'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { useReactFlow, type Edge, type Node } from '@xyflow/react';
import { BoxIcon, DownloadIcon, PackageCheckIcon, RefreshCcwIcon, Settings2Icon, XIcon } from 'lucide-react';

import { cn } from '@/lib/classnames';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { useServerActionQuery } from '@/hooks/use-server-action-query';
import { getAllDependencys, getAllTopics, type Topic, type Dependency } from '../state/commit-topic-collection-slice';
import { getPakageInFilePath, type PakageInFile } from '../action/package-from-file';
import { getDependencyPackageJson, type DependencyInPackageJson } from '../action/dependency-package-json';

import { Button } from '@/components/ui/button';
import { ButtonCopy } from '@/components/ui/custom/button-copy';
import { ButtonTips } from '../components/button-tips';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

import {
    DataTable,
    DataTableViewOptions,
    DataTableView,
    DataTableGlobalFilter,
    DataTablePagination,
    DataTableColumnHeaderWithFilter,
    DataTableColumnHeader,
    type ColumnDef,
} from '@/components/ui/custom/data-table';

import { getUntrackedAndModifiedFiles, type UntrackedAndModifiedFile } from '../action/untracked-modified-files';

type DialogListDepedencyMapperProps = {
    trigger: ReactNode;
};

export function DialogListDepedencyMapper({ trigger }: DialogListDepedencyMapperProps) {
    const [dialogStateIsOpen, setDialogStateIsOpen] = useState<boolean>(false);

    return (
        <Dialog
            open={dialogStateIsOpen}
            onOpenChange={setDialogStateIsOpen}
        >
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className="flex flex-col _sm:max-w-[425px] h-[90vh] max-h-[90vh] max-w-[90vw] overflow-hidden gap-1">
                <DialogHeader>
                    <DialogTitle className="flex gap-2">Depedency mapper</DialogTitle>
                    <DialogDescription>Dependency list of packages.json file for mapping, dependencies in files and topics</DialogDescription>
                </DialogHeader>
                <TableDependencyMapperRender dialogStateIsOpen={dialogStateIsOpen} />
            </DialogContent>
        </Dialog>
    );
}

//* Table Dependency Mapper (Main)
function TableDependencyMapperRender({ dialogStateIsOpen }: { dialogStateIsOpen: boolean }) {
    // const dispatch = useAppDispatch();
    const { getNodes, getEdges } = useReactFlow();
    const topicsInRedux = useAppSelector(getAllTopics);
    const dependencysInRedux = useAppSelector(getAllDependencys);

    const {
        data: dataLogicMapper,
        isError,
        error,
        isLoading,
        refetch,
    } = useServerActionQuery(
        () =>
            logicMapper({
                node: getNodes(),
                edge: getEdges(),
                topicInRedux: topicsInRedux,
                dependencyInRedux: dependencysInRedux,
            }),
        [],
        {
            enabled: dialogStateIsOpen === true,
        }
    );

    return (
        <div className="flex flex-col flex-1 overflow-hidden gap-y-1">
            <div>
                <Button
                    className="w-fit h-fit p-1"
                    title="refetch"
                    onClick={() => refetch()}
                    disabled={isLoading}
                >
                    <RefreshCcwIcon className={cn('size-[14px] ', isLoading && 'animate-spin')} />
                </Button>
            </div>
            <div className="flex-1 overflow-hidden">
                {isLoading ? (
                    <div className="">loading...</div>
                ) : isError ? (
                    <div>error: {error}</div>
                ) : !dataLogicMapper ? (
                    <div>data null</div>
                ) : dataLogicMapper ? (
                    <TableDependencyMapper
                        data={dataLogicMapper}
                        colums={columnsDefTableDependencyMapper}
                    />
                ) : (
                    <div>empty data</div>
                )}
            </div>
        </div>
    );
}

type DependencyPackageJson = Awaited<ReturnType<typeof getDependencyPackageJson>>['dependencies'][number];

