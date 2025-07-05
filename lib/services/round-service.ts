import { Database } from '../../types/database';
import { supabaseServer } from '../supabase-server';

type RoundRow = Database['public']['Tables']['rounds']['Row'];
type RoundInsert = Database['public']['Tables']['rounds']['Insert'];
type RoundUpdate = Database['public']['Tables']['rounds']['Update'];

export class RoundService {
    static async createRound(roundData: RoundInsert): Promise<RoundRow> {
        const { data, error } = await supabaseServer
            .from('rounds')
            .insert(roundData)
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    static async getRounds(filters?: {
        phase?: string;
        category?: string;
        founder?: string;
        limit?: number;
        offset?: number;
    }): Promise<RoundRow[]> {
        let query = supabaseServer
            .from('rounds')
            .select('*')
            .order('created_at', { ascending: false });

        if (filters?.phase) {
            query = query.eq('phase', filters.phase);
        }

        if (filters?.category) {
            query = query.eq('category', filters.category);
        }

        if (filters?.founder) {
            query = query.eq('founder_address', filters.founder.toLowerCase());
        }

        if (filters?.limit) {
            query = query.limit(filters.limit);
        }

        if (filters?.offset) {
            query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
        }

        const { data, error } = await query;

        if (error) throw error;
        return data || [];
    }

    static async getRoundsWithPagination(filters: {
        phase?: string;
        category?: string;
        founder?: string;
        search?: string;
        sortBy?: string;
        sortOrder?: 'asc' | 'desc';
        limit?: number;
        offset?: number;
    }): Promise<{ rounds: RoundRow[]; total: number }> {
        let query = supabaseServer.from('rounds').select('*', { count: 'exact' });

        // Apply filters
        if (filters.phase) {
            query = query.eq('phase', filters.phase);
        }

        if (filters.category) {
            query = query.eq('category', filters.category);
        }

        if (filters.founder) {
            query = query.eq('founder_address', filters.founder.toLowerCase());
        }

        if (filters.search) {
            query = query.or(
                `title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`
            );
        }

        // Apply ordering
        const sortBy = filters.sortBy || 'created_at';
        const sortOrder = filters.sortOrder || 'desc';
        query = query.order(sortBy, { ascending: sortOrder === 'asc' });

        // Apply pagination
        if (filters.limit) {
            query = query.limit(filters.limit);
        }

        if (filters.offset) {
            query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
        }

        const { data, error, count } = await query;

        if (error) throw error;

        return {
            rounds: data || [],
            total: count || 0,
        };
    }

    static async getRoundByContract(contractAddress: string): Promise<RoundRow | null> {
        const { data, error } = await supabaseServer
            .from('rounds')
            .select('*')
            .eq('contract_address', contractAddress.toLowerCase())
            .single();

        if (error && error.code !== 'PGRST116') {
            throw error;
        }

        return data;
    }

    static async updateRound(contractAddress: string, updates: RoundUpdate): Promise<RoundRow> {
        const { data, error } = await supabaseServer
            .from('rounds')
            .update({ ...updates, updated_at: new Date().toISOString() })
            .eq('contract_address', contractAddress.toLowerCase())
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    static async getRoundStats(): Promise<{
        totalRounds: number;
        activeRounds: number;
        totalFunding: string;
        completedMilestones: number;
    }> {
        try {
            // Total rounds
            const { count: totalRounds } = await supabaseServer
                .from('rounds')
                .select('*', { count: 'exact', head: true });

            // Active rounds
            const { count: activeRounds } = await supabaseServer
                .from('rounds')
                .select('*', { count: 'exact', head: true })
                .in('phase', ['Funding', 'Execution']);

            // Total funding
            const { data: fundingData } = await supabaseServer
                .from('rounds')
                .select('current_amount.sum()');

            // Completed milestones
            const { count: completedMilestones } = await supabaseServer
                .from('milestones')
                .select('*', { count: 'exact', head: true })
                .eq('status', 'Completed');

            return {
                totalRounds: totalRounds || 0,
                activeRounds: activeRounds || 0,
                totalFunding: fundingData?.[0]?.sum || '0',
                completedMilestones: completedMilestones || 0,
            };
        } catch (error) {
            console.error('Error getting round stats:', error);
            return {
                totalRounds: 0,
                activeRounds: 0,
                totalFunding: '0',
                completedMilestones: 0,
            };
        }
    }

    static async getCategories(): Promise<string[]> {
        try {
            const { data } = await supabaseServer
                .from('rounds')
                .select('category')
                .not('category', 'is', null);

            const categories = [...new Set(data?.map(r => r.category).filter(Boolean))];
            return categories.sort();
        } catch (error) {
            console.error('Error getting categories:', error);
            return [];
        }
    }
}
