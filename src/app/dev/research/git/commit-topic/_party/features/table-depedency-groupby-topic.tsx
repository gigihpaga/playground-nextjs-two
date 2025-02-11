'use client';

import React, { useRef } from 'react';
import { BoxIcon, CableIcon, DownloadIcon, PackageCheckIcon, Settings2Icon, UnplugIcon } from 'lucide-react';

import { cn } from '@/lib/classnames';
import { type Dependency } from '../state/commit-topic-collection-slice';

import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { DataTableColumnHeader } from '@/app/dev/tutorial/official-shadcn/tasks/_party/components/data-table-column-header';
import { type ColumnDef, TableBasic } from '../components/data-table/table';
import { type DataDependencyTopicSummary, type DataTopicDependencySummary } from './dialog-list-depedency-topic-grouping';
import { ButtonTips } from '../components/button-tips';
import { Button } from '@/components/ui/button';
import {
    DataTable,
    DataTableViewOptions,
    DataTableView,
    DataTableGlobalFilter,
    DataTablePagination,
    DataTableColumnHeaderWithFilter,
} from '@/components/ui/custom/data-table';

//* Table 1
type TableDepedencyGroupbyTopicProps = {
    /** data is array with nested object */
    // data: { title: string; depedencys: Array<Dependency & { isExist: boolean; isConnected: boolean }> }[];
    data: DataTopicDependencySummary;
};

//* Table 1 - Table View
export function TableDepedencyGroupbyTopic1({ data }: TableDepedencyGroupbyTopicProps) {
    return (
        <Table>
            <TableCaption>A list of depedency in flow.</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[60px]">No</TableHead>
                    <TableHead className="w-[100px]">Title</TableHead>
                    <TableHead className="w-[50px] text-nowrap">is exist</TableHead>
                    <TableHead className="w-[50px] text-nowrap">is connected</TableHead>
                    <TableHead className="w-[50px] text-nowrap">status</TableHead>

                    <TableHead>Dependency</TableHead>
                    {/* <TableHead>Status</TableHead>
                            <TableHead className="w-[80px] text-center">Action</TableHead> */}
                </TableRow>
            </TableHeader>
            <TableBody>
                {data?.map((commit, idxCommit) => (
                    <>
                        <TableRow
                            // className={cn(dependency.isNew && 'text-green-400')}
                            key={`${commit.title}_${idxCommit}`}
                        >
                            <TableCell
                                rowSpan={commit.depedencys.length === 0 ? 1 : commit.depedencys.length + 1}
                                className="font-light py-1 px-[6px] text-nowrap text-xs"
                            >
                                {idxCommit + 1}
                            </TableCell>
                            <TableCell
                                rowSpan={commit.depedencys.length === 0 ? 1 : commit.depedencys.length + 1}
                                className="font-light py-1 px-[6px] text-nowrap text-xs"
                            >
                                {commit.title}
                            </TableCell>
                            {commit.depedencys.length === 0 && (
                                <>
                                    <TableCell className="">
                                        <BoxIcon className="size-4 m-auto text-orange-400" />
                                    </TableCell>
                                    <TableCell className="">
                                        <UnplugIcon className="size-4 m-auto text-red-400" />
                                    </TableCell>

                                    <TableCell className="font-light py-1 px-[6px] text-nowrap text-xs text-orange-400">empty</TableCell>
                                    <TableCell className="font-light py-1 px-[6px] text-nowrap text-xs text-red-400">empty</TableCell>
                                </>
                            )}

                            {/* <TableCell className="font-light py-1 px-[6px]">{dependency.isNew ? 'new' : 'old'}</TableCell>
                                <TableCell className="text-center font-light py-1 px-[6px]">
                                    <ButtonCopy
                                        title="copy title"
                                        className="size-[18px] [&_.btn-copy-icon-wrapper]:size-[10px] [&_svg]:size-[10px] rounded"
                                        data={dependency.title}
                                    />
                                </TableCell> */}
                        </TableRow>
                        {commit.depedencys.length > 0 &&
                            commit.depedencys.map((dependency) => (
                                <TableRow key={`${commit.title}_${dependency.id}_${idxCommit}`}>
                                    <TableCell className="font-light py-1 px-[6px] text-nowrap text-xs">
                                        {dependency.isExist ? (
                                            <PackageCheckIcon className="size-4 m-auto text-green-400" />
                                        ) : (
                                            <BoxIcon className="size-4 m-auto text-orange-400" />
                                        )}
                                    </TableCell>
                                    <TableCell className="font-light py-1 px-[6px] text-nowrap text-xs">
                                        {dependency.isConnected ? (
                                            <CableIcon className="size-4 m-auto text-green-400" />
                                        ) : (
                                            <UnplugIcon className="size-4 m-auto text-red-400" />
                                        )}
                                    </TableCell>
                                    <TableCell
                                        className={cn(
                                            'font-light py-1 px-[6px] text-nowrap text-xs text-orange-400',
                                            dependency.isNew && 'text-green-400'
                                        )}
                                    >
                                        {dependency.isNew ? 'new' : 'old'}
                                    </TableCell>
                                    <TableCell className="font-light py-1 px-[6px] text-nowrap text-xs">{dependency.title}</TableCell>
                                </TableRow>
                            ))}
                    </>
                ))}
            </TableBody>
        </Table>
    );
}

