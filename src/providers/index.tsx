import { type ReactNode } from 'react';

import dynamic from 'next/dynamic';
import { ThemeProvider } from './theme-provider';
import { NextAuthProvider } from './next-auth-provider';
import { ReactQueryProviders } from './react-query-provider';
// import ReduxProvider from './redux-provider';
const ReduxProvider = dynamic(() => import('./redux-provider'), {
    ssr: false,
    loading: () => <div className="h-screen w-screen flex justify-center items-center">loading redux provider...</div>,
}); // dengan melakukan ini maka saat page di reload kita akan melihat white blank page, tapi kalo tidak pakai ini, redux-persis tidak bisa jalan

import { Toaster } from '@/components/ui/toaster';
import { Toaster as ToasterSonner } from '@/components/ui/sonner';

export function Providers({ children }: { children: ReactNode | ReactNode[] }) {
    return (
        <>
            <NextAuthProvider>
                <ThemeProvider>
                    <ReactQueryProviders>
                        <ReduxProvider>{children}</ReduxProvider>
                    </ReactQueryProviders>
                </ThemeProvider>
            </NextAuthProvider>
            <Toaster />
            <ToasterSonner />
        </>
    );
}
