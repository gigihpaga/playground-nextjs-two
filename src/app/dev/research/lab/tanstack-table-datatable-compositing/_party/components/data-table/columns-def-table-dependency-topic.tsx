import { BoxIcon, PackageCheckIcon } from 'lucide-react';

import { Checkbox } from '@/components/ui/checkbox';
import { type DummyDependencyTopic } from '../../data/types';

import { DataTableColumnHeaderWithFilter, type ColumnDef } from '@/components/ui/custom/data-table';
import { FilterArray } from './by-case/filter-array';

export const columnsDefTableDependencyTopic: ColumnDef<DummyDependencyTopic>[] = [
    {
        id: 'select',
        header: ({ table }) => (
            <Checkbox
                checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
                className="translate-y-[2px]"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
                className="translate-y-[2px]"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },

    {
        id: 'NUM_ROW', // <== disini menggunakan "id" bukan "accessorKey" karena ingin membuat value, bukan mengambil value dari data.original
        header: ({ column }) => (
            <DataTableColumnHeaderWithFilter
                column={column}
                title="No"
            />
        ),
        cell: ({ row, cell, column }) => {
            return (
                <div className="flex space-x-2">
                    <span className="max-w-[500px] truncate font-medium">{row.index + 1}</span>
                </div>
            );
        },
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: 'title',
        header: ({ column }) => (
            <DataTableColumnHeaderWithFilter
                column={column}
                title="Dependency"
            />
        ),
        cell: ({ row }) => {
            return (
                <div className="flex space-x-2">
                    <span className="max-w-[500px] truncate font-medium">{row.getValue('title')}</span>
                </div>
            );
        },
        meta: {
            filterVariant: 'select',
        },
        filterFn: (row, id, value: string[]) => {
            return value.includes(row.getValue(id));
        },
    },
    {
        accessorKey: 'isExist',
        header: ({ column }) => (
            <DataTableColumnHeaderWithFilter
                column={column}
                title="Is exist"
            />
        ),
        cell: ({ row }) => {
            return (
                <div
                    title={row.original.isExist === true ? 'exist' : 'not exist'}
                    className="flex space-x-2"
                >
                    {row.original.isExist === true ? (
                        <PackageCheckIcon className="size-4 m-auto text-green-400" />
                    ) : (
                        <BoxIcon className="size-4 m-auto text-orange-400" />
                    )}
                </div>
            );
        },
        accessorFn: (data) => (data.isExist === true ? 'Exist' : 'Not exist'),
        filterFn: (row, id, value: string[]) => {
            return value.includes(row.getValue(id));
        },
    },

    {
        accessorKey: 'isNew',
        header: ({ column }) => (
            <DataTableColumnHeaderWithFilter
                column={column}
                title="Is New"
            />
        ),
        cell: ({ row }) => {
            return (
                <div className="flex justify-center w-full">
                    {row.original.isNew === true ? <p className=" text-green-400">New</p> : <p className=" text-red-400">Old</p>}
                </div>
            );
        },
        accessorFn: (data) => (data.isNew === true ? 'New' : 'Old'),
        filterFn: (row, id, value: string[]) => {
            return value.includes(row.getValue(id));
        },
    },
    {
        // id: 'topics',
        accessorKey: 'topics',
        header: ({ column }) => (
            <DataTableColumnHeaderWithFilter
                column={column}
                title="Topics"
                // filterComponent={<FilterArray column={column} />}
            />
        ),
        cell: (context) => {
            return (
                <div className="flex space-x-2">
                    <span>{context.getValue<string[]>().length}</span>
                    <span className="max-w-[500px] truncate font-medium">{context.row.original.topics.map((topic) => topic.title).join(', ')}</span>
                </div>
            );
        },
        meta: {
            filterVariant: 'select',
        },
        accessorFn: (data) => data.topics.map((topic) => topic.title),
        filterFn: (row, columnId, filterValue: string[], addMeta) => {
            // console.log(`topics  filter fn ${columnId}`, 'filterValue', filterValue, 'data', row.getValue(columnId));
            /**
             * secara default row.getValue() me-return value berdasarkan "accessorKey"
             * tetapi jika accessorFn di definisikan, maka row.getValue() memiliki nilai yang sama dengan return value function accessorFn()
             */
            return filterValue.some((inc) => row.getValue<string[]>(columnId).some((d) => inc.includes(d)));
            // return row.original.topics.some((topic) => topic.title.includes(filterValue));
        },
        enableColumnFilter: true,
        enableGlobalFilter: true,
        // enableSorting: false,
    },

    // {
    //     id: 'actions',
    //     cell: ({ row }) => <DataTableRowActions row={row} />,
    // },
];
