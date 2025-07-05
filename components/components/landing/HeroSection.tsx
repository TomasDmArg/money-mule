import { motion } from 'framer-motion';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
};

export function HeroSection() {
    return (
        <motion.section
            className='w-full flex flex-col items-center justify-center text-center px-4 sm:px-8 md:px-16 py-16 bg-green-50 min-h-[60vh] max-w-5xl mx-auto'
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
        >
            <h1 className='text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-bold mb-4 leading-tight'>
                No More Shitty Investments
            </h1>
            <p className='text-base sm:text-lg md:text-xl mb-4 max-w-2xl'>
                Save time and money by qualifying founders in seconds, using milestone-based
                funding, and reviewing critical documents automatically.
            </p>
            <p className='font-semibold text-green-700 mb-6 text-base sm:text-lg'>
                Skip the noise. Invest smarter.
            </p>
            <div className='flex flex-col sm:flex-row gap-4 mb-4 w-full max-w-md mx-auto justify-center'>
                <Link href='/dashboard'>
                    <Button className='w-full sm:w-auto'>Start Free Trial</Button>
                </Link>
            </div>
        </motion.section>
    );
}
