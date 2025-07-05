import { Database } from '../../types/database';
import { supabaseServer } from '../supabase-server';

type WalletRow = Database['public']['Tables']['wallets']['Row'];
type WalletInsert = Database['public']['Tables']['wallets']['Insert'];

export class WalletService {
    static async getWallet(address: string): Promise<WalletRow | null> {
        const { data, error } = await supabaseServer
            .from('wallets')
            .select('*')
            .eq('address', address.toLowerCase())
            .single();

        if (error && error.code !== 'PGRST116') {
            throw error;
        }

        return data;
    }

    static async createWallet(address: string): Promise<WalletRow> {
        const { data, error } = await supabaseServer
            .from('wallets')
            .insert({ address: address.toLowerCase() })
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    static async updateLastFaucetRequest(address: string): Promise<WalletRow> {
        const { data, error } = await supabaseServer
            .from('wallets')
            .update({
                last_faucet_request: new Date().toISOString(),
                total_faucet_requests: await this.incrementFaucetRequests(address),
            })
            .eq('address', address.toLowerCase())
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    static async canRequestFaucet(address: string): Promise<boolean> {
        const wallet = await this.getWallet(address);

        if (!wallet || !wallet.last_faucet_request) {
            return true;
        }

        const lastRequest = new Date(wallet.last_faucet_request);
        const now = new Date();
        const hoursDiff = (now.getTime() - lastRequest.getTime()) / (1000 * 60 * 60);

        return hoursDiff >= 24;
    }

    private static async incrementFaucetRequests(address: string): Promise<number> {
        const wallet = await this.getWallet(address);
        return (wallet?.total_faucet_requests || 0) + 1;
    }
}
