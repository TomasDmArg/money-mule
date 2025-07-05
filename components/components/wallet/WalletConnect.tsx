'use client';

import { ChevronDown, Copy, ExternalLink, Loader2, LogOut, Settings, Wallet } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { useWallet } from '../../../hooks/useWallet';

interface WalletConnectProps {
    className?: string;
}

export const WalletConnect: React.FC<WalletConnectProps> = ({ className = '' }) => {
    const { isConnected, address, isLoading, connect, disconnect, formatAddress, network } =
        useWallet();
    const [isConnecting, setIsConnecting] = useState(false);

    const handleConnect = async () => {
        setIsConnecting(true);
        try {
            await connect();
        } catch (error) {
            console.error('Connection failed:', error);
            toast.error('Failed to connect wallet');
        } finally {
            setIsConnecting(false);
        }
    };

    const handleDisconnect = async () => {
        try {
            await disconnect();
            toast.success('Wallet disconnected');
        } catch (error) {
            console.error('Disconnect failed:', error);
            toast.error('Failed to disconnect wallet');
        }
    };

    const copyAddress = async () => {
        if (address) {
            await navigator.clipboard.writeText(address);
            toast.success('Address copied to clipboard');
        }
    };

    const viewOnExplorer = () => {
        if (address) {
            window.open(`${network.blockExplorers.default.url}/address/${address}`, '_blank');
        }
    };

    if (isLoading) {
        return (
            <Button variant='outline' disabled className={className}>
                <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                Loading...
            </Button>
        );
    }

    if (!isConnected) {
        return (
            <Button onClick={handleConnect} disabled={isConnecting} className={className}>
                {isConnecting ? (
                    <>
                        <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                        Connecting...
                    </>
                ) : (
                    <>
                        <Wallet className='w-4 h-4 mr-2' />
                        Connect Wallet
                    </>
                )}
            </Button>
        );
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant='outline' className={`flex items-center gap-2 ${className}`}>
                    <Avatar className='w-6 h-6'>
                        <AvatarFallback className='text-xs'>
                            {address?.slice(2, 4).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <span className='hidden sm:inline'>{formatAddress(address!)}</span>
                    <ChevronDown className='w-4 h-4' />
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align='end' className='w-56'>
                <div className='px-2 py-1.5'>
                    <p className='text-sm font-medium'>Connected Wallet</p>
                    <p className='text-xs text-gray-500 font-mono'>{address}</p>
                </div>

                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={copyAddress} className='cursor-pointer'>
                    <Copy className='w-4 h-4 mr-2' />
                    Copy Address
                </DropdownMenuItem>

                <DropdownMenuItem onClick={viewOnExplorer} className='cursor-pointer'>
                    <ExternalLink className='w-4 h-4 mr-2' />
                    View on Explorer
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem className='cursor-pointer'>
                    <Settings className='w-4 h-4 mr-2' />
                    Settings
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={handleDisconnect}
                    className='cursor-pointer text-red-600'
                >
                    <LogOut className='w-4 h-4 mr-2' />
                    Disconnect
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
