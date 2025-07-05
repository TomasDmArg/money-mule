import { NextRequest, NextResponse } from 'next/server';

import { requireAuth } from '../../../lib/middleware/auth';
import { supabaseServer } from '../../../lib/supabase-server';
import { milestoneVoteSchema } from '../../../lib/validations/schemas';

export async function POST(request: NextRequest) {
    try {
        // Validate authentication
        const auth = await requireAuth(request);
        if (!auth.success) {
            return NextResponse.json({ error: auth.error }, { status: 401 });
        }

        const body = await request.json();

        // Validate data
        const validation = milestoneVoteSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json(
                { error: 'Invalid request data', details: validation.error.errors },
                { status: 400 }
            );
        }

        const { milestoneId, jurorAddress, approve, transactionHash } = validation.data;

        // Verify juror address matches authenticated address
        if (jurorAddress !== auth.address) {
            return NextResponse.json({ error: 'Address mismatch' }, { status: 403 });
        }

        // Check if juror is authorized (TODO: implement proper jury authorization)
        // For now, we'll allow any authenticated user to vote

        // Insert vote
        const { data: vote, error } = await supabaseServer
            .from('jury_votes')
            .upsert({
                milestone_id: milestoneId,
                juror_address: jurorAddress.toLowerCase(),
                approve,
                transaction_hash: transactionHash,
            })
            .select()
            .single();

        if (error) {
            throw error;
        }

        return NextResponse.json({
            success: true,
            vote,
        });
    } catch (error) {
        console.error('Jury vote API error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const milestoneId = searchParams.get('milestone');
        const jurorAddress = searchParams.get('juror');

        let query = supabaseServer.from('jury_votes').select(`
        *,
        milestones!inner(*)
      `);

        if (milestoneId) {
            query = query.eq('milestone_id', milestoneId);
        }

        if (jurorAddress) {
            query = query.eq('juror_address', jurorAddress.toLowerCase());
        }

        const { data: votes, error } = await query.order('created_at', { ascending: false });

        if (error) {
            throw error;
        }

        return NextResponse.json({
            success: true,
            votes: votes || [],
        });
    } catch (error) {
        console.error('Get jury votes API error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
