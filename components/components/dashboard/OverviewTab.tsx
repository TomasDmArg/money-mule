'use client';

import { AlertTriangle, Award, Shield, Target } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ProjectResult } from '@/types/project';

interface OverviewTabProps {
    result: ProjectResult;
}

const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-yellow-600';
    if (score >= 4) return 'text-orange-600';
    return 'text-red-600';
};

const getScoreBgColor = (score: number) => {
    if (score >= 8) return 'bg-green-100';
    if (score >= 6) return 'bg-yellow-100';
    if (score >= 4) return 'bg-orange-100';
    return 'bg-red-100';
};

export function OverviewTab({ result }: OverviewTabProps) {
    return (
        <div className='space-y-6'>
            {/* Scores Section */}
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                {/* Main Viability Score */}
                <Card className='lg:col-span-2'>
                    <CardHeader>
                        <CardTitle className='flex items-center gap-2 justify-center'>
                            <Award className='h-5 w-5 text-yellow-600' />
                            Viability Score
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className='text-center'>
                            <div
                                className={`text-8xl font-bold mb-4 ${getScoreColor(
                                    result.viability_score || 0
                                )}`}
                            >
                                {result.viability_score || 0}
                                <span className='text-3xl text-gray-500'>/10</span>
                            </div>
                            <div
                                className={`inline-flex px-4 py-2 rounded-full text-lg font-medium ${getScoreBgColor(
                                    result.viability_score || 0
                                )} ${getScoreColor(result.viability_score || 0)}`}
                            >
                                {result.recommendation || 'N/A'}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Breakdown Scores */}
                <Card className='lg:col-span-2'>
                    <CardHeader>
                        <CardTitle className='flex items-center gap-2 justify-center'>
                            <Target className='h-5 w-5 text-blue-600' />
                            Score Breakdown
                        </CardTitle>
                    </CardHeader>
                    <CardContent className='space-y-4'>
                        {result.viability_breakdown &&
                            Object.entries(result.viability_breakdown).map(([key, value]) => (
                                <div key={key} className='space-y-2'>
                                    <div className='flex justify-between text-sm'>
                                        <span className='capitalize'>{key.replace('_', ' ')}</span>
                                        <span
                                            className={`font-semibold ${getScoreColor(value || 0)}`}
                                        >
                                            {value}/10
                                        </span>
                                    </div>
                                    <Progress value={(value || 0) * 10} className='h-2' />
                                </div>
                            ))}
                    </CardContent>
                </Card>
            </div>

            {/* Project Summary */}
            {result.summary && (
                <Card>
                    <CardHeader>
                        <CardTitle>Executive Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className='text-gray-700 leading-relaxed'>{result.summary}</p>
                    </CardContent>
                </Card>
            )}

            {/* Strengths and Risks */}
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                {/* Strengths */}
                {result.strengths && result.strengths.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className='flex items-center gap-2 text-green-600'>
                                <Shield className='h-5 w-5' />
                                Strengths
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className='space-y-2'>
                                {result.strengths.map(strength => (
                                    <li key={strength} className='flex items-start gap-2'>
                                        <span className='text-green-500 mt-1'>✓</span>
                                        <span className='text-sm text-gray-700'>{strength}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                )}

                {/* Risk Factors */}
                {result.risk_factors && result.risk_factors.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className='flex items-center gap-2 text-red-600'>
                                <AlertTriangle className='h-5 w-5' />
                                Risk Factors
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className='space-y-2'>
                                {result.risk_factors.map(risk => (
                                    <li key={risk} className='flex items-start gap-2'>
                                        <span className='text-red-500 mt-1'>⚠</span>
                                        <span className='text-sm text-gray-700'>{risk}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
