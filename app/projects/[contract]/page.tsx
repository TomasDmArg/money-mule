import { Metadata } from 'next';

import { ProjectDetailClient } from '../../../components/components/project/ProjectDetailClient';
import { Database } from '../../../types/database';

interface ProjectPageProps {
    params: { contract: string };
}

type Round = Database['public']['Tables']['rounds']['Row'];

interface ApiResponse {
    round: Round;
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
    // Fetch project data for metadata
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/rounds/${params.contract}`
        );

        if (response.ok) {
            const data = (await response.json()) as ApiResponse;
            const project = data.round;

            return {
                title: `${project.title} | MoneyMule`,
                description: project.description || 'Milestone-based funding project on MoneyMule',
                openGraph: {
                    title: project.title,
                    description: project.description,
                    images: project.image_url ? [{ url: project.image_url }] : [],
                },
            };
        }
    } catch (error) {
        console.error('Error generating metadata:', error);
    }

    return {
        title: 'Project | MoneyMule',
        description: 'View project details on MoneyMule platform',
    };
}

export default function ProjectPage({ params }: ProjectPageProps) {
    return <ProjectDetailClient contractAddress={params.contract} />;
}
