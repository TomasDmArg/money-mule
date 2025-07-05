import { ethers } from 'ethers';
import { useCallback, useEffect, useState } from 'react';

import { MilestoneInfo, RoundContract, RoundInfo } from '../lib/contracts/round-contract';
import { Database } from '../types/database';
import { useWallet } from './useWallet';

type RoundRow = Database['public']['Tables']['rounds']['Row'];
type MilestoneRow = Database['public']['Tables']['milestones']['Row'];

interface ProjectDetailData {
    // Database metadata
    metadata: RoundRow | null;
    milestones: MilestoneRow[];

    // Blockchain data
    contractInfo: RoundInfo | null;
    contractMilestones: MilestoneInfo[];
    userInvestment: bigint;
    investors: string[];

    // User role
    isFounder: boolean;
    isJuror: boolean;

    // Loading states
    isLoading: boolean;
    error: string | null;
}

export const useProjectDetail = (contractAddress: string) => {
    const { address, network } = useWallet();
    const [data, setData] = useState<ProjectDetailData>({
        metadata: null,
        milestones: [],
        contractInfo: null,
        contractMilestones: [],
        userInvestment: 0n,
        investors: [],
        isFounder: false,
        isJuror: false,
        isLoading: true,
        error: null,
    });

    const [contract, setContract] = useState<RoundContract | null>(null);

    // Initialize contract
    useEffect(() => {
        if (!contractAddress || !ethers.isAddress(contractAddress)) return;

        try {
            const provider = new ethers.JsonRpcProvider(network.rpcUrls.default.http[0]);
            const roundContract = new RoundContract(
                contractAddress,
                process.env.NEXT_PUBLIC_USDC_CONTRACT!,
                provider
            );
            setContract(roundContract);
        } catch (error) {
            console.error('Failed to initialize contract:', error);
            setData(prev => ({ ...prev, error: 'Failed to initialize contract' }));
        }
    }, [contractAddress, network]);

    // Fetch project metadata from database
    const fetchMetadata = useCallback(async () => {
        try {
            const response = await fetch(`/api/rounds/${contractAddress}`);
            if (!response.ok) {
                throw new Error('Failed to fetch project metadata');
            }
            const data = await response.json();
            return data.round || null;
        } catch (error) {
            console.error('Error fetching metadata:', error);
            return null;
        }
    }, [contractAddress]);

    // Fetch milestones from database
    const fetchMilestones = useCallback(async () => {
        try {
            const response = await fetch(`/api/rounds/${contractAddress}/milestones`);
            if (!response.ok) {
                throw new Error('Failed to fetch milestones');
            }
            const data = await response.json();
            return data.milestones || [];
        } catch (error) {
            console.error('Error fetching milestones:', error);
            return [];
        }
    }, [contractAddress]);

    // Fetch contract data
    const fetchContractData = useCallback(async () => {
        if (!contract) return;

        try {
            const [contractInfo, founder, totalMilestones] = await Promise.all([
                contract.getRoundInfo(),
                contract.getFounder(),
                contract.getTotalMilestones(),
            ]);

            // Fetch all milestones from contract
            const contractMilestones: MilestoneInfo[] = [];
            for (let i = 0; i < totalMilestones; i++) {
                const milestone = await contract.getMilestone(i);
                contractMilestones.push(milestone);
            }

            // Get user investment if connected
            let userInvestment = 0n;
            if (address) {
                userInvestment = await contract.getInvestment(address);
            }

            // Get all investors
            const investors = await contract.getAllInvestors();

            // Check if user is founder
            const isFounder = address ? address.toLowerCase() === founder.toLowerCase() : false;

            // Check if user is juror (would need to be implemented based on your jury system)
            const isJuror = false; // TODO: Implement jury check

            return {
                contractInfo,
                contractMilestones,
                userInvestment,
                investors,
                isFounder,
                isJuror,
            };
        } catch (error) {
            console.error('Error fetching contract data:', error);
            throw error;
        }
    }, [contract, address]);

    // Main data fetching function
    const fetchAll = useCallback(async () => {
        setData(prev => ({ ...prev, isLoading: true, error: null }));

        try {
            const [metadata, milestones, contractData] = await Promise.all([
                fetchMetadata(),
                fetchMilestones(),
                contract ? fetchContractData() : Promise.resolve(null),
            ]);

            setData(prev => ({
                ...prev,
                metadata,
                milestones,
                contractInfo: contractData?.contractInfo || null,
                contractMilestones: contractData?.contractMilestones || [],
                userInvestment: contractData?.userInvestment || 0n,
                investors: contractData?.investors || [],
                isFounder: contractData?.isFounder || false,
                isJuror: contractData?.isJuror || false,
                isLoading: false,
            }));
        } catch (error) {
            console.error('Error fetching project data:', error);
            setData(prev => ({
                ...prev,
                error: error instanceof Error ? error.message : 'Failed to fetch project data',
                isLoading: false,
            }));
        }
    }, [fetchMetadata, fetchMilestones, fetchContractData, contract]);

    // Refresh data
    const refresh = useCallback(() => {
        fetchAll();
    }, [fetchAll]);

    // Auto-fetch on mount and when dependencies change
    useEffect(() => {
        fetchAll();
    }, [fetchAll]);

    // Auto-refresh contract data periodically
    useEffect(() => {
        if (!contract) return;

        const interval = setInterval(() => {
            fetchContractData()
                .then(contractData => {
                    if (contractData) {
                        setData(prev => ({
                            ...prev,
                            contractInfo: contractData.contractInfo,
                            contractMilestones: contractData.contractMilestones,
                            userInvestment: contractData.userInvestment,
                            investors: contractData.investors,
                        }));
                    }
                })
                .catch(console.error);
        }, 30000); // Refresh every 30 seconds

        return () => clearInterval(interval);
    }, [contract, fetchContractData]);

    return {
        ...data,
        contract,
        refresh,
    };
};
