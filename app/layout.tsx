import type { Metadata } from 'next';

import { Inter } from 'next/font/google';
import { Toaster } from 'sonner';

import { Navbar } from '../components/components/layout/Navbar';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'MoneyMule | Milestone-Based Funding Platform',
    description:
        'Support innovative projects through milestone-based funding on the MoneyMule platform',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang='en'>
            <body className={inter.className}>
                <Navbar />
                <main>{children}</main>
                <Toaster />
            </body>
        </html>
    );
}
