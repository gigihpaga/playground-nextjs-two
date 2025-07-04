import React, { ReactElement, ReactNode } from 'react';
import { flexRender, type Row, type Column, type Table as DataTableInstance, type ColumnDef } from '@tanstack/react-table';
import {
    ArrowDown,
    ArrowUp,
    ChevronsUpDown,
    EyeOff,
    Settings2,
    MoreHorizontal,
    Check,
    PlusCircle,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    X,
} from 'lucide-react';

import { cn } from '@/lib/classnames';
import { Button, type ButtonProps } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from '@/components/ui/command';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
    DropdownMenuCheckboxItem,
    DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';

import { Filter } from '@/app/dev/tutorial/official-tanstack-table/example-table-filters-faceted/_party/app';
// import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';

import { labels } from '@/app/dev/tutorial/official-shadcn/tasks/_party/data/data';
import { taskSchema } from '@/app/dev/tutorial/official-shadcn/tasks/_party/data/schema';
import { priorities, statuses } from '@/app/dev/tutorial/official-shadcn/tasks/_party/data//data';

export interface DataTableColumnHeaderProps<TData, TValue> extends React.HTMLAttributes<HTMLDivElement> {
    column: Column<TData, TValue>;
    title: string;
}

/**
 * colum header, this component use in colum definition
 * @param param0 
 * @returns 
 * 
 * @example
 * const tableDependencyTopicColumns: ColumnDef<DummyDependencyTopic>[] = [
        {
            accessorKey: 'title',
            header: ({ column }) => (
                <DataTableColumnHeader
                    column={column}
                    title="Dependency"
                />
            ),
        }
 * ]
 */
