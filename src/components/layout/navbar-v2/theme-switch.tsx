'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { DesktopIcon, MoonIcon, SunIcon, CheckIcon } from '@radix-ui/react-icons';
import { Button, ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/classnames';
import { useSyncMetaThemeColor } from '@/hooks/use-sync-meta-theme-color';

type Theme = 'dark' | 'light' | 'system';

/** memetakan setiap tema ke tema berikutnya dalam siklus (dark → light → system → dark) */
const nextThemeMap: Record<string, Theme> = {
    dark: 'light',
    light: 'system',
    system: 'dark',
};

export type ThemeSwitchProps = Omit<ButtonProps, 'children' | 'onClick'>;

export function ThemeSwitch({ className, size = 'sm', variant = 'outline', ...props }: ThemeSwitchProps) {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useSyncMetaThemeColor();

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <Button
            aria-describedby="theme switch"
            {...props}
            size={size}
            variant={variant}
            className={cn('select-none size-fit p-1.5', className)}
            onClick={() => setTheme(nextThemeMap[theme ?? 'system'])}
        >
            {theme === 'light' ? (
                <SunIcon
                    className={cn('size-3 rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0', size === 'default' && 'size-4')}
                />
            ) : theme === 'dark' ? (
                <MoonIcon
                    className={cn('size-3 rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100', size === 'default' && 'size-4')}
                />
            ) : (
                <DesktopIcon className={cn('size-3', size === 'default' && 'size-4')} />
            )}
        </Button>
    );
}
