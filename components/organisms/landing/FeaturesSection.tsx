import { motion } from 'framer-motion';
import { Bot, FileText, Shield, Target, TrendingUp, Users, Zap } from 'lucide-react';

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
            staggerChildren: 0.1,
        },
    },
};

export function FeaturesSection() {
    const features = [
        {
            icon: <Bot className='w-8 h-8' />,
            title: 'AI-Powered Analysis',
            desc: 'Advanced algorithms analyze founder reputation, project viability, and market potential in seconds',
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
            borderColor: 'border-blue-200',
        },
        {
            icon: <Target className='w-8 h-8' />,
            title: 'Milestone-Based Funding',
            desc: 'Automated funding releases based on verified milestone completion, reducing risk and ensuring progress',
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
            borderColor: 'border-blue-200',
        },
        {
            icon: <FileText className='w-8 h-8' />,
            title: 'Smart Document Review',
            desc: 'AI-powered analysis of SAFTs, SAFEs, term sheets, and whitepapers with risk assessment',
            color: 'text-purple-600',
            bgColor: 'bg-purple-50',
            borderColor: 'border-purple-200',
        },
        {
            icon: <Shield className='w-8 h-8' />,
            title: 'Reputation Tracking',
            desc: 'Comprehensive founder reputation system with verified track record and success metrics',
            color: 'text-orange-600',
            bgColor: 'bg-orange-50',
            borderColor: 'border-orange-200',
        },
        {
            icon: <Users className='w-8 h-8' />,
            title: 'Smart Matching',
            desc: 'Connect founders with the most suitable investors based on investment preferences and criteria',
            color: 'text-teal-600',
            bgColor: 'bg-teal-50',
            borderColor: 'border-teal-200',
        },
        {
            icon: <TrendingUp className='w-8 h-8' />,
            title: 'Risk Assessment',
            desc: 'Real-time risk analysis with market data integration and predictive modeling',
            color: 'text-red-600',
            bgColor: 'bg-red-50',
            borderColor: 'border-red-200',
        },
    ];

    return (
        <section id='features' className='w-full bg-white py-20'>
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
                        Powerful Features
                    </div>
                    <h2 className='text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6'>
                        Everything You Need for
                        <span className='text-blue-600 block'>Smart Investing</span>
                    </h2>
                    <p className='text-xl text-gray-600 max-w-3xl mx-auto'>
                        Our comprehensive platform combines AI-powered analytics, automated
                        processes, and risk management tools to revolutionize your investment
                        workflow
                    </p>
                </motion.div>

                <motion.div
                    className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16'
                    initial='hidden'
                    whileInView='visible'
                    viewport={{ once: true, amount: 0.3 }}
                    variants={staggerChildren}
                >
                    {features.map(feature => (
                        <motion.div key={feature.title} variants={fadeInUp} className='h-full'>
                            <Card
                                className={`h-full ${feature.borderColor} hover:shadow-lg transition-all duration-300 group hover:-translate-y-1`}
                            >
                                <CardHeader className='space-y-4'>
                                    <div
                                        className={`w-16 h-16 ${feature.bgColor} rounded-2xl flex items-center justify-center ${feature.color} group-hover:scale-110 transition-transform duration-300`}
                                    >
                                        {feature.icon}
                                    </div>
                                    <CardTitle className='text-xl font-bold text-gray-900'>
                                        {feature.title}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className='text-gray-600 leading-relaxed'>{feature.desc}</p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