export function DataTableColumnHeader<TData, TValue>({ column, title, className }: DataTableColumnHeaderProps<TData, TValue>) {
    console.log(`DataTableColumnHeader ${title}`, column.getCanSort());
    if (!column.getCanSort()) {
        // return <div className={cn(className)}>{title}</div>;
        return (
            <div className={cn('h-full py-1', className)}>
                <div className="h-full flex items-center justify-center  border border-dashed rounded-md">{title}</div>
            </div>
        );
    }

    return (
        <div className={cn('flex items-center space-x-2', className)}>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="_-ml-3 px-1 w-full _justify-start justify-between h-8 data-[state=open]:bg-accent [&_svg]:size-4 [&_svg]:shrink-0 space-x-2 gap-2"
                    >
                        <span>{title}</span>
                        {column.getIsSorted() === 'desc' ? <ArrowDown /> : column.getIsSorted() === 'asc' ? <ArrowUp /> : <ChevronsUpDown />}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                    <DropdownMenuItem
                        className="gap-2"
                        onClick={() => column.toggleSorting(false)}
                    >
                        <ArrowUp className="h-3.5 w-3.5 text-muted-foreground/70" />
                        Asc
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        className="gap-2"
                        onClick={() => column.clearSorting()}
                    >
                        <ChevronsUpDown className="h-3.5 w-3.5 text-muted-foreground/70" />
                        None
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        className="gap-2"
                        onClick={() => column.toggleSorting(true)}
                    >
                        <ArrowDown className="h-3.5 w-3.5 text-muted-foreground/70" />
                        Desc
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        className="gap-2"
                        onClick={() => column.toggleVisibility(false)}
                    >
                        <EyeOff className="h-3.5 w-3.5 text-muted-foreground/70" />
                        Hide
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}

type DataTableColumnHeaderWithFilterProps<TData, TValue> = DataTableColumnHeaderProps<TData, TValue> & {
    filterComponent?: (args: {
        column: DataTableColumnHeaderProps<TData, TValue>['column'];
        title: DataTableColumnHeaderProps<TData, TValue>['title'];
    }) => React.ReactElement;
};

export function DataTableColumnHeaderWithFilter<TData, TValue>({
    column,
    title,
    className,
    filterComponent,
}: DataTableColumnHeaderWithFilterProps<TData, TValue>) {
    // console.log(`DataTableColumnHeaderWithFilter ${column.id}`, column.getFilterValue());

    if (!column.getCanSort()) {
        return (
            <div className={cn('h-full py-1', className)}>
                <div className="h-full flex items-center justify-center  border border-dashed rounded-md">{title}</div>
            </div>
        );
    }

    return (
        <div className={cn('h-full py-1', className)}>
            <div className="flex flex-col items-center gap-y-[2px] border border-dashed rounded-md">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="_-ml-3 px-1 w-full _justify-start justify-between h-8 data-[state=open]:bg-accent [&_svg]:size-4 [&_svg]:shrink-0 space-x-2 gap-2"
                        >
                            <span>{title}</span>
                            {column.getIsSorted() === 'desc' ? <ArrowDown /> : column.getIsSorted() === 'asc' ? <ArrowUp /> : <ChevronsUpDown />}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                        <DropdownMenuItem
                            className="gap-2"
                            onClick={() => column.toggleSorting(false)}
                        >
                            <ArrowUp className="h-3.5 w-3.5 text-muted-foreground/70" />
                            Asc
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className="gap-2"
                            onClick={() => column.clearSorting()}
                        >
                            <ChevronsUpDown className="h-3.5 w-3.5 text-muted-foreground/70" />
                            None
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className="gap-2"
                            onClick={() => column.toggleSorting(true)}
                        >
                            <ArrowDown className="h-3.5 w-3.5 text-muted-foreground/70" />
                            Desc
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            className="gap-2"
                            onClick={() => column.toggleVisibility(false)}
                        >
                            <EyeOff className="h-3.5 w-3.5 text-muted-foreground/70" />
                            Hide
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                {/* {column.getCanFilter() && <Filter column={column} />} */}
                {column.getCanFilter() ? (
                    filterComponent instanceof Function ? (
                        filterComponent({ column: column, title: title })
                    ) : (
                        // <Filter column={column} />
                        <DataTableFacetedFilter
                            title={title}
                            column={column}
                        />
                    )
                ) : null}
            </div>
        </div>
    );
}

interface _DataTableFacetedFilterProps<TData, TValue> {
    column?: Column<TData, TValue>;
    title?: string;
    options: {
        label: string;
        value: string;
        icon?: React.ComponentType<{ className?: string }>;
    }[];
}

function _DataTableFacetedFilter<TData, TValue>({ column, title, options }: _DataTableFacetedFilterProps<TData, TValue>) {
    const facets = column?.getFacetedUniqueValues();
    const selectedValues = new Set(column?.getFilterValue() as string[]);

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className="h-8 border-dashed [&_svg]:size-4 [&_svg]:shrink-0 space-x-2 gap-2"
                >
                    <PlusCircle />
                    {title}
                    {selectedValues?.size > 0 && (
                        <>
                            <Separator
                                orientation="vertical"
                                className="mx-2 h-4"
                            />
                            <Badge
                                variant="secondary"
                                className="rounded-sm px-1 font-normal lg:hidden"
                            >
                                {selectedValues.size}
                            </Badge>
                            <div className="hidden space-x-1 lg:flex">
                                {selectedValues.size > 2 ? (
                                    <Badge
                                        variant="secondary"
                                        className="rounded-sm px-1 font-normal"
                                    >
                                        {selectedValues.size} selected
                                    </Badge>
                                ) : (
                                    options
                                        .filter((option) => selectedValues.has(option.value))
                                        .map((option) => (
                                            <Badge
                                                variant="secondary"
                                                key={option.value}
                                                className="rounded-sm px-1 font-normal"
                                            >
                                                {option.label}
                                            </Badge>
                                        ))
                                )}
                            </div>
                        </>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent
                className="w-[200px] p-0"
                align="start"
            >
                <Command>
                    <CommandInput placeholder={title} />
                    <CommandList>
                        <CommandEmpty>No results found.</CommandEmpty>
                        <CommandGroup>
                            {options.map((option) => {
                                const isSelected = selectedValues.has(option.value);
                                return (
                                    <CommandItem
                                        key={option.value}
                                        onSelect={() => {
                                            if (isSelected) {
                                                selectedValues.delete(option.value);
                                            } else {
                                                selectedValues.add(option.value);
                                            }
                                            const filterValues = Array.from(selectedValues);
                                            column?.setFilterValue(filterValues.length ? filterValues : undefined);
                                        }}
                                    >
                                        <div
                                            className={cn(
                                                'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                                                isSelected ? 'bg-primary text-primary-foreground' : 'opacity-50 [&_svg]:invisible'
                                            )}
                                        >
                                            <Check />
                                        </div>
                                        {option.icon && <option.icon className="mr-2 h-4 w-4 text-muted-foreground" />}
                                        <span>{option.label}</span>
                                        {facets?.get(option.value) && (
                                            <span className="ml-auto flex h-4 w-4 items-center justify-center font-mono text-xs">
                                                {facets.get(option.value)}
                                            </span>
                                        )}
                                    </CommandItem>
                                );
                            })}
                        </CommandGroup>
                        {selectedValues.size > 0 && (
                            <>
                                <CommandSeparator />
                                <CommandGroup>
                                    <CommandItem
                                        onSelect={() => column?.setFilterValue(undefined)}
                                        className="justify-center text-center"
                                    >
                                        Clear filters
                                    </CommandItem>
                                </CommandGroup>
                            </>
                        )}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}

export interface DataTableFacetedFilterProps<TData, TValue> {
    column: Column<TData, TValue>;
    title?: string;
}

export function DataTableFacetedFilter<TData, TValue>({ column, title }: DataTableFacetedFilterProps<TData, TValue>) {
    const facets = column.getFacetedUniqueValues();

    const options = React.useMemo(() => {
        const facetKeys = Array.from(facets.keys()) as unknown[] | unknown[][];
        const firstFacetKey = facetKeys[0];
        if (Array.isArray(firstFacetKey)) {
            return Array.from(new Set(facetKeys.flat()).values()) as string[];
        } else {
            return facetKeys as /* (string|undefined)[] */ string[];
        }
    }, [facets]);

    const selectedValues = new Set(column?.getFilterValue() as string[]);
    title = title || column.id;

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    // className="text-left justify-start h-8 border-dashed [&_svg]:size-4 [&_svg]:shrink-0 space-x-2 gap-2 w-full"
                    className="px-1 w-full justify-start h-8 rounded-se-none rounded-ss-none border-t border-dashed [&_svg]:size-4 [&_svg]:shrink-0 space-x-1 gap-1"
                >
                    <PlusCircle />
                    {title}
                    {selectedValues?.size > 0 && (
                        <>
                            <Separator
                                orientation="vertical"
                                className="mx-2 h-4"
                            />
                            <Badge
                                variant="secondary"
                                className="rounded-sm px-1 font-normal lg:hidden"
                            >
                                {selectedValues.size}
                            </Badge>
                            <div className="hidden space-x-1 lg:flex">
                                {selectedValues.size > 2 ? (
                                    <Badge
                                        variant="secondary"
                                        className="rounded-sm px-1 font-normal"
                                    >
                                        {selectedValues.size} selected
                                    </Badge>
                                ) : (
                                    options
                                        .filter((option) => selectedValues.has(option))
                                        .map((option) => (
                                            <Badge
                                                variant="secondary"
                                                key={option}
                                                className="rounded-sm px-1 font-normal"
                                            >
                                                {option.toString()}
                                            </Badge>
                                        ))
                                )}
                            </div>
                        </>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent
                className="w-[200px] p-0"
                align="start"
            >
                <Command>
                    <CommandInput placeholder={title} />
                    <CommandList>
                        <CommandEmpty>No results found.</CommandEmpty>
                        {selectedValues.size > 0 && (
                            <>
                                <CommandGroup>
                                    <CommandItem
                                        onSelect={() => column?.setFilterValue(undefined)}
                                        className="justify-center text-center"
                                    >
                                        Clear filters
                                    </CommandItem>
                                </CommandGroup>
                            </>
                        )}
                        <CommandSeparator />
                        <CommandGroup>
                            {options.map((option) => {
                                const isSelected = selectedValues.has(option);
                                return (
                                    <CommandItem
                                        key={String(option)}
                                        onSelect={() => {
                                            if (isSelected) {
                                                selectedValues.delete(option);
                                            } else {
                                                selectedValues.add(option);
                                            }
                                            const filterValues = Array.from(selectedValues);
                                            column?.setFilterValue(filterValues.length ? filterValues : undefined);
                                        }}
                                    >
                                        <div
                                            className={cn(
                                                'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                                                isSelected ? 'bg-primary text-primary-foreground' : 'opacity-50 [&_svg]:invisible'
                                            )}
                                        >
                                            <Check />
                                        </div>
                                        {/* {option.icon && <option.icon className="mr-2 h-4 w-4 text-muted-foreground" />} */}
                                        <span>{/* option.toString() */ String(option)}</span>
                                        {facets?.get(option) && (
                                            <span className="ml-auto flex h-4 w-4 items-center justify-center font-mono text-xs">
                                                {facets.get(option)}
                                            </span>
                                        )}
                                    </CommandItem>
                                );
                            })}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}

export interface DataTablePaginationProps<TData> {
    table: DataTableInstance<TData>;
}

export function DataTablePagination<TData>({ table }: DataTablePaginationProps<TData>) {
    return (
        <div className="flex items-center justify-between px-2">
            <div className="flex-1 text-sm text-muted-foreground">
                {table.getFilteredSelectedRowModel().rows.length}&nbsp;selected&nbsp;{table.getFilteredRowModel().rows.length}&nbsp;result of&nbsp;
                {table.options.data.length}&nbsp;rows
            </div>
            <div className="flex items-center space-x-6 lg:space-x-8">
                <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium">Rows per page</p>
                    <Select
                        value={`${table.getState().pagination.pageSize}`}
                        onValueChange={(value) => {
                            table.setPageSize(Number(value));
                        }}
                    >
                        <SelectTrigger className="h-8 w-[70px]">
                            <SelectValue placeholder={table.getState().pagination.pageSize} />
                        </SelectTrigger>
                        <SelectContent side="top">
                            <SelectItem
                                key={`all-${table.options.data.length}`}
                                value={`${table.options.data.length}`}
                            >
                                All
                            </SelectItem>
                            {[10, 20, 30, 40, 50].map((pageSize) => (
                                <SelectItem
                                    key={pageSize}
                                    value={`${pageSize}`}
                                >
                                    {pageSize}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                    Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                </div>
                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        className="hidden h-8 w-8 p-0 lg:flex"
                        onClick={() => table.setPageIndex(0)}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <span className="sr-only">Go to first page</span>
                        <ChevronsLeft />
                    </Button>
                    <Button
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <span className="sr-only">Go to previous page</span>
                        <ChevronLeft />
                    </Button>
                    <Button
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        <span className="sr-only">Go to next page</span>
                        <ChevronRight />
                    </Button>
                    <Button
                        variant="outline"
                        className="hidden h-8 w-8 p-0 lg:flex"
                        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                        disabled={!table.getCanNextPage()}
                    >
                        <span className="sr-only">Go to last page</span>
                        <ChevronsRight />
                    </Button>
                </div>
            </div>
        </div>
    );
}

export interface DataTableRowActionsProps<TData> {
    row: Row<TData>;
}

export function DataTableRowActions<TData>({ row }: DataTableRowActionsProps<TData>) {
    // const task = taskSchema.parse(row.original);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
                >
                    <MoreHorizontal />
                    <span className="sr-only">Open menu</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="end"
                className="w-[160px]"
            >
                <DropdownMenuItem>Edit</DropdownMenuItem>
                <DropdownMenuItem>Make a copy</DropdownMenuItem>
                <DropdownMenuItem>Favorite</DropdownMenuItem>
                {/*//TODO: make this dynamic   */}
                {/* <DropdownMenuSub>
                <DropdownMenuSeparator />
                    <DropdownMenuSubTrigger>Labels</DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                        <DropdownMenuRadioGroup value={task.label}>
                            {labels.map((label) => (
                                <DropdownMenuRadioItem
                                    key={label.value}
                                    value={label.value}
                                >
                                    {label.label}
                                </DropdownMenuRadioItem>
                            ))}
                        </DropdownMenuRadioGroup>
                    </DropdownMenuSubContent>
                </DropdownMenuSub> */}
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                    Delete
                    <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

interface DataTableToolbarProps<TData> {
    table: DataTableInstance<TData>;
}

function DataTableToolbar<TData>({ table }: DataTableToolbarProps<TData>) {
    const isFiltered = table.getState().columnFilters.length > 0;

    return (
        <div className="flex items-center justify-between">
            <div className="flex flex-1 items-center space-x-2">
                <Input
                    placeholder="Filter tasks..."
                    value={(table.getColumn('title')?.getFilterValue() as string) ?? ''}
                    onChange={(event) => table.getColumn('title')?.setFilterValue(event.target.value)}
                    className="h-8 w-[150px] lg:w-[250px]"
                />
                {/*//TODO: make this dynamic   */}
                {/* {table.getColumn('status') && (
                    <DataTableFacetedFilter
                        column={table.getColumn('status')}
                        title="Status"
                        options={statuses}
                    />
                )}
                {table.getColumn('priority') && (
                    <DataTableFacetedFilter
                        column={table.getColumn('priority')}
                        title="Priority"
                        options={priorities}
                    />
                )} */}
                {isFiltered && (
                    <Button
                        variant="ghost"
                        onClick={() => table.resetColumnFilters()}
                        className="h-8 px-2 lg:px-3 [&_svg]:size-4 [&_svg]:shrink-0 space-x-2 gap-2"
                    >
                        Reset
                        <X />
                    </Button>
                )}
            </div>
            <DataTableViewOptions table={table} />
        </div>
    );
}

export interface DataTableViewOptionsProps<TData> {
    table: DataTableInstance<TData>;
    trigger?: React.ReactElement;
}

function DataTableViewOptionsTriggerDdefault({ className, variant = 'outline', size = 'sm', ...props }: ButtonProps) {
    return (
        <Button
            variant={variant}
            size={size}
            className={cn('ml-auto h-8 [&_svg]:size-4 [&_svg]:shrink-0 space-x-2 gap-2', className)}
            {...props}
        >
            <Settings2 />
            View
        </Button>
    );
}

export function DataTableViewOptions<TData>({ table, trigger }: DataTableViewOptionsProps<TData>) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>{trigger ? trigger : <DataTableViewOptionsTriggerDdefault />}</DropdownMenuTrigger>
            <DropdownMenuContent
                align="end"
                className="w-[150px]"
            >
                <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {table
                    .getAllColumns()
                    .filter((column) => typeof column.accessorFn !== 'undefined' && column.getCanHide())
                    .map((column) => {
                        return (
                            <DropdownMenuCheckboxItem
                                key={column.id}
                                className="capitalize"
                                checked={column.getIsVisible()}
                                onCheckedChange={(value) => column.toggleVisibility(!!value)}
                            >
                                {column.id}
                            </DropdownMenuCheckboxItem>
                        );
                    })}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export interface DataTableViewProps<TData, TValue> extends React.HTMLAttributes<HTMLTableElement> {
    table: DataTableInstance<TData>;
    columns: ColumnDef<TData, TValue>[];
    /** default false */
    footer?: boolean;
}

export function DataTableView<TData, TValue>({ table, columns, className, footer = false, ...props }: DataTableViewProps<TData, TValue>) {
    // [&_thead]:sticky [&_thead]:top-0 [&_thead]:bg-background [&_thead]:z-[1] [&_thead_tr:hover]:bg-inherit
    return (
        <Table
            className={cn('', className)}
            {...props}
        >
            <TableHeader className="sticky top-0 bg-background z-[1]">
                {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow
                        className="hover:bg-inherit"
                        key={headerGroup.id}
                    >
                        {headerGroup.headers.map((header) => {
                            return (
                                <TableHead
                                    className="px-1"
                                    key={header.id}
                                    colSpan={header.colSpan}
                                >
                                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                </TableHead>
                            );
                        })}
                    </TableRow>
                ))}
            </TableHeader>
            <TableBody>
                {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                        <TableRow
                            key={row.id}
                            data-state={row.getIsSelected() && 'selected'}
                        >
                            {row.getVisibleCells().map((cell) => (
                                <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                            ))}
                        </TableRow>
                    ))
                ) : (
                    <TableRow>
                        <TableCell
                            colSpan={columns.length}
                            className="h-24 text-center"
                        >
                            No results.
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
            {footer === true ? (
                <TableFooter>
                    {table.getFooterGroups().map((footerGroup) => (
                        <TableRow key={footerGroup.id}>
                            {footerGroup.headers.map((header) => (
                                <TableHead
                                    key={header.id}
                                    colSpan={header.colSpan}
                                >
                                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.footer, header.getContext())}
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableFooter>
            ) : null}
        </Table>
    );
}

export type DataTableGlobalFilterProps<TData> = {
    table: DataTableInstance<TData>;
} & React.HTMLAttributes<HTMLDivElement>;

export function DataTableGlobalFilter<TData>({ table, children, className, ...props }: DataTableGlobalFilterProps<TData>) {
    const isFiltered = table.getState().columnFilters.length > 0;
    return (
        <div
            className={cn('flex flex-1 items-center space-x-2', className)}
            {...props}
        >
            <Input
                placeholder="Filter..."
                onChange={(event) => table.setGlobalFilter(event.target.value)}
                className="h-8 w-[150px] lg:w-[250px]"
            />
            {children}
            {isFiltered && (
                <Button
                    variant="ghost"
                    onClick={() => table.resetColumnFilters()}
                    className="h-8 px-2 lg:px-3 [&_svg]:size-4 [&_svg]:shrink-0 space-x-2 gap-2"
                >
                    Reset
                    <X />
                </Button>
            )}
        </div>
    );
}
