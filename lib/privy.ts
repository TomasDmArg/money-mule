import { PrivyClientConfig } from '@privy-io/react-auth';

export const sagaNetwork = {
    id: 2751721147387000,
    name: 'MoneyMule',
    network: 'moneymule',
    nativeCurrency: {
        name: 'MULE',
        symbol: 'mule',
        decimals: 18,
    },
    rpcUrls: {
        default: {
            http: ['https://moneymule-2751721147387000-1.jsonrpc.sagarpc.io'],
        },
        public: {
            http: ['https://moneymule-2751721147387000-1.jsonrpc.sagarpc.io'],
        },
    },
    blockExplorers: {
        default: {
            name: 'Saga Explorer',
            url: 'https://moneymule-2751721147387000-1.sagaexplorer.io:443',
        },
    },
};

export const privyConfig: PrivyClientConfig = {
    appearance: {
        theme: 'light',
        accentColor: '#6366f1',
        logo: 'https://your-logo-url.com/logo.png',
    },
    embeddedWallets: {
        createOnLogin: 'users-without-wallets',
        requireUserPasswordOnCreate: true,
    },
    defaultChain: sagaNetwork,
    supportedChains: [sagaNetwork],
    loginMethods: ['wallet', 'email', 'google'],
};
