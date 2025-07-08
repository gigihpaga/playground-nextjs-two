import React, { useMemo, useState } from 'react';
import { useDebounce } from './use-debounce';

type UseSearchProps<T> = {
    items: T[];
    searchFn: (item: T, query: string) => boolean;
    sortFn?: (a: T, b: T) => number;
    delay?: number;
};

export type UseSearchReturn<T> = {
    query: string;
    setQuery: React.Dispatch<React.SetStateAction<string>>;
    filteredItems: T[];
};

export function useSearch<T>({ items, searchFn, sortFn, delay = 300 }: UseSearchProps<T>): UseSearchReturn<T> {
    const [query, setQuery] = useState('');
    const debouncedQuery = useDebounce(query, delay);

    const filteredItems = useMemo(() => {
        if (!debouncedQuery) return items;
        let filtered = items.filter((item) => searchFn(item, debouncedQuery.toLowerCase()));
        if (sortFn) {
            filtered = [...filtered].sort(sortFn);
        }
        return filtered;
    }, [items, debouncedQuery, searchFn, sortFn]);

    return {
        query,
        setQuery,
        filteredItems,
    };
}
