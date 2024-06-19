import { type ReactNode } from 'react';

import { ThemeProvider } from './theme-provider';
import { Toaster } from '@/components/ui/toaster';

export function Providers({ children }: { children: ReactNode | ReactNode[] }) {
    return (
        <>
            <ThemeProvider>{children}</ThemeProvider>
            <Toaster />
        </>
    );
}
