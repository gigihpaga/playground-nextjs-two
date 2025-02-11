import { useState, memo, type ReactNode, useEffect, useMemo } from 'react';
import {
    BoxIcon,
    CableIcon,
    DownloadIcon,
    FileTextIcon,
    PackageCheckIcon,
    PackageIcon,
    PlusIcon,
    Settings2Icon,
    UnplugIcon,
    XIcon,
} from 'lucide-react';
import { useHandleConnections, useReactFlow, type Node } from '@xyflow/react';
import { type Connection, type HandleConnection, type HandleType } from '@xyflow/system';

import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { cn } from '@/lib/classnames';
import { useServerActionQuery } from '@/hooks/use-server-action-query';
import { type Topic, type Dependency, addDependency, getAllDependencys, getTopic } from '../state/commit-topic-collection-slice';
import { getPagakage, type PakageInFile } from '../action/package-from-file';

import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { ButtonCopy } from '@/components/ui/custom/button-copy';
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table';
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
import { ButtonTips } from '../components/button-tips';
import { Checkbox } from '@/components/ui/checkbox';
import { getDependencyPackageJson } from '../action/dependency-package-json';
import { ComparePackageJson } from '@/server/git-command';
import { getWorkspace } from '../state/commit-topic-flow-transaction';

