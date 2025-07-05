import { NextRequest, NextResponse } from 'next/server';

import { supabaseServer } from '../../../../../lib/supabase-server';

export async function GET(request: NextRequest, { params }: { params: { contract: string } }) {
    try {
        const contractAddress = params.contract;

        if (!contractAddress) {
            return NextResponse.json({ error: 'Contract address is required' }, { status: 400 });
        }

        // Get round first to get round_id
        const { data: round } = await supabaseServer
            .from('rounds')
            .select('id')
            .eq('contract_address', contractAddress.toLowerCase())
            .single();

        if (!round) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        }

        // Get milestones for this round
        const { data: milestones, error } = await supabaseServer
            .from('milestones')
            .select('*')
            .eq('round_id', round.id)
            .order('milestone_id', { ascending: true });

        if (error) {
            throw error;
        }

        return NextResponse.json({
            success: true,
            milestones: milestones || [],
        });
    } catch (error) {
        console.error('Get milestones API error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
