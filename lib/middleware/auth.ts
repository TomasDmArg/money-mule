import { NextRequest } from 'next/server';

export async function validateWalletAddress(
    request: NextRequest,
    providedAddress: string
): Promise<{ isValid: boolean; error?: string }> {
    try {
        // Validate format of address
        if (!providedAddress || !providedAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
            return { isValid: false, error: 'Invalid wallet address format' };
        }

        // Additional validations could be added here
        // such as verifying message signature, etc.

        return { isValid: true };
    } catch (error) {
        return { isValid: false, error: 'Authentication failed' };
    }
}

export async function requireAuth(
    request: NextRequest,
    requiredAddress?: string
): Promise<{ success: boolean; address?: string; error?: string }> {
    const address = request.headers.get('x-wallet-address');

    if (!address) {
        return { success: false, error: 'Wallet address required' };
    }

    const validation = await validateWalletAddress(request, address);

    if (!validation.isValid) {
        return { success: false, error: validation.error };
    }

    if (requiredAddress && address.toLowerCase() !== requiredAddress.toLowerCase()) {
        return { success: false, error: 'Address mismatch' };
    }

    return { success: true, address: address.toLowerCase() };
}
