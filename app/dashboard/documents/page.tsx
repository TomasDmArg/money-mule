'use client';

import { motion } from 'framer-motion';
import {
    AlertTriangle,
    CheckCircle,
    Clock,
    FileText,
    Info,
    Shield,
    Upload,
    XCircle,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { DashboardNav } from '@/components/components/navigation/DashboardNav';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';

// Constants
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://backend.moneymule.xyz';
const STORAGE_KEY = 'document-analyses';
const ACCEPTED_FILE_TYPES = '.pdf';
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

// Types
interface RiskSummary {
    critical?: string[];
    medium?: string[];
    low?: string[];
}

interface DocumentResult {
    document_type?: string;
    score?: number;
    risk_summary?: RiskSummary;
}

interface DocumentAnalysis {
    id: string;
    fileName: string;
    documentType?: string;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    uploadedAt: string;
    progress: number;
    result?: DocumentResult;
}

interface DocumentTypeInfo {
    name: string;
    icon: React.ComponentType<{ className?: string }>;
}

// Document types configuration
const SUPPORTED_DOCUMENT_TYPES: DocumentTypeInfo[] = [
    { name: 'SAFE', icon: FileText },
    { name: 'SAFT', icon: FileText },
    { name: 'Term Sheet', icon: FileText },
    { name: 'Cap Table', icon: FileText },
    { name: 'Convertible Note', icon: FileText },
    { name: 'Agreement', icon: FileText },
    { name: 'Contract', icon: FileText },
    { name: 'Others', icon: FileText },
];

// Risk level configuration
const RISK_LEVELS = {
    critical: { color: 'text-red-600', icon: AlertTriangle, bgColor: 'bg-red-50' },
    medium: { color: 'text-yellow-600', icon: Shield, bgColor: 'bg-yellow-50' },
    low: { color: 'text-green-600', icon: Info, bgColor: 'bg-green-50' },
} as const;

// Utility functions
const getStatusColor = (status: DocumentAnalysis['status']): string => {
    const statusColors = {
        completed: 'bg-green-100 text-green-800',
        processing: 'bg-blue-100 text-blue-800',
        pending: 'bg-yellow-100 text-yellow-800',
        failed: 'bg-red-100 text-red-800',
    } as const;

    return statusColors[status] || 'bg-gray-100 text-gray-800';
};

const getStatusIcon = (status: DocumentAnalysis['status']) => {
    const statusIcons = {
        completed: CheckCircle,
        processing: Clock,
        pending: Clock,
        failed: XCircle,
    } as const;

    const IconComponent = statusIcons[status] || FileText;
    return <IconComponent className='h-4 w-4' />;
};

const getScoreColor = (score: number): string => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
};

const detectDocumentType = (fileName: string): string => {
    const name = fileName.toLowerCase();

    if (name.includes('safe')) return 'SAFE';
    if (name.includes('saft')) return 'SAFT';
    if (name.includes('term sheet') || name.includes('termsheet')) return 'Term Sheet';
    if (name.includes('cap table') || name.includes('captable')) return 'Cap Table';
    if (name.includes('convertible')) return 'Convertible Note';
    if (name.includes('agreement')) return 'Agreement';
    if (name.includes('contract')) return 'Contract';

    return 'Document';
};

const generateDocumentId = (): string =>
    `${Date.now().toString(36)}-${Math.random().toString(36).substr(2)}`;

const validateFile = (file: File): { isValid: boolean; error?: string } => {
    if (!file.type.includes('pdf')) {
        return { isValid: false, error: 'Please select a PDF file' };
    }

    if (file.size > MAX_FILE_SIZE) {
        return { isValid: false, error: 'File size must be less than 10MB' };
    }

    return { isValid: true };
};

// Custom hooks
const useDocumentStorage = () => {
    const loadDocuments = useCallback((): DocumentAnalysis[] => {
        if (typeof window === 'undefined') return [];

        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            return stored ? (JSON.parse(stored) as DocumentAnalysis[]) : [];
        } catch (error) {
            console.error('Error loading documents from localStorage:', error);
            return [];
        }
    }, []);

    const saveDocuments = useCallback((documents: DocumentAnalysis[]) => {
        if (typeof window === 'undefined') return;

        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(documents));
        } catch (error) {
            console.error('Error saving documents to localStorage:', error);
        }
    }, []);

    return { loadDocuments, saveDocuments };
};

// Component: Document Type Card
const DocumentTypeCard = ({ type }: { type: DocumentTypeInfo }) => {
    const IconComponent = type.icon;
    return (
        <div className='flex items-center gap-2'>
            <IconComponent className='h-4 w-4 text-blue-600' />
            <span>{type.name}</span>
        </div>
    );
};

