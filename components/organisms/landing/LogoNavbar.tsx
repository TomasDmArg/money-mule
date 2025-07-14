import Image from 'next/image';

export function LogoNavbar() {
    return (
        <nav className='relative z-50 mt-4 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center sm:justify-start'>
            <Image
                src='/logo.svg'
                alt='VenturePilot Logo'
                width={940}
                height={292}
                className='h-14 w-auto'
            />
        </nav>
    );
}
