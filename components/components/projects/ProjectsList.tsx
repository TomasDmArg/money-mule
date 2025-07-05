'use client';

import { Calendar, DollarSign, ExternalLink, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

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

export const ProjectsList: React.FC = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await fetch('/api/projects');
                if (response.ok) {
                    const data = await response.json();
                    setProjects(data.projects || []);
                } else {
                    setError('Failed to fetch projects');
                }
            } catch (error) {
                setError('Failed to fetch projects');
            } finally {
                setIsLoading(false);
            }
        };

        fetchProjects();
    }, []);

    const handleProjectClick = (contractAddress: string) => {
        router.push(`/projects/${contractAddress}`);
    };

    if (isLoading) {
        return (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                {[...Array(6)].map((_, i) => (
                    <div key={i} className='bg-white rounded-lg shadow-md p-6'>
                        <div className='animate-pulse'>
                            <div className='h-48 bg-gray-200 rounded mb-4' />
                            <div className='h-4 bg-gray-200 rounded w-3/4 mb-2' />
                            <div className='h-4 bg-gray-200 rounded w-1/2 mb-4' />
                            <div className='h-8 bg-gray-200 rounded w-full' />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className='text-center py-8'>
                <p className='text-red-600'>{error}</p>
            </div>
        );
    }

    if (projects.length === 0) {
        return (
            <div className='text-center py-8'>
                <p className='text-gray-600'>No projects found.</p>
            </div>
        );
    }

    return (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {projects.map(project => (
                <div
                    key={project.id}
                    className='bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer'
                    onClick={() => handleProjectClick(project.contract_address)}
                >
                    <div className='p-6'>
                        {project.image_url && (
                            <img
                                src={project.image_url}
                                alt={project.title}
                                className='w-full h-48 object-cover rounded-lg mb-4'
                            />
                        )}
                        <div className='flex items-start justify-between mb-2'>
                            <h3 className='text-xl font-semibold text-gray-900 line-clamp-1'>
                                {project.title}
                            </h3>
                            <span className='text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full'>
                                {project.category}
                            </span>
                        </div>
                        <p className='text-gray-600 mb-4 line-clamp-2'>{project.description}</p>

                        <div className='space-y-2 mb-4'>
                            <div className='flex items-center justify-between text-sm'>
                                <div className='flex items-center'>
                                    <DollarSign className='w-4 h-4 mr-1 text-green-600' />
                                    <span className='text-gray-600'>Target:</span>
                                </div>
                                <span className='font-medium'>${project.target_amount}</span>
                            </div>
                            <div className='flex items-center justify-between text-sm'>
                                <div className='flex items-center'>
                                    <Users className='w-4 h-4 mr-1 text-blue-600' />
                                    <span className='text-gray-600'>Raised:</span>
                                </div>
                                <span className='font-medium'>${project.current_amount}</span>
                            </div>
                            <div className='flex items-center justify-between text-sm'>
                                <div className='flex items-center'>
                                    <Calendar className='w-4 h-4 mr-1 text-purple-600' />
                                    <span className='text-gray-600'>Phase:</span>
                                </div>
                                <span className='font-medium capitalize'>{project.phase}</span>
                            </div>
                        </div>

                        <div className='flex items-center justify-between'>
                            <span className='text-xs text-gray-500'>
                                {new Date(project.created_at).toLocaleDateString()}
                            </span>
                            <ExternalLink className='w-4 h-4 text-gray-400' />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};
