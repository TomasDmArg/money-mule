'use client';

import { ArrowLeft, Calendar, DollarSign, ExternalLink, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';

interface ProjectDetailClientProps {
    contractAddress: string;
}

interface Project {
    id: number;
    contract_address: string;
    title: string;
    description: string;
    category: string;
    founder_address: string;
    target_amount: string;
    current_amount: string;
    phase: string;
    created_at: string;
    image_url: string | null;
    end_date: string | null;
}

interface Milestone {
    id: number;
    title: string;
    description: string;
    target_amount: string;
    status: string;
    created_at: string;
}

export const ProjectDetailClient: React.FC<ProjectDetailClientProps> = ({ contractAddress }) => {
    const [project, setProject] = useState<Project | null>(null);
    const [milestones, setMilestones] = useState<Milestone[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchProjectData = async () => {
            try {
                const [projectResponse, milestonesResponse] = await Promise.all([
                    fetch(`/api/rounds/${contractAddress}`),
                    fetch(`/api/rounds/${contractAddress}/milestones`),
                ]);

                if (projectResponse.ok) {
                    const projectData = await projectResponse.json();
                    setProject(projectData.round);
                }

                if (milestonesResponse.ok) {
                    const milestonesData = await milestonesResponse.json();
                    setMilestones(milestonesData.milestones || []);
                }
            } catch (error) {
                setError('Failed to load project data');
            } finally {
                setIsLoading(false);
            }
        };

        fetchProjectData();
    }, [contractAddress]);

    const handleBack = () => {
        router.push('/projects');
    };

    const handleInvest = () => {
        // Navigate to investment flow
        router.push(`/projects/${contractAddress}/invest`);
    };

    if (isLoading) {
        return (
            <div className='min-h-screen bg-gray-50'>
                <div className='container mx-auto px-4 py-8'>
                    <div className='animate-pulse'>
                        <div className='h-8 bg-gray-200 rounded w-1/4 mb-6' />
                        <div className='h-64 bg-gray-200 rounded mb-6' />
                        <div className='h-4 bg-gray-200 rounded w-3/4 mb-4' />
                        <div className='h-4 bg-gray-200 rounded w-1/2' />
                    </div>
                </div>
            </div>
        );
    }

    if (error || !project) {
        return (
            <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
                <div className='text-center'>
                    <h1 className='text-2xl font-bold text-gray-900 mb-4'>Project Not Found</h1>
                    <p className='text-gray-600 mb-6'>
                        {error || 'The requested project could not be found.'}
                    </p>
                    <Button onClick={handleBack}>
                        <ArrowLeft className='w-4 h-4 mr-2' />
                        Back to Projects
                    </Button>
                </div>
            </div>
        );
    }

    const progressPercentage =
        project.target_amount !== '0'
            ? (parseFloat(project.current_amount) / parseFloat(project.target_amount)) * 100
            : 0;

    return (
        <div className='min-h-screen bg-gray-50'>
            <div className='container mx-auto px-4 py-8'>
                <Button variant='outline' onClick={handleBack} className='mb-6'>
                    <ArrowLeft className='w-4 h-4 mr-2' />
                    Back to Projects
                </Button>

                <div className='bg-white rounded-lg shadow-lg overflow-hidden'>
                    {project.image_url && (
                        <img
                            src={project.image_url}
                            alt={project.title}
                            className='w-full h-64 object-cover'
                        />
                    )}

                    <div className='p-8'>
                        <div className='flex items-start justify-between mb-6'>
                            <div>
                                <h1 className='text-3xl font-bold text-gray-900 mb-2'>
                                    {project.title}
                                </h1>
                                <span className='inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm'>
                                    {project.category}
                                </span>
                            </div>
                            <span
                                className={`px-3 py-1 rounded-full text-sm font-medium ${
                                    project.phase === 'active'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-gray-100 text-gray-800'
                                }`}
                            >
                                {project.phase}
                            </span>
                        </div>

                        <p className='text-gray-700 mb-8 text-lg leading-relaxed'>
                            {project.description}
                        </p>

                        <div className='grid md:grid-cols-2 gap-8 mb-8'>
                            <div>
                                <h3 className='text-lg font-semibold mb-4'>Funding Progress</h3>
                                <div className='space-y-4'>
                                    <div className='flex justify-between items-center'>
                                        <span className='text-gray-600'>Raised</span>
                                        <span className='font-bold text-xl'>
                                            ${project.current_amount}
                                        </span>
                                    </div>
                                    <div className='flex justify-between items-center'>
                                        <span className='text-gray-600'>Target</span>
                                        <span className='font-bold text-xl'>
                                            ${project.target_amount}
                                        </span>
                                    </div>
                                    <div className='w-full bg-gray-200 rounded-full h-3'>
                                        <div
                                            className='bg-blue-600 h-3 rounded-full transition-all duration-300'
                                            style={{
                                                width: `${Math.min(progressPercentage, 100)}%`,
                                            }}
                                        />
                                    </div>
                                    <div className='text-center text-sm text-gray-600'>
                                        {progressPercentage.toFixed(1)}% funded
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className='text-lg font-semibold mb-4'>Project Details</h3>
                                <div className='space-y-3'>
                                    <div className='flex items-center'>
                                        <Users className='w-5 h-5 mr-3 text-gray-400' />
                                        <span className='text-gray-600'>Founder:</span>
                                        <span className='ml-2 font-mono text-sm'>
                                            {project.founder_address.slice(0, 6)}...
                                            {project.founder_address.slice(-4)}
                                        </span>
                                    </div>
                                    <div className='flex items-center'>
                                        <Calendar className='w-5 h-5 mr-3 text-gray-400' />
                                        <span className='text-gray-600'>Created:</span>
                                        <span className='ml-2'>
                                            {new Date(project.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className='flex items-center'>
                                        <ExternalLink className='w-5 h-5 mr-3 text-gray-400' />
                                        <span className='text-gray-600'>Contract:</span>
                                        <span className='ml-2 font-mono text-sm'>
                                            {project.contract_address.slice(0, 6)}...
                                            {project.contract_address.slice(-4)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {milestones.length > 0 && (
                            <div className='mb-8'>
                                <h3 className='text-lg font-semibold mb-4'>Milestones</h3>
                                <div className='space-y-4'>
                                    {milestones.map((milestone, index) => (
                                        <div key={milestone.id} className='border rounded-lg p-4'>
                                            <div className='flex items-start justify-between'>
                                                <div>
                                                    <h4 className='font-medium'>
                                                        {milestone.title}
                                                    </h4>
                                                    <p className='text-gray-600 text-sm mt-1'>
                                                        {milestone.description}
                                                    </p>
                                                </div>
                                                <div className='text-right'>
                                                    <div className='text-sm font-medium'>
                                                        ${milestone.target_amount}
                                                    </div>
                                                    <span
                                                        className={`inline-block px-2 py-1 rounded-full text-xs ${
                                                            milestone.status === 'completed'
                                                                ? 'bg-green-100 text-green-800'
                                                                : milestone.status === 'active'
                                                                  ? 'bg-blue-100 text-blue-800'
                                                                  : 'bg-gray-100 text-gray-800'
                                                        }`}
                                                    >
                                                        {milestone.status}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className='flex gap-4'>
                            <Button onClick={handleInvest} size='lg' className='flex-1'>
                                <DollarSign className='w-4 h-4 mr-2' />
                                Invest in Project
                            </Button>
                            <Button variant='outline' size='lg'>
                                <ExternalLink className='w-4 h-4 mr-2' />
                                View on Explorer
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
