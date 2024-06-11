'use client';

import { type ReactNode } from 'react';
import { ThemeProvider as NextThemeProvider } from 'next-themes';

export function ThemeProvider({ children }: { children: ReactNode | ReactNode[] }) {
    return (
        <NextThemeProvider disableTransitionOnChange attribute="class" enableSystem defaultTheme="system">
            {children}
        </NextThemeProvider>
    );
}
