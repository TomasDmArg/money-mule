'use client';

import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';

export const FaucetCard: React.FC = () => {
    const [isRequesting, setIsRequesting] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleRequest = async () => {
        setIsRequesting(true);
        setStatus('idle');
        setMessage('');

        try {
            const response = await fetch('/api/faucet', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();

            if (response.ok) {
                setStatus('success');
                setMessage(data.message || 'Successfully received 100 USDC!');
            } else {
                setStatus('error');
                setMessage(data.error || 'Failed to request tokens');
            }
        } catch (error) {
            setStatus('error');
            setMessage('Network error. Please try again.');
        } finally {
            setIsRequesting(false);
        }
    };

    return (
        <div className='max-w-md mx-auto'>
            <div className='bg-white rounded-xl shadow-lg p-6'>
                <div className='text-center mb-6'>
                    <div className='w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                        <span className='text-2xl'>💰</span>
                    </div>
                    <h2 className='text-2xl font-bold text-gray-900 mb-2'>Request Test Tokens</h2>
                    <p className='text-gray-600'>Get 100 USDC for testing the platform</p>
                </div>

                <div className='space-y-4'>
                    <div className='bg-gray-50 rounded-lg p-4'>
                        <div className='flex justify-between items-center mb-2'>
                            <span className='text-sm font-medium text-gray-700'>Amount:</span>
                            <span className='text-lg font-bold text-green-600'>100 USDC</span>
                        </div>
                        <div className='flex justify-between items-center'>
                            <span className='text-sm font-medium text-gray-700'>Cooldown:</span>
                            <span className='text-sm text-gray-500'>24 hours</span>
                        </div>
                    </div>

                    {message && (
                        <div
                            className={`flex items-center p-3 rounded-lg ${
                                status === 'success'
                                    ? 'bg-green-50 text-green-700'
                                    : 'bg-red-50 text-red-700'
                            }`}
                        >
                            {status === 'success' ? (
                                <CheckCircle className='w-5 h-5 mr-2' />
                            ) : (
                                <AlertCircle className='w-5 h-5 mr-2' />
                            )}
                            <span className='text-sm'>{message}</span>
                        </div>
                    )}

                    <Button
                        onClick={handleRequest}
                        disabled={isRequesting}
                        className='w-full'
                        size='lg'
                    >
                        {isRequesting ? (
                            <>
                                <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                                Requesting...
                            </>
                        ) : (
                            'Request 100 USDC'
                        )}
                    </Button>

                    <div className='text-xs text-gray-500 text-center'>
                        <p>• Connect your wallet first</p>
                        <p>• One request per wallet every 24 hours</p>
                        <p>• Tokens are for testing purposes only</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
