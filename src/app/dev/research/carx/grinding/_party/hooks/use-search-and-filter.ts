// useSearchAndSort.ts
import React, { useMemo, useState } from 'react';

export function getValueByPath<T>(obj: T, path: keyof T | string) {
    const value: unknown | undefined = (path as string).split('.').reduce((acc: any, key) => acc?.[key], obj);
    return value;
}

export type SortDir = 'asc' | 'desc' | null;

type KeysOf<T> = Array<keyof T>;

interface useSearchAndSortProps<T> {
    data: T[];
    /** key dari object, jika nested object maka quetation menggunakan dot (.) contoh: ['name', 'class', 'quest.cooldownTime']*/
    keyFilters: KeysOf<T> | string[];
    /** key dari object, jika nested object maka quetation menggunakan dot (.) contoh: ['name', 'class', 'quest.cooldownTime']*/
    keySorteds: KeysOf<T> | string[];
}

export type useSearchAndSortReturn<T> = {
    keyFilters: string[] | KeysOf<T>;
    query: string;
    setQuery: React.Dispatch<React.SetStateAction<string>>;
    keySorteds: string[] | KeysOf<T>;
    sortBy: string | keyof T | null;
    setSortBy: React.Dispatch<React.SetStateAction<string | keyof T | null>>;
    sortDir: SortDir;
    setSortDir: React.Dispatch<React.SetStateAction<SortDir>>;
    results: T[];
};

export function useSearchAndSort<T>({ data, keyFilters, keySorteds }: useSearchAndSortProps<T>) {
    const [query, setQuery] = useState('');
    const [sortBy, setSortBy] = useState<keyof T | string | null>(null);
    const [sortDir, setSortDir] = useState<SortDir>(null);

    const filtered = useMemo(() => {
        const lowerQuery = query.toLowerCase();
        return data.filter((item) =>
            keyFilters.some((key) => {
                const value = getValueByPath(item, key);
                if (typeof value === 'string') {
                    return value.toLowerCase().includes(lowerQuery);
                } else if (typeof value === 'number') {
                    return value.toString().includes(lowerQuery);
                } else {
                    return false;
                }
            })
        );
    }, [query, data, keyFilters]);

    const sorted = useMemo(() => {
        if (!sortBy || !keySorteds.includes(sortBy as keyof T & string)) return filtered;

        return [...filtered].sort((a, b) => {
            const aValue = getValueByPath(a, sortBy);
            const bValue = getValueByPath(b, sortBy);

            if (typeof aValue === 'string' && typeof bValue === 'string') {
                return sortDir === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
            }

            if (typeof aValue === 'number' && typeof bValue === 'number') {
                return sortDir === 'asc' ? aValue - bValue : bValue - aValue;
            }

            if (aValue instanceof Date && bValue instanceof Date) {
                return sortDir === 'asc' ? aValue.getTime() - bValue.getTime() : bValue.getTime() - aValue.getTime();
            }

            return 0;
        });
    }, [filtered, sortBy, sortDir, keySorteds]);

    return {
        keyFilters,
        query,
        setQuery,
        keySorteds,
        sortBy,
        setSortBy,
        sortDir,
        setSortDir,
        results: sorted,
    } satisfies useSearchAndSortReturn<T> as useSearchAndSortReturn<T>;
}
