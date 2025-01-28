'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { DesktopIcon, MoonIcon, SunIcon, CheckIcon } from '@radix-ui/react-icons';

type Theme = 'dark' | 'light' | 'system';

export function ThemeSwitch() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <button
            className="select-none"
            onClick={() => {
                if (theme === 'dark') {
                    setTheme('light');
                } else if (theme === 'light') {
                    setTheme('system');
                } else if (theme === 'system') {
                    setTheme('dark');
                }
            }}
        >
            {theme === 'light' ? (
                <SunIcon className="size-[1rem] rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0" />
            ) : theme === 'dark' ? (
                <MoonIcon className="size-[1rem] rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100" />
            ) : (
                <DesktopIcon className="size-[1rem] " />
            )}
        </button>
    );
}
