import { NextRequest, NextResponse } from 'next/server';

import { RoundService } from '../../../lib/services/round-service';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);

        // Filter parameters
        const phase = searchParams.get('phase');
        const category = searchParams.get('category');
        const founder = searchParams.get('founder');
        const search = searchParams.get('search');
        const sortBy = searchParams.get('sortBy') || 'created_at';
        const sortOrder = searchParams.get('sortOrder') || 'desc';

        // Pagination parameters
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '12');
        const offset = (page - 1) * limit;

        const result = await RoundService.getRoundsWithPagination({
            phase: phase || undefined,
            category: category || undefined,
            founder: founder || undefined,
            search: search || undefined,
            sortBy,
            sortOrder: sortOrder as 'asc' | 'desc',
            limit,
            offset,
        });

        return NextResponse.json({
            success: true,
            rounds: result.rounds,
            pagination: {
                page,
                limit,
                total: result.total,
                totalPages: Math.ceil(result.total / limit),
                hasNext: page < Math.ceil(result.total / limit),
                hasPrev: page > 1,
            },
        });
    } catch (error) {
        console.error('Get rounds API error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