function DrawerP({ trigger, topicId }: { topicId: Topic['id']; trigger: ReactNode }) {
    const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
    const topic = useAppSelector((state) => getTopic(state, topicId));

    // console.log('packagesFaceted', packagesFaceted, 'pakagesInFile', pakagesInFile, 'topic', topic, 'drawerState', drawerState);
    return (
        <Drawer
            open={isDrawerOpen}
            onOpenChange={setIsDrawerOpen}
        >
            <DrawerTrigger asChild>{trigger}</DrawerTrigger>
            <DrawerContent
                className="mt-12"
                aria-description="DrawerContent"
            >
                <DrawerHeader className="flex">
                    <div className="flex-1">
                        <p>topic title: {topic ? topic.title : 'no title'}</p>
                        <DrawerTitle>Are you absolutely sure?</DrawerTitle>
                        <DrawerDescription>list dependency in node topic</DrawerDescription>
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
                        <ListPackage
                            topicId={topicId}
                            isDrawerOpen={isDrawerOpen}
                        />
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

function ListPackage({ topicId, isDrawerOpen }: { topicId: Topic['id']; isDrawerOpen: boolean }) {
    const { getNodes } = useReactFlow();

    const topic = useAppSelector((state) => getTopic(state, topicId));
    const dependencys = useAppSelector(getAllDependencys);
    const connections = useHandleConnections({ type: 'target', nodeId: topicId });

    const {
        data: pakagesInFile,
        isError: pakagesInFileError,
        isLoading: pakagesInFileLoading,
        refetch,
    } = useServerActionQuery(() => getPagakage(topic?.files.map((f) => f.path) || []), [], {
        enabled: isDrawerOpen === true,
    });

    const {
        data: pakagesInFileJson,
        isError: pakagesInFileJsonError,
        isLoading: pakagesInFileJsonLoading,
    } = useServerActionQuery(() => getDependencyPackageJson(), [], {
        enabled: isDrawerOpen === true,
    });

    const packagesFaceted = grabPakages({
        pakagesInFile: pakagesInFile,
        pakagesInFileJson: pakagesInFileJson,
        connections: connections,
        nodes: getNodes(),
        dependencys: dependencys,
    });

    return (
        <div
            className="h-full"
            aria-description="list package wrapper"
        >
            {pakagesInFileLoading || pakagesInFileJsonLoading ? (
                <div className="">loading...</div>
            ) : pakagesInFileError || pakagesInFileJsonError ? (
                <div>error</div>
            ) : pakagesInFile === null || pakagesInFileJson == null ? (
                <div>data null</div>
            ) : pakagesInFile.length > 0 ? (
                // make sure to pass the data to the datatable with the correct data / not empty array ([]), if the array is empty, then what is encountered in the table data header does not work correctly
                <TablePackage
                    data={packagesFaceted}
                    colums={columnsDefTablePackage}
                />
            ) : (
                <div>data kosong</div>
            )}
        </div>
    );
}

const columnsDefTablePackage: ColumnDef<FileInPackage>[] = [
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
        accessorKey: 'packageName',
        header: ({ column }) => (
            <DataTableColumnHeaderWithFilter
                column={column}
                title="Name"
            />
        ),
        cell: ({ row }) => {
            return (
                <div className="flex space-x-2">
                    <span className="max-w-[500px] truncate font-medium">{row.getValue('packageName')}</span>
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
        accessorKey: 'isNew',
        header: ({ column }) => (
            <DataTableColumnHeaderWithFilter
                column={column}
                title="Is New"
            />
        ),
        cell: ({ row }) => {
            return (
                <div
                    className="flex space-x-2"
                    title={`dependecy is ${row.original.isNew === true ? 'New' : 'Old'}`}
                >
                    {row.original.isNew ? (
                        <span className="size-4 m-auto text-green-400">Yes</span>
                    ) : (
                        <span className="size-4 m-auto text-red-400">No</span>
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
        accessorKey: 'isConnected',
        header: ({ column }) => (
            <DataTableColumnHeaderWithFilter
                column={column}
                title="Is connected"
            />
        ),
        cell: ({ row }) => {
            return (
                <div
                    className="flex space-x-2"
                    title={`dependecy is ${row.original.isConnected ? 'connected' : 'not connected'}`}
                >
                    {row.original.isConnected ? (
                        // <span className="size-4 m-auto text-green-400">Yes</span>
                        <CableIcon className="size-4 m-auto  text-green-400" />
                    ) : (
                        // <span className="size-4 m-auto text-red-400">No</span>
                        <UnplugIcon className="size-4 m-auto  text-red-400" />
                    )}
                </div>
            );
        },
        accessorFn: (data) => (data.isConnected === true ? 'Yes' : 'No'),
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
                    className="flex space-x-2"
                    title={`dependecy is ${row.original.isExist ? 'exist' : 'not exist'}`}
                >
                    {row.original.isExist ? (
                        <PackageCheckIcon className="size-4 m-auto text-green-400" />
                    ) : (
                        <BoxIcon className="size-4 m-auto text-red-400" />
                    )}
                </div>
            );
        },
        accessorFn: (data) => (data.isExist === true ? 'Yes' : 'No'),
        filterFn: (row, id, value: string[]) => {
            return value.includes(row.getValue(id));
        },
    },
    {
        id: 'actions',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title="Action"
            />
        ),
        cell: ({ row, cell, column }) => {
            return <ActionTablePackage data={row.original} />;
        },
        enableSorting: false,
        enableHiding: false,
    },
];

function ActionTablePackage({ data }: { data: FileInPackage }) {
    const dispatch = useAppDispatch();
    const { toast } = useToast();

    function handleAddDepency(pakageName: string) {
        dispatch(addDependency({ title: pakageName }));
        // @ts-ignore
        toast({ title: <span className="text-green-500">Succes</span>, description: 'depedency added', variant: 'default' });
    }

    console.log('ActionTablePackage', data);
    return (
        <div className="flex items-center justify-around">
            <DialogPath
                paths={data.paths}
                trigger={
                    <Button
                        size="sm"
                        className="h-fit w-fit p-1"
                        title="show file path"
                    >
                        <FileTextIcon className="size-3" />
                    </Button>
                }
            />
            <ButtonCopy
                title="copy dependecy name"
                className="size-5 [&_svg]:size-3 [&_.btn-copy-icon-wrapper]:size-3"
                data={data.packageName}
            />
            <Button
                size="sm"
                className="h-fit w-fit p-1"
                disabled={data.isExist}
                onClick={() => handleAddDepency(data.packageName)}
                title="add dependency"
            >
                <PlusIcon className="size-3" />
            </Button>
        </div>
    );
}

function TablePackage({ data, colums }: { data: FileInPackage[]; colums: ColumnDef<FileInPackage>[] }) {
    return (
        <DataTable
            columns={colums}
            data={data}
            className=""
            aria-description="table container"
            tableOptios={{ enablePagination: true, debugMode: false }}
        >
            <DataTable.SectionToolBar<FileInPackage, unknown>
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
            <DataTable.SectionContent<FileInPackage, unknown>
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
            <DataTable.SectionPagination<FileInPackage, unknown>
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

function _ListPackage({ topicId }: { topicId: Topic['id'] }) {
    const { getNodes } = useReactFlow();
    const dispatch = useAppDispatch();
    const { toast } = useToast();

    const topic = useAppSelector((state) => getTopic(state, topicId));
    const dependencys = useAppSelector(getAllDependencys);
    const connections = useHandleConnections({ type: 'target', nodeId: topicId });

    const {
        data: pakagesInFile,
        isError,
        isLoading,
        refetch,
    } = useServerActionQuery(() => getPagakage(topic?.files.map((f) => f.path) || []), [], {
        // enabled: drawerState === true,
    });

    const { data: pakagesInFileJson } = useServerActionQuery(() => getDependencyPackageJson(), [], {
        // enabled: isDrawerOpen === true,
    });

    const packagesFaceted = grabPakages({
        pakagesInFile: pakagesInFile,
        pakagesInFileJson: pakagesInFileJson,
        connections: connections,
        nodes: getNodes(),
        dependencys: dependencys,
    });

    function handleAddDepency(pakageName: string) {
        dispatch(addDependency({ title: pakageName }));
        // @ts-ignore
        toast({ title: <span className="text-green-500">Succes</span>, description: 'depedency added', variant: 'default' });
    }
    return (
        <>
            <h2 className="underline mb-2">list dependency</h2>
            {packagesFaceted !== null ? (
                <ul className="space-y-1.5 flex-1 overflow-auto">
                    {packagesFaceted.length > 0 ? (
                        packagesFaceted.map((packagesFace) => {
                            return (
                                <li
                                    className="odd:bg-gray-600 even:bg-gray-500 hover:bg-gray-700 flex gap-2 p-1 rounded"
                                    key={`${topicId}-${packagesFace.packageName}`}
                                >
                                    <div className="space-x-1">
                                        <ButtonCopy
                                            title="copy dependecy name"
                                            className="size-5 [&_svg]:size-3 [&_.btn-copy-icon-wrapper]:size-3"
                                            data={packagesFace.packageName}
                                        />

                                        <Button
                                            size="sm"
                                            className="h-fit w-fit p-1"
                                            // disabled={_pakagesInRedux.has(pakageName)}
                                            disabled={packagesFace.isExist}
                                            onClick={() => handleAddDepency(packagesFace.packageName)}
                                            title="add dependency"
                                        >
                                            <PlusIcon className="size-3" />
                                        </Button>
                                        <DialogPath
                                            paths={packagesFace.paths}
                                            trigger={
                                                <Button
                                                    size="sm"
                                                    className="h-fit w-fit p-1"
                                                    title="show file path"
                                                >
                                                    <FileTextIcon className="size-3" />
                                                </Button>
                                            }
                                        />
                                    </div>
                                    <div className="space-x-1">
                                        <div
                                            className="h-fit inline-flex _bg-gray-400 rounded-md w-fit p-1 justify-center items-center"
                                            aria-description=""
                                            // title={`dependecy is ${_pakagesInRedux.has(pakageName) ? 'exist' : 'not exist'}`}
                                            title={`dependecy is ${packagesFace.isExist ? 'exist' : 'not exist'}`}
                                        >
                                            {/* {_pakagesInRedux.has(pakageName) ? ( */}
                                            {packagesFace.isExist ? (
                                                <PackageCheckIcon className="size-4 text-blue-400" />
                                            ) : (
                                                <BoxIcon className="size-4 text-orange-400" />
                                            )}
                                        </div>
                                        <div
                                            className="h-fit inline-flex _bg-gray-400 rounded-md w-fit p-1 justify-center items-center"
                                            aria-description=""
                                            // title={`dependecy is ${_packagesInConnection.has(pakageName) ? 'connected' : 'not connected'}`}
                                            title={`dependecy is ${packagesFace.isConnected ? 'connected' : 'not connected'}`}
                                        >
                                            {/* {_packagesInConnection.has(pakageName) ? ( */}
                                            {packagesFace.isConnected ? (
                                                <CableIcon className="size-4 text-green-400" />
                                            ) : (
                                                <UnplugIcon className="size-4 text-red-400" />
                                            )}
                                        </div>
                                    </div>
                                    <span className={cn('flex-1')}>{packagesFace.packageName}</span>
                                </li>
                            );
                        })
                    ) : (
                        <li>
                            <span className="flex-1 flex justify-center items-center">no dependency in topic: {topic?.title}</span>
                        </li>
                    )}
                </ul>
            ) : (
                <div className="h-full w-full flex justify-center items-center">reading package...</div>
            )}
        </>
    );
}

function DialogPath({ paths, trigger }: { paths: string[]; trigger: ReactNode }) {
    return (
        <Dialog>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className="lg:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>File paths</DialogTitle>
                    <DialogDescription>Make changes to your profile here. Click save when you&lsquo;re done.</DialogDescription>
                </DialogHeader>
                <div className="h-[40vh] overflow-y-auto overflow-x-hidden">
                    <Table>
                        <TableCaption>A list of file paths.</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[30px]">No</TableHead>
                                <TableHead className="w-[25px]">Action</TableHead>
                                <TableHead>Path</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paths.map((path, idx) => (
                                <TableRow key={path}>
                                    <TableCell className="text-xs">{idx + 1}</TableCell>
                                    <TableCell className="text-center">
                                        <ButtonCopy
                                            className="size-5 [&_svg]:size-3 [&_.btn-copy-icon-wrapper]:size-3"
                                            data={path}
                                            title="copy title"
                                        />
                                    </TableCell>
                                    <TableCell className="text-2xs text-nowrap">{path}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                        <TableFooter></TableFooter>
                    </Table>
                </div>
                <DialogFooter></DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export const DrawerPackage = memo(DrawerP, (prevProps, nextProps) => prevProps.topicId === nextProps.topicId);

//* Helper
type FileInPackage = { packageName: string; paths: string[]; isNew: boolean; isConnected: boolean; isExist: boolean };
function grabPakages(param: {
    pakagesInFile: PakageInFile[] | null;
    pakagesInFileJson: ComparePackageJson | null;
    connections: HandleConnection[];
    nodes: Node[];
    dependencys: Dependency[];
}): FileInPackage[] {
    const { pakagesInFile, pakagesInFileJson, connections, nodes, dependencys } = param;
    if (!pakagesInFile || !pakagesInFileJson) {
        return [];
    }

    // Point A
    const idsConnectionsSources: string[] = connections.map((conn) => conn.source);
    const _packagesInConnection = new Set<string>([
        ...nodes
            .filter((node) => node.type === 'dependency-node' && idsConnectionsSources.some((sourceId) => sourceId === node.id))
            .map((n2) => n2.data.title as unknown as string),
    ]);

    // Point B
    const _pakagesInRedux = new Set([...dependencys.map((d) => d.title)]);

    // Point C
    // example path: src/app/dev/tutorial/tom-is-loadingv/drag-and-drop-kanban/page.tsx
    const _pakagesInFile = new Set<string>([...pakagesInFile.flatMap((pif) => pif.pakages.flat(Infinity))]);

    // Point D
    const _pakagesInFileJson = new Map(pakagesInFileJson.dependencies.map((dep) => [dep.name, dep]));
    // point Final groupping
    const fileInPackages: FileInPackage[] = Array.from(_pakagesInFile)
        .sort((a, b) => a.localeCompare(b))
        .reduce((acc, packageName, idx) => {
            const paths = pakagesInFile.filter((pif) => pif.pakages.some((pn) => pn === packageName)).map((pif) => pif.path);
            const newElement: FileInPackage = {
                packageName: packageName,
                paths: paths,
                isNew: Boolean(_pakagesInFileJson.get(packageName)?.isNew),
                isConnected: _packagesInConnection.has(packageName),
                isExist: _pakagesInRedux.has(packageName),
            };

            acc.push(newElement);
            return acc;
        }, [] as FileInPackage[]);

    return fileInPackages;
}
