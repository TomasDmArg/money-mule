'use client';

import { Copy, Target } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FollowupQuestions } from '@/types/project';

interface FollowupTabProps {
    followupQuestions?: FollowupQuestions;
}

const getPriorityColor = (priority: string) => {
    switch (priority) {
        case 'high':
            return 'bg-red-100 text-red-700';
        case 'medium':
            return 'bg-yellow-100 text-yellow-700';
        default:
            return 'bg-green-100 text-green-700';
    }
};

const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).catch(console.error);
};

export function FollowupTab({ followupQuestions }: FollowupTabProps) {
    if (
        !followupQuestions?.priority_questions ||
        followupQuestions.priority_questions.length === 0
    ) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className='flex items-center gap-2'>
                        <Target className='h-5 w-5 text-blue-600' />
                        Follow-up Questions
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className='text-center py-8'>
                        <p className='text-gray-500'>
                            No follow-up questions available for this analysis.
                        </p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                    <Target className='h-5 w-5 text-blue-600' />
                    Follow-up Questions
                </CardTitle>
                <CardDescription>Important questions to deepen the analysis</CardDescription>
            </CardHeader>
            <CardContent>
                <div className='space-y-4'>
                    {followupQuestions.priority_questions.map(item => (
                        <div
                            key={`question-${item.category}-${item.question.slice(0, 50)}`}
                            className='border rounded-lg p-4 bg-gray-50'
                        >
                            <div className='flex justify-between items-start gap-3 mb-3'>
                                <div className='flex items-center gap-2'>
                                    <span
                                        className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(
                                            item.priority
                                        )}`}
                                    >
                                        {item.priority}
                                    </span>
                                    <span className='px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium capitalize'>
                                        {item.category}
                                    </span>
                                </div>
                                <Button
                                    variant='outline'
                                    size='sm'
                                    onClick={() => copyToClipboard(item.question)}
                                    className='flex items-center gap-1 shrink-0'
                                >
                                    <Copy className='h-3 w-3' />
                                    Copy
                                </Button>
                            </div>
                            <p className='text-gray-700 mb-2 font-medium'>{item.question}</p>
                            <p className='text-gray-600 text-sm italic'>{item.rationale}</p>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
