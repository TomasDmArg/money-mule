'use client';

import { usePrivy, useWallets } from '@privy-io/react-auth';
import { useCallback } from 'react';
import { useAccount, useSwitchChain } from 'wagmi';

import { sagaNetwork } from '../lib/privy';

export const useWallet = () => {
    const { login, logout, ready, authenticated } = usePrivy();
    const { wallets } = useWallets();
    const { address, isConnected } = useAccount();
    const { switchChain } = useSwitchChain();

    const connect = useCallback(async () => {
        if (!ready) return;
        login();
    }, [login, ready]);

    const disconnect = useCallback(async () => {
        await logout();
    }, [logout]);

    const switchNetwork = useCallback(
        async (chainId: number) => {
            try {
                await switchChain({ chainId });
            } catch (error) {
                console.error('Failed to switch network:', error);
            }
        },
        [switchChain]
    );

    const formatAddress = useCallback(
        (address: string) => `${address.slice(0, 6)}...${address.slice(-4)}`,
        []
    );

    const isCorrectNetwork = useCallback(
        () => true, // Always return true for now since we're using a single chain
        []
    );

    return {
        // State
        isConnected: authenticated && isConnected,
        address: address || null,
        isLoading: !ready,
        wallets,

        // Actions
        connect,
        disconnect,
        switchNetwork,

        // Utilities
        formatAddress,
        isCorrectNetwork,

        // Network info
        network: sagaNetwork,
        chainId: sagaNetwork.id,
    };
};
