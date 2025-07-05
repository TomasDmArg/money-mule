'use client';

import { Github, Linkedin, Twitter, Users } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Founder } from '@/types/project';

interface TeamTabProps {
    founders?: Founder[];
}

const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-yellow-600';
    if (score >= 4) return 'text-orange-600';
    return 'text-red-600';
};

export function TeamTab({ founders }: TeamTabProps) {
    if (!founders || founders.length === 0) {
        return (
            <div className='text-center py-8'>
                <Users className='h-12 w-12 text-gray-400 mx-auto mb-4' />
                <p className='text-gray-500'>No team information available for this project.</p>
            </div>
        );
    }

    return (
        <div className='space-y-4'>
            <h3 className='text-xl font-semibold flex items-center gap-2'>
                <Users className='h-5 w-5 text-blue-600' />
                Founding Team
            </h3>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
                {founders.map((founder, index) => (
                    <Card key={founder.name || `founder-${index}`}>
                        <CardHeader>
                            <div className='flex items-start justify-between'>
                                <div>
                                    <CardTitle className='text-lg'>{founder.name}</CardTitle>
                                    <CardDescription>{founder.role}</CardDescription>
                                </div>
                                <div className='text-right'>
                                    <div
                                        className={`text-xl font-bold ${getScoreColor(founder.score || 0)}`}
                                    >
                                        {founder.score || 0}/10
                                    </div>
                                    <div className='text-xs text-gray-500'>Score</div>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className='space-y-4'>
                            {/* Bio */}
                            {founder.deck_bio && (
                                <p className='text-sm text-gray-700'>{founder.deck_bio}</p>
                            )}

                            {/* Technical and Business Scores */}
                            <div className='grid grid-cols-2 gap-4'>
                                <div>
                                    <div className='text-sm text-gray-600'>Technical</div>
                                    <div
                                        className={`text-lg font-semibold ${getScoreColor(founder.technical_score || 0)}`}
                                    >
                                        {founder.technical_score || 0}/10
                                    </div>
                                </div>
                                <div>
                                    <div className='text-sm text-gray-600'>Business</div>
                                    <div
                                        className={`text-lg font-semibold ${getScoreColor(founder.business_score || 0)}`}
                                    >
                                        {founder.business_score || 0}/10
                                    </div>
                                </div>
                            </div>

                            {/* Social Links */}
                            <div className='flex gap-2 flex-wrap'>
                                <Button
                                    variant='outline'
                                    size='sm'
                                    className='flex items-center gap-1'
                                    disabled={!founder.linkedin}
                                >
                                    <Linkedin className='h-3 w-3' />
                                    LinkedIn
                                </Button>
                                <Button
                                    variant='outline'
                                    size='sm'
                                    className='flex items-center gap-1'
                                    disabled={!founder.twitter}
                                >
                                    <Twitter className='h-3 w-3' />
                                    Twitter
                                </Button>
                                <Button
                                    variant='outline'
                                    size='sm'
                                    className='flex items-center gap-1'
                                    disabled={!founder.gitroll_user_id}
                                >
                                    <Github className='h-3 w-3' />
                                    GitRoll
                                    {founder.gitroll_score && (
                                        <span className='text-xs'>({founder.gitroll_score})</span>
                                    )}
                                </Button>
                            </div>

                            {/* Contribution */}
                            {founder.contribution && (
                                <div className='text-xs text-gray-600 bg-gray-50 p-2 rounded'>
                                    {founder.contribution}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
