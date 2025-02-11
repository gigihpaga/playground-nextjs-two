'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { useReactFlow, type Edge } from '@xyflow/react';

import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { getAllDependencys, getAllTopics, type Topic, type Dependency } from '../state/commit-topic-collection-slice';

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TableDependencyTopicSummary, TableTopicDependencySummary } from './table-depedency-groupby-topic';
import { useServerActionQuery } from '@/hooks/use-server-action-query';
import { Button } from '@/components/ui/button';
import { getDependencyPackageJson } from '../action/dependency-package-json';
import {
    DataTable,
    DataTableViewOptions,
    DataTableView,
    DataTableGlobalFilter,
    DataTablePagination,
    DataTableColumnHeaderWithFilter,
    type ColumnDef,
    DataTableColumnHeader,
} from '@/components/ui/custom/data-table';
import { Checkbox } from '@/components/ui/checkbox';
import { BoxIcon, DownloadIcon, PackageCheckIcon, Settings2Icon } from 'lucide-react';
import { ButtonTips } from '../components/button-tips';

type DialogListDepedencyPackageJsonProps = {
    trigger: ReactNode;
};

export function DialogListDepedencyPackageJson({ trigger }: DialogListDepedencyPackageJsonProps) {
    const [open, setOpen] = useState<boolean>(false);

    function handleOpenChange(state: boolean) {
        setOpen(state);
    }

    return (
        <Dialog
            open={open}
            onOpenChange={handleOpenChange}
        >
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className="flex flex-col _sm:max-w-[425px] h-[90vh] max-h-[90vh] max-w-[90vw] overflow-hidden gap-1">
                <DialogHeader>
                    <DialogTitle className="flex gap-2">List depedency package json</DialogTitle>
                    <DialogDescription>
                        List depedency in file package json. this dependency in current pacakage json compare with last commit of package json
                    </DialogDescription>
                </DialogHeader>
                <TableDependencyPackageJsonRender dialogStateIsOpen={open} />
            </DialogContent>
        </Dialog>
    );
}

function TableDependencyPackageJsonRender({ dialogStateIsOpen }: { dialogStateIsOpen: boolean }) {
    // const dispatch = useAppDispatch();
    // const { getNodes, getEdges } = useReactFlow();
    // const topicsInRedux = useAppSelector(getAllTopics);
    // const dependencysInRedux = useAppSelector(getAllDependencys);

    const { data, isError, isLoading, refetch } = useServerActionQuery(() => getDependencyPackageJson(), [], {
        enabled: dialogStateIsOpen === true,
    });

    return (
        <div className="flex-1 overflow-hidden">
            {isLoading ? (
                <div className="">loading...</div>
            ) : isError ? (
                <div>error</div>
            ) : data ? (
                <TableDependencyPackageJson
                    data={data.dependencies}
                    colums={columnsDefTableDependencyPackageJson}
                />
            ) : (
                <div>unknow view</div>
            )}
        </div>
    );
}

type DependencyPackageJson = Awaited<ReturnType<typeof getDependencyPackageJson>>['dependencies'][number];

const columnsDefTableDependencyPackageJson: ColumnDef<DependencyPackageJson>[] = [
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
        accessorKey: 'name',
        header: ({ column }) => (
            <DataTableColumnHeaderWithFilter
                column={column}
                title="Name"
            />
        ),
        cell: ({ row }) => {
            return (
                <div className="flex space-x-2">
                    <span className="max-w-[500px] truncate font-medium">{row.getValue('name')}</span>
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
        accessorKey: 'type',
        header: ({ column }) => (
            <DataTableColumnHeaderWithFilter
                column={column}
                title="Type"
            />
        ),
        cell: ({ row }) => {
            return (
                <div className="flex space-x-2">
                    <span className="max-w-[500px] truncate font-medium">{row.getValue('type')}</span>
                </div>
            );
        },

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
                        <span className="size-4 m-auto text-green-400">Yes</span>
                    ) : (
                        <span className="size-4 m-auto text-red-400">No</span>
                    )}
                </div>
            );
        },
        accessorFn: (data) => (data.isNew === true ? 'Yes' : 'No'),
        filterFn: (row, id, value: string[]) => {
            return value.includes(row.getValue(id));
        },
    },
    {
        accessorKey: 'isDelete',
        header: ({ column }) => (
            <DataTableColumnHeaderWithFilter
                column={column}
                title="Is delete"
            />
        ),
        cell: ({ row }) => {
            return (
                <div className="flex space-x-2">
                    {row.original.isDelete ? (
                        <PackageCheckIcon className="size-4 m-auto text-green-400" />
                    ) : (
                        <BoxIcon className="size-4 m-auto text-orange-400" />
                    )}
                </div>
            );
        },
        accessorFn: (data) => (data.isDelete === true ? 'Yes' : 'No'),
        filterFn: (row, id, value: string[]) => {
            return value.includes(row.getValue(id));
        },
    },
];

function TableDependencyPackageJson({ data, colums }: { data: DependencyPackageJson[]; colums: ColumnDef<DependencyPackageJson>[] }) {
    return (
        <DataTable
            columns={colums}
            data={data}
            className=""
            aria-description="table container"
            tableOptios={{ enablePagination: true, debugMode: false }}
        >
            <DataTable.SectionToolBar<DependencyPackageJson, unknown>
                className=""
                aria-description="table toolbar"
                renderFn={({ columns, data, tableInstance }) => (
                    <>
                        <DataTableGlobalFilter table={tableInstance} />
                        <div className="flex gap-2">
                            <ButtonTips content={{ title: 'About data', description: 'data dependencies in this table from package json' }} />
                            <Button
                                size="icon"
                                variant="outline"
                                className="size-6"
                                title="download data taable dependency topic summary"
                                // onClick={(event) => handleDownload(event, data)}
                            >
                                <DownloadIcon className="size-4" />
                            </Button>
                            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid, jsx-a11y/anchor-has-content */}
                            <a
                                // ref={elementAnchorDonwloadRef}
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
            <DataTable.SectionContent<DependencyPackageJson, unknown>
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
            <DataTable.SectionPagination<DependencyPackageJson, unknown>
                className=""
                aria-description="table pagination"
                renderFn={({ columns, data, tableInstance }) => (
                    //
                    <DataTablePagination table={tableInstance} />
                )}
            />
        </DataTable>
    );
}
