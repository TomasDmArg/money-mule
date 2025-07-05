import { Metadata } from 'next';

import { ProjectStats } from '../../components/components/projects/ProjectStats';
import { ProjectsList } from '../../components/components/projects/ProjectsList';

export const metadata: Metadata = {
    title: 'Projects | MoneyMule',
    description: 'Discover and support innovative projects through milestone-based funding',
};

export default function ProjectsPage() {
    return (
        <div className='min-h-screen bg-gray-50'>
            <div className='container mx-auto px-4 py-8'>
                {/* Header */}
                <div className='text-center mb-8'>
                    <h1 className='text-4xl font-bold text-gray-900 mb-4'>Discover Projects</h1>
                    <p className='text-xl text-gray-600 max-w-2xl mx-auto mb-8'>
                        Support innovative projects through our milestone-based funding platform.
                        Every project is backed by community trust and transparent progress
                        tracking.
                    </p>
                </div>

                {/* Stats */}
                <ProjectStats className='mb-8' />

                {/* Projects List */}
                <ProjectsList />
            </div>
        </div>
    );
}
