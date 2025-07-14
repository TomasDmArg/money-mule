import { motion } from 'framer-motion';
import { ArrowRight, BarChart3, FileText, Rocket, Target, Zap } from 'lucide-react';

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
            staggerChildren: 0.2,
        },
    },
};

export function HowItWorksSection() {
    const steps = [
        {
            icon: <FileText className='w-8 h-8' />,
            title: 'Upload Investment Data',
            description:
                'Import your investment portfolio, deal flow, and due diligence documents. Our AI instantly begins processing your data.',
            number: '01',
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
            borderColor: 'border-blue-200',
        },
        {
            icon: <BarChart3 className='w-8 h-8' />,
            title: 'AI-Powered Analysis',
            description:
                'Advanced algorithms assess founder reputation, project viability, market potential, and key follow up questions.',
            number: '02',
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
            borderColor: 'border-blue-200',
        },
        {
            icon: <Target className='w-8 h-8' />,
            title: 'Risk Assessment',
            description: 'Risk analysis for investment documents and projects information.',
            number: '03',
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
            borderColor: 'border-blue-200',
        },
        {
            icon: <Rocket className='w-8 h-8' />,
            title: 'Automated Monitoring',
            description:
                'Track portfolio performance, milestone progress, and risk metrics automatically with real-time alerts and reporting.',
            number: '04',
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
            borderColor: 'border-blue-200',
        },
    ];

    return (
        <section id='how-it-works' className='w-full bg-gray-50 py-20 lg:py-32'>
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
                        How It Works
                    </div>
                    <h2 className='text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6'>
                        Streamline Your Investment Process
                        <span className='text-blue-600 block'>In Four Simple Steps</span>
                    </h2>
                    <p className='text-xl text-gray-600 max-w-3xl mx-auto'>
                        Our AI-powered platform helps investors make faster, smarter decisions while
                        reducing manual work and improving portfolio performance.
                    </p>
                </motion.div>

                <motion.div
                    className='grid grid-cols-1 lg:grid-cols-4 gap-8 relative'
                    initial='hidden'
                    whileInView='visible'
                    viewport={{ once: true, amount: 0.3 }}
                    variants={staggerChildren}
                >
                    {/* Connection lines for desktop */}
                    <div className='hidden lg:block absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-200 via-blue-300 via-blue-400 to-blue-500 z-0' />

                    {steps.map((step, index) => (
                        <motion.div key={step.title} variants={fadeInUp} className='relative z-10'>
                            <Card
                                className={`h-full ${step.borderColor} hover:shadow-lg transition-all duration-300 group hover:-translate-y-2`}
                            >
                                <CardHeader className='text-center space-y-4'>
                                    <div className='relative'>
                                        <div
                                            className={`w-16 h-16 ${step.bgColor} rounded-2xl flex items-center justify-center ${step.color} mx-auto group-hover:scale-110 transition-transform duration-300`}
                                        >
                                            {step.icon}
                                        </div>
                                        <div className='absolute -top-2 -right-2 w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center text-sm font-bold'>
                                            {step.number}
                                        </div>
                                    </div>
                                    <CardTitle className='text-xl font-bold text-gray-900'>
                                        {step.title}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className='text-gray-600 leading-relaxed text-center'>
                                        {step.description}
                                    </p>
                                </CardContent>
                            </Card>

                            {/* Arrow for mobile */}
                            {index < steps.length - 1 && (
                                <div className='lg:hidden flex justify-center my-6'>
                                    <ArrowRight className='w-6 h-6 text-gray-400' />
                                </div>
                            )}
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
