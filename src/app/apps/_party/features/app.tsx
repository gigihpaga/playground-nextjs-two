'use client';

import { ListApp } from './list-app';
import { useSearchAndSort } from '@/app/dev/research/carx/grinding/_party/hooks/use-search-and-filter';
import { FilterAndSearch } from '@/app/dev/research/carx/grinding/_party/components/filter-and-search';

export function App({ paths }: { paths: Array<{ url: string }> }) {
    const {
        keyFilters,
        query,
        setQuery,
        keySorteds,
        sortBy,
        setSortBy,
        sortDir,
        setSortDir,
        results: filteredPaths,
    } = useSearchAndSort({
        data: paths,
        keyFilters: ['url'],
        keySorteds: ['url'],
    });
    return (
        <div className="space-y-2 py-2 px-4 h-full overflow-hidden flex flex-col">
            <FilterAndSearch
                query={query}
                setQuery={setQuery}
                keySorteds={keySorteds}
                sortBy={sortBy}
                setSortBy={setSortBy}
                sortDir={sortDir}
                setSortDir={setSortDir}
            />
            <ListApp paths={filteredPaths} />
        </div>
    );
}