const columnsDefTableDependencyMapper: ColumnDef<SummaryDependency>[] = [
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
        cell: ({ row, getValue }) => (
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
                <div className="flex space-x-1.5">
                    <ButtonCopy
                        variant="ghost"
                        className="h-fit w-fit p-1 [&_svg]:size-[12px] [&_.btn-copy-icon-wrapper]:size-[12px] rounded"
                        data={row.original.name}
                        title="copy name"
                    />
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
                    <span className={cn('max-w-[500px] truncate font-medium', row.original.type === 'unknown' && 'text-muted-foreground')}>
                        {row.getValue('type')}
                    </span>
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
                    {row.original.isNew === true ? (
                        <span className="size-4 m-auto text-green-400">Yes</span>
                    ) : row.original.isNew === false ? (
                        <span className="size-4 m-auto text-red-400">No</span>
                    ) : (
                        <span className="size-4 m-auto text-muted-foreground">Unknow</span>
                    )}
                </div>
            );
        },
        accessorFn: (data) => (data.isNew === true ? 'Yes' : data.isNew === false ? 'No' : 'Unknow'),
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
                    {row.original.isDelete === true ? (
                        <PackageCheckIcon className="size-4 m-auto text-green-400" />
                    ) : row.original.isDelete === false ? (
                        <BoxIcon className="size-4 m-auto text-orange-400" />
                    ) : (
                        <span className="size-4 m-auto text-muted-foreground">Unknow</span>
                    )}
                </div>
            );
        },
        accessorFn: (data) => (data.isDelete === true ? 'Yes' : data.isDelete === false ? 'No' : 'Unknow'),
        filterFn: (row, id, value: string[]) => {
            return value.includes(row.getValue(id));
        },
    },
    {
        accessorKey: 'files',
        header: ({ column }) => (
            <DataTableColumnHeaderWithFilter
                column={column}
                title="Files"
            />
        ),
        cell: ({ row }) => {
            return (
                <div className="flex space-x-2">
                    <DrawerFiles
                        dependencyName={row.original.name}
                        files={row.original.files}
                        trigger={
                            <Button
                                title="open table files"
                                variant="ghost"
                                className="h-fit w-fit p-[2px] min-w-5 text-xs"
                            >
                                {row.original.files.length}
                            </Button>
                        }
                    />
                </div>
            );
        },
        accessorFn: (data) => data.files.length,
        filterFn: (row, columnId, filterValues: string[]) => {
            return filterValues.includes(row.getValue(columnId));
        },
    },
    {
        accessorKey: 'topicsByFilePath',
        header: ({ column }) => (
            <DataTableColumnHeaderWithFilter
                column={column}
                title="Topic by Filepath"
            />
        ),
        cell: ({ row }) => {
            return (
                <div className="flex space-x-2">
                    <DrawerTopicsByFilePath
                        dependencyName={row.original.name}
                        topicsByFilePath={row.original.topicsByFilePath}
                        trigger={
                            <Button
                                variant="ghost"
                                className="h-fit w-fit p-[2px] min-w-5 text-xs"
                            >
                                {row.original.topicsByFilePath.length}
                            </Button>
                        }
                    />
                </div>
            );
        },
        meta: {
            filterVariant: 'select',
        },
        accessorFn: (data) => data.topicsByFilePath.map((topic) => topic.title),
        filterFn: (row, columnId, filterValues: string[], addMeta) => {
            return filterValues.some((elmFilter) => row.getValue<string[]>(columnId).some((topicTitle) => elmFilter.includes(topicTitle)));
        },
        enableColumnFilter: true,
        enableGlobalFilter: true,
    },
    {
        accessorKey: 'statusConnectToTopic',
        header: ({ column }) => (
            <DataTableColumnHeaderWithFilter
                column={column}
                title="Status Connect to Topic"
            />
        ),
        cell: ({ row }) => {
            return (
                <div className="flex space-x-2">
                    <DrawerStatusConnectToTopic
                        topics={row.original.statusConnectToTopic.topics}
                        dependencyName={row.original.name}
                        trigger={
                            <Button
                                className="h-fit w-fit p-1 text-xs"
                                title="open table status connect to topic"
                            >
                                {`${row.original.statusConnectToTopic.summarize.estimation}, ${row.original.statusConnectToTopic.summarize.sentence}`}
                            </Button>
                        }
                    />
                </div>
            );
        },
        meta: {
            filterVariant: 'select',
        },
        accessorFn: (data) => data.statusConnectToTopic.summarize.sentence,
        filterFn: (row, columnId, filterValues: string[], addMeta) => {
            return filterValues.includes(row.getValue<SummaryDependency['statusConnectToTopic']['summarize']['sentence']>(columnId));
        },
        enableColumnFilter: true,
        enableGlobalFilter: true,
    },
    /*  {
        accessorKey: 'statusConnectToTopic',
        header: ({ column }) => (
            <DataTableColumnHeaderWithFilter
                column={column}
                title="Status Connect Lama"
            />
        ),
        cell: ({ row }) => {
            const allTopicCount = row.original.statusConnectToTopic.length;
            const topicIsConnectedCount = row.original.statusConnectToTopic.filter((topic) => topic.isConnected === true).length;
            const status = allTopicCount === 0 ? 'not used' : topicIsConnectedCount < allTopicCount ? 'partial connected' : 'all connected';
            return (
                <div className="flex space-x-2">
                    <Button className="h-fit w-fit p-1 text-2xs">{`${topicIsConnectedCount}/${allTopicCount}, ${status}`}</Button>
                </div>
            );
        },
        meta: {
            filterVariant: 'select',
        },
        accessorFn: (data) => {
            const allTopicCount = data.statusConnectToTopic.length;
            const topicIsConnectedCount = data.statusConnectToTopic.filter((topic) => topic.isConnected === true).length;
            const status = allTopicCount === 0 ? 'not used' : topicIsConnectedCount < allTopicCount ? 'partial connected' : 'all connected';
            return status;
        },
        filterFn: (row, columnId, filterValues: string[], addMeta) => {
            return filterValues.includes(row.getValue(columnId));
        },
        enableColumnFilter: true,
        enableGlobalFilter: true,
    }, */
];

