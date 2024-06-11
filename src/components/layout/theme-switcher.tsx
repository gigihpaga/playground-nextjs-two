'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';
import { DesktopIcon, MoonIcon, SunIcon } from '@radix-ui/react-icons';

export function ThemeSwitcher() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    /**
     * useEffect only runs on the client, so now we can safely the UI
     * in this trick we are avoiding hydration errors
     */
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <Tabs defaultValue={theme}>
            <TabsList className="border _dark:border-neutral-800 _dark:bg-[#030303]">
                <TabsTrigger value="light" onClick={(e) => setTheme('light')}>
                    <SunIcon className="h-[1.2rem] w-[1.2rem]" />
                </TabsTrigger>
                <TabsTrigger value="dark" onClick={(e) => setTheme('dark')}>
                    <MoonIcon className="h-[1.2rem] w-[1.2rem] rotate-90 transition-all dark:rotate-0" />
                </TabsTrigger>
                <TabsTrigger value="system" onClick={(e) => setTheme('system')}>
                    <DesktopIcon className="h-[1.2rem] w-[1.2rem]" />
                </TabsTrigger>
            </TabsList>
        </Tabs>
    );
}
