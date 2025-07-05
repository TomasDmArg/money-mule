'use client';

import { BarChart3, FileText, Home, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Button } from '@/components/ui/button';

export function DashboardNav() {
    const pathname = usePathname();

    return (
        <nav className='bg-white border-b border-gray-200 px-4 py-3'>
            <div className='container mx-auto flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                    <BarChart3 className='h-6 w-6 text-green-600' />
                    <span className='font-semibold text-gray-900'>Money Mule</span>
                </div>

                <div className='flex items-center gap-4'>
                    <Link href='/dashboard'>
                        <Button
                            variant={pathname === '/dashboard' ? 'default' : 'outline'}
                            size='sm'
                            className='flex items-center gap-2'
                        >
                            <TrendingUp className='h-4 w-4' />
                            Proyectos
                        </Button>
                    </Link>

                    <Link href='/dashboard/documents'>
                        <Button
                            variant={pathname === '/dashboard/documents' ? 'default' : 'outline'}
                            size='sm'
                            className='flex items-center gap-2'
                        >
                            <FileText className='h-4 w-4' />
                            Documentos
                        </Button>
                    </Link>

                    <Link href='/'>
                        <Button variant='ghost' size='sm' className='flex items-center gap-2'>
                            <Home className='h-4 w-4' />
                            Inicio
                        </Button>
                    </Link>
                </div>
            </div>
        </nav>
    );
}
