import { type ReactNode } from 'react';

import { ClerkProvider } from './clerk-provider';
import { ThemeProvider } from './theme-provider';
import { Toaster } from '@/components/ui/toaster';

export function Providers({ children }: { children: ReactNode | ReactNode[] }) {
    return (
        <>
            <ClerkProvider>
                <ThemeProvider>{children}</ThemeProvider>
                <Toaster />
            </ClerkProvider>
        </>
    );
}
