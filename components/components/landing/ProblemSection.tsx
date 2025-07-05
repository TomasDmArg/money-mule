import { motion } from 'framer-motion';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
};

export function ProblemSection() {
    const items = [
        {
            icon: <span className='text-4xl text-red-500'>$</span>,
            title: 'Investors Lose Millions',
            desc: 'Projects that never deliver on promises, wasting investor capital and trust',
            cardClass: 'bg-red-50 border-red-200 text-red-700',
            titleClass: 'text-red-700',
        },
        {
            icon: <span className='text-4xl text-orange-500'>🕒</span>,
            title: 'Founders Waste Time',
            desc: 'Precious time spent finding suitable investors instead of building their product',
            cardClass: 'bg-orange-50 border-orange-200 text-orange-700',
            titleClass: 'text-orange-700',
        },
        {
            icon: <span className='text-4xl text-green-600'>⚡</span>,
            title: 'Our Solution',
            desc: 'A tool that saves time and money for both investors and founders',
            cardClass: 'bg-green-50 border-green-200 text-green-700',
            titleClass: 'text-green-700',
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
                The Problem We Solve
            </h2>
            <p className='text-center text-base sm:text-lg md:text-xl mb-8'>
                The investment ecosystem is broken for both investors and founders
            </p>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                {items.map(item => (
                    <motion.div
                        key={item.title}
                        variants={fadeInUp}
                        initial='hidden'
                        whileInView='visible'
                        viewport={{ once: true, amount: 0.3 }}
                        className='h-full'
                    >
                        <Card className={`${item.cardClass} h-full`}>
                            <CardHeader>
                                {item.icon}
                                <CardTitle className={`${item.titleClass} mt-2`}>
                                    {item.title}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className={item.titleClass}>{item.desc}</CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </motion.section>
    );
}
