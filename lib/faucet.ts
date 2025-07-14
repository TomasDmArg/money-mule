// Faucet utility functions

export interface FaucetResponse {
    success: boolean;
    message: string;
    transactionHashes?: {
        mule?: string;
        usdc?: string;
    };
    nextClaimTime?: number;
}

export interface FaucetStatusResponse {
    success: boolean;
    canClaim: boolean;
    hoursLeft: number;
    nextClaimTime: number | null;
    lastClaimTime: number | null;
}

/**
 * Check if a wallet can claim tokens from the faucet
 */
export async function checkFaucetStatus(address: string): Promise<FaucetStatusResponse> {
    const response = await fetch(`/api/faucet?address=${address}`);
    return (await response.json()) as FaucetStatusResponse;
}

/**
 * Claim tokens from the faucet
 */
export async function claimTokens(walletAddress: string): Promise<FaucetResponse> {
    const response = await fetch('/api/faucet', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ walletAddress }),
    });

    return (await response.json()) as FaucetResponse;
}

/**
 * Format time remaining until next claim
 */
export function formatTimeRemaining(hoursLeft: number): string {
    if (hoursLeft <= 0) return 'Available now';
    if (hoursLeft < 1) return 'Less than 1 hour';
    if (hoursLeft === 1) return '1 hour';
    return `${hoursLeft} hours`;
}

/**
 * Get explorer URL for transaction
 */
export function getTransactionUrl(hash: string): string {
    return `https://venturepilot-2751721147387000-1.sagaexplorer.io:443/tx/${hash}`;
}
