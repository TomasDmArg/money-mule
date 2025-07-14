import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, TrendingUp, Users } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

import { LogoNavbar } from './LogoNavbar';

const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
};

const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2,
        },
    },
};

export function HeroSection() {
    return (
        <section className='w-full relative overflow-hidden'>
            {/* Background gradient */}
            <div className='absolute inset-0 bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200' />

            {/* Hero content */}
            <LogoNavbar />
            <div className='relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20'>
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>
                    {/* Left side - Content */}
                    <motion.div
                        className='text-center lg:text-left space-y-8'
                        initial='hidden'
                        whileInView='visible'
                        viewport={{ once: true, amount: 0.3 }}
                        variants={staggerChildren}
                    >
                        <motion.div variants={fadeInUp} className='space-y-4'>
                            <h1 className='text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight'>
                                <span className='text-blue-600 block'>Navigate</span>
                                Smart Investments
                            </h1>
                            <p className='text-xl text-gray-600 max-w-2xl mx-auto lg:mx-0'>
                                Revolutionize your investment strategy with AI-powered analysis,
                                milestone-based funding, and automated due diligence. Save time,
                                reduce risk, and maximize returns.
                            </p>
                        </motion.div>

                        <motion.div
                            variants={fadeInUp}
                            className='flex items-center justify-center lg:justify-start space-x-4 sm:space-x-8'
                        >
                            <div className='text-center'>
                                <div className='text-2xl font-bold text-gray-900'>90%</div>
                                <div className='text-sm text-gray-600'>Faster Due Diligence</div>
                            </div>
                            <div className='text-center'>
                                <div className='text-2xl font-bold text-gray-900'>~3min</div>
                                <div className='text-sm text-gray-600'>To Analyze</div>
                            </div>
                            <div className='text-center'>
                                <div className='text-2xl font-bold text-gray-900'>2.5x</div>
                                <div className='text-sm text-gray-600'>Avg. Returns</div>
                            </div>
                        </motion.div>

                        <motion.div
                            variants={fadeInUp}
                            className='flex flex-col lg:flex-row gap-4 justify-center lg:justify-start w-full'
                        >
                            <Link href='/dashboard' className='w-full lg:w-auto'>
                                <Button
                                    size='lg'
                                    className='w-full lg:w-auto bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 text-lg font-semibold flex items-center justify-center gap-2'
                                >
                                    Start Free Trial
                                    <ArrowRight className='w-5 h-5' />
                                </Button>
                            </Link>
                            <Link href='/dashboard/projects' className='w-full lg:w-auto'>
                                <Button
                                    size='lg'
                                    variant='outline'
                                    className='w-full lg:w-auto border-blue-600 text-blue-700 hover:bg-blue-50 px-8 py-4 text-lg font-semibold'
                                >
                                    Browse Projects
                                </Button>
                            </Link>
                        </motion.div>

                        <motion.div
                            variants={fadeInUp}
                            className='flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-2 sm:space-y-0 sm:space-x-4 text-sm text-gray-600'
                        >
                            <div className='flex items-center space-x-2'>
                                <CheckCircle className='w-4 h-4 text-blue-600' />
                                <span>No credit card required</span>
                            </div>
                            <div className='flex items-center space-x-2'>
                                <CheckCircle className='w-4 h-4 text-blue-600' />
                                <span>14-day free trial</span>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Right side - Visual elements */}
                    <motion.div
                        className='relative'
                        initial='hidden'
                        whileInView='visible'
                        viewport={{ once: true, amount: 0.3 }}
                        variants={fadeInUp}
                    >
                        <div className='relative z-10 space-y-6'>
                            {/* Main feature card */}
                            <Card className='bg-white/80 backdrop-blur-sm shadow-xl border-blue-200'>
                                <CardContent className='p-6'>
                                    <div className='flex items-center justify-between mb-4'>
                                        <div className='flex items-center space-x-3'>
                                            <div className='w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center'>
                                                <TrendingUp className='w-5 h-5 text-white' />
                                            </div>
                                            <div>
                                                <div className='font-semibold text-gray-900'>
                                                    Smart Analytics
                                                </div>
                                                <div className='text-sm text-gray-600'>
                                                    AI-Powered Insights
                                                </div>
                                            </div>
                                        </div>
                                        <div className='text-right'>
                                            <div className='text-2xl font-bold text-blue-600'>
                                                +127%
                                            </div>
                                            <div className='text-sm text-gray-600'>
                                                ROI Improvement
                                            </div>
                                        </div>
                                    </div>
                                    <div className='w-full bg-gray-200 rounded-full h-2'>
                                        <div
                                            className='bg-gradient-to-r from-blue-600 to-blue-700 h-2 rounded-full'
                                            style={{ width: '85%' }}
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Secondary cards */}
                            <div className='grid grid-cols-2 gap-4'>
                                <Card className='bg-white/60 backdrop-blur-sm shadow-lg border-blue-200'>
                                    <CardContent className='p-4'>
                                        <div className='flex items-center space-x-2 mb-2'>
                                            <Users className='w-5 h-5 text-blue-600' />
                                            <span className='font-semibold text-gray-900'>
                                                Active Projects
                                            </span>
                                        </div>
                                        <div className='text-2xl font-bold text-gray-900'>
                                            1,247
                                        </div>
                                        <div className='text-sm text-blue-600'>+23% this month</div>
                                    </CardContent>
                                </Card>
                                <Card className='bg-white/60 backdrop-blur-sm shadow-lg border-blue-200'>
                                    <CardContent className='p-4'>
                                        <div className='flex items-center space-x-2 mb-2'>
                                            <CheckCircle className='w-5 h-5 text-blue-600' />
                                            <span className='font-semibold text-gray-900'>
                                                Success Rate
                                            </span>
                                        </div>
                                        <div className='text-2xl font-bold text-gray-900'>
                                            98.2%
                                        </div>
                                        <div className='text-sm text-blue-600'>
                                            Industry leading
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>

                        {/* Background decorations */}
                        <div className='absolute -top-10 -right-10 w-32 h-32 bg-blue-600/10 rounded-full blur-3xl' />
                        <div className='absolute -bottom-10 -left-10 w-40 h-40 bg-blue-400/10 rounded-full blur-3xl' />
                    </motion.div>
                </div>
            </div>

            {/* Built on Saga logo */}
            <div
                className='absolute bottom-8 left-1/2'
                style={{ transform: 'translate(-50%, 50%)' }}
            >
                <p className='font-semibold text-slate-900 opacity-50 mb-6 text-base sm:text-lg flex items-center justify-center'>
                    Built on
                    <Image
                        src='https://files.invicta.capital/u/saga_7754.svg'
                        alt='Saga Logo'
                        width={3412}
                        height={512}
                        className='ml-2 h-[1rem] w-auto'
                    />
                </p>
            </div>
        </section>
    );
}
