'use client';

import { MainLayout } from '@/components/templates/main-layout';

import { FeaturesSection } from '../components/components/landing/FeaturesSection';
import { FinalCTASection } from '../components/components/landing/FinalCTASection';
import { HeroSection } from '../components/components/landing/HeroSection';
import { LogoNavbar } from '../components/components/landing/LogoNavbar';
import { PricingSection } from '../components/components/landing/PricingSection';
import { ProblemSection } from '../components/components/landing/ProblemSection';

export default function Home() {
    return (
        <MainLayout>
            <LogoNavbar />
            <main className='flex flex-col items-center w-full min-h-screen bg-green-50'>
                <HeroSection />
                <ProblemSection />
                <FeaturesSection />
                <PricingSection />
                <FinalCTASection />
            </main>
        </MainLayout>
    );
}
