'use client';

import { TrendingUp } from 'lucide-react';

import { ProjectAnalysis } from '@/types/project';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { AnalysisTab } from './AnalysisTab';
import { FollowupTab } from './FollowupTab';
import { OverviewTab } from './OverviewTab';
import { TeamTab } from './TeamTab';

interface ProjectModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    selectedProject: ProjectAnalysis | null;
}

export function ProjectModal({ open, onOpenChange, selectedProject }: ProjectModalProps) {
    if (!selectedProject || !selectedProject.result) {
        return null;
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className='max-w-6xl max-h-[90vh] overflow-y-auto'>
                <DialogHeader>
                    <DialogTitle className='flex items-center gap-2'>
                        <TrendingUp className='h-5 w-5' />
                        {selectedProject.result.project_name || selectedProject.projectName}
                    </DialogTitle>
                </DialogHeader>

                <Tabs defaultValue='overview' className='w-full'>
                    <TabsList className='grid w-full grid-cols-4'>
                        <TabsTrigger value='overview'>Overview</TabsTrigger>
                        <TabsTrigger value='team'>Team</TabsTrigger>
                        <TabsTrigger value='analysis'>Analysis</TabsTrigger>
                        <TabsTrigger value='followup'>Follow Up</TabsTrigger>
                    </TabsList>

                    <TabsContent value='overview'>
                        <OverviewTab result={selectedProject.result} />
                    </TabsContent>

                    <TabsContent value='team'>
                        <TeamTab founders={selectedProject.result.founders} />
                    </TabsContent>

                    <TabsContent value='analysis'>
                        <AnalysisTab
                            detailedAnalysis={selectedProject.result.detailed_analysis}
                            competitorAnalysis={selectedProject.result.competitor_analysis}
                        />
                    </TabsContent>

                    <TabsContent value='followup'>
                        <FollowupTab
                            followupQuestions={selectedProject.result.followup_questions}
                        />
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}
