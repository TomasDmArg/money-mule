'use client';

import { useConnectWallet, usePrivy, useWallets } from '@privy-io/react-auth';
import { DollarSign, FileText, Heart, LogOut, Menu, TrendingUp, Wallet } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

// Helper function to format wallet address
const formatAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 4)}***${address.slice(-4)}`;
};

function WalletButton({ isMobile = false }: { isMobile?: boolean }) {
    const { wallets } = useWallets();
    const { connectWallet } = useConnectWallet();

    const handleConnectWallet = useCallback(() => {
        if (connectWallet && typeof connectWallet === 'function') {
            connectWallet({
                walletChainType: 'ethereum-only',
            });
        }
    }, [connectWallet]);

    // Get the first connected wallet
    const connectedWallet = wallets.find(wallet => wallet.connectorType !== 'embedded');

    if (connectedWallet) {
        return (
            <Button
                variant='outline'
                size={isMobile ? 'default' : 'sm'}
                className={`flex items-center gap-2 ${isMobile ? 'w-full justify-start' : ''}`}
            >
                <Wallet className={`${isMobile ? 'h-5 w-5' : 'h-4 w-4'}`} />
                {formatAddress(connectedWallet.address)}
            </Button>
        );
    }

    return (
        <Button
            variant='outline'
            size={isMobile ? 'default' : 'sm'}
            className={`flex items-center gap-2 ${isMobile ? 'w-full justify-start' : ''}`}
            onClick={handleConnectWallet}
        >
            <Wallet className={`${isMobile ? 'h-5 w-5' : 'h-4 w-4'}`} />
            Connect Wallet
        </Button>
    );
}

// Mobile Navigation Menu
function MobileNavMenu({ pathname }: { pathname: string }) {
    const [isOpen, setIsOpen] = useState(false);

    const navigationItems = [
        {
            href: '/dashboard',
            icon: TrendingUp,
            label: 'Analyze Projects',
            isActive: pathname === '/dashboard',
        },
        {
            href: '/dashboard/documents',
            icon: FileText,
            label: 'Documents',
            isActive: pathname === '/dashboard/documents',
        },
        {
            href: '/dashboard/projects',
            icon: Heart,
            label: 'Fund Projects',
            isActive: pathname === '/dashboard/projects',
        },
        {
            href: '/dashboard/faucet',
            icon: DollarSign,
            label: 'Faucet',
            isActive: pathname === '/dashboard/faucet',
        },
    ];

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                <Button
                    variant='ghost'
                    size='sm'
                    className='md:hidden p-2'
                    aria-label='Open navigation menu'
                >
                    <Menu className='h-5 w-5' />
                </Button>
            </SheetTrigger>
            <SheetContent side='right' className='w-[300px] sm:w-[400px]'>
                <SheetHeader>
                    <SheetTitle className='flex items-center gap-2'>
                        <Image src='/logo.svg' alt='VenturePilot Logo' width={120} height={34} />
                    </SheetTitle>
                </SheetHeader>
                <nav className='flex flex-col gap-4 mt-8'>
                    {navigationItems.map(item => (
                        <Link key={item.href} href={item.href} onClick={() => setIsOpen(false)}>
                            <Button
                                variant={item.isActive ? 'default' : 'outline'}
                                size='default'
                                className='w-full justify-start gap-3'
                            >
                                <item.icon className='h-5 w-5' />
                                {item.label}
                            </Button>
                        </Link>
                    ))}

                    <div className='border-t pt-4 mt-4'>
                        <WalletButton isMobile />
                    </div>

                    <Link href='/' onClick={() => setIsOpen(false)}>
                        <Button
                            variant='ghost'
                            size='default'
                            className='w-full justify-start gap-3'
                        >
                            <LogOut className='h-5 w-5' />
                            Logout
                        </Button>
                    </Link>
                </nav>
            </SheetContent>
        </Sheet>
    );
}

export function DashboardNav() {
    const pathname = usePathname();
    const { ready } = usePrivy();

    // Don't render the component until Privy is ready
    if (!ready) {
        return (
            <nav className='bg-white border-b border-gray-200 px-4 py-3'>
                <div className='container mx-auto flex items-center justify-between'>
                    <div className='flex items-center gap-2'>
                        <Image
                            src='/logo.svg'
                            alt='VenturePilot Logo'
                            width={120}
                            height={34}
                            className='w-20 h-6 sm:w-24 sm:h-7 lg:w-32 lg:h-9'
                        />
                        <span className='font-semibold text-gray-900 text-sm sm:text-base lg:text-lg xl:text-xl'>
                            VenturePilot
                        </span>
                    </div>
                    <div className='flex items-center gap-4'>
                        <div className='animate-pulse bg-gray-200 h-8 w-32 rounded' />
                    </div>
                </div>
            </nav>
        );
    }

    // Only render the main component when Privy is ready
    return <DashboardNavContent pathname={pathname} />;
}

function DashboardNavContent({ pathname }: { pathname: string }) {
    return (
        <nav className='bg-white border-b border-gray-200 px-4 py-3 lg:py-4'>
            <div className='container mx-auto flex items-center justify-between'>
                {/* Logo - responsive sizing */}
                <div className='flex items-center gap-2'>
                    <Image
                        src='/logo.svg'
                        alt='VenturePilot Logo'
                        width={120}
                        height={34}
                        className='w-20 h-6 sm:w-24 sm:h-7 lg:w-32 lg:h-9 2xl:w-40 2xl:h-11'
                    />
                </div>

                {/* Desktop Navigation - hidden on mobile/small tablet */}
                <div className='hidden lg:flex items-center gap-2 xl:gap-3 2xl:gap-4'>
                    <Link href='/dashboard'>
                        <Button
                            variant={pathname === '/dashboard' ? 'default' : 'outline'}
                            size='sm'
                            className='flex items-center gap-2 text-xs xl:text-sm 2xl:text-base px-3 xl:px-4 2xl:px-5'
                        >
                            <TrendingUp className='h-4 w-4 xl:h-5 xl:w-5' />
                            <span className='hidden xl:inline'>Analyze Projects</span>
                            <span className='xl:hidden'>Analyze</span>
                        </Button>
                    </Link>

                    <Link href='/dashboard/documents'>
                        <Button
                            variant={pathname === '/dashboard/documents' ? 'default' : 'outline'}
                            size='sm'
                            className='flex items-center gap-2 text-xs xl:text-sm 2xl:text-base px-3 xl:px-4 2xl:px-5'
                        >
                            <FileText className='h-4 w-4 xl:h-5 xl:w-5' />
                            Documents
                        </Button>
                    </Link>

                    <Link href='/dashboard/projects'>
                        <Button
                            variant={pathname === '/dashboard/projects' ? 'default' : 'outline'}
                            size='sm'
                            className='flex items-center gap-2 text-xs xl:text-sm 2xl:text-base px-3 xl:px-4 2xl:px-5'
                        >
                            <Heart className='h-4 w-4 xl:h-5 xl:w-5' />
                            <span className='hidden xl:inline'>Fund Projects</span>
                            <span className='xl:hidden'>Fund</span>
                        </Button>
                    </Link>

                    <Link href='/dashboard/faucet'>
                        <Button
                            variant={pathname === '/dashboard/faucet' ? 'default' : 'outline'}
                            size='sm'
                            className='flex items-center gap-2 text-xs xl:text-sm 2xl:text-base px-3 xl:px-4 2xl:px-5'
                        >
                            <DollarSign className='h-4 w-4 xl:h-5 xl:w-5' />
                            Faucet
                        </Button>
                    </Link>

                    <WalletButton />

                    <Link href='/'>
                        <Button
                            variant='ghost'
                            size='sm'
                            className='flex items-center gap-2 text-xs xl:text-sm 2xl:text-base px-3 xl:px-4 2xl:px-5'
                        >
                            <LogOut className='h-4 w-4 xl:h-5 xl:w-5' />
                            <span className='hidden xl:inline'>Logout</span>
                            <span className='xl:hidden'>Exit</span>
                        </Button>
                    </Link>
                </div>

                {/* Tablet Navigation - visible on medium screens only */}
                <div className='hidden md:flex lg:hidden items-center gap-2'>
                    <Link href='/dashboard'>
                        <Button
                            variant={pathname === '/dashboard' ? 'default' : 'outline'}
                            size='sm'
                            className='flex items-center gap-2 p-2'
                            title='Analyze Projects'
                        >
                            <TrendingUp className='h-4 w-4' />
                        </Button>
                    </Link>

                    <Link href='/dashboard/documents'>
                        <Button
                            variant={pathname === '/dashboard/documents' ? 'default' : 'outline'}
                            size='sm'
                            className='flex items-center gap-2 p-2'
                            title='Documents'
                        >
                            <FileText className='h-4 w-4' />
                        </Button>
                    </Link>

                    <Link href='/dashboard/projects'>
                        <Button
                            variant={pathname === '/dashboard/projects' ? 'default' : 'outline'}
                            size='sm'
                            className='flex items-center gap-2 p-2'
                            title='Fund Projects'
                        >
                            <Heart className='h-4 w-4' />
                        </Button>
                    </Link>

                    <Link href='/dashboard/faucet'>
                        <Button
                            variant={pathname === '/dashboard/faucet' ? 'default' : 'outline'}
                            size='sm'
                            className='flex items-center gap-2 p-2'
                            title='Faucet'
                        >
                            <DollarSign className='h-4 w-4' />
                        </Button>
                    </Link>

                    <WalletButton />

                    <Link href='/'>
                        <Button
                            variant='ghost'
                            size='sm'
                            className='flex items-center gap-2 p-2'
                            title='Logout'
                        >
                            <LogOut className='h-4 w-4' />
                        </Button>
                    </Link>
                </div>

                {/* Mobile Navigation - hamburger menu */}
                <MobileNavMenu pathname={pathname} />
            </div>
        </nav>
    );
}