function TableDependencyMapper({ data, colums }: { data: SummaryDependency[]; colums: ColumnDef<SummaryDependency>[] }) {
    return (
        <DataTable
            columns={colums}
            data={data}
            className=""
            aria-description="table container"
            tableOptios={{ enablePagination: true, debugMode: false }}
        >
            <DataTable.SectionToolBar<SummaryDependency, unknown>
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
            <DataTable.SectionContent<SummaryDependency, unknown>
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
            <DataTable.SectionPagination<SummaryDependency, unknown>
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

function DrawerFiles({
    trigger,
    files,
    dependencyName,
}: {
    trigger: ReactNode;
    files: SummaryDependency['files'];
    dependencyName: SummaryDependency['name'];
}) {
    console.log('in DrawerFiles', files);
    return (
        <DrawerBase
            trigger={trigger}
            header={
                <>
                    <DrawerTitle>
                        Files for dependency <span className="underline">{dependencyName}</span>
                    </DrawerTitle>
                    <DrawerDescription>List files from dependency</DrawerDescription>
                </>
            }
            content={
                <div className="h-full _w-full overflow-auto [&>*]:overflow-visible">
                    <Table>
                        <TableCaption>A list of files by dependency</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[60px]">No</TableHead>
                                <TableHead>Path</TableHead>
                                <TableHead className="w-[100px]">Status</TableHead>
                                {/* <TableHead className="w-[80px] text-center">Action</TableHead> */}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {files.map((file, idx) => (
                                <TableRow
                                    // className={cn(dependency.isNew && 'text-green-400')}
                                    key={file.path}
                                >
                                    <TableCell className="font-light py-1 px-[6px]">{idx + 1}</TableCell>
                                    <TableCell className="font-light py-1 px-[6px] text-nowrap text-2xs">
                                        <ButtonCopy
                                            title="copy path"
                                            className="size-[18px] [&_.btn-copy-icon-wrapper]:size-[10px] [&_svg]:size-[10px] rounded mr-1"
                                            data={file.path}
                                        />
                                        {file.path}
                                    </TableCell>
                                    <TableCell className="font-light py-1 px-[6px]">{file.status}</TableCell>
                                    {/* <TableCell className="text-center font-light py-1 px-[6px]">
                                        <ButtonCopy
                                            title="copy path"
                                            className="size-[18px] [&_.btn-copy-icon-wrapper]:size-[10px] [&_svg]:size-[10px] rounded"
                                            data={file.path}
                                        />
                                    </TableCell> */}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            }
        />
    );
}
function DrawerTopicsByFilePath({
    trigger,
    topicsByFilePath,
    dependencyName,
}: {
    trigger: ReactNode;
    topicsByFilePath: SummaryDependency['topicsByFilePath'];
    dependencyName: SummaryDependency['name'];
}) {
    console.log('in DrawerTopicsByFilePath', topicsByFilePath);
    return (
        <DrawerBase
            trigger={trigger}
            header={
                <>
                    <DrawerTitle>
                        Files for dependency <span className="underline">{dependencyName}</span>
                    </DrawerTitle>
                    <DrawerDescription>List files from dependency</DrawerDescription>
                </>
            }
            content={
                <div className="h-full _w-full overflow-auto [&>*]:overflow-visible">
                    <Table>
                        <TableCaption>A list of files by dependency</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[60px]">No</TableHead>
                                <TableHead>Title</TableHead>
                                <TableHead>Description</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {topicsByFilePath.map((topic, idx) => (
                                <TableRow
                                    // className={cn(dependency.isNew && 'text-green-400')}
                                    key={topic.id}
                                >
                                    <TableCell className="font-light py-1 px-[6px]">{idx + 1}</TableCell>
                                    <TableCell className="font-light py-1 px-[6px] text-nowrap text-2xs">
                                        <ButtonCopy
                                            title="copy path"
                                            className="size-[18px] [&_.btn-copy-icon-wrapper]:size-[10px] [&_svg]:size-[10px] rounded mr-1"
                                            data={topic.title}
                                        />
                                        {topic.title}
                                    </TableCell>
                                    <TableCell className="font-light py-1 px-[6px] text-2xs">{topic.description}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            }
        />
    );
}
function DrawerStatusConnectToTopic({
    trigger,
    topics,
    dependencyName,
}: {
    trigger: ReactNode;
    topics: SummaryDependency['statusConnectToTopic']['topics'];
    dependencyName: SummaryDependency['name'];
}) {
    console.log('in DrawerStatusConnectToTopic', topics);
    return (
        <DrawerBase
            trigger={trigger}
            header={
                <>
                    <DrawerTitle>Relation dependency: {dependencyName} to Topic</DrawerTitle>
                    <DrawerDescription>Relation dependency in package.json to Topic in redux</DrawerDescription>
                </>
            }
            content={
                <div className="h-full overscroll-y-auto">
                    <Table>
                        <TableCaption>A list of depedency in packagejson relation to topic.</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[60px]">No</TableHead>
                                <TableHead className="w-[100px]">Topic name</TableHead>
                                <TableHead>Is Connected</TableHead>
                                <TableHead className="w-[80px] text-center">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {topics.map((topic, idx) => (
                                <TableRow
                                    // className={cn(dependency.isNew && 'text-green-400')}
                                    key={topic.topicId}
                                >
                                    <TableCell className="font-light py-1 px-[6px]">{idx + 1}</TableCell>
                                    <TableCell className="font-light py-1 px-[6px] text-nowrap">{topic.topicName}</TableCell>
                                    <TableCell className="font-light py-1 px-[6px]">{topic.isConnected ? 'yes' : 'no'}</TableCell>
                                    <TableCell className="text-center font-light py-1 px-[6px]">
                                        <ButtonCopy
                                            title="copy topic name"
                                            className="size-[18px] [&_.btn-copy-icon-wrapper]:size-[10px] [&_svg]:size-[10px] rounded"
                                            data={topic.topicName}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            }
        />
    );
}

//* Reusable component
function DrawerBase({ trigger, content, header }: { content?: ReactNode; header?: ReactNode; trigger: ReactNode }) {
    // const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

    return (
        <Drawer
        // open={isDrawerOpen}
        // onOpenChange={setIsDrawerOpen}
        >
            <DrawerTrigger asChild>{trigger}</DrawerTrigger>
            <DrawerContent
                className="mt-12"
                aria-description="DrawerContent"
            >
                <DrawerHeader className="flex">
                    <div className="flex-1">
                        {header ? (
                            header
                        ) : (
                            <>
                                <DrawerTitle>Are you absolutely sure?</DrawerTitle>
                                <DrawerDescription>This action cannot be undone.</DrawerDescription>
                            </>
                        )}
                    </div>
                    <DrawerClose asChild>
                        <Button
                            size="icon"
                            className="h-fit w-fit p-1.5"
                            variant="outline"
                        >
                            <XIcon className="size-4" />
                        </Button>
                    </DrawerClose>
                </DrawerHeader>
                <div className="px-4 py-2 h-[75vh] flex flex-col overflow-hidden">
                    <div className="flex-1 overflow-hidden">
                        {content ? content : null}
                        {/* <_ListPackage topicId={topicId} /> */}
                    </div>
                </div>
                {/* <DrawerFooter>
                    <Button>Submit</Button>
                </DrawerFooter> */}
            </DrawerContent>
        </Drawer>
    );
}

//* Action
type LogicMapperParams = {
    node: Node[];
    edge: Edge[];
    topicInRedux: Topic[];
    dependencyInRedux: Dependency[];
};

type SummaryDependency = (
    | {
          name: DependencyInPackageJson['name'];
          type: DependencyInPackageJson['type'];
          isNew: DependencyInPackageJson['isNew'];
          isDelete: DependencyInPackageJson['isDelete'];
          from: 'packagejson';
      }
    | {
          name: DependencyInPackageJson['name'];
          type: 'unknown';
          isNew: null;
          isDelete: null;
          from: 'filescan';
      }
) & {
    files: {
        path: UntrackedAndModifiedFile['path'];
        status: UntrackedAndModifiedFile['status'];
        associatedTopicIds: string[];
    }[];
    topicsByFilePath: Topic[];
    statusConnectToTopic: {
        topics: Array<{ topicId: Topic['id']; topicName: Topic['title']; isConnected: boolean }>;
        summarize: {
            estimation: string;
            sentence: 'not used' | 'all not connected' | 'partial connected' | 'all connected' | 'unknow status';
        };
    };
};

async function logicMapper(params: LogicMapperParams) {
    const { node, edge, topicInRedux, dependencyInRedux } = params;
    const { dependencies: dependencyInPackageJson } = await getDependencyPackageJson();

    //* connection Node
    function getConnection({ node, edge }: { node: Node[]; edge: Edge[] }) {
        type ConnectionNode = Node & { connections: Node[] };
        const topicInFlow = node.filter((node) => node.type === 'topic-node');
        const dependencyInFlow = node.filter((node) => node.type === 'dependency-node');

        const connections: ConnectionNode[] = topicInFlow.reduce((accNode, currNode) => {
            const connects = edge
                .filter((edge) => edge.target === currNode.id)
                .map((edge) => {
                    return dependencyInFlow.find((dif) => dif.id === edge.source)!;
                });
            // console.log('loop', 'currNode', currNode.data?.title, 'connect', connects);
            const newNode: ConnectionNode = { ...currNode, connections: connects };
            accNode.push(newNode);

            return accNode;
        }, [] as ConnectionNode[]);

        return connections;
    }

    //* base File
    const baseFiles: UntrackedAndModifiedFile[] = await getUntrackedAndModifiedFiles();
    const baseFilesWithDependency = await getPakageInFilePath(baseFiles);
    function getFilesByDependency(depencyName: string) {
        const filesWithTopic = baseFilesWithDependency
            .filter((file) => file.dependencysInFile.some((dep) => dep === depencyName))
            .map((file) => {
                const topicIds = topicInRedux.filter((topic) => topic.files.some((fileGit) => fileGit.path === file.path)).map((topic) => topic.id);
                return { ...file, associatedTopicIds: topicIds };
            });

        const topicIds = Array.from(new Set(filesWithTopic.flatMap((fwt) => fwt.associatedTopicIds)));
        const topicsByFilePath = topicInRedux.filter((topic) => topicIds.some((topicId) => topic.id === topicId));
        return { filesWithTopic: filesWithTopic, topicsByFilePath: topicsByFilePath };
    }

    //* base Dependency
    const _dependencysInFile = new Set(baseFilesWithDependency.flatMap((a) => a.dependencysInFile));
    const _dependencyInPackageJson = new Set(dependencyInPackageJson.map((d) => d.name));
    const baseDependencys = Array.from(_dependencysInFile.union(_dependencyInPackageJson))
        .sort((x, y) => x.localeCompare(y))
        .map((dependencyName) => {
            const isDependencyJson = dependencyInPackageJson.find((depjson) => depjson.name === dependencyName);
            if (isDependencyJson) {
                return { ...isDependencyJson, from: 'packagejson' as const };
            } else {
                return {
                    name: dependencyName,
                    type: 'unknown' as const,
                    isNew: null,
                    isDelete: null,
                    from: 'filescan' as const,
                };
            }
        });

    //* utils
    function statusConnectToTopicSummarize(statusConnectToTopic: Array<{ topicId: string; topicName: string; isConnected: boolean }>) {
        const xAllTopicCount = statusConnectToTopic.length,
            xTopicIsConnectedCount = statusConnectToTopic.filter((topic) => topic.isConnected === true).length;

        let sentence: SummaryDependency['statusConnectToTopic']['summarize']['sentence'] = 'unknow status';
        if (xAllTopicCount === 0) {
            sentence = 'not used';
        } else if (xTopicIsConnectedCount === 0) {
            sentence = 'all not connected';
        } else if (xTopicIsConnectedCount > 0 && xTopicIsConnectedCount < xAllTopicCount) {
            sentence = 'partial connected';
        } else if (xTopicIsConnectedCount === xAllTopicCount) {
            sentence = 'all connected';
        } else {
            sentence = 'unknow status';
        }

        const estimation = `${xTopicIsConnectedCount}/${xAllTopicCount}`;
        return {
            sentence: sentence,
            /** example: 2/5, dimana 2 adalah topic yang terkoneksi dan 5 adalah total topic */
            estimation: estimation,
        };
    }

    const summaryDependency: SummaryDependency[] = baseDependencys.reduce((accDependency, currDependency) => {
        const { filesWithTopic, topicsByFilePath } = getFilesByDependency(currDependency.name);

        const topicIds = topicsByFilePath.map((topic) => topic.id);
        const connections = getConnection({ node: node, edge: edge });
        const statusConnectToTopic = connections
            .filter((node) => topicIds.some((topicId) => node.id === topicId))
            .map((node) => {
                const { id, data, connections } = node;
                const isExist = connections.find((n1) => n1.data.title === currDependency.name);
                return {
                    topicId: id,
                    topicName: data.title as string,
                    isConnected: isExist ? true : false,
                };
            });

        const { sentence, estimation } = statusConnectToTopicSummarize(statusConnectToTopic);

        const newDependency: SummaryDependency = {
            ...currDependency,
            files: filesWithTopic,
            topicsByFilePath: topicsByFilePath,
            statusConnectToTopic: {
                topics: statusConnectToTopic,
                summarize: {
                    estimation: estimation,
                    sentence: sentence,
                },
            },
        };
        accDependency.push(newDependency);
        return accDependency;
    }, [] as SummaryDependency[]);

    const testUhuy = summaryDependency.filter((sd) => sd.files.some((f) => f.associatedTopicIds.length > 0) && sd.isNew === true);
    console.log('testUhuy', testUhuy);

    return summaryDependency;
}
