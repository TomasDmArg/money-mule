import { motion } from 'framer-motion';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
};

export function FinalCTASection() {
    return (
        <motion.section
            className='w-full py-10 md:py-16 bg-green-600 flex flex-col items-center px-2 sm:px-4'
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
        >
            <h2 className='text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 text-center'>
                Ready to Skip the Noise?
            </h2>
            <p className='text-white text-base sm:text-lg md:text-xl mb-8 text-center max-w-2xl'>
                Join the revolution in smart investing. Start making better investment decisions
                today.
            </p>
            <div className='flex flex-col sm:flex-row gap-4 w-full max-w-xs sm:max-w-none justify-center'>
                <Link href='/dashboard'>
                    <Button className='bg-white hover:bg-white/80 text-green-700 font-bold w-full sm:w-auto'>
                        Start Free Trial
                    </Button>
                </Link>
            </div>
        </motion.section>
    );
}
