'use client';

import { PrivyProvider } from '@privy-io/react-auth';

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <PrivyProvider
            appId='cmcqt3cuz006sjp0lv3ggveyn'
            config={{
                embeddedWallets: {
                    ethereum: {
                        createOnLogin: 'users-without-wallets',
                    },
                },
                supportedChains: [
                    {
                        id: 2751721147387000,
                        name: 'venturepilot',
                        network: 'venturepilot',
                        nativeCurrency: {
                            name: 'pilot',
                            symbol: 'pilot',
                            decimals: 18,
                        },
                        rpcUrls: {
                            default: {
                                http: [
                                    'https://venturepilot-2751721147387000-1.jsonrpc.sagarpc.io',
                                ],
                            },
                        },
                        blockExplorers: {
                            default: {
                                name: 'Saga Explorer',
                                url: 'https://venturepilot-2751721147387000-1.sagaexplorer.io:443',
                            },
                        },
                    },
                ],
                defaultChain: {
                    id: 2751721147387000,
                    name: 'venturepilot',
                    network: 'venturepilot',
                    nativeCurrency: {
                        name: 'pilot',
                        symbol: 'pilot',
                        decimals: 18,
                    },
                    rpcUrls: {
                        default: {
                            http: ['https://venturepilot-2751721147387000-1.jsonrpc.sagarpc.io'],
                        },
                    },
                    blockExplorers: {
                        default: {
                            name: 'Saga Explorer',
                            url: 'https://venturepilot-2751721147387000-1.sagaexplorer.io:443',
                        },
                    },
                },
            }}
        >
            {children}
        </PrivyProvider>
    );
}
