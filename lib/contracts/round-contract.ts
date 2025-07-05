import { ethers } from 'ethers';

// MoneyMule Round Contract ABI (essential functions)
export const ROUND_CONTRACT_ABI = [
    // Read functions
    'function getRoundInfo() external view returns (uint256 targetAmount, uint256 currentAmount, uint256 deadline, uint8 phase)',
    'function getMilestone(uint256 milestoneId) external view returns (string memory title, string memory description, uint256 amount, uint256 deadline, uint8 status, uint256 votesFor, uint256 votesAgainst)',
    'function getInvestment(address investor) external view returns (uint256 amount)',
    'function getTotalInvestors() external view returns (uint256)',
    'function getInvestorAt(uint256 index) external view returns (address)',
    'function founder() external view returns (address)',
    'function tokenAddress() external view returns (address)',
    'function currentPhase() external view returns (uint8)',
    'function totalMilestones() external view returns (uint256)',
    'function milestonesCompleted() external view returns (uint256)',

    // Write functions
    'function invest(uint256 amount) external',
    'function requestMilestoneFunds(uint256 milestoneId) external',
    'function voteMilestone(uint256 milestoneId, bool approve) external',
    'function releaseMilestoneFunds(uint256 milestoneId) external',

    // Events
    'event InvestmentMade(address indexed investor, uint256 amount)',
    'event MilestoneVoted(uint256 indexed milestoneId, address indexed juror, bool approve)',
    'event MilestoneFundsReleased(uint256 indexed milestoneId, uint256 amount)',
    'event PhaseChanged(uint8 newPhase)',
];

// USDC Contract ABI
export const USDC_CONTRACT_ABI = [
    'function balanceOf(address account) external view returns (uint256)',
    'function allowance(address owner, address spender) external view returns (uint256)',
    'function approve(address spender, uint256 amount) external returns (bool)',
    'function transfer(address to, uint256 amount) external returns (bool)',
    'function decimals() external view returns (uint8)',
];

export enum ProjectPhase {
    Funding = 0,
    Execution = 1,
    Completed = 2,
    Cancelled = 3,
}

export enum MilestoneStatus {
    Pending = 0,
    Active = 1,
    Approved = 2,
    Rejected = 3,
    Completed = 4,
}

export interface RoundInfo {
    targetAmount: bigint;
    currentAmount: bigint;
    deadline: bigint;
    phase: ProjectPhase;
}

export interface MilestoneInfo {
    title: string;
    description: string;
    amount: bigint;
    deadline: bigint;
    status: MilestoneStatus;
    votesFor: bigint;
    votesAgainst: bigint;
}

export class RoundContract {
    private contract: ethers.Contract;

    private usdcContract: ethers.Contract;

    private provider: ethers.Provider;

    private signer?: ethers.Signer;

    constructor(
        contractAddress: string,
        usdcAddress: string,
        provider: ethers.Provider,
        signer?: ethers.Signer
    ) {
        this.provider = provider;
        this.signer = signer;
        this.contract = new ethers.Contract(
            contractAddress,
            ROUND_CONTRACT_ABI,
            signer || provider
        );
        this.usdcContract = new ethers.Contract(usdcAddress, USDC_CONTRACT_ABI, signer || provider);
    }

    // Read functions
    async getRoundInfo(): Promise<RoundInfo> {
        const [targetAmount, currentAmount, deadline, phase] = await this.contract.getRoundInfo();
        return {
            targetAmount,
            currentAmount,
            deadline,
            phase: phase as ProjectPhase,
        };
    }

    async getMilestone(milestoneId: number): Promise<MilestoneInfo> {
        const [title, description, amount, deadline, status, votesFor, votesAgainst] =
            await this.contract.getMilestone(milestoneId);
        return {
            title,
            description,
            amount,
            deadline,
            status: status as MilestoneStatus,
            votesFor,
            votesAgainst,
        };
    }

    async getInvestment(investor: string): Promise<bigint> {
        return this.contract.getInvestment(investor);
    }

    async getAllInvestors(): Promise<string[]> {
        const totalInvestors = await this.contract.getTotalInvestors();
        const investors: string[] = [];

        for (let i = 0; i < totalInvestors; i++) {
            const investor = await this.contract.getInvestorAt(i);
            investors.push(investor);
        }

        return investors;
    }

    async getFounder(): Promise<string> {
        return this.contract.founder();
    }

    async getCurrentPhase(): Promise<ProjectPhase> {
        return this.contract.currentPhase();
    }

    async getTotalMilestones(): Promise<number> {
        const total = await this.contract.totalMilestones();
        return Number(total);
    }

    async getMilestonesCompleted(): Promise<number> {
        const completed = await this.contract.milestonesCompleted();
        return Number(completed);
    }

    // USDC functions
    async getUSDCBalance(address: string): Promise<bigint> {
        return this.usdcContract.balanceOf(address);
    }

    async getUSDCAllowance(owner: string, spender: string): Promise<bigint> {
        return this.usdcContract.allowance(owner, spender);
    }

    async approveUSDC(spender: string, amount: bigint): Promise<ethers.ContractTransaction> {
        if (!this.signer) throw new Error('Signer required for write operations');
        return await this.usdcContract.connect(this.signer).approve(spender, amount);
    }

    // Write functions (require signer)
    async invest(amount: bigint): Promise<ethers.ContractTransaction> {
        if (!this.signer) throw new Error('Signer required for investment');
        return await this.contract.connect(this.signer).invest(amount);
    }

    async requestMilestoneFunds(milestoneId: number): Promise<ethers.ContractTransaction> {
        if (!this.signer) throw new Error('Signer required for milestone operations');
        return await this.contract.connect(this.signer).requestMilestoneFunds(milestoneId);
    }

    async voteMilestone(
        milestoneId: number,
        approve: boolean
    ): Promise<ethers.ContractTransaction> {
        if (!this.signer) throw new Error('Signer required for voting');
        return await this.contract.connect(this.signer).voteMilestone(milestoneId, approve);
    }

    async releaseMilestoneFunds(milestoneId: number): Promise<ethers.ContractTransaction> {
        if (!this.signer) throw new Error('Signer required for releasing funds');
        return await this.contract.connect(this.signer).releaseMilestoneFunds(milestoneId);
    }
}
