'use client';

import React, { useEffect } from 'react';
import {
    flexRender,
    getCoreRowModel,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
    type RowSelectionState,
    type RowData,
    type ColumnDef,
    type ColumnFiltersState,
    type SortingState,
    type VisibilityState,
    type Table as TableInstance,
} from '@tanstack/react-table';

import { DataTableRowActions } from '@/app/dev/tutorial/official-shadcn/tasks/_party/components/data-table-row-actions';
import { DataTableView } from '@/components/ui/custom/data-table';

type TableBasicProps<TData, TValue> = {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
};

export function TableWithOutCompound<TData, TValue>({ columns, data }: TableBasicProps<TData, TValue>) {
    const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [sorting, setSorting] = React.useState<SortingState>([]);

    const table = useReactTable({
        data: data,
        columns: columns,
        state: {
            sorting,
            columnVisibility,
            rowSelection,
            columnFilters,
        },
        enableRowSelection: true,
        onRowSelectionChange: setRowSelection,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        // getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
        debugTable: true,
        debugHeaders: true,
        debugColumns: true,
    });

    // console.log('TableBasic', table.getRowModel());

    return (
        <div
            aria-description="table container"
            className="h-full flex flex-col gap-y-2"
        >
            <div>
                <p className="text-xs text-muted-foreground">Result count: {table.getFilteredRowModel().rows.length}</p>
            </div>
            <div className="flex-1 overflow-auto border rounded-md [&>*]:overflow-visible">
                <DataTableView
                    columns={columns}
                    table={table}
                />
            </div>
            <div>bottombar</div>
            {/*  <pre>
                row
                {JSON.stringify(rowSelection, null, 2)}
                visibility
                {JSON.stringify(columnVisibility, null, 2)}
                filter
                {JSON.stringify(columnFilters, null, 2)}
                sorting
                {JSON.stringify(sorting, null, 2)}
            </pre> */}
        </div>
    );
}
