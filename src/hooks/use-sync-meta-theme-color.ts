'use client';

import { useEffect } from 'react';
import { useTheme } from 'next-themes';

/**
 * Updates the meta theme-color tag based on the current CSS --background variable.
 * This function should only run on the client side.
 */
export function updateMetaThemeColorFromCssValue() {
    if (typeof window === 'undefined') return;

    const hsl = document.documentElement ? getComputedStyle(document.documentElement).getPropertyValue('--background').trim() : null;

    const metaTag = document.querySelector('meta[name="theme-color"]');
    const metaTag2 = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
    if (hsl) {
        metaTag?.setAttribute('content', `hsl(${hsl})`);
        metaTag2?.setAttribute('content', `hsl(${hsl})`);
    }
}

export function useSyncMetaThemeColor() {
    const { theme } = useTheme();

    useEffect(() => {
        const rafId = requestAnimationFrame(() => {
            updateMetaThemeColorFromCssValue();
        });
        return () => cancelAnimationFrame(rafId);
    }, [theme]);
}