//? Table 3,
type TableDependencyTopicSummaryProps = {
    /** data is array with flat object */
    /* data: Array<Dependency & { isExist: boolean; isConnected: boolean; topicTitle: string }>; */
    data: DataDependencyTopicSummary;
};

//? Table 3 - Column Definitions
const columnsDefTableDependencyTopicSummary: ColumnDef<TableDependencyTopicSummaryProps['data'][number]>[] = [
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
        id: 'NUM_ROW',
        header: ({ column }) => (
            <DataTableColumnHeader
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
                <div className="flex space-x-2">
                    {row.original.isExist ? (
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
                <div className="flex space-x-2">
                    {row.original.isNew ? (
                        <span className="size-4 m-auto text-green-400">New</span>
                    ) : (
                        <span className="size-4 m-auto text-red-400">Old</span>
                    )}
                </div>
            );
        },
        accessorFn: (data) => (data.isNew === true ? 'New' : 'Old'),
        filterFn: (row, id, value: string[]) => {
            return value.includes(row.getValue(id));
        },
    },

    {
        id: 'topics',
        header: ({ column }) => (
            <DataTableColumnHeaderWithFilter
                column={column}
                title="Topics"
            />
        ),
        cell: ({ row }) => {
            return (
                <div className="flex space-x-2">
                    <span className="max-w-[500px] truncate font-medium">{row.original.topics.map((topic) => topic.title).join(', ')}</span>
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
    },

    /* {
        id: 'actions',
        cell: ({ row }) => <DataTableRowActions row={row} />,
    }, */
];

//? Table 3 - Table View
export function TableDependencyTopicSummary({ data }: TableDependencyTopicSummaryProps) {
    const elementAnchorDonwloadRef = useRef<HTMLAnchorElement | null>(null);

    async function handleDownload(e: React.MouseEvent<HTMLButtonElement, MouseEvent>, data: unknown) {
        const { current: anchor } = elementAnchorDonwloadRef;
        if (!anchor) return;

        let urlBlob = '';
        const fileName = `DataTableDependencyTopicSummary - ${new Date().toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'medium', hour12: false })}.json`;

        anchor.onclick = (ev) => {
            e.preventDefault();
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            urlBlob = window.URL.createObjectURL(blob);

            anchor.href = urlBlob;
            anchor.download = fileName;
        };

        anchor.click();
        window.URL.revokeObjectURL(urlBlob);
        anchor.href = 'yourblob';
        anchor.download = 'filename.json';
    }

    return (
        <div className="h-full flex flex-col">
            <div className="flex gap-2"></div>
            <div className="flex-1 _h-full overflow-y-auto p-2 rounded-md [&>*]:overflow-visible">
                {/* <TableBasic
                    data={data}
                    columns={columnsDefTableDependencyTopicSummary}
                /> */}
                <DataTable
                    columns={columnsDefTableDependencyTopicSummary}
                    data={data}
                    className=""
                    aria-description="table container"
                    tableOptios={{ enablePagination: true, debugMode: false }}
                >
                    <DataTable.SectionToolBar<TableDependencyTopicSummaryProps['data'][number], unknown>
                        className=""
                        aria-description="table toolbar"
                        renderFn={({ columns, data, tableInstance }) => (
                            <>
                                <DataTableGlobalFilter table={tableInstance} />
                                <div className="flex gap-2">
                                    <ButtonTips
                                        content={{ title: 'About data', description: 'data in this table is one dependencies to many topics' }}
                                    />
                                    <Button
                                        size="icon"
                                        variant="outline"
                                        className="size-6"
                                        title="download data taable dependency topic summary"
                                        onClick={(event) => handleDownload(event, data)}
                                    >
                                        <DownloadIcon className="size-4" />
                                    </Button>
                                    {/* eslint-disable-next-line jsx-a11y/anchor-is-valid, jsx-a11y/anchor-has-content */}
                                    <a
                                        ref={elementAnchorDonwloadRef}
                                        href=""
                                        download=""
                                        target="_blank"
                                        className="sr-only"
                                        rel="noopener noreferrer"
                                    />
                                    <DataTableViewOptions
                                        trigger={
                                            <Button
                                                size="icon"
                                                variant="outline"
                                                className="size-6"
                                                title="view columns"
                                            >
                                                <Settings2Icon className="size-4" />
                                            </Button>
                                        }
                                        table={tableInstance}
                                    />
                                </div>
                            </>
                        )}
                    />
                    <DataTable.SectionContent<TableDependencyTopicSummaryProps['data'][number], unknown>
                        className=""
                        aria-description="table wrapper"
                        renderFn={({ columns, tableInstance }) => (
                            <DataTableView
                                className=""
                                table={tableInstance}
                                columns={columns}
                            />
                        )}
                    />
                    <DataTable.SectionPagination<TableDependencyTopicSummaryProps['data'][number], unknown>
                        className=""
                        aria-description="table pagination"
                        renderFn={({ columns, data, tableInstance }) => (
                            //
                            <DataTablePagination table={tableInstance} />
                        )}
                    />
                </DataTable>
            </div>
        </div>
    );
}

//* Table 2
type TableTopicDependencySummaryProps = {
    /** data is array with flat object */
    /* data: Array<Dependency & { isExist: boolean; isConnected: boolean; topicTitle: string }>; */
    data: DataTopicDependencySummary;
};

//* Table 2 - Column Definitions
const columnsDefTableTopicDependencySummary: ColumnDef<ReturnType<typeof flattenTopicDependencySummary>[number]>[] = [
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
    // {
    //     accessorKey: 'id',
    //     header: ({ column }) => (
    //         <DataTableColumnHeader
    //             column={column}
    //             title="Task"
    //         />
    //     ),
    //     cell: ({ row }) => <div className="w-[80px]">{row.getValue('id')}</div>,
    //     enableSorting: false,
    //     enableHiding: false,
    // },

    {
        id: 'number_row',
        header: ({ column }) => (
            <DataTableColumnHeader
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
            <DataTableColumnHeader
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
        // accessorFn: (a) => a.title,
    },
    {
        accessorKey: 'isExist',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title="Is exist"
            />
        ),
        cell: ({ row }) => {
            return (
                <div className="flex space-x-2">
                    {row.original.isExist ? (
                        <PackageCheckIcon className="size-4 m-auto text-green-400" />
                    ) : (
                        <BoxIcon className="size-4 m-auto text-orange-400" />
                    )}
                </div>
            );
        },
    },

    {
        accessorKey: 'isNew',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title="Is New"
            />
        ),
        cell: ({ row }) => {
            return (
                <div className="flex space-x-2">
                    {row.original.isNew ? (
                        <span className="size-4 m-auto text-green-400">New</span>
                    ) : (
                        <span className="size-4 m-auto text-red-400">Old</span>
                    )}
                </div>
            );
        },
    },
    {
        accessorKey: 'isConnected',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title="Is Connected"
            />
        ),
        cell: ({ row }) => {
            return (
                <div className="flex space-x-2">
                    {row.original.isConnected ? (
                        <CableIcon className="size-4 m-auto text-green-400" />
                    ) : (
                        <UnplugIcon className="size-4 m-auto text-red-400" />
                    )}
                </div>
            );
        },
    },
    {
        accessorKey: 'topicTitle',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title="Topic"
            />
        ),
        cell: ({ row }) => {
            return (
                <div className="flex space-x-2">
                    <span className="max-w-[500px] truncate font-medium">{row.original.topicTitle}</span>
                </div>
            );
        },
    },

    // {
    //     id: 'actions',
    //     cell: ({ row }) => <DataTableRowActions row={row} />,
    // },
];

