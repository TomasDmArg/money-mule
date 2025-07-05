import { NextRequest, NextResponse } from 'next/server';

import { requireAuth } from '../../../lib/middleware/auth';
import { supabaseServer } from '../../../lib/supabase-server';
import { investmentSchema } from '../../../lib/validations/schemas';

export async function POST(request: NextRequest) {
    try {
        // Validate authentication
        const auth = await requireAuth(request);
        if (!auth.success) {
            return NextResponse.json({ error: auth.error }, { status: 401 });
        }

        const body = await request.json();

        // Validate data
        const validation = investmentSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json(
                { error: 'Invalid request data', details: validation.error.errors },
                { status: 400 }
            );
        }

        const { contractAddress, amount, investorAddress, transactionHash } = validation.data;

        // Verify investor address matches authenticated address
        if (investorAddress !== auth.address) {
            return NextResponse.json({ error: 'Address mismatch' }, { status: 403 });
        }

        // Get round ID from contract address
        const { data: round } = await supabaseServer
            .from('rounds')
            .select('id')
            .eq('contract_address', contractAddress.toLowerCase())
            .single();

        if (!round) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        }

        // Insert or update investment
        const { data: investment, error } = await supabaseServer
            .from('investments')
            .upsert({
                round_id: round.id,
                investor_address: investorAddress.toLowerCase(),
                amount,
                transaction_hash: transactionHash,
            })
            .select()
            .single();

        if (error) {
            throw error;
        }

        return NextResponse.json({
            success: true,
            investment,
        });
    } catch (error) {
        console.error('Investment API error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const contractAddress = searchParams.get('contract');
        const investorAddress = searchParams.get('investor');

        let query = supabaseServer.from('investments').select(`
        *,
        rounds!inner(contract_address, title)
      `);

        if (contractAddress) {
            query = query.eq('rounds.contract_address', contractAddress.toLowerCase());
        }

        if (investorAddress) {
            query = query.eq('investor_address', investorAddress.toLowerCase());
        }

        const { data: investments, error } = await query.order('created_at', { ascending: false });

        if (error) {
            throw error;
        }

        return NextResponse.json({
            success: true,
            investments: investments || [],
        });
    } catch (error) {
        console.error('Get investments API error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
