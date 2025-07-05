export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
    public: {
        Tables: {
            wallets: {
                Row: {
                    id: number;
                    address: string;
                    created_at: string;
                    last_faucet_request: string | null;
                    total_faucet_requests: number;
                };
                Insert: {
                    id?: number;
                    address: string;
                    created_at?: string;
                    last_faucet_request?: string | null;
                    total_faucet_requests?: number;
                };
                Update: {
                    id?: number;
                    address?: string;
                    created_at?: string;
                    last_faucet_request?: string | null;
                    total_faucet_requests?: number;
                };
            };
            rounds: {
                Row: {
                    id: number;
                    contract_address: string;
                    title: string;
                    description: string;
                    category: string;
                    founder_address: string;
                    target_amount: string;
                    current_amount: string;
                    phase: string;
                    created_at: string;
                    updated_at: string;
                    image_url: string | null;
                    end_date: string | null;
                };
                Insert: {
                    id?: number;
                    contract_address: string;
                    title: string;
                    description: string;
                    category: string;
                    founder_address: string;
                    target_amount: string;
                    current_amount?: string;
                    phase?: string;
                    created_at?: string;
                    updated_at?: string;
                    image_url?: string | null;
                    end_date?: string | null;
                };
                Update: {
                    id?: number;
                    contract_address?: string;
                    title?: string;
                    description?: string;
                    category?: string;
                    founder_address?: string;
                    target_amount?: string;
                    current_amount?: string;
                    phase?: string;
                    created_at?: string;
                    updated_at?: string;
                    image_url?: string | null;
                    end_date?: string | null;
                };
            };
            investments: {
                Row: {
                    id: number;
                    investor_address: string;
                    round_id: number;
                    amount: string;
                    transaction_hash: string;
                    created_at: string;
                };
                Insert: {
                    id?: number;
                    investor_address: string;
                    round_id: number;
                    amount: string;
                    transaction_hash: string;
                    created_at?: string;
                };
                Update: {
                    id?: number;
                    investor_address?: string;
                    round_id?: number;
                    amount?: string;
                    transaction_hash?: string;
                    created_at?: string;
                };
            };
            milestones: {
                Row: {
                    id: number;
                    round_id: number;
                    title: string;
                    description: string;
                    target_amount: string;
                    status: string;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: number;
                    round_id: number;
                    title: string;
                    description: string;
                    target_amount: string;
                    status?: string;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: number;
                    round_id?: number;
                    title?: string;
                    description?: string;
                    target_amount?: string;
                    status?: string;
                    created_at?: string;
                    updated_at?: string;
                };
            };
            jury_votes: {
                Row: {
                    id: number;
                    voter_address: string;
                    milestone_id: number;
                    vote: boolean;
                    created_at: string;
                };
                Insert: {
                    id?: number;
                    voter_address: string;
                    milestone_id: number;
                    vote: boolean;
                    created_at?: string;
                };
                Update: {
                    id?: number;
                    voter_address?: string;
                    milestone_id?: number;
                    vote?: boolean;
                    created_at?: string;
                };
            };
        };
        Views: {
            [_ in never]: never;
        };
        Functions: {
            [_ in never]: never;
        };
        Enums: {
            [_ in never]: never;
        };
        CompositeTypes: {
            [_ in never]: never;
        };
    };
}
