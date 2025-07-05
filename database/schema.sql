-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Wallet table for faucet tracking
CREATE TABLE wallets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    address TEXT NOT NULL UNIQUE,
    last_faucet_request TIMESTAMP,
    total_faucet_requests INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Rounds table (projects/funding rounds)
CREATE TABLE rounds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    round_id BIGINT NOT NULL,
    contract_address TEXT NOT NULL UNIQUE,
    founder_address TEXT NOT NULL,
    token_address TEXT NOT NULL,
    target_amount DECIMAL(78, 0) NOT NULL,
    current_amount DECIMAL(78, 0) DEFAULT 0,
    funding_deadline TIMESTAMP NOT NULL,
    phase TEXT NOT NULL DEFAULT 'Funding',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    -- Project metadata
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    website_url TEXT,
    category TEXT,
    
    -- Contract state
    total_milestones INTEGER NOT NULL,
    milestones_completed INTEGER DEFAULT 0,
    
    CONSTRAINT valid_phase CHECK (phase IN ('Funding', 'Execution', 'Completed', 'Cancelled'))
);

-- Milestones table
CREATE TABLE milestones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    round_id UUID REFERENCES rounds(id) ON DELETE CASCADE,
    milestone_id INTEGER NOT NULL,
    contract_address TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    funding_amount DECIMAL(78, 0) NOT NULL,
    deadline TIMESTAMP NOT NULL,
    status TEXT NOT NULL DEFAULT 'Pending',
    votes_for INTEGER DEFAULT 0,
    votes_against INTEGER DEFAULT 0,
    voting_start_time TIMESTAMP,
    completed_at TIMESTAMP,
    funds_released BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    CONSTRAINT valid_status CHECK (status IN ('Pending', 'Active', 'Approved', 'Rejected', 'Completed'))
);

-- Investments table
CREATE TABLE investments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    round_id UUID REFERENCES rounds(id) ON DELETE CASCADE,
    investor_address TEXT NOT NULL,
    amount DECIMAL(78, 0) NOT NULL,
    transaction_hash TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(round_id, investor_address)
);

-- Jury members table
CREATE TABLE jury_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    address TEXT NOT NULL UNIQUE,
    name TEXT,
    bio TEXT,
    avatar_url TEXT,
    authorized BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Jury votes table
CREATE TABLE jury_votes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    milestone_id UUID REFERENCES milestones(id) ON DELETE CASCADE,
    juror_address TEXT NOT NULL,
    approve BOOLEAN NOT NULL,
    transaction_hash TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(milestone_id, juror_address)
);

-- Create indexes for performance
CREATE INDEX idx_rounds_founder ON rounds(founder_address);
CREATE INDEX idx_rounds_phase ON rounds(phase);
CREATE INDEX idx_rounds_created ON rounds(created_at);
CREATE INDEX idx_milestones_round ON milestones(round_id);
CREATE INDEX idx_investments_round ON investments(round_id);
CREATE INDEX idx_investments_investor ON investments(investor_address);
CREATE INDEX idx_wallets_address ON wallets(address);
CREATE INDEX idx_wallets_last_faucet ON wallets(last_faucet_request);

-- Enable Row Level Security
ALTER TABLE rounds ENABLE ROW LEVEL SECURITY;
ALTER TABLE milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE investments ENABLE ROW LEVEL SECURITY;
ALTER TABLE jury_votes ENABLE ROW LEVEL SECURITY;

-- Basic policies (allow read access to all users)
CREATE POLICY "Allow read access to all users" ON rounds FOR SELECT TO anon USING (true);
CREATE POLICY "Allow read access to all users" ON milestones FOR SELECT TO anon USING (true);
CREATE POLICY "Allow read access to all users" ON investments FOR SELECT TO anon USING (true);
CREATE POLICY "Allow read access to all users" ON jury_votes FOR SELECT TO anon USING (true);