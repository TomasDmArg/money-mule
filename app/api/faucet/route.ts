import { NextRequest, NextResponse } from 'next/server';

import { requireAuth } from '../../../lib/middleware/auth';
import { FaucetService } from '../../../lib/services/faucet-service';
import { faucetRequestSchema } from '../../../lib/validations/schemas';

export async function POST(request: NextRequest) {
    try {
        // Validate authentication
        const auth = await requireAuth(request);
        if (!auth.success) {
            return NextResponse.json({ error: auth.error }, { status: 401 });
        }

        const body = await request.json();

        // Validate data
        const validation = faucetRequestSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json(
                { error: 'Invalid request data', details: validation.error.errors },
                { status: 400 }
            );
        }

        // Verify address matches authenticated address
        if (validation.data.address !== auth.address) {
            return NextResponse.json({ error: 'Address mismatch' }, { status: 403 });
        }

        // Process faucet request
        const result = await FaucetService.requestTokens(validation.data.address);

        if (result.success) {
            return NextResponse.json({
                success: true,
                txHash: result.txHash,
                message: 'Tokens sent successfully!',
            });
        }
        return NextResponse.json(
            {
                error: result.error,
                nextRequestTime: result.nextRequestTime,
            },
            { status: 400 }
        );
    } catch (error) {
        console.error('Faucet API error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function GET() {
    try {
        const stats = await FaucetService.getFaucetStats();
        return NextResponse.json(stats);
    } catch (error) {
        console.error('Faucet stats error:', error);
        return NextResponse.json({ error: 'Failed to get faucet stats' }, { status: 500 });
    }
}
