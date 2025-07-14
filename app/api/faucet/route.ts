import { ethers } from 'ethers';
import { NextRequest, NextResponse } from 'next/server';

import { faucetHelpers } from '@/lib/supabase';

// Network configuration
const SAGA_CHAINLET_RPC = 'https://venturepilot-2751721147387000-1.jsonrpc.sagarpc.io';

// Token amounts (in wei)
const MULE_AMOUNT = ethers.parseEther('1'); // 1 MULE (native token like ETH)
const USDC_AMOUNT = ethers.parseUnits('10', 6); // 10 USDC (6 decimals)

// ERC20 ABI for token transfers
const ERC20_ABI = [
    'function transfer(address to, uint256 amount) returns (bool)',
    'function balanceOf(address account) view returns (uint256)',
    'function decimals() view returns (uint8)',
] as const;

interface FaucetRequest {
    walletAddress: string;
}

export async function POST(request: NextRequest) {
    try {
        // Get environment variables
        const privateKey = process.env.FAUCET_PRIVATE_KEY;
        const USDC_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_USDC_CONTRACT || '';

        const body = (await request.json()) as FaucetRequest;
        const { walletAddress } = body;

        // Validate wallet address
        if (!walletAddress || !ethers.isAddress(walletAddress)) {
            return NextResponse.json(
                { success: false, message: 'Invalid wallet address' },
                { status: 400 }
            );
        }

        // Check environment variables
        if (!privateKey) {
            console.error('FAUCET_PRIVATE_KEY not found in environment variables');
            return NextResponse.json(
                { success: false, message: 'Faucet not configured' },
                { status: 500 }
            );
        }

        if (!USDC_CONTRACT_ADDRESS) {
            console.error('USDC contract address not configured');
            return NextResponse.json(
                { success: false, message: 'USDC contract not configured' },
                { status: 500 }
            );
        }

        // Check 24-hour cooldown using Supabase
        const canClaim = await faucetHelpers.canMakeFaucetRequest(walletAddress.toLowerCase());

        if (!canClaim) {
            const stats = await faucetHelpers.getWalletStats(walletAddress.toLowerCase());
            const lastClaim = stats.last_request ? new Date(stats.last_request).getTime() : null;
            const cooldownPeriod = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

            if (lastClaim) {
                const nextClaimTime = lastClaim + cooldownPeriod;
                const hoursLeft = Math.ceil((nextClaimTime - Date.now()) / (60 * 60 * 1000));

                return NextResponse.json(
                    {
                        success: false,
                        message: `Please wait ${hoursLeft} hours before claiming again`,
                        nextClaimTime,
                    },
                    { status: 429 }
                );
            }
        }

        // Setup provider and wallet
        const provider = new ethers.JsonRpcProvider(SAGA_CHAINLET_RPC);
        const wallet = new ethers.Wallet(privateKey, provider);

        // Check wallet balance
        const balance = await provider.getBalance(wallet.address);
        const minBalance = ethers.parseEther('0.01'); // Minimum balance for gas

        if (balance < minBalance) {
            console.error('Faucet wallet has insufficient balance for gas fees');
            return NextResponse.json(
                { success: false, message: 'Faucet temporarily unavailable' },
                { status: 503 }
            );
        }

        const transactionHashes: { mule?: string; usdc?: string } = {};

        try {
            // Send MULE (native token like ETH)
            const muleTx = await wallet.sendTransaction({
                to: walletAddress,
                value: MULE_AMOUNT,
            });
            await muleTx.wait();
            transactionHashes.mule = muleTx.hash;

            // Transfer USDC tokens
            if (USDC_CONTRACT_ADDRESS !== ethers.ZeroAddress) {
                const usdcContract = new ethers.Contract(USDC_CONTRACT_ADDRESS, ERC20_ABI, wallet);
                const usdcTx = (await usdcContract.transfer(
                    walletAddress,
                    USDC_AMOUNT
                )) as ethers.ContractTransactionResponse;
                await usdcTx.wait();
                transactionHashes.usdc = usdcTx.hash;
            }

            // Record faucet request in Supabase
            await faucetHelpers.recordFaucetRequest(walletAddress.toLowerCase());

            const cooldownPeriod = 24 * 60 * 60 * 1000;
            return NextResponse.json({
                success: true,
                message: 'Tokens sent successfully! You received 1 MULE and 10 USDC.',
                transactionHashes,
                nextClaimTime: Date.now() + cooldownPeriod,
            });
        } catch (txError) {
            console.error('Transaction error:', txError);
            return NextResponse.json(
                { success: false, message: 'Failed to send tokens. Please try again.' },
                { status: 500 }
            );
        }
    } catch (error) {
        console.error('Faucet API error:', error);
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const walletAddress = searchParams.get('address');

        if (!walletAddress || !ethers.isAddress(walletAddress)) {
            return NextResponse.json(
                { success: false, message: 'Invalid wallet address' },
                { status: 400 }
            );
        }

        // Check faucet status using Supabase
        const canClaim = await faucetHelpers.canMakeFaucetRequest(walletAddress.toLowerCase());
        const stats = await faucetHelpers.getWalletStats(walletAddress.toLowerCase());

        const cooldownPeriod = 24 * 60 * 60 * 1000;
        const now = Date.now();

        if (stats.last_request) {
            const lastClaim = new Date(stats.last_request).getTime();
            const nextClaimTime = lastClaim + cooldownPeriod;
            const hoursLeft = canClaim ? 0 : Math.ceil((nextClaimTime - now) / (60 * 60 * 1000));

            return NextResponse.json({
                success: true,
                canClaim,
                hoursLeft,
                nextClaimTime: canClaim ? null : nextClaimTime,
                lastClaimTime: lastClaim,
            });
        }

        return NextResponse.json({
            success: true,
            canClaim: true,
            hoursLeft: 0,
            nextClaimTime: null,
            lastClaimTime: null,
        });
    } catch (error) {
        console.error('Faucet status API error:', error);
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        );
    }
}
