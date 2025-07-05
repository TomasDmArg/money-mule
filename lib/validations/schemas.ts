import { z } from 'zod';

export const walletAddressSchema = z
    .string()
    .regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid wallet address format')
    .transform(address => address.toLowerCase());

export const roundCreateSchema = z.object({
    title: z.string().min(1, 'Title is required').max(100, 'Title too long'),
    description: z.string().max(1000, 'Description too long').optional(),
    category: z.string().max(50, 'Category too long').optional(),
    imageUrl: z.string().url('Invalid image URL').optional(),
    websiteUrl: z.string().url('Invalid website URL').optional(),
    targetAmount: z.string().refine(val => {
        try {
            const num = BigInt(val);
            return num > 0n;
        } catch {
            return false;
        }
    }, 'Invalid target amount'),
    fundingDeadline: z.string().datetime('Invalid funding deadline'),
    milestones: z
        .array(
            z.object({
                title: z.string().min(1, 'Milestone title is required'),
                description: z.string().min(1, 'Milestone description is required'),
                fundingAmount: z.string().refine(val => {
                    try {
                        const num = BigInt(val);
                        return num > 0n;
                    } catch {
                        return false;
                    }
                }, 'Invalid funding amount'),
                deadline: z.string().datetime('Invalid milestone deadline'),
                juryWallets: z
                    .array(walletAddressSchema)
                    .length(3, 'Must have exactly 3 jury wallets'),
            })
        )
        .min(1, 'At least one milestone is required'),
});

export const faucetRequestSchema = z.object({
    address: walletAddressSchema,
});

export const investmentSchema = z.object({
    contractAddress: walletAddressSchema,
    amount: z.string().refine(val => {
        try {
            const num = BigInt(val);
            return num > 0n;
        } catch {
            return false;
        }
    }, 'Invalid investment amount'),
    investorAddress: walletAddressSchema,
});

export const milestoneVoteSchema = z.object({
    milestoneId: z.string().uuid('Invalid milestone ID'),
    jurorAddress: walletAddressSchema,
    approve: z.boolean(),
    transactionHash: z
        .string()
        .regex(/^0x[a-fA-F0-9]{64}$/, 'Invalid transaction hash')
        .optional(),
});
