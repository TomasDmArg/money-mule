import { ethers } from 'ethers';

import { supabaseServer } from '../supabase-server';
import { WalletService } from './wallet-service';

const USDC_ABI = [
    'function transfer(address to, uint256 amount) external returns (bool)',
    'function balanceOf(address account) external view returns (uint256)',
    'function decimals() external view returns (uint8)',
];

export class FaucetService {
    private static provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL);

    private static wallet = new ethers.Wallet(process.env.FAUCET_PRIVATE_KEY!, this.provider);

    private static usdcContract = new ethers.Contract(
        process.env.NEXT_PUBLIC_USDC_CONTRACT!,
        USDC_ABI,
        this.wallet
    );

    static async requestTokens(address: string): Promise<{
        success: boolean;
        txHash?: string;
        error?: string;
        nextRequestTime?: Date;
    }> {
        try {
            // Validate address
            if (!ethers.isAddress(address)) {
                return { success: false, error: 'Invalid wallet address' };
            }

            // Check if can request tokens
            const canRequest = await WalletService.canRequestFaucet(address);
            if (!canRequest) {
                const wallet = await WalletService.getWallet(address);
                const nextRequestTime = new Date(wallet!.last_faucet_request);
                nextRequestTime.setHours(nextRequestTime.getHours() + 24);

                return {
                    success: false,
                    error: 'You can only request tokens once per day',
                    nextRequestTime,
                };
            }

            // Check historical limit
            const wallet = await WalletService.getWallet(address);
            if (wallet && wallet.total_faucet_requests >= 10) {
                return {
                    success: false,
                    error: 'Maximum faucet requests reached (10 per wallet)',
                };
            }

            // Check faucet balance
            const faucetBalance = await this.usdcContract.balanceOf(this.wallet.address);
            const requestAmount = BigInt(process.env.FAUCET_AMOUNT || '100000000');

            if (faucetBalance < requestAmount) {
                return {
                    success: false,
                    error: 'Faucet is empty. Please try again later.',
                };
            }

            // Execute transfer
            const tx = await this.usdcContract.transfer(address, requestAmount);
            await tx.wait();

            // Update database record
            if (!wallet) {
                await WalletService.createWallet(address);
            }
            await WalletService.updateLastFaucetRequest(address);

            return {
                success: true,
                txHash: tx.hash,
            };
        } catch (error) {
            console.error('Faucet error:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error occurred',
            };
        }
    }

    static async getFaucetStats(): Promise<{
        balance: string;
        totalRequests: number;
        dailyRequests: number;
        isOperational: boolean;
    }> {
        try {
            // Faucet balance
            const balance = await this.usdcContract.balanceOf(this.wallet.address);

            // Request statistics
            const { data: totalRequestsData } = await supabaseServer
                .from('wallets')
                .select('total_faucet_requests.sum()');

            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const { data: dailyRequestsData } = await supabaseServer
                .from('wallets')
                .select('id')
                .gte('last_faucet_request', today.toISOString());

            return {
                balance: ethers.formatUnits(balance, 6),
                totalRequests: totalRequestsData?.[0]?.sum || 0,
                dailyRequests: dailyRequestsData?.length || 0,
                isOperational: balance > BigInt(process.env.FAUCET_AMOUNT || '100000000'),
            };
        } catch (error) {
            console.error('Error getting faucet stats:', error);
            return {
                balance: '0',
                totalRequests: 0,
                dailyRequests: 0,
                isOperational: false,
            };
        }
    }
}
