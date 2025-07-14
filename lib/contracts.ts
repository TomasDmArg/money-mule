import { ethers } from 'ethers';

import { CONTRACTS, DEFAULT_JURY_ADDRESSES } from './constants';

// VenturePilotFactory ABI
export const MONEY_MULE_FACTORY_ABI = [
    {
        inputs: [
            {
                internalType: 'address',
                name: 'token',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'targetAmount',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: 'fundingDeadline',
                type: 'uint256',
            },
            {
                components: [
                    {
                        internalType: 'string',
                        name: 'description',
                        type: 'string',
                    },
                    {
                        internalType: 'uint256',
                        name: 'fundingAmount',
                        type: 'uint256',
                    },
                    {
                        internalType: 'uint256',
                        name: 'deadline',
                        type: 'uint256',
                    },
                    {
                        internalType: 'address[3]',
                        name: 'juryWallets',
                        type: 'address[3]',
                    },
                ],
                internalType: 'struct MoneyMuleFactory.MilestoneData[]',
                name: 'milestones',
                type: 'tuple[]',
            },
        ],
        name: 'createFundingRound',
        outputs: [
            {
                internalType: 'uint256',
                name: 'roundId',
                type: 'uint256',
            },
            {
                internalType: 'address',
                name: 'roundContract',
                type: 'address',
            },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'founder',
                type: 'address',
            },
        ],
        name: 'getFounderRounds',
        outputs: [
            {
                internalType: 'uint256[]',
                name: '',
                type: 'uint256[]',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'getNextRoundId',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: 'roundId',
                type: 'uint256',
            },
        ],
        name: 'getRoundContract',
        outputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'juror',
                type: 'address',
            },
        ],
        name: 'isAuthorizedJuror',
        outputs: [
            {
                internalType: 'bool',
                name: '',
                type: 'bool',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'juror',
                type: 'address',
            },
        ],
        name: 'authorizeJuror',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        name: 'getTotalRounds',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'uint256',
                name: 'roundId',
                type: 'uint256',
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'roundContract',
                type: 'address',
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'founder',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'address',
                name: 'token',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'targetAmount',
                type: 'uint256',
            },
        ],
        name: 'RoundCreated',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'juror',
                type: 'address',
            },
        ],
        name: 'JurorAuthorized',
        type: 'event',
    },
    {
        inputs: [],
        name: 'paused',
        outputs: [
            {
                internalType: 'bool',
                name: '',
                type: 'bool',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
] as const;

export interface MilestoneData {
    description: string;
    fundingAmount: bigint;
    deadline: number;
    juryWallets: [string, string, string];
}

export interface CreateFundingRoundParams {
    tokenAddress: string;
    targetAmount: bigint;
    fundingDeadline: number;
    milestones: MilestoneData[];
}

export interface CreateFundingRoundResult {
    roundId: bigint;
    roundContract: string;
    transactionHash: string;
}

/**
 * Get the factory contract instance
 */
export function getFactoryContract(signerOrProvider: ethers.Signer | ethers.Provider) {
    return new ethers.Contract(CONTRACTS.FACTORY_ADDRESS, MONEY_MULE_FACTORY_ABI, signerOrProvider);
}

/**
 * Create a new funding round
 */
export async function createFundingRound(
    signer: ethers.Signer,
    params: CreateFundingRoundParams
): Promise<CreateFundingRoundResult> {
    const factory = getFactoryContract(signer);

    // Convert milestone data to contract format
    const milestoneData = params.milestones.map(milestone => ({
        description: milestone.description,
        fundingAmount: milestone.fundingAmount,
        deadline: milestone.deadline,
        juryWallets: milestone.juryWallets,
    }));

    // Call the contract function
    const tx = (await factory.createFundingRound(
        params.tokenAddress,
        params.targetAmount,
        params.fundingDeadline,
        milestoneData
    )) as ethers.ContractTransactionResponse;

    // Wait for the transaction to be mined
    const receipt = await tx.wait();

    if (!receipt) {
        throw new Error('Transaction failed to be mined');
    }

    // Find the RoundCreated event
    const roundCreatedEvent = receipt.logs.find((log: ethers.Log) => {
        try {
            const parsed = factory.interface.parseLog(log);
            return parsed?.name === 'RoundCreated';
        } catch {
            return false;
        }
    });

    if (!roundCreatedEvent) {
        throw new Error('RoundCreated event not found in transaction receipt');
    }

    const parsedEvent = factory.interface.parseLog(roundCreatedEvent);
    const roundId = parsedEvent?.args?.roundId as bigint;
    const roundContract = parsedEvent?.args?.roundContract as string;

    return {
        roundId,
        roundContract,
        transactionHash: receipt.hash,
    };
}

/**
 * Get the next round ID
 */
export async function getNextRoundId(provider: ethers.Provider): Promise<bigint> {
    const factory = getFactoryContract(provider);
    return (await factory.getNextRoundId()) as bigint;
}

/**
 * Get rounds created by a founder
 */
export async function getFounderRounds(
    provider: ethers.Provider,
    founderAddress: string
): Promise<bigint[]> {
    const factory = getFactoryContract(provider);
    return (await factory.getFounderRounds(founderAddress)) as bigint[];
}

/**
 * Get the round contract address for a specific round ID
 */
export async function getRoundContract(
    provider: ethers.Provider,
    roundId: bigint
): Promise<string> {
    const factory = getFactoryContract(provider);
    return (await factory.getRoundContract(roundId)) as string;
}

/**
 * Helper function to parse USDC amount (6 decimals)
 */
export function parseUSDCAmount(amount: string): bigint {
    return ethers.parseUnits(amount, 6);
}

/**
 * Helper function to format USDC amount (6 decimals)
 */
export function formatUSDCAmount(amount: bigint): string {
    return ethers.formatUnits(amount, 6);
}

/**
 * Helper function to convert date to Unix timestamp
 */
export function dateToUnixTimestamp(date: Date): number {
    return Math.floor(date.getTime() / 1000);
}

/**
 * Helper function to create milestone data with default jury
 */
export function createMilestoneData(
    description: string,
    fundingAmount: bigint,
    deadline: number,
    juryWallets: [string, string, string] = [...DEFAULT_JURY_ADDRESSES] as [string, string, string]
): MilestoneData {
    return {
        description,
        fundingAmount,
        deadline,
        juryWallets,
    };
}

/**
 * Verify that the factory contract is properly deployed and accessible
 */
export async function verifyFactoryContract(provider: ethers.Provider): Promise<boolean> {
    try {
        const factory = getFactoryContract(provider);

        await factory.getNextRoundId();
        return true;
    } catch (error) {
        return false;
    }
}

/**
 * Check if an address has any bytecode (i.e., is a contract)
 */
export async function isContract(provider: ethers.Provider, address: string): Promise<boolean> {
    try {
        const code = await provider.getCode(address);
        return code !== '0x';
    } catch (error) {
        return false;
    }
}

/**
 * Check if an address is an authorized juror
 */
export async function isAuthorizedJuror(
    provider: ethers.Provider,
    jurorAddress: string
): Promise<boolean> {
    try {
        const factory = getFactoryContract(provider);
        const isAuthorized = (await factory.isAuthorizedJuror(jurorAddress)) as boolean;
        return isAuthorized;
    } catch (error) {
        return false;
    }
}

/**
 * Get jury addresses using the authorized address from constants
 */
export function getAuthorizedJuryAddresses(): [string, string, string] {
    // Use the first authorized address from the constants
    const authorizedAddress = '0xa6e4e006EeD9fEA0C378A42d32a033F4B4f4A15b';
    return [authorizedAddress, authorizedAddress, authorizedAddress];
}

/**
 * Test contract call to get more detailed error information
 */
export async function testCreateFundingRound(
    signer: ethers.Signer,
    params: CreateFundingRoundParams
): Promise<void> {
    const factory = getFactoryContract(signer);
    const { provider } = signer;

    if (!provider) {
        throw new Error('Provider not available');
    }

    // Convert milestone data to contract format
    const milestoneData = params.milestones.map(milestone => ({
        description: milestone.description,
        fundingAmount: milestone.fundingAmount,
        deadline: milestone.deadline,
        juryWallets: milestone.juryWallets,
    }));

    // Check jury authorizations (parallel to avoid await in loops)
    const juryChecks = milestoneData.flatMap((milestone, i) =>
        milestone.juryWallets.map(async (juryWallet, j) => {
            try {
                const isAuthorized = (await factory.isAuthorizedJuror(juryWallet)) as boolean;
                if (!isAuthorized) {
                    throw new Error(`Jury wallet ${juryWallet} is not authorized!`);
                }
                return { milestone: i + 1, jury: j + 1, address: juryWallet, isAuthorized };
            } catch (error) {
                return { milestone: i + 1, jury: j + 1, address: juryWallet, isAuthorized: false };
            }
        })
    );

    // Wait for all jury checks to complete
    await Promise.all(juryChecks);

    // Check if the token address is valid
    try {
        const tokenCode = await provider.getCode(params.tokenAddress);
        if (tokenCode === '0x') {
            throw new Error('Token address is not a valid contract');
        }
    } catch (error) {
        throw new Error('Error checking token contract');
    }

    // Try to get the next round ID to make sure the factory is working
    try {
        await factory.getNextRoundId();
    } catch (error) {
        throw new Error('Factory contract is not working properly');
    }

    // Check if the contract is paused
    try {
        const isPaused = (await factory.paused()) as boolean;
        if (isPaused) {
            throw new Error(
                'The factory contract is currently paused. Contact the contract owner to unpause it.'
            );
        }
    } catch (error) {
        throw new Error('Error checking pause status');
    }

    try {
        await factory.createFundingRound.estimateGas(
            params.tokenAddress,
            params.targetAmount,
            params.fundingDeadline,
            milestoneData,
            { gasLimit: 10000000 } // 10M gas limit
        );
    } catch (error) {
        // Try to get more details about the error
        if (error instanceof Error) {
            // Check if this is a revert with reason
            if (error.message.includes('revert')) {
                throw new Error('Transaction would revert - validation failed');
            }

            // Try with a very high gas limit to see if it's a gas issue
            try {
                await factory.createFundingRound.estimateGas(
                    params.tokenAddress,
                    params.targetAmount,
                    params.fundingDeadline,
                    milestoneData,
                    { gasLimit: 10000000 } // 10M gas limit
                );
            } catch (highGasError) {
                // The issue is likely with contract deployment or MoneyMuleRound constructor
                throw new Error(
                    'VenturePilotRound contract deployment is failing. Possible causes: contract not deployed, constructor validation issues, gas limits exceeded, or missing dependencies.'
                );
            }
        }

        throw error;
    }
}
