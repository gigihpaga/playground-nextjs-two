'use client';

import React, { PropsWithChildren } from 'react';

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
    type Row,
    type RowData,
    type ColumnDef,
    type ColumnFiltersState,
    type SortingState,
    type VisibilityState,
    type Table as DataTableInstance,
    TableOptions,
} from '@tanstack/react-table';

import { cn } from '@/lib/classnames';

type DataTableContextType<TData, TValue> = {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    tableInstance: DataTableInstance<TData>;
};

// Create a context for the compound component
const DataTableContext = React.createContext<DataTableContextType<any, any> | null>(null);

// Create a custom hook to access the context
function useDataTableContext<TData extends RowData, TValue>() {
    const context = React.useContext(DataTableContext) as DataTableContextType<TData, TValue> | null;

    if (!context) {
        throw new Error('Toggle compound components must be rendered within the Toggle component');
    }
    return context;
}

type DataTableProps<TData extends RowData, TValue> = {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    tableOptios?: {
        /** default true */
        enablePagination?: boolean;
        /** default false */
        debugMode?: boolean;
    } & Omit<TableOptions<TData>, 'data' | 'columns' | 'state' | 'getCoreRowModel' | 'getPaginationRowModel'>;
} & React.HTMLAttributes<HTMLDivElement>;

// const HHH: Omit<TableOptions<{ name: string }>, 'data' | 'columns' | 'state' | 'getCoreRowModel'> = {};

// Compound component
function DataTable<TData extends RowData, TValue>(_props: DataTableProps<TData, TValue>) {
    const { data, columns, children, className, tableOptios = { debugMode: false }, ...props } = _props;
    const { ...restTableOptios } = tableOptios;

    const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [globalFilter, setGlobalFilter] = React.useState<string>('');

    const table = useReactTable({
        data: data,
        columns: columns,
        state: {
            globalFilter: globalFilter,
            sorting: sorting,
            columnVisibility: columnVisibility,
            rowSelection: rowSelection,
            columnFilters: columnFilters,
        },
        enableRowSelection: true,
        onRowSelectionChange: setRowSelection,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: tableOptios?.enablePagination === true ? getPaginationRowModel() : undefined,
        getSortedRowModel: getSortedRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
        debugTable: tableOptios?.debugMode,
        debugHeaders: tableOptios?.debugMode,
        debugColumns: tableOptios?.debugMode,
        ...restTableOptios,
    });

    // Provide the context value to the children components
    const contextValue = { data, columns, tableInstance: table };

    return (
        <DataTableContext.Provider value={contextValue}>
            <div
                className={cn('h-full flex flex-col gap-y-2', className)}
                {...props}
            >
                {children}
                {tableOptios?.debugMode === true ? (
                    <pre>
                        row
                        {JSON.stringify(rowSelection, null, 2)}
                        visibility
                        {JSON.stringify(columnVisibility, null, 2)}
                        filter
                        {JSON.stringify(columnFilters, null, 2)}
                        sorting
                        {JSON.stringify(sorting, null, 2)}
                        globalFilter
                        {JSON.stringify(globalFilter, null, 2)}
                    </pre>
                ) : null}
            </div>
        </DataTableContext.Provider>
    );
}

type SectionToolBarProps<TData extends RowData, TValue> = {
    renderFn: (context: { columns: ColumnDef<TData, TValue>[]; data: TData[]; tableInstance: DataTableInstance<TData> }) => React.ReactNode;
} & Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>;

// Child components
function SectionToolBar<TData extends RowData, TValue>({ renderFn, className, ...props }: SectionToolBarProps<TData, TValue>) {
    const { tableInstance, columns, data } = useDataTableContext<TData, TValue>();
    return (
        <div
            className={cn('flex items-center justify-between', className)}
            {...props}
        >
            {renderFn({ tableInstance, columns, data })}
        </div>
    );
}

type SectionPaginationProps<TData extends RowData, TValue> = {
    renderFn: (context: { columns: ColumnDef<TData, TValue>[]; data: TData[]; tableInstance: DataTableInstance<TData> }) => React.ReactNode;
} & Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>;

// Child components
function SectionPagination<TData extends RowData, TValue>({ renderFn, className, ...props }: SectionPaginationProps<TData, TValue>) {
    const { tableInstance, columns, data } = useDataTableContext<TData, TValue>();
    return (
        <div
            className={cn('', className)}
            {...props}
        >
            {renderFn({ tableInstance, columns, data })}
        </div>
    );
}

type SectionContentProps<TData extends RowData, TValue> = {
    renderFn: (context: { columns: ColumnDef<TData, TValue>[]; data: TData[]; tableInstance: DataTableInstance<TData> }) => React.ReactNode;
} & Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>;

// Child components
function SectionContent<TData extends RowData, TValue>({ renderFn, className, ...props }: SectionContentProps<TData, TValue>) {
    const { tableInstance, columns, data } = useDataTableContext<TData, TValue>();
    return (
        <div
            className={cn('flex-1 overflow-auto border rounded-md [&>*]:overflow-visible', className)}
            {...props}
        >
            {renderFn({ tableInstance, columns, data })}
        </div>
    );
}

DataTable.SectionToolBar = SectionToolBar;
DataTable.SectionPagination = SectionPagination;
DataTable.SectionContent = SectionContent;

export {
    // own
    DataTable,
    type DataTableProps,
    type SectionToolBarProps,
    type SectionPaginationProps,
    type SectionContentProps,
    // deps
    flexRender,
    type Row,
    type ColumnDef,
    type DataTableInstance,
};
