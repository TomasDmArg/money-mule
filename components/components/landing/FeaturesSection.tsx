import { motion } from 'framer-motion';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
};

export function FeaturesSection() {
    const features = [
        {
            icon: '🎯',
            title: 'Founder Qualification',
            desc: 'Qualify founders in seconds with automated reputation scoring',
        },
        {
            icon: '📈',
            title: 'Milestone-Based Funding',
            desc: 'Trigger funding automatically based on achieved milestones',
        },
        {
            icon: '📄',
            title: 'Document Review',
            desc: 'AI-powered review of SAFTs, SAFEs, term sheets, and whitepapers',
        },
        {
            icon: '🛡️',
            title: 'Automated Reputation',
            desc: 'Build and track founder reputation automatically',
        },
        {
            icon: '👥',
            title: 'Investor Matching',
            desc: 'Connect founders with suitable investors efficiently',
        },
        {
            icon: '✅',
            title: 'Risk Assessment',
            desc: 'Comprehensive risk analysis for every investment opportunity',
        },
    ];
    return (
        <motion.section
            className='w-full max-w-7xl px-2 sm:px-4 py-10 md:py-16'
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
        >
            <h2 className='text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-2'>
                Powerful Features for Smart Investing
            </h2>
            <p className='text-center text-base sm:text-lg md:text-xl mb-8'>
                Everything you need to make informed investment decisions
            </p>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                {features.map(item => (
                    <motion.div
                        key={item.title}
                        variants={fadeInUp}
                        initial='hidden'
                        whileInView='visible'
                        viewport={{ once: true, amount: 0.3 }}
                        className='h-full'
                    >
                        <Card className='h-full'>
                            <CardHeader>
                                <span className='text-2xl text-green-700'>{item.icon}</span>
                                <CardTitle className='mt-2'>{item.title}</CardTitle>
                            </CardHeader>
                            <CardContent>{item.desc}</CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </motion.section>
    );
}
