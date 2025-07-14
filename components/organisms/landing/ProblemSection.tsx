import { motion } from 'framer-motion';
import { AlertCircle, Clock, DollarSign, Zap } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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

export function ProblemSection() {
    const items = [
        {
            icon: <DollarSign className='w-8 h-8' />,
            title: 'Massive Capital Losses',
            desc: 'Investors lose billions annually on failed projects with poor due diligence, unrealistic promises, and inadequate founder vetting',
            stat: '$2.3B+',
            statDesc: 'Lost annually',
            cardClass: 'bg-gradient-to-br from-red-50 to-red-100 border-red-200 hover:shadow-lg',
            titleClass: 'text-red-700',
            iconBg: 'bg-red-100',
            iconColor: 'text-red-600',
        },
        {
            icon: <Clock className='w-8 h-8' />,
            title: 'Inefficient Processes',
            desc: 'Founders spend 70% of their time fundraising instead of building, while investors struggle with manual analysis and endless paperwork',
            stat: '6-12 months',
            statDesc: 'Average fundraising time',
            cardClass:
                'bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 hover:shadow-lg',
            titleClass: 'text-orange-700',
            iconBg: 'bg-orange-100',
            iconColor: 'text-orange-600',
        },
        {
            icon: <Zap className='w-8 h-8' />,
            title: 'Our Smart Solution',
            desc: 'AI-powered platform that automates due diligence, enables milestone-based funding, and connects the right investors with promising founders',
            stat: '3 min',
            statDesc: 'Document review time',
            cardClass:
                'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-xl transform hover:-translate-y-1',
            titleClass: 'text-blue-700',
            iconBg: 'bg-blue-100',
            iconColor: 'text-blue-600',
        },
    ];

    return (
        <section className='w-full bg-gray-50 py-20 lg:py-32'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                <motion.div
                    className='text-center mb-16'
                    initial='hidden'
                    whileInView='visible'
                    viewport={{ once: true, amount: 0.3 }}
                    variants={fadeInUp}
                >
                    <div className='inline-flex items-center px-4 py-2 rounded-full bg-red-100 text-red-700 text-sm font-medium mb-4'>
                        <AlertCircle className='w-4 h-4 mr-2' />
                        Critical Problems
                    </div>
                    <h2 className='text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6'>
                        The Investment Ecosystem
                        <span className='text-red-600 block'>Is Fundamentally Broken</span>
                    </h2>
                    <p className='text-xl text-gray-600 max-w-3xl mx-auto'>
                        Traditional investment processes are slow, expensive, and prone to costly
                        mistakes. Both investors and founders deserve better.
                    </p>
                </motion.div>

                {/* Problem Cards */}
                <motion.div
                    className='grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16'
                    initial='hidden'
                    whileInView='visible'
                    viewport={{ once: true, amount: 0.3 }}
                    variants={staggerChildren}
                >
                    {items.map(item => (
                        <motion.div key={item.title} variants={fadeInUp} className='h-full'>
                            <Card
                                className={`${item.cardClass} h-full transition-all duration-300 group`}
                            >
                                <CardHeader className='space-y-4'>
                                    <div
                                        className={`w-16 h-16 ${item.iconBg} rounded-2xl flex items-center justify-center ${item.iconColor} group-hover:scale-110 transition-transform duration-300`}
                                    >
                                        {item.icon}
                                    </div>
                                    <div>
                                        <CardTitle
                                            className={`${item.titleClass} text-xl font-bold mb-2`}
                                        >
                                            {item.title}
                                        </CardTitle>
                                        <div className='flex items-baseline space-x-2'>
                                            <span
                                                className={`text-2xl font-bold ${item.titleClass}`}
                                            >
                                                {item.stat}
                                            </span>
                                            <span className='text-sm text-gray-600'>
                                                {item.statDesc}
                                            </span>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className={`${item.titleClass} leading-relaxed`}>
                                        {item.desc}
                                    </p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
