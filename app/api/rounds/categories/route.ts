import { NextResponse } from 'next/server';

import { RoundService } from '../../../../lib/services/round-service';

export async function GET() {
    try {
        const categories = await RoundService.getCategories();
        return NextResponse.json({ categories });
    } catch (error) {
        console.error('Categories API error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
