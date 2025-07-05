import { ethers } from 'ethers';
import { useCallback, useState } from 'react';
import toast from 'react-hot-toast';

import { RoundContract } from '../lib/contracts/round-contract';
import { useWallet } from './useWallet';

interface InvestmentState {
    isLoading: boolean;
    isApproving: boolean;
    isInvesting: boolean;
    error: string | null;
}

export const useInvestment = (contract: RoundContract | null) => {
    const { address } = useWallet();
    const [state, setState] = useState<InvestmentState>({
        isLoading: false,
        isApproving: false,
        isInvesting: false,
        error: null,
    });

    const checkUSDCBalance = useCallback(
        async (amount: bigint): Promise<boolean> => {
            if (!contract || !address) return false;

            try {
                const balance = await contract.getUSDCBalance(address);
                return balance >= amount;
            } catch (error) {
                console.error('Error checking USDC balance:', error);
                return false;
            }
        },
        [contract, address]
    );

    const checkUSDCAllowance = useCallback(
        async (contractAddress: string, amount: bigint): Promise<boolean> => {
            if (!contract || !address) return false;

            try {
                const allowance = await contract.getUSDCAllowance(address, contractAddress);
                return allowance >= amount;
            } catch (error) {
                console.error('Error checking USDC allowance:', error);
                return false;
            }
        },
        [contract, address]
    );

    const approveUSDC = useCallback(
        async (contractAddress: string, amount: bigint): Promise<boolean> => {
            if (!contract) {
                toast.error('Contract not initialized');
                return false;
            }

            setState(prev => ({ ...prev, isApproving: true, error: null }));

            try {
                toast.loading('Approving USDC spending...', { id: 'approve' });

                const tx = await contract.approveUSDC(contractAddress, amount);

                toast.loading('Waiting for approval confirmation...', { id: 'approve' });
                await tx.wait();

                toast.success('USDC spending approved!', { id: 'approve' });
                return true;
            } catch (error) {
                console.error('Approval failed:', error);
                toast.error('Failed to approve USDC spending', { id: 'approve' });
                setState(prev => ({
                    ...prev,
                    error: error instanceof Error ? error.message : 'Approval failed',
                }));
                return false;
            } finally {
                setState(prev => ({ ...prev, isApproving: false }));
            }
        },
        [contract]
    );

    const invest = useCallback(
        async (
            contractAddress: string,
            amount: bigint
        ): Promise<{ success: boolean; txHash?: string }> => {
            if (!contract || !address) {
                toast.error('Please connect your wallet');
                return { success: false };
            }

            setState(prev => ({ ...prev, isInvesting: true, error: null }));

            try {
                // Check USDC balance
                const hasBalance = await checkUSDCBalance(amount);
                if (!hasBalance) {
                    toast.error('Insufficient USDC balance');
                    return { success: false };
                }

                // Check allowance
                const hasAllowance = await checkUSDCAllowance(contractAddress, amount);
                if (!hasAllowance) {
                    const approved = await approveUSDC(contractAddress, amount);
                    if (!approved) {
                        return { success: false };
                    }
                }

                // Make investment
                toast.loading('Processing investment...', { id: 'invest' });

                const tx = await contract.invest(amount);

                toast.loading('Waiting for transaction confirmation...', { id: 'invest' });
                const receipt = await tx.wait();

                // Update database
                await fetch('/api/investments', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-wallet-address': address,
                    },
                    body: JSON.stringify({
                        contractAddress,
                        amount: amount.toString(),
                        investorAddress: address,
                        transactionHash: receipt.hash,
                    }),
                });

                toast.success(`Investment of ${ethers.formatUnits(amount, 6)} USDC successful!`, {
                    id: 'invest',
                });
                return { success: true, txHash: receipt.hash };
            } catch (error) {
                console.error('Investment failed:', error);
                toast.error('Investment failed', { id: 'invest' });
                setState(prev => ({
                    ...prev,
                    error: error instanceof Error ? error.message : 'Investment failed',
                }));
                return { success: false };
            } finally {
                setState(prev => ({ ...prev, isInvesting: false }));
            }
        },
        [contract, address, checkUSDCBalance, checkUSDCAllowance, approveUSDC]
    );

    const getInvestmentInfo = useCallback(
        async (amount: bigint) => {
            if (!contract || !address) return null;

            try {
                const [balance, allowance] = await Promise.all([
                    contract.getUSDCBalance(address),
                    contract.getUSDCAllowance(address, contract.contract.target as string),
                ]);

                return {
                    hasBalance: balance >= amount,
                    hasAllowance: allowance >= amount,
                    balance,
                    allowance,
                };
            } catch (error) {
                console.error('Error getting investment info:', error);
                return null;
            }
        },
        [contract, address]
    );

    return {
        ...state,
        invest,
        approveUSDC,
        checkUSDCBalance,
        checkUSDCAllowance,
        getInvestmentInfo,
    };
};