// Component: Document Card
const DocumentCard = ({
    document,
    onClick,
}: {
    document: DocumentAnalysis;
    onClick: (document: DocumentAnalysis) => void;
}) => {
    const isClickable = document.status === 'completed';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`border rounded-lg p-4 transition-all ${isClickable ? 'hover:shadow-md cursor-pointer hover:bg-gray-50' : 'bg-gray-50'
                }`}
            onClick={() => onClick(document)}
        >
            <div className='flex items-start justify-between mb-3'>
                <div className='flex-1 min-w-0'>
                    <h3 className='font-semibold text-gray-900 text-sm truncate'>
                        {document.fileName}
                    </h3>
                    <p className='text-xs text-blue-600 font-medium mt-1'>
                        {document.result?.document_type || document.documentType}
                    </p>
                </div>
                <Badge className={`${getStatusColor(document.status)} text-xs`}>
                    {getStatusIcon(document.status)}
                    <span className='ml-1 capitalize'>{document.status}</span>
                </Badge>
            </div>

            {document.status === 'completed' && document.result?.score && (
                <div className='mb-3'>
                    <div className='flex items-center justify-between text-sm'>
                        <span className='text-gray-600'>Score:</span>
                        <span className={`font-bold ${getScoreColor(document.result.score)}`}>
                            {document.result.score}/100
                        </span>
                    </div>
                </div>
            )}

            <div className='space-y-2'>
                <div className='flex items-center justify-between text-xs'>
                    <span className='text-gray-600'>
                        {new Date(document.uploadedAt).toLocaleDateString()}
                    </span>
                    <span className='text-gray-900'>{document.progress}%</span>
                </div>
                <Progress value={document.progress} className='h-1' />
            </div>

            {isClickable && <div className='mt-3 text-xs text-gray-500'>Click to view details</div>}
        </motion.div>
    );
};

// Component: Risk Summary Section
const RiskSummarySection = ({ riskSummary }: { riskSummary?: RiskSummary }) => {
    if (!riskSummary) return null;

    const renderRiskList = (risks: string[], level: keyof typeof RISK_LEVELS) => {
        if (!risks || risks.length === 0) return null;

        const { color, icon: IconComponent, bgColor } = RISK_LEVELS[level];
        const levelNames = {
            critical: 'Critical',
            medium: 'Medium',
            low: 'Low',
        };

        return (
            <div className={`space-y-2 p-3 rounded-lg ${bgColor}`}>
                <h4 className={`flex items-center gap-2 font-medium ${color}`}>
                    <IconComponent className='h-4 w-4' />
                    {levelNames[level]} ({risks.length})
                </h4>
                <ul className='space-y-1 text-sm'>
                    {risks.map(risk => (
                        <li key={`${level}-${risk}`} className='flex items-start gap-2'>
                            <span className={`mt-1 ${color.replace('text-', 'text-')}`}>•</span>
                            <span className='text-gray-700'>{risk}</span>
                        </li>
                    ))}
                </ul>
            </div>
        );
    };

    return (
        <div className='space-y-4'>
            <h3 className='font-semibold text-gray-900'>Risk Summary</h3>
            <div className='space-y-3'>
                {riskSummary.critical && renderRiskList(riskSummary.critical, 'critical')}
                {riskSummary.medium && renderRiskList(riskSummary.medium, 'medium')}
                {riskSummary.low && renderRiskList(riskSummary.low, 'low')}
            </div>
        </div>
    );
};

