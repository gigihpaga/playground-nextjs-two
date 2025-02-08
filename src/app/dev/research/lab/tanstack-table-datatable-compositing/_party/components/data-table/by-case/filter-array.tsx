import { type Column, type RowData } from '@tanstack/react-table';
import React from 'react';

/**
 * Filter array faced
 * `impportant` untuk menggunakan filter array ini pada column def harus mereturn Array<string>
 * @param param0
 * @returns
 *
 * @example
 * //  penggunaan di column def
 * accessorFn: (data) => data.topics.map((topic) => topic.title) // <== accessorFn return Array<string>
 */
export function FilterArray<T extends RowData>({ column }: { column: Column<T, unknown> }) {
    const { filterVariant } = column.columnDef.meta ?? {};

    const columnFilterValue = column.getFilterValue();

    const sortedUniqueValues2 = React.useMemo(
        () => Array.from(new Set(Array.from(column.getFacetedUniqueValues().keys()).flatMap((val) => val)).values()),

        [column]
    );

    return (
        <select
            onChange={(e) => column.setFilterValue(e.target.value)}
            value={columnFilterValue?.toString()}
        >
            <option value="">All</option>
            {sortedUniqueValues2.map((value, idx) => (
                //dynamically generated select options from faceted values feature
                <option
                    value={value}
                    key={value}
                >
                    {value}
                </option>
            ))}
        </select>
    );
}
