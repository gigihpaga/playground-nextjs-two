import { ArrowDownIcon, ArrowUpIcon, RotateCcwIcon } from 'lucide-react';
import { SortDir, useSearchAndSortReturn } from '../hooks/use-search-and-filter';

import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { InputDebounce } from './input-debounce';
import { Button } from '@/components/ui/button';

type FilterAndSearchProps<T> = Pick<
    useSearchAndSortReturn<T>,
    'query' | 'setQuery' | 'keySorteds' | 'sortBy' | 'setSortBy' | 'sortDir' | 'setSortDir'
>;

export function FilterAndSearch<T>({ query, setQuery, keySorteds, sortBy, setSortBy, sortDir, setSortDir }: FilterAndSearchProps<T>) {
    return (
        <div className="flex gap-x-2">
            <InputDebounce
                className="text-xs h-8"
                type="search"
                placeholder="Search clubs..."
                value={query}
                onChange={(value) => setQuery(value)}
            />
            <div className="flex border border-input rounded-md">
                <Select
                    value={sortBy === null ? 'none' : String(sortBy)}
                    onValueChange={(v) => setSortBy(v === 'none' ? null : v)}
                >
                    <SelectTrigger className="w-[50px] sm:w-[150px] text-xs h-8 px-2 py-1 border-none ">
                        <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent className="w-fit min-w-[160px] max-w-[250px]">
                        {['none', ...keySorteds].map((keySorted) => (
                            <SelectItem
                                className="text-xs"
                                key={String(keySorted)}
                                value={String(keySorted)}
                            >
                                {String(keySorted).split('.').at(-1)}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Separator orientation="vertical" />
                <Select
                    value={sortDir ? sortDir : 'none'}
                    onValueChange={(v) => setSortDir(v === 'none' ? null : (v as SortDir))}
                >
                    <SelectTrigger className="w-[60px] text-xs h-8 px-2 py-1 border-none">
                        <SelectValue placeholder="Sort dir" />
                    </SelectTrigger>
                    <SelectContent className="">
                        {(['asc', null, 'desc'] as SortDir[]).map((sd) => (
                            <SelectItem
                                className="text-xs"
                                key={sd}
                                value={sd ? sd : 'none'}
                            >
                                {sd === 'asc' ? <ArrowDownIcon className="size-3" /> : sd === 'desc' ? <ArrowUpIcon className="size-3" /> : 'none'}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Button
                    title="reset sorter"
                    className="size-8 text-xs p-1 rounded-md rounded-tl-none rounded-bl-none"
                    onClick={() => {
                        setSortBy(null);
                        setSortDir(null);
                    }}
                >
                    <RotateCcwIcon className="size-3" />
                </Button>
            </div>
        </div>
    );
}
