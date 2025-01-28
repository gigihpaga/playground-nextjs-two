'use client';

import { useEffect, useRef, useState } from 'react';

type Theme = 'dark' | 'light' | 'system';
type StorageTheme = {
    theme: Theme;
};

const storageThemeKey = 'theme';
const preferDarkQuery = '(prefers-color-schema:dark)';

export function useThemeSwith() {
    const htmlElm = useRef<HTMLElement | null>(null);

    const [modeTheme, setModeTheme] = useState<Theme>('system');

    function toggleTheme(theme: Theme) {
        htmlElm.current = document.documentElement;
        // if (!htmlElm.current) return;
        if (theme === 'dark') {
            htmlElm.current?.classList.remove('light');
            htmlElm.current?.classList.remove('system');
            htmlElm.current?.classList.add(theme);
        } else if (theme === 'light') {
            htmlElm.current?.classList.remove('dark');
            htmlElm.current?.classList.remove('system');
            htmlElm.current?.classList.add(theme);
        } else {
            htmlElm.current?.classList.remove('dark');
            htmlElm.current?.classList.remove('light');
            htmlElm.current?.classList.add(theme);
        }
        window.localStorage.setItem(storageThemeKey, theme);
    }

    function getUserPreference() {
        const userPref = window.localStorage.getItem(storageThemeKey) as StorageTheme['theme'];
        if (userPref) return userPref;
        return window.matchMedia(preferDarkQuery).matches ? 'dark' : 'light';
    }

    useEffect(() => {
        const mediaQuery = window.matchMedia(preferDarkQuery);

        const handleChange = () => {
            const newModeTheme = getUserPreference();
            setModeTheme(newModeTheme);
            toggleTheme(newModeTheme);
        };

        handleChange();

        mediaQuery.addEventListener('change', handleChange);
        return () => {
            mediaQuery.removeEventListener('change', handleChange);
        };
    }, []);

    return [modeTheme, setModeTheme];
}
