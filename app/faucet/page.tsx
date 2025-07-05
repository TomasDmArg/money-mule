import { Metadata } from 'next';

import { FaucetCard } from '../../components/components/faucet/FaucetCard';

export const metadata: Metadata = {
    title: 'Faucet | MoneyMule',
    description: 'Get free USDC tokens for testing on the MoneyMule network',
};

export default function FaucetPage() {
    return (
        <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100'>
            <div className='container mx-auto px-4 py-8'>
                <div className='text-center mb-8'>
                    <h1 className='text-4xl font-bold text-gray-900 mb-4'>MoneyMule Faucet</h1>
                    <p className='text-xl text-gray-600 max-w-2xl mx-auto'>
                        Get free USDC tokens to test funding rounds and investments on the MoneyMule
                        platform
                    </p>
                </div>

                <FaucetCard />

                {/* Additional Information */}
                <div className='mt-12 max-w-4xl mx-auto'>
                    <div className='grid md:grid-cols-2 gap-8'>
                        <div className='bg-white rounded-lg p-6 shadow-sm'>
                            <h3 className='text-lg font-semibold mb-4'>How to Use</h3>
                            <ol className='space-y-2 text-sm text-gray-600'>
                                <li>1. Connect your wallet to the MoneyMule network</li>
                                <li>2. Click Request 100 USDC to receive tokens</li>
                                <li>3. Wait 24 hours between requests</li>
                                <li>4. Use tokens to test funding rounds</li>
                            </ol>
                        </div>

                        <div className='bg-white rounded-lg p-6 shadow-sm'>
                            <h3 className='text-lg font-semibold mb-4'>Need Help?</h3>
                            <div className='space-y-2 text-sm text-gray-600'>
                                <p>• Make sure you are connected to the MoneyMule network</p>
                                <p>• Check that your wallet supports custom networks</p>
                                <p>• Faucet tokens are for testing only</p>
                                <p>• Contact support if you encounter issues</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
