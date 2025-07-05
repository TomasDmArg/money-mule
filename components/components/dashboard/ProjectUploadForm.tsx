'use client';

import { Upload } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ProjectUploadFormProps {
    onUpload: (projectName: string, file: File) => Promise<void>;
    uploading: boolean;
}

export function ProjectUploadForm({ onUpload, uploading }: ProjectUploadFormProps) {
    const [projectName, setProjectName] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile || !projectName.trim()) {
            console.error('Please select a file and enter a project name');
            return;
        }

        await onUpload(projectName.trim(), selectedFile);

        // Clear form
        setProjectName('');
        setSelectedFile(null);
        const fileInput = document.getElementById('file-input') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
    };

    const handleUploadClick = () => {
        handleUpload().catch(console.error);
    };

    return (
        <Card className='mb-8 bg-gradient-to-r from-green-50 to-blue-50 border-green-200'>
            <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                    <Upload className='h-5 w-5 text-green-600' />
                    Upload Project
                </CardTitle>
                <CardDescription>Select a PDF file and provide the project name</CardDescription>
            </CardHeader>
            <CardContent>
                <div className='space-y-4'>
                    <div>
                        <Label htmlFor='project-name'>Project Name</Label>
                        <Input
                            id='project-name'
                            type='text'
                            placeholder='e.g., My SaaS Startup'
                            value={projectName}
                            onChange={e => setProjectName(e.target.value)}
                            disabled={uploading}
                        />
                    </div>

                    <div>
                        <Label htmlFor='file-input'>Deck File (PDF)</Label>
                        <Input
                            id='file-input'
                            type='file'
                            accept='.pdf'
                            onChange={handleFileChange}
                            disabled={uploading}
                        />
                    </div>

                    {selectedFile && (
                        <div className='text-sm text-gray-600'>
                            Selected file: {selectedFile.name}
                        </div>
                    )}

                    <Button
                        onClick={handleUploadClick}
                        disabled={uploading || !selectedFile || !projectName.trim()}
                        className='bg-green-600 hover:bg-green-700 text-white'
                        size='lg'
                    >
                        {uploading ? (
                            <>
                                <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2' />
                                Uploading...
                            </>
                        ) : (
                            <>
                                <Upload className='h-4 w-4 mr-2' />
                                Upload and Analyze
                            </>
                        )}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