//* Table 2 - Table View
export function TableTopicDependencySummary({ data }: TableTopicDependencySummaryProps) {
    const dataFlat = flattenTopicDependencySummary(data);

    return (
        <div className="h-full flex flex-col">
            <div>
                tolbal
                <ButtonTips content={{ title: 'About data', description: 'data in this table is many dependencies to many topics' }} />
            </div>
            <div className="flex-1 _h-full overflow-y-auto p-2 rounded-md [&>*]:overflow-visible">
                <TableBasic
                    data={dataFlat}
                    columns={columnsDefTableTopicDependencySummary}
                />
            </div>
        </div>
    );
}

//! Helpers
function flattenTopicDependencySummary(data: TableTopicDependencySummaryProps['data']) {
    type ReturnFlattenDepedencyGroupbyTopic = Dependency & { isExist: boolean; isConnected: boolean; topicTitle: string };

    const dataFlat = data.reduce((acc, currTopic) => {
        currTopic.depedencys.forEach((dependency) => {
            const obj = {
                topicTitle: currTopic.title,
                ...dependency,
            } satisfies ReturnFlattenDepedencyGroupbyTopic;

            acc.push(obj);
        });
        return acc;
    }, [] as ReturnFlattenDepedencyGroupbyTopic[]);

    return dataFlat;
}
