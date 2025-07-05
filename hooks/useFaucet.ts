import { useCallback, useState } from 'react';
import toast from 'react-hot-toast';

import { useWallet } from './useWallet';

interface FaucetStats {
    balance: string;
    totalRequests: number;
    dailyRequests: number;
    isOperational: boolean;
}

export const useFaucet = () => {
    const { address } = useWallet();
    const [isLoading, setIsLoading] = useState(false);
    const [stats, setStats] = useState<FaucetStats | null>(null);

    const requestTokens = useCallback(async () => {
        if (!address) {
            toast.error('Please connect your wallet first');
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch('/api/faucet', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-wallet-address': address,
                },
                body: JSON.stringify({ address }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success('Tokens sent successfully! 🎉');
                return { success: true, txHash: data.txHash };
            }
            if (data.nextRequestTime) {
                const nextTime = new Date(data.nextRequestTime);
                toast.error(`Please wait until ${nextTime.toLocaleString()}`);
            } else {
                toast.error(data.error || 'Failed to request tokens');
            }
            return { success: false, error: data.error };
        } catch (error) {
            console.error('Faucet request error:', error);
            toast.error('Network error. Please try again.');
            return { success: false, error: 'Network error' };
        } finally {
            setIsLoading(false);
        }
    }, [address]);

    const getFaucetStats = useCallback(async () => {
        try {
            const response = await fetch('/api/faucet');
            if (response.ok) {
                const data = await response.json();
                setStats(data);
                return data;
            }
        } catch (error) {
            console.error('Error fetching faucet stats:', error);
        }
    }, []);

    return {
        requestTokens,
        getFaucetStats,
        isLoading,
        stats,
    };
};
