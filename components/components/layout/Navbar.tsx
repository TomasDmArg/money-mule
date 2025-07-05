'use client';

import { Droplets, Target } from 'lucide-react';
import Link from 'next/link';

export const Navbar = () => (
    <nav className='border-b bg-white'>
        <div className='container mx-auto px-4'>
            <div className='flex items-center justify-between h-16'>
                {/* Logo */}
                <Link href='/' className='flex items-center gap-2'>
                    <Target className='w-8 h-8 text-blue-600' />
                    <span className='text-xl font-bold text-gray-900'>MoneyMule</span>
                </Link>

                {/* Navigation Links */}
                <div className='hidden md:flex items-center gap-6'>
                    <Link
                        href='/projects'
                        className='text-gray-600 hover:text-gray-900 transition-colors'
                    >
                        Projects
                    </Link>
                    <Link
                        href='/faucet'
                        className='text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-2'
                    >
                        <Droplets className='w-4 h-4' />
                        Faucet
                    </Link>
                </div>

                {/* Wallet Connect */}
            </div>
        </div>
    </nav>
);
