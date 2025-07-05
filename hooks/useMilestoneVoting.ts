import { useCallback, useState } from 'react';
import toast from 'react-hot-toast';

import { RoundContract } from '@/lib/contracts/round-contract';

import { useWallet } from './useWallet';

interface VotingState {
    isVoting: boolean;
    error: string | null;
}

export const useMilestoneVoting = (contract: RoundContract | null) => {
    const { address } = useWallet();
    const [state, setState] = useState<VotingState>({
        isVoting: false,
        error: null,
    });

    const voteMilestone = useCallback(
        async (
            milestoneId: number,
            approve: boolean,
            contractAddress: string
        ): Promise<{ success: boolean; txHash?: string }> => {
            if (!contract || !address) {
                toast.error('Please connect your wallet');
                return { success: false };
            }

            setState(prev => ({ ...prev, isVoting: true, error: null }));

            try {
                toast.loading(`Submitting ${approve ? 'approval' : 'rejection'} vote...`, {
                    id: 'vote',
                });

                const tx = await contract.voteMilestone(milestoneId, approve);

                toast.loading('Waiting for transaction confirmation...', { id: 'vote' });
                const receipt = await tx.wait();

                // Update database
                await fetch('/api/jury-votes', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-wallet-address': address,
                    },
                    body: JSON.stringify({
                        milestoneId,
                        jurorAddress: address,
                        approve,
                        transactionHash: receipt.hash,
                    }),
                });

                toast.success(`Vote ${approve ? 'approved' : 'rejected'} successfully!`, {
                    id: 'vote',
                });
                return { success: true, txHash: receipt.hash };
            } catch (error) {
                console.error('Voting failed:', error);
                toast.error('Failed to submit vote', { id: 'vote' });
                setState(prev => ({
                    ...prev,
                    error: error instanceof Error ? error.message : 'Voting failed',
                }));
                return { success: false };
            } finally {
                setState(prev => ({ ...prev, isVoting: false }));
            }
        },
        [contract, address]
    );

    const requestMilestoneFunds = useCallback(
        async (
            milestoneId: number,
            contractAddress: string
        ): Promise<{ success: boolean; txHash?: string }> => {
            if (!contract || !address) {
                toast.error('Please connect your wallet');
                return { success: false };
            }

            setState(prev => ({ ...prev, isVoting: true, error: null }));

            try {
                toast.loading('Requesting milestone funds...', { id: 'request' });

                const tx = await contract.requestMilestoneFunds(milestoneId);

                toast.loading('Waiting for transaction confirmation...', { id: 'request' });
                const receipt = await tx.wait();

                toast.success('Milestone funds requested successfully!', { id: 'request' });
                return { success: true, txHash: receipt.hash };
            } catch (error) {
                console.error('Request funds failed:', error);
                toast.error('Failed to request funds', { id: 'request' });
                setState(prev => ({
                    ...prev,
                    error: error instanceof Error ? error.message : 'Request failed',
                }));
                return { success: false };
            } finally {
                setState(prev => ({ ...prev, isVoting: false }));
            }
        },
        [contract, address]
    );

    const releaseMilestoneFunds = useCallback(
        async (
            milestoneId: number,
            contractAddress: string
        ): Promise<{ success: boolean; txHash?: string }> => {
            if (!contract || !address) {
                toast.error('Please connect your wallet');
                return { success: false };
            }

            setState(prev => ({ ...prev, isVoting: true, error: null }));

            try {
                toast.loading('Releasing milestone funds...', { id: 'release' });

                const tx = await contract.releaseMilestoneFunds(milestoneId);

                toast.loading('Waiting for transaction confirmation...', { id: 'release' });
                const receipt = await tx.wait();

                toast.success('Milestone funds released successfully!', { id: 'release' });
                return { success: true, txHash: receipt.hash };
            } catch (error) {
                console.error('Release funds failed:', error);
                toast.error('Failed to release funds', { id: 'release' });
                setState(prev => ({
                    ...prev,
                    error: error instanceof Error ? error.message : 'Release failed',
                }));
                return { success: false };
            } finally {
                setState(prev => ({ ...prev, isVoting: false }));
            }
        },
        [contract, address]
    );

    return {
        ...state,
        voteMilestone,
        requestMilestoneFunds,
        releaseMilestoneFunds,
    };
};
