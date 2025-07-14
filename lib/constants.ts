// Smart Contract Configuration
export const CONTRACTS = {
    FACTORY_ADDRESS: '0x36f46D89f6262844adF61dc836Dfe1005ffd8F05',
    // Use environment variable or fallback to a test address
    USDC_ADDRESS:
        process.env.NEXT_PUBLIC_USDC_CONTRACT || '0xa2be65f0bfb810ef7b17807f3cd10d428f989a4a',
} as const;

// Network Configuration
export const NETWORK = {
    CHAIN_ID: 2751721147387000,
    NAME: 'venturepilot',
    RPC_URL: 'https://venturepilot-2751721147387000-1.jsonrpc.sagarpc.io',
    EXPLORER_URL: 'https://venturepilot-2751721147387000-1.sagaexplorer.io:443',
} as const;

// Default jury addresses (using the factory address as a placeholder instead of zeros)
export const DEFAULT_JURY_ADDRESSES = [
    '0xa6e4e006EeD9fEA0C378A42d32a033F4B4f4A15b',
    '0xa6e4e006EeD9fEA0C378A42d32a033F4B4f4A15b',
    '0xa6e4e006EeD9fEA0C378A42d32a033F4B4f4A15b',
] as const;

// Known authorized jury addresses (these should be authorized on the smart contract)
export const AUTHORIZED_JURY_ADDRESSES = ['0xa6e4e006EeD9fEA0C378A42d32a033F4B4f4A15b'] as const;

// Validation constants
export const VALIDATION = {
    MAX_MILESTONES: 10,
    MIN_MILESTONES: 1,
    MAX_FUNDING_GOAL: 1000000, // 1M USDC
    MIN_FUNDING_GOAL: 100, // 100 USDC
} as const;
