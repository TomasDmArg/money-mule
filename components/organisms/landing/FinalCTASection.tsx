import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, Rocket } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
};

const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

export function FinalCTASection() {
    const testimonials = [
        {
            quote: 'This tool would have saved me hundreds of thousands of dollars.',
            author: 'Gonzalo Ferradás',
            role: 'Founder, Invicta Crypto',
        },
    ];

    return (
        <section className='w-full relative overflow-hidden'>
            {/* Background with gradient */}
            <div className='absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800' />

            {/* Background pattern */}
            <div className='absolute inset-0 bg-[url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="1"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")]' />

            <div className='relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32'>
                <motion.div
                    className='text-center mb-12'
                    initial='hidden'
                    whileInView='visible'
                    viewport={{ once: true, amount: 0.3 }}
                    variants={fadeInUp}
                >
                    <div className='inline-flex items-center px-4 py-2 rounded-full bg-white/20 text-white text-sm font-medium mb-6'>
                        <Rocket className='w-4 h-4 mr-2' />
                        Ready to Transform Your Investment Strategy?
                    </div>
                    <h2 className='text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight'>
                        Join the Future of
                        <span className='text-blue-200 block'>Smart Investing</span>
                    </h2>
                    <p className='text-xl text-blue-100 max-w-3xl mx-auto mb-8'>
                        Stop losing money on bad investments. Start making data-driven decisions
                        with AI-powered insights, automated due diligence, and milestone-based
                        funding.
                    </p>
                </motion.div>

                <motion.div
                    className='grid grid-cols-1 gap-12 items-center mb-16'
                    initial='hidden'
                    whileInView='visible'
                    viewport={{ once: true, amount: 0.3 }}
                    variants={staggerChildren}
                >
                    {/* Right side - Testimonials */}
                    <motion.div variants={fadeInUp} className='space-y-6 flex justify-center'>
                        {testimonials.map(testimonial => (
                            <Card
                                key={testimonial.author}
                                className='bg-white/10 backdrop-blur-sm border-white/20 max-w-[400px]'
                            >
                                <CardContent className='p-6'>
                                    <p className='text-white mb-4 italic'>
                                        &ldquo;{testimonial.quote}&rdquo;
                                    </p>
                                    <div className='text-blue-200 text-sm'>
                                        <div className='font-semibold'>{testimonial.author}</div>
                                        <div>{testimonial.role}</div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </motion.div>
                </motion.div>

                {/* CTA Buttons */}
                <motion.div
                    className='text-center space-y-8'
                    initial='hidden'
                    whileInView='visible'
                    viewport={{ once: true, amount: 0.3 }}
                    variants={fadeInUp}
                >
                    <div className='flex flex-col sm:flex-row gap-4 justify-center items-center max-w-lg mx-auto'>
                        <Link href='/dashboard' className='w-full sm:w-auto'>
                            <Button
                                size='lg'
                                className='w-full sm:w-auto bg-white hover:bg-gray-100 text-blue-700 font-bold px-8 py-4 text-lg flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300'
                            >
                                Start Free Trial
                                <ArrowRight className='w-5 h-5' />
                            </Button>
                        </Link>
                    </div>

                    <div className='flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-8 text-blue-100 text-sm'>
                        <div className='flex items-center space-x-2'>
                            <CheckCircle className='w-4 h-4' />
                            <span>14-day free trial</span>
                        </div>
                        <div className='flex items-center space-x-2'>
                            <CheckCircle className='w-4 h-4' />
                            <span>No credit card required</span>
                        </div>
                        <div className='flex items-center space-x-2'>
                            <CheckCircle className='w-4 h-4' />
                            <span>Cancel anytime</span>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Decorative elements */}
            <div className='absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl' />
            <div className='absolute bottom-10 right-10 w-32 h-32 bg-blue-400/20 rounded-full blur-2xl' />
            <div className='absolute top-1/2 left-1/4 w-16 h-16 bg-blue-300/10 rounded-full blur-lg' />
        </section>
    );
}
