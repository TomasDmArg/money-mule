import Image from 'next/image';

export function LogoNavbar() {
    return (
        <nav className='w-full flex items-center justify-center px-12 py-3 bg-green-50'>
            <Image
                src='/logo.svg'
                alt='MoneyMule Logo'
                width={940}
                height={292}
                className='h-14 w-auto'
            />
        </nav>
    );
}
