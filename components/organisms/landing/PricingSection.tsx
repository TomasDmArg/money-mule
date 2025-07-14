import { motion } from 'framer-motion';
import { ArrowRight, Check, Star, Zap } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
};

const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
        },
    },
};

export function PricingSection() {
    const plans = [
        {
            name: 'Starter',
            description: 'Perfect for occasional investors',
            price: '$25',
            period: 'per analysis',
            popular: false,
            features: ['Single investment analysis', 'Basic founder scoring', 'Document review'],
            buttonText: 'Get Started',
            buttonVariant: 'outline' as const,
        },
        {
            name: 'Professional',
            description: 'Best for active investors',
            price: '$99',
            period: 'per month',
            popular: true,
            features: [
                'Unlimited deck analyses',
                'Unlimited document analyses',
                'Priority access to deals',
                'Advanced AI insights',
                'Priority support',
            ],
            buttonText: 'Start Free Trial',
            buttonVariant: 'default' as const,
        },
        {
            name: 'Enterprise',
            description: 'For institutional investors',
            price: 'Custom',
            period: 'pricing',
            popular: false,
            features: [
                'Everything in Professional',
                'Custom integrations or reports',
                'Multi-user dashboard',
                'Advanced analytics',
                'Dedicated support',
            ],
            buttonText: 'Contact Sales',
            buttonVariant: 'outline' as const,
        },
    ];

    return (
        <section id='pricing' className='w-full bg-white py-20 lg:py-32'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                <motion.div
                    className='text-center mb-16'
                    initial='hidden'
                    whileInView='visible'
                    viewport={{ once: true, amount: 0.3 }}
                    variants={fadeInUp}
                >
                    <div className='inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-4'>
                        <Zap className='w-4 h-4 mr-2' />
                        Flexible Pricing
                    </div>
                    <h2 className='text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6'>
                        Choose Your
                        <span className='text-blue-600 block'>Investment Workflow</span>
                    </h2>
                    <p className='text-xl text-gray-600 max-w-3xl mx-auto'>
                        Flexible pricing models designed to streamline your investment processes.
                        Start free and scale as you succeed.
                    </p>
                </motion.div>

                {/* Main Pricing Cards */}
                <motion.div
                    className='grid grid-cols-1 lg:grid-cols-3 gap-8 mb-0 items-stretch'
                    initial='hidden'
                    whileInView='visible'
                    viewport={{ once: true, amount: 0.3 }}
                    variants={staggerChildren}
                >
                    {plans.map(plan => (
                        <motion.div
                            key={plan.name}
                            variants={fadeInUp}
                            className='relative flex flex-col h-full'
                        >
                            {plan.popular && (
                                <div
                                    className='absolute left-1/2 z-20'
                                    style={{
                                        top: '0px',
                                        transform: 'translate(-50%, -50%)',
                                        pointerEvents: 'none',
                                    }}
                                >
                                    <div className='inline-flex items-center px-4 py-2 rounded-full bg-blue-600 text-white text-sm font-medium shadow-lg'>
                                        <Star className='w-4 h-4 mr-1' />
                                        Most Popular
                                    </div>
                                </div>
                            )}
                            <Card className='flex flex-col justify-between h-full min-h-[520px] border-gray-200 hover:border-blue-300 transition-all duration-300 hover:shadow-lg relative'>
                                <CardHeader className='text-center pb-8'>
                                    <CardTitle className='text-2xl font-bold text-gray-900'>
                                        {plan.name}
                                    </CardTitle>
                                    <CardDescription className='text-gray-600 mt-2'>
                                        {plan.description}
                                    </CardDescription>
                                    <div className='mt-6'>
                                        <div className='flex items-baseline justify-center'>
                                            <span className='text-4xl font-bold text-gray-900'>
                                                {plan.price}
                                            </span>
                                            <span className='text-gray-600 ml-2'>
                                                {plan.period}
                                            </span>
                                        </div>
                                        {plan.name === 'Professional' && (
                                            <p className='text-sm text-blue-600 mt-2 font-medium'>
                                                14-day free trial
                                            </p>
                                        )}
                                    </div>
                                </CardHeader>
                                <CardContent className='pt-0 flex flex-col flex-1 justify-between'>
                                    <ul className='space-y-3 mb-8'>
                                        {plan.features.map(feature => (
                                            <li key={feature} className='flex items-center'>
                                                <Check className='w-5 h-5 text-blue-600 mr-3 flex-shrink-0' />
                                                <span className='text-gray-700'>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <div className='mt-auto'>
                                        <Link href='/dashboard'>
                                            <Button
                                                variant={plan.buttonVariant}
                                                size='lg'
                                                className={`w-full ${plan.popular
                                                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white'
                                                        : 'border-blue-600 text-blue-700 hover:bg-blue-50'
                                                    } flex items-center justify-center gap-2`}
                                            >
                                                {plan.buttonText}
                                                <ArrowRight className='w-4 h-4' />
                                            </Button>
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>

                {/* FAQ or Additional Info */}
                <motion.div
                    className='text-center mt-16'
                    initial='hidden'
                    whileInView='visible'
                    viewport={{ once: true, amount: 0.3 }}
                    variants={fadeInUp}
                >
                    <p className='text-gray-600 mb-4'>
                        Need a custom plan? Enterprise pricing available for teams and institutions.
                    </p>
                    <Link href='/dashboard'>
                        <Button
                            variant='ghost'
                            className='text-blue-600 hover:text-blue-700 hover:bg-blue-50'
                        >
                            Contact our sales team →
                        </Button>
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
