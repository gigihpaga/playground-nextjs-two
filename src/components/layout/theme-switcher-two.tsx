'use client';

import { useEffect, useState } from 'react';
import { DesktopIcon, MoonIcon, SunIcon, CheckIcon } from '@radix-ui/react-icons';
import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

export function ThemeSwitcherTwo() {
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
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    size="icon"
                >
                    {theme === 'light' ? (
                        <SunIcon className="size-[1rem] rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0" />
                    ) : theme === 'dark' ? (
                        <MoonIcon className="absolute size-[1rem] rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100" />
                    ) : (
                        <DesktopIcon className="size-[1rem] " />
                    )}
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem
                    className="justify-between"
                    onClick={() => setTheme('light')}
                >
                    Light
                    {theme === 'light' && <CheckIcon />}
                </DropdownMenuItem>
                <DropdownMenuItem
                    className="justify-between"
                    onClick={() => setTheme('dark')}
                >
                    Dark
                    {theme === 'dark' && <CheckIcon />}
                </DropdownMenuItem>
                <DropdownMenuItem
                    className="justify-between"
                    onClick={() => setTheme('system')}
                >
                    System
                    {theme === 'system' && <CheckIcon />}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
