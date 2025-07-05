import { NextResponse } from 'next/server';

import { RoundService } from '../../../../lib/services/round-service';

export async function GET() {
    try {
        const stats = await RoundService.getRoundStats();
        return NextResponse.json(stats);
    } catch (error) {
        console.error('Stats API error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