// Main component
export default function DocumentsPage() {
    const [documents, setDocuments] = useState<DocumentAnalysis[]>([]);
    const [uploading, setUploading] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [mounted, setMounted] = useState(false);
    const [selectedDocument, setSelectedDocument] = useState<DocumentAnalysis | null>(null);
    const [modalOpen, setModalOpen] = useState(false);

    const { loadDocuments, saveDocuments } = useDocumentStorage();

    // Load documents on mount
    useEffect(() => {
        setMounted(true);
        setDocuments(loadDocuments());
    }, [loadDocuments]);

    // Update document status
    const updateDocumentStatus = useCallback(
        (
            id: string,
            status: DocumentAnalysis['status'],
            progress: number,
            result?: DocumentResult
        ) => {
            setDocuments(prevDocuments => {
                const updatedDocuments = prevDocuments.map(document => {
                    if (document.id === id) {
                        return { ...document, status, progress, result };
                    }
                    return document;
                });
                saveDocuments(updatedDocuments);
                return updatedDocuments;
            });
        },
        [saveDocuments]
    );

    // Handle file selection
    const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const validation = validateFile(file);
            if (!validation.isValid) {
                console.error(`Invalid file: ${validation.error}`);
                return;
            }
            setSelectedFile(file);
        }
    }, []);

    // Handle file upload
    const handleUpload = useCallback(async () => {
        if (!selectedFile) {
            console.error('Please select a file to upload');
            return;
        }

        setUploading(true);

        const newDocument: DocumentAnalysis = {
            id: generateDocumentId(),
            fileName: selectedFile.name,
            documentType: detectDocumentType(selectedFile.name),
            status: 'pending',
            uploadedAt: new Date().toISOString(),
            progress: 0,
        };

        // Add document to state and storage immediately
        const updatedDocuments = [newDocument, ...documents];
        setDocuments(updatedDocuments);
        saveDocuments(updatedDocuments);

        // Clear form
        setSelectedFile(null);
        const fileInput = document.getElementById('file-input') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
        setUploading(false);

        try {
            const formData = new FormData();
            formData.append('file', selectedFile);

            // Update to processing
            updateDocumentStatus(newDocument.id, 'processing', 25);

            const response = await fetch(`${API_URL}/api/v1/analysis/document/analyze`, {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const result = (await response.json()) as DocumentResult;
                updateDocumentStatus(newDocument.id, 'completed', 100, result);
            } else {
                throw new Error('Analysis failed');
            }
        } catch (error) {
            console.error('Error uploading document:', error);
            updateDocumentStatus(newDocument.id, 'failed', 0);
            console.error('There was an error analyzing your document. Please try again.');
        }
    }, [selectedFile, documents, saveDocuments, updateDocumentStatus]);

    // Handle upload click
    const handleUploadClick = useCallback(() => {
        handleUpload().catch(console.error);
    }, [handleUpload]);

    // Handle document click
    const handleDocumentClick = useCallback((document: DocumentAnalysis) => {
        if (document.status === 'completed') {
            setSelectedDocument(document);
            setModalOpen(true);
        }
    }, []);

    // Memoized values
    const sortedDocuments = useMemo(
        () =>
            [...documents].sort(
                (a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
            ),
        [documents]
    );

    // Show loading state until mounted
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
                    <h1 className='text-3xl font-bold text-gray-900 mb-2'>Document Analysis</h1>
                    <p className='text-gray-600'>
                        Analyze legal documents like SAFE, SAFT, Term Sheets, Cap Tables and more
                    </p>
                </div>

                {/* Supported Document Types */}
                <Card className='mb-8 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200'>
                    <CardHeader>
                        <CardTitle className='text-lg'>Supported Document Types</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className='grid grid-cols-2 md:grid-cols-4 gap-4 text-sm'>
                            {SUPPORTED_DOCUMENT_TYPES.map(type => (
                                <DocumentTypeCard key={type.name} type={type} />
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Upload Form */}
                <Card className='mb-8 bg-gradient-to-r from-green-50 to-blue-50 border-green-200'>
                    <CardHeader>
                        <CardTitle className='flex items-center gap-2'>
                            <Upload className='h-5 w-5 text-green-600' />
                            Upload Document
                        </CardTitle>
                        <CardDescription>Select a PDF file to analyze</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className='space-y-4'>
                            <div>
                                <Label htmlFor='file-input'>Document (PDF)</Label>
                                <Input
                                    id='file-input'
                                    type='file'
                                    accept={ACCEPTED_FILE_TYPES}
                                    onChange={handleFileChange}
                                    disabled={uploading}
                                />
                            </div>

                            {selectedFile && (
                                <div className='space-y-2'>
                                    <div className='text-sm text-gray-600'>
                                        Selected file: {selectedFile.name}
                                    </div>
                                    <div className='text-sm text-blue-600 font-medium'>
                                        Detected type: {detectDocumentType(selectedFile.name)}
                                    </div>
                                </div>
                            )}

                            <Button
                                onClick={handleUploadClick}
                                disabled={uploading || !selectedFile}
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

                {/* Documents Grid */}
                <Card>
                    <CardHeader>
                        <CardTitle>Analyzed Documents</CardTitle>
                        <CardDescription>History of legal document analyses</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {sortedDocuments.length === 0 ? (
                            <div className='text-center py-8'>
                                <FileText className='h-12 w-12 text-gray-400 mx-auto mb-4' />
                                <p className='text-gray-500'>
                                    No documents analyzed yet. Upload your first document!
                                </p>
                            </div>
                        ) : (
                            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                                {sortedDocuments.map(document => (
                                    <DocumentCard
                                        key={document.id}
                                        document={document}
                                        onClick={handleDocumentClick}
                                    />
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Document Detail Modal */}
                <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                    <DialogContent className='max-w-4xl max-h-[80vh] overflow-y-auto'>
                        <DialogHeader>
                            <DialogTitle className='flex items-center gap-2'>
                                <FileText className='h-5 w-5' />
                                {selectedDocument?.fileName}
                            </DialogTitle>
                        </DialogHeader>

                        {selectedDocument?.result && (
                            <div className='space-y-6'>
                                {/* Header Info */}
                                <div className='grid grid-cols-2 gap-4'>
                                    <div>
                                        <h3 className='font-semibold text-gray-900'>
                                            Document Type
                                        </h3>
                                        <p className='text-blue-600 font-medium'>
                                            {selectedDocument.result.document_type ||
                                                selectedDocument.documentType}
                                        </p>
                                    </div>
                                    <div>
                                        <h3 className='font-semibold text-gray-900'>Risk Score</h3>
                                        <p
                                            className={`text-xl font-bold ${getScoreColor(selectedDocument.result.score || 0)}`}
                                        >
                                            {selectedDocument.result.score || 0}/100
                                        </p>
                                    </div>
                                </div>

                                {/* Risk Summary */}
                                <RiskSummarySection
                                    riskSummary={selectedDocument.result.risk_summary}
                                />
                            </div>
                        )}
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}
