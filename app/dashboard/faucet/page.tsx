'use client';

import { usePrivy, useWallets } from '@privy-io/react-auth';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

import { DashboardNav } from '@/components/organisms/navigation/DashboardNav';

interface FaucetStatus {
    canClaim: boolean;
    hoursLeft: number;
    nextClaimTime: number | null;
    lastClaimTime: number | null;
}

interface FaucetResponse {
    success: boolean;
    message: string;
    transactionHashes?: {
        pilot?: string;
        usdc?: string;
    };
    nextClaimTime?: number;
}

interface FaucetStatusResponse {
    success: boolean;
    canClaim: boolean;
    hoursLeft: number;
    nextClaimTime: number | null;
    lastClaimTime: number | null;
}

export default function FaucetPage() {
    const { ready } = usePrivy();
    const { wallets } = useWallets();
    const [isLoading, setIsLoading] = useState(false);
    const [isCheckingStatus, setIsCheckingStatus] = useState(false);
    const [faucetStatus, setFaucetStatus] = useState<FaucetStatus | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Get the connected wallet
    const connectedWallet =
        wallets.find(wallet => wallet.connectorType !== 'embedded') || wallets[0];

    const checkFaucetStatus = useCallback(async () => {
        if (!connectedWallet?.address) return;

        setIsCheckingStatus(true);
        try {
            const response = await fetch(`/api/faucet?address=${connectedWallet.address}`);
            const data = (await response.json()) as FaucetStatusResponse;

            if (data.success) {
                setFaucetStatus({
                    canClaim: data.canClaim,
                    hoursLeft: data.hoursLeft,
                    nextClaimTime: data.nextClaimTime,
                    lastClaimTime: data.lastClaimTime,
                });
            }
        } catch (error) {
            console.error('Error checking faucet status:', error);
        } finally {
            setIsCheckingStatus(false);
        }
    }, [connectedWallet?.address]);

    useEffect(() => {
        if (ready && connectedWallet?.address) {
            checkFaucetStatus().catch(console.error);
        }
    }, [ready, connectedWallet?.address, checkFaucetStatus]);

    const handleClaimTokens = async () => {
        if (!connectedWallet?.address) {
            toast.error('Please connect your wallet first');
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch('/api/faucet', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    walletAddress: connectedWallet.address,
                }),
            });

            const data = (await response.json()) as FaucetResponse;

            if (data.success) {
                toast.success(data.message);

                // Show transaction links if available
                if (data.transactionHashes) {
                    const explorer = 'https://venturepilot-2751721147387000-1.sagaexplorer.io:443';

                    if (data.transactionHashes.pilot) {
                        setTimeout(() => {
                            toast.info(
                                `PILOT Transaction: ${data.transactionHashes?.pilot?.slice(0, 10)}...`,
                                {
                                    action: {
                                        label: 'View',
                                        onClick: () =>
                                            window.open(
                                                `${explorer}/tx/${data.transactionHashes?.pilot}`,
                                                '_blank'
                                            ),
                                    },
                                }
                            );
                        }, 1000);
                    }

                    if (data.transactionHashes.usdc) {
                        setTimeout(() => {
                            toast.info(
                                `USDC Transaction: ${data.transactionHashes?.usdc?.slice(0, 10)}...`,
                                {
                                    action: {
                                        label: 'View',
                                        onClick: () =>
                                            window.open(
                                                `${explorer}/tx/${data.transactionHashes?.usdc}`,
                                                '_blank'
                                            ),
                                    },
                                }
                            );
                        }, 2000);
                    }
                }

                // Refresh status
                await checkFaucetStatus();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error('Error claiming tokens:', error);
            toast.error('Failed to claim tokens. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const formatTimeLeft = (hours: number) => {
        if (hours < 1) return 'Less than 1 hour';
        if (hours === 1) return '1 hour';
        return `${hours} hours`;
    };

    const formatDate = (timestamp: number) => new Date(timestamp).toLocaleString();

    const renderClaimStatus = () => {
        if (isCheckingStatus) {
            return (
                <div className='mb-8'>
                    <div className='flex items-center justify-center py-4'>
                        <div className='animate-spin rounded-full h-6 w-6 border-b-2 border-green-600 mr-3' />
                        <span className='text-gray-600'>Checking claim status...</span>
                    </div>
                </div>
            );
        }

        if (!faucetStatus) {
            return null;
        }

        return (
            <div className='mb-8'>
                <h3 className='text-lg font-semibold text-gray-900 mb-4'>Claim Status</h3>

                {faucetStatus.canClaim ? (
                    <div className='bg-green-50 border border-green-200 rounded-lg p-4'>
                        <p className='text-green-800 font-semibold mb-2'>✅ Ready to claim!</p>
                        <p className='text-green-700 text-sm'>You can claim your tokens now.</p>
                    </div>
                ) : (
                    <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-4'>
                        <p className='text-yellow-800 font-semibold mb-2'>⏳ Cooldown Period</p>
                        <p className='text-yellow-700 text-sm mb-2'>
                            You can claim again in {formatTimeLeft(faucetStatus.hoursLeft)}.
                        </p>
                        {faucetStatus.lastClaimTime && (
                            <p className='text-yellow-600 text-xs'>
                                Last claimed: {formatDate(faucetStatus.lastClaimTime)}
                            </p>
                        )}
                    </div>
                )}
            </div>
        );
    };

    const renderButtonContent = () => {
        if (isLoading) {
            return (
                <div className='flex items-center'>
                    <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2' />
                    Claiming Tokens...
                </div>
            );
        }

        if (faucetStatus?.canClaim) {
            return 'Claim Tokens';
        }

        return 'Claim Unavailable';
    };

    // Show loading state until mounted
    if (!mounted || !ready) {
        return (
            <div className='min-h-screen bg-gray-50'>
                <DashboardNav />
                <div className='flex items-center justify-center h-[calc(100vh-80px)]'>
                    <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-green-600' />
                </div>
            </div>
        );
    }

    // Show wallet connection required state
    if (!connectedWallet?.address) {
        return (
            <div className='min-h-screen bg-gray-50'>
                <DashboardNav />
                <div className='flex items-center justify-center h-[calc(100vh-80px)]'>
                    <div className='text-center'>
                        <h2 className='text-2xl font-bold text-gray-900 mb-4'>
                            Wallet Connection Required
                        </h2>
                        <p className='text-gray-600 mb-6'>
                            Please connect your wallet to access the faucet
                        </p>
                        <p className='text-sm text-gray-500'>
                            Use the &quot;Connect Wallet&quot; button in the navigation above
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className='min-h-screen bg-gray-50'>
            <DashboardNav />
            <div className='container mx-auto px-4 py-8'>
                {/* Header */}
                <div className='mb-8'>
                    <h1 className='text-3xl font-bold text-gray-900 mb-2'>Token Faucet</h1>
                    <p className='text-gray-600'>
                        Get free tokens to test the VenturePilot platform on Saga Chainlet
                    </p>
                </div>

                {/* Faucet Card */}
                <div className='max-w-2xl mx-auto'>
                    <div className='bg-white rounded-lg shadow-md p-8'>
                        {/* Token Information */}
                        <div className='mb-8'>
                            <h2 className='text-xl font-semibold text-gray-900 mb-4'>
                                Available Tokens
                            </h2>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                <div className='bg-green-50 rounded-lg p-4 border border-green-200'>
                                    <div className='flex items-center mb-2'>
                                        <div className='w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3'>
                                            M
                                        </div>
                                        <span className='font-semibold text-gray-900'>
                                            PILOT Token
                                        </span>
                                    </div>
                                    <p className='text-2xl font-bold text-green-600'>1 PILOT</p>
                                    <p className='text-sm text-gray-600'>Native platform token</p>
                                </div>
                                <div className='bg-blue-50 rounded-lg p-4 border border-blue-200'>
                                    <div className='flex items-center mb-2'>
                                        <div className='w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3'>
                                            U
                                        </div>
                                        <span className='font-semibold text-gray-900'>
                                            Demo USDC
                                        </span>
                                    </div>
                                    <p className='text-2xl font-bold text-blue-600'>10 USDC</p>
                                    <p className='text-sm text-gray-600'>Demo stablecoin</p>
                                </div>
                            </div>
                        </div>

                        {/* Wallet Information */}
                        <div className='mb-8'>
                            <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                                Your Wallet
                            </h3>
                            <div className='bg-gray-50 rounded-lg p-4'>
                                <p className='text-sm text-gray-600 mb-1'>Address:</p>
                                <p className='font-mono text-sm text-gray-900'>
                                    {connectedWallet?.address || 'Not connected'}
                                </p>
                            </div>
                        </div>

                        {/* Claim Status */}
                        {renderClaimStatus()}

                        {/* Claim Button */}
                        <div className='text-center'>
                            <button
                                type='button'
                                onClick={() => {
                                    handleClaimTokens().catch(console.error);
                                }}
                                disabled={isLoading || !faucetStatus?.canClaim}
                                className={`px-8 py-3 rounded-lg font-semibold text-white transition-all ${
                                    isLoading || !faucetStatus?.canClaim
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-green-600 hover:bg-green-700 active:scale-95'
                                }`}
                            >
                                {renderButtonContent()}
                            </button>
                        </div>

                        {/* Information */}
                        <div className='mt-8 pt-6 border-t border-gray-200'>
                            <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                                Important Information
                            </h3>
                            <div className='space-y-3 text-sm text-gray-600'>
                                <div className='flex items-start'>
                                    <span className='text-green-600 mr-2'>•</span>
                                    <span>Each wallet can claim tokens once every 24 hours</span>
                                </div>
                                <div className='flex items-start'>
                                    <span className='text-green-600 mr-2'>•</span>
                                    <span>Tokens are sent to your connected wallet address</span>
                                </div>
                                <div className='flex items-start'>
                                    <span className='text-green-600 mr-2'>•</span>
                                    <span>These are test tokens for the Saga Chainlet network</span>
                                </div>
                                <div className='flex items-start'>
                                    <span className='text-green-600 mr-2'>•</span>
                                    <span>Transactions will appear in the Saga Explorer</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
