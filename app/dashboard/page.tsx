'use client';

import { useEffect, useState } from 'react';

import { ProjectGrid } from '@/components/organisms/dashboard/ProjectGrid';
import { ProjectModal } from '@/components/organisms/dashboard/ProjectModal';
import { ProjectUploadForm } from '@/components/organisms/dashboard/ProjectUploadForm';
import { DashboardNav } from '@/components/organisms/navigation/DashboardNav';
import { ProjectAnalysis } from '@/types/project';

// Configure API URL from environment variables
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://backend.venturepilot.xyz';

export default function DashboardPage() {
    const [projects, setProjects] = useState<ProjectAnalysis[]>([]);
    const [uploading, setUploading] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [selectedProject, setSelectedProject] = useState<ProjectAnalysis | null>(null);
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        setMounted(true);
        loadProjectsFromStorage();
    }, []);

    const loadProjectsFromStorage = () => {
        if (typeof window === 'undefined') return;

        try {
            const stored = localStorage.getItem('project-analyses');
            if (stored) {
                const parsedProjects = JSON.parse(stored) as ProjectAnalysis[];
                setProjects(parsedProjects);
            }
        } catch (error) {
            console.error('Error loading projects from localStorage:', error);
        }
    };

    const saveProjectsToStorage = (updatedProjects: ProjectAnalysis[]) => {
        if (typeof window === 'undefined') return;

        try {
            localStorage.setItem('project-analyses', JSON.stringify(updatedProjects));
        } catch (error) {
            console.error('Error saving projects to localStorage:', error);
        }
    };

    const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);

    const handleUpload = async (projectName: string, file: File) => {
        setUploading(true);

        const newProject: ProjectAnalysis = {
            id: generateId(),
            projectName,
            fileName: file.name,
            status: 'pending',
            uploadedAt: new Date().toISOString(),
            progress: 0,
        };

        // Add project to state and localStorage immediately
        const updatedProjects = [newProject, ...projects];
        setProjects(updatedProjects);
        saveProjectsToStorage(updatedProjects);

        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('project_name', projectName);

            // Update to processing
            updateProjectStatus(newProject.id, 'processing', 25);

            const response = await fetch(`${API_URL}/api/v1/analysis/project/upload`, {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const result = (await response.json()) as ProjectAnalysis['result'];
                updateProjectStatus(newProject.id, 'completed', 100, result);
            } else {
                updateProjectStatus(newProject.id, 'failed', 0);
            }
        } catch (error) {
            console.error('Error uploading project:', error);
            updateProjectStatus(newProject.id, 'failed', 0);
        } finally {
            setUploading(false);
        }
    };

    const updateProjectStatus = (
        id: string,
        status: ProjectAnalysis['status'],
        progress: number,
        result?: ProjectAnalysis['result']
    ) => {
        setProjects(prevProjects => {
            const updatedProjects = prevProjects.map(project => {
                if (project.id === id) {
                    return {
                        ...project,
                        status,
                        progress,
                        result,
                    };
                }
                return project;
            });
            saveProjectsToStorage(updatedProjects);
            return updatedProjects;
        });
    };

    const handleProjectClick = (project: ProjectAnalysis) => {
        if (project.status === 'completed') {
            setSelectedProject(project);
            setModalOpen(true);
        }
    };

    // Prevent rendering until component mounts on client
    if (!mounted) {
        return (
            <div className='min-h-screen bg-gray-50'>
                <DashboardNav />
                <div className='flex items-center justify-center h-[calc(100vh-80px)]'>
                    <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-green-600' />
                </div>
            </div>
        );
    }

    return (
        <div className='min-h-screen bg-gray-50'>
            <DashboardNav />
            <div className='container mx-auto px-4 py-8'>
                {/* Header */}
                <div className='mb-8'>
                    <h1 className='text-3xl font-bold text-gray-900 mb-2'>Project Analysis</h1>
                    <p className='text-gray-600'>
                        Upload your deck and get a detailed project analysis
                    </p>
                </div>

                {/* Upload Form */}
                <ProjectUploadForm onUpload={handleUpload} uploading={uploading} />

                {/* Projects Grid */}
                <ProjectGrid projects={projects} onProjectClick={handleProjectClick} />

                {/* Project Detail Modal */}
                <ProjectModal
                    open={modalOpen}
                    onOpenChange={setModalOpen}
                    selectedProject={selectedProject}
                />
            </div>
        </div>
    );
}
