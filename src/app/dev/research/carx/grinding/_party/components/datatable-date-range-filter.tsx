import React from 'react';
import { format } from 'date-fns';
import { flexRender, type Row, type Column, type Table as DataTableInstance, type ColumnDef, Table } from '@tanstack/react-table';

import { isValidDate } from '../utils/datatable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type DataTableDateRangeFilterProps<TData, TValue> = {
    column: Column<TData, TValue>;
    title?: string;
    table: Table<any>;
};
export function DataTableDateRangeFilter<TData, TValue>({ column, title, table }: DataTableDateRangeFilterProps<TData, TValue>) {
    return (
        <>
            {/*   <input
                type="date"
                defaultValue={format(new Date(), 'yyyy-MM-dd')}
            /> */}

            <RangeFilter
                column={column}
                table={table}
            />
        </>
    );
}

//* Contoh
/**
 * [](https://stackblitz.com/edit/tanstack-table-mkky4i?file=src%2Fmain.tsx,date-between-filter.ts,src%2Fdate-utils.ts)
 * @param param0
 * @returns
 */

function RangeFilter({ column, table }: { column: Column<any, unknown>; table: Table<any> }) {
    const firstValue = table.getPreFilteredRowModel().flatRows[0]?.getValue(column.id);
    const columnFilterValue = column.getFilterValue();

    const values = columnFilterValue as [Date, Date];
    const startDate = values?.[0];
    const endDate = values?.[1];
    return (
        <div className="flex space-x-2 items-center h-8 border-t border-dashed w-full">
            <Input
                className="text-xs py-[2px] px-1 h-fit"
                aria-description="start date"
                title="start date"
                type="date"
                // debounce={200}
                value={startDate ? format(startDate, 'yyyy-MM-dd') : ''}
                onChange={(event) => {
                    const { value } = event.target;
                    if (isValidDate(value) && value !== '' /* && value !== 'Invalid Date' */) {
                        const localDate = new Date(value);
                        localDate.setHours(0, 1, 0, 0); // Jam 00:01 lokal (awal hari)
                        column.setFilterValue((old: [Date, Date]) => [localDate, old?.[1]]);
                    } else {
                        column.setFilterValue((old: [Date, Date]) => [undefined, old?.[1]]);
                    }
                }}
            />
            <div aria-description="separator">-</div>
            <Input
                className="text-xs py-[2px] px-1 h-fit"
                aria-description="end date"
                title="end date"
                type="date"
                // debounce={200}
                value={endDate ? format(endDate, 'yyyy-MM-dd') : ''}
                onChange={(event) => {
                    const { value } = event.target;
                    if (isValidDate(value) && value !== '' /* && value !== 'Invalid Date' */) {
                        const localDate = new Date(value);
                        localDate.setHours(23, 59, 0, 0); // Jam 23:59:59.999 lokal (akhir hari)
                        column.setFilterValue((old: [Date, Date]) => [old?.[0], localDate]);
                    } else {
                        column.setFilterValue((old: [Date, Date]) => [old?.[0], undefined]);
                    }
                }}
            />
            <Button
                className="h-fit w-fit p-1 text-xs"
                onClick={() => {
                    column.setFilterValue(undefined);
                }}
            >
                reset
            </Button>
        </div>
    );
}

// A debounced input react component
function DebouncedInput({
    value: initialValue,
    onChange,
    debounce = 500,
    ...props
}: {
    value: string | number;
    onChange: (value: string | number) => void;
    debounce?: number;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>) {
    const [value, setValue] = React.useState(initialValue);

    React.useEffect(() => {
        setValue(initialValue);
    }, [initialValue]);

    React.useEffect(() => {
        const timeout = setTimeout(() => {
            onChange(value);
        }, debounce);

        return () => clearTimeout(timeout);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debounce, value]);

    return (
        <input
            {...props}
            value={value}
            onChange={(e) => setValue(e.target.value)}
        />
    );
}
