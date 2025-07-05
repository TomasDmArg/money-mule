import { motion } from 'framer-motion';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
};

export function PricingSection() {
    return (
        <motion.section
            className='w-full max-w-7xl px-2 sm:px-4 py-10 md:py-16'
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
        >
            <h2 className='text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-2'>
                Flexible Pricing Models
            </h2>
            <p className='text-center text-base sm:text-lg md:text-xl mb-8'>
                Choose the pricing model that works best for your investment strategy
            </p>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                <motion.div
                    variants={fadeInUp}
                    initial='hidden'
                    whileInView='visible'
                    viewport={{ once: true, amount: 0.3 }}
                    className='h-full'
                >
                    <Card className='border-green-200 h-full'>
                        <CardHeader>
                            <CardTitle>Subscription</CardTitle>
                            <CardDescription>
                                Monthly or annual plans for regular users
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className='text-3xl font-bold mb-2'>$99/mo</div>
                            <div className='mb-4'>Unlimited access to all features</div>
                            <Link href='/dashboard'>
                                <Button className='w-full'>Start Free Trial</Button>
                            </Link>
                        </CardContent>
                    </Card>
                </motion.div>
                <motion.div
                    variants={fadeInUp}
                    initial='hidden'
                    whileInView='visible'
                    viewport={{ once: true, amount: 0.3 }}
                    className='h-full'
                >
                    <Card className='border-green-400 h-full'>
                        <CardHeader>
                            <CardTitle>Pay Per Use</CardTitle>
                            <CardDescription>Perfect for occasional investors</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className='text-3xl font-bold mb-2'>$25</div>
                            <div className='mb-4'>Per investment analysis</div>
                            <Link href='/dashboard'>
                                <Button className='w-full' variant='outline'>
                                    Get Started
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </motion.div>
                <motion.div
                    variants={fadeInUp}
                    initial='hidden'
                    whileInView='visible'
                    viewport={{ once: true, amount: 0.3 }}
                    className='h-full'
                >
                    <Card className='border-green-200 h-full'>
                        <CardHeader>
                            <CardTitle>Success Fee</CardTitle>
                            <CardDescription>Pay only when investments succeed</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className='text-3xl font-bold mb-2'>2-5%</div>
                            <div className='mb-4'>Of successful investment returns</div>
                            <Link href='/dashboard'>
                                <Button className='w-full'>Contact Sales</Button>
                            </Link>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </motion.section>
    );
}
