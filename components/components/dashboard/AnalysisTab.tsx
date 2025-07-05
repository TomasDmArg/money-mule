'use client';

import { DollarSign } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CompetitorAnalysis, DetailedAnalysis } from '@/types/project';

interface AnalysisTabProps {
    detailedAnalysis?: DetailedAnalysis;
    competitorAnalysis?: CompetitorAnalysis;
}

export function AnalysisTab({ detailedAnalysis, competitorAnalysis }: AnalysisTabProps) {
    if (!detailedAnalysis && !competitorAnalysis) {
        return (
            <div className='text-center py-8'>
                <p className='text-gray-500'>No detailed analysis available for this project.</p>
            </div>
        );
    }

    return (
        <div className='space-y-6'>
            {/* Detailed Analysis */}
            {detailedAnalysis && (
                <div className='space-y-6'>
                    {/* Problem & Solution */}
                    <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                        {detailedAnalysis.problem && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className='text-red-600'>Problem</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className='text-gray-700'>{detailedAnalysis.problem}</p>
                                </CardContent>
                            </Card>
                        )}

                        {detailedAnalysis.solution && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className='text-green-600'>Solution</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className='text-gray-700'>{detailedAnalysis.solution}</p>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Market & Business Model */}
                    <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                        {detailedAnalysis.target_market && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className='text-blue-600'>Target Market</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className='text-gray-700'>
                                        {detailedAnalysis.target_market}
                                    </p>
                                </CardContent>
                            </Card>
                        )}

                        {detailedAnalysis.business_model && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className='text-purple-600 flex items-center gap-2'>
                                        <DollarSign className='h-4 w-4' />
                                        Business Model
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className='text-gray-700'>
                                        {detailedAnalysis.business_model}
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            )}

            {/* Competitive Analysis */}
            {competitorAnalysis && (
                <Card>
                    <CardHeader>
                        <CardTitle>Competitive Analysis</CardTitle>
                    </CardHeader>
                    <CardContent className='space-y-4'>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            <div>
                                <div className='text-sm text-gray-600'>Market Saturation</div>
                                <div className='font-semibold capitalize'>
                                    {competitorAnalysis.market_saturation}
                                </div>
                            </div>
                            <div>
                                <div className='text-sm text-gray-600'>Threat Level</div>
                                <div className='font-semibold capitalize'>
                                    {competitorAnalysis.threat_level}
                                </div>
                            </div>
                        </div>
                        {competitorAnalysis.competitive_advantage && (
                            <div>
                                <div className='text-sm text-gray-600 mb-1'>
                                    Competitive Advantage
                                </div>
                                <p className='text-gray-700'>
                                    {competitorAnalysis.competitive_advantage}
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
