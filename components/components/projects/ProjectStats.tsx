'use client';

import { useEffect, useState } from 'react';

interface ProjectStatsProps {
    className?: string;
}

interface Stats {
    totalProjects: number;
    totalFunding: string;
    successfulProjects: number;
    activeInvestors: number;
}

export const ProjectStats: React.FC<ProjectStatsProps> = ({ className = '' }) => {
    const [stats, setStats] = useState<Stats>({
        totalProjects: 0,
        totalFunding: '0',
        successfulProjects: 0,
        activeInvestors: 0,
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await fetch('/api/projects/stats');
                if (response.ok) {
                    const data = await response.json();
                    setStats(data);
                }
            } catch (error) {
                console.error('Failed to fetch stats:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (isLoading) {
        return (
            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${className}`}>
                {[...Array(4)].map((_, i) => (
                    <div key={i} className='bg-white rounded-lg shadow-md p-6'>
                        <div className='animate-pulse'>
                            <div className='h-4 bg-gray-200 rounded w-3/4 mb-2' />
                            <div className='h-8 bg-gray-200 rounded w-1/2' />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${className}`}>
            <div className='bg-white rounded-lg shadow-md p-6'>
                <h3 className='text-sm font-medium text-gray-500 mb-2'>Total Projects</h3>
                <p className='text-3xl font-bold text-gray-900'>{stats.totalProjects}</p>
            </div>
            <div className='bg-white rounded-lg shadow-md p-6'>
                <h3 className='text-sm font-medium text-gray-500 mb-2'>Total Funding</h3>
                <p className='text-3xl font-bold text-gray-900'>${stats.totalFunding}</p>
            </div>
            <div className='bg-white rounded-lg shadow-md p-6'>
                <h3 className='text-sm font-medium text-gray-500 mb-2'>Successful Projects</h3>
                <p className='text-3xl font-bold text-gray-900'>{stats.successfulProjects}</p>
            </div>
            <div className='bg-white rounded-lg shadow-md p-6'>
                <h3 className='text-sm font-medium text-gray-500 mb-2'>Active Investors</h3>
                <p className='text-3xl font-bold text-gray-900'>{stats.activeInvestors}</p>
            </div>
        </div>
    );
};
