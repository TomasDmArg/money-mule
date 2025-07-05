import { NextRequest, NextResponse } from 'next/server';

import { RoundService } from '../../../../lib/services/round-service';

export async function GET(request: NextRequest, { params }: { params: { contract: string } }) {
    try {
        const contractAddress = params.contract;

        if (!contractAddress) {
            return NextResponse.json({ error: 'Contract address is required' }, { status: 400 });
        }

        const round = await RoundService.getRoundByContract(contractAddress);

        if (!round) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            round,
        });
    } catch (error) {
        console.error('Get round API error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest, { params }: { params: { contract: string } }) {
    try {
        const contractAddress = params.contract;
        const body = await request.json();

        if (!contractAddress) {
            return NextResponse.json({ error: 'Contract address is required' }, { status: 400 });
        }

        const updatedRound = await RoundService.updateRound(contractAddress, body);

        return NextResponse.json({
            success: true,
            round: updatedRound,
        });
    } catch (error) {
        console.error('Update round API error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
