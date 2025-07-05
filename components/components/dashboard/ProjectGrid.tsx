'use client';

import { motion } from 'framer-motion';
import { CheckCircle, Clock, FileText, XCircle } from 'lucide-react';

import { ProjectAnalysis } from '@/types/project';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface ProjectGridProps {
    projects: ProjectAnalysis[];
    onProjectClick: (project: ProjectAnalysis) => void;
}

const getStatusColor = (status: ProjectAnalysis['status']) => {
    switch (status) {
        case 'completed':
            return 'bg-green-100 text-green-800';
        case 'processing':
            return 'bg-blue-100 text-blue-800';
        case 'pending':
            return 'bg-yellow-100 text-yellow-800';
        case 'failed':
            return 'bg-red-100 text-red-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
};

const getStatusIcon = (status: ProjectAnalysis['status']) => {
    switch (status) {
        case 'completed':
            return <CheckCircle className='h-4 w-4' />;
        case 'processing':
            return <Clock className='h-4 w-4' />;
        case 'pending':
            return <Clock className='h-4 w-4' />;
        case 'failed':
            return <XCircle className='h-4 w-4' />;
        default:
            return <FileText className='h-4 w-4' />;
    }
};

const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-yellow-600';
    if (score >= 4) return 'text-orange-600';
    return 'text-red-600';
};

export function ProjectGrid({ projects, onProjectClick }: ProjectGridProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Analyzed Projects</CardTitle>
                <CardDescription>History of completed analyses</CardDescription>
            </CardHeader>
            <CardContent>
                {projects.length === 0 ? (
                    <div className='text-center py-8'>
                        <FileText className='h-12 w-12 text-gray-400 mx-auto mb-4' />
                        <p className='text-gray-500'>
                            No projects analyzed yet. Upload your first deck!
                        </p>
                    </div>
                ) : (
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                        {projects.map(project => (
                            <motion.div
                                key={project.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                                className={`border rounded-lg p-4 transition-all ${project.status === 'completed'
                                        ? 'hover:shadow-md cursor-pointer hover:bg-gray-50'
                                        : 'bg-gray-50'
                                    }`}
                                onClick={() => onProjectClick(project)}
                            >
                                <div className='flex items-start justify-between mb-3'>
                                    <div className='flex-1 min-w-0'>
                                        <h3 className='font-semibold text-gray-900 text-sm truncate'>
                                            {project.projectName}
                                        </h3>
                                        <p className='text-xs text-gray-600 mt-1'>
                                            {project.fileName}
                                        </p>
                                    </div>
                                    <Badge className={`${getStatusColor(project.status)} text-xs`}>
                                        {getStatusIcon(project.status)}
                                        <span className='ml-1 capitalize'>{project.status}</span>
                                    </Badge>
                                </div>

                                {project.status === 'completed' &&
                                    project.result?.viability_score && (
                                        <div className='mb-3'>
                                            <div className='flex items-center justify-between text-sm'>
                                                <span className='text-gray-600'>Viability:</span>
                                                <span
                                                    className={`font-bold ${getScoreColor(
                                                        project.result.viability_score
                                                    )}`}
                                                >
                                                    {project.result.viability_score}/10
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                <div className='space-y-2'>
                                    <div className='flex items-center justify-between text-xs'>
                                        <span className='text-gray-600'>
                                            {new Date(project.uploadedAt).toLocaleDateString()}
                                        </span>
                                        <span className='text-gray-900'>{project.progress}%</span>
                                    </div>
                                    <Progress value={project.progress} className='h-1' />
                                </div>

                                {project.status === 'completed' && (
                                    <div className='mt-3 text-xs text-gray-500'>
                                        Click to view details
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
