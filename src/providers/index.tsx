import { type ReactNode } from 'react';

import { ThemeProvider } from './theme-provider';
import { NextAuthProvider } from './next-auth-provider';

import { Toaster } from '@/components/ui/toaster';
import { Toaster as ToasterSonner } from '@/components/ui/sonner';

export function Providers({ children }: { children: ReactNode | ReactNode[] }) {
    return (
        <>
            <NextAuthProvider>
                <ThemeProvider>{children}</ThemeProvider>
            </NextAuthProvider>
            <Toaster />
            <ToasterSonner />
        </>
    );
}
