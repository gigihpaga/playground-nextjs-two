import React, { useState, type ReactNode, type CSSProperties, memo } from 'react';

import {
    BoxIcon,
    DownloadIcon,
    GripVerticalIcon,
    PackageCheckIcon,
    PartyPopperIcon,
    PlugZapIcon,
    RefreshCcwIcon,
    Settings2Icon,
    XIcon,
} from 'lucide-react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    MouseSensor,
    TouchSensor,
    PointerSensor,
    useSensor,
    useSensors,
    type DragEndEvent,
    type UniqueIdentifier,
} from '@dnd-kit/core';

import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';

import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { cn } from '@/lib/classnames';
import { useServerActionQuery } from '@/hooks/use-server-action-query';

import { getPagakage, type PakageInFile } from '../action/package-from-file';
import { isObjectWithId } from '../utils';

import { updateTopic, reorderTopic, getAllTopics, type Topic, type WorkspaceTopic, getTopic } from '../state/commit-topic-collection-slice';

import { Button } from '@/components/ui/button';
import { ButtonCopy } from '@/components/ui/custom/button-copy';
import { Checkbox } from '@/components/ui/checkbox';
import { toast, useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import {
    DataTable,
    DataTableViewOptions,
    DataTableView,
    type DataTableViewProps,
    DataTableGlobalFilter,
    DataTablePagination,
    DataTableColumnHeaderWithFilter,
    DataTableColumnHeader,
    flexRender,
    type Row,
    type ColumnDef,
    type DataTableInstance,
    type RowData,
} from '@/components/ui/custom/data-table';
import { ButtonTips } from '../components/button-tips';
// import { DrawerPackage } from './drawer-package';

interface DialogTopicCollectionTableProps {
    trigger: ReactNode;
}

/**
 * component untuk menampilkan data topic colection yang ada di redux (dragable table)
 * - menggunakan:
 * > - tanstack table
 * > - dnd-kit
 * - component ini mirip dengan `sheet-topic-collection.tsx`
 * @param param0
 * @returns
 */
export default function DialogTopicCollectionTable({ trigger }: DialogTopicCollectionTableProps) {
    const [dialogStateIsOpen, setDialogStateIsOpen] = useState<boolean>(false);
    return (
        <Dialog
            open={dialogStateIsOpen}
            onOpenChange={setDialogStateIsOpen}
        >
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className="flex flex-col _sm:max-w-[425px] h-[90vh] max-h-[90vh] max-w-[90vw] overflow-hidden gap-1">
                <DialogHeader>
                    <DialogTitle className="flex gap-2">Topic collection</DialogTitle>
                    <DialogDescription>You can drag and drop to order topic.</DialogDescription>
                </DialogHeader>
                <TableTopicCollectionRender />
            </DialogContent>
        </Dialog>
    );
}

function TableTopicCollectionRender() {
    const topics = useAppSelector(getAllTopics);
    const [renderCount, setRenderCount] = useState(1);

    function handleRerender() {
        setRenderCount((prev) => prev + 1);
    }

    return (
        <div className="flex flex-col flex-1 overflow-hidden gap-y-1">
            <div>
                <Button
                    className="w-fit h-fit p-1"
                    title="refetch"
                    onClick={() => handleRerender()}
                    // disabled={isLoading}
                >
                    {/* <RefreshCcwIcon className={cn('size-[14px] ', isLoading && 'animate-spin')} /> */}
                    <RefreshCcwIcon className={cn('size-[14px] ')} />
                </Button>
            </div>
            <div className="flex-1 overflow-hidden">
                <TableTopicCollection
                    data={topics}
                    colums={columnsDefTableTopicCollection}
                />
            </div>
        </div>
    );
}

//* Table Topic
const columnsDefTableTopicCollection: ColumnDef<Topic>[] = [
    {
        id: 'DRAG_HANDLE',
        header: ({ column }) => (
            <DataTableColumnHeader
                className="[&>div]:border-none _w-[20px]"
                column={column}
                title=""
            />
        ),
        cell: ({ row }) => (
            <div className="flex justify-center items-center">
                <RowDragHandleCell rowId={row.id} />
            </div>
        ),
        size: 20,
        enableSorting: false,
        enableHiding: false,
    },
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
                className="h-full py-1 [&>button]:border [&>button]:border-dashed [&>button]:rounded-md [&>button]:h-full [&>button]:gap-x-[2px]"
            />
        ),
        cell: ({ row, cell, column }) => {
            return (
                <div className="flex space-x-2">
                    <span className="max-w-[500px] truncate font-medium">{row.index + 1}</span>
                </div>
            );
        },
        enableSorting: true,
        enableHiding: false,
        accessorFn: (data, dataIndex) => dataIndex,
    },
    {
        accessorKey: 'title',
        header: ({ column }) => (
            <DataTableColumnHeaderWithFilter
                column={column}
                title="Title"
            />
        ),
        cell: ({ row, getValue }) => {
            return (
                <div className="flex space-x-2">
                    <span className="max-w-[500px] truncate font-medium">{row.getValue<string>('title')}</span>
                </div>
            );
        },
        meta: {
            filterVariant: 'select',
        },
        filterFn: (row, columnId, filterValues: string[]) => {
            return filterValues.includes(row.getValue(columnId));
        },
    },

    {
        accessorKey: 'description',
        header: ({ column }) => (
            <DataTableColumnHeaderWithFilter
                column={column}
                title="Description"
            />
        ),
        cell: ({ row, getValue }) => {
            return (
                <div className="flex space-x-2">
                    <span className="max-w-[500px] truncate font-medium">{row.getValue<string | undefined>('description')}</span>
                </div>
            );
        },
        meta: {
            filterVariant: 'text',
        },
        filterFn: (row, columnId, filterValues: string[]) => {
            return filterValues.includes(row.getValue(columnId));
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
                    <span className="max-w-[500px] truncate font-medium">{row.original.files.length}</span>
                </div>
            );
        },
        accessorFn: (data, i) => data.files.map((file) => file.path),
        filterFn: (row, columnId, filterValues: string[], addMeta) => {
            return filterValues.some((elmFilter) => row.getValue<string[]>(columnId).some((path) => elmFilter.includes(path)));
        },
        enableColumnFilter: true,
        enableGlobalFilter: true,
    },
    {
        accessorKey: 'isCommited',
        header: ({ column }) => (
            <DataTableColumnHeaderWithFilter
                column={column}
                title="Is Commited"
            />
        ),
        cell: ({ row }) => {
            return (
                <div className="flex space-x-2">
                    {/*  {row.original.isCommited === true ? (
                        <span className="size-4 m-auto text-green-400">Yes</span>
                    ) : row.original.isCommited === false ? (
                        <span className="size-4 m-auto text-red-400">No</span>
                    ) : (
                        <span className="size-4 m-auto text-muted-foreground">Unknow</span>
                    )} */}
                    <CheckBoxIsCommited topic={row.original} />
                </div>
            );
        },
        accessorFn: (data) => (data.isCommited === true ? 'Yes' : data.isCommited === false ? 'No' : 'Unknow'),
        filterFn: (row, columnId, value: string[]) => {
            return value.includes(row.getValue(columnId));
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
            return (
                <DrawerPackage
                    topicId={row.original.id}
                    trigger={
                        <Button
                            aria-description={`button show drawer package ${row.original.title}`}
                            title={`show package list for topic: ${row.original.title}`}
                            className="text-2xs h-fit w-fit p-1 rounded-sm leading-tight"
                        >
                            <PlugZapIcon className="size-3" />
                        </Button>
                    }
                />
            );
        },
        enableSorting: false,
        enableHiding: false,
    },
];

// Compositing data table
function TableTopicCollection({ data, colums }: { data: Topic[]; colums: ColumnDef<Topic>[] }) {
    return (
        <DataTable
            // <Topic, unknown>
            columns={colums}
            data={data}
            className=""
            aria-description="table container"
            tableOptios={{
                enablePagination: true,
                debugMode: false,
                getRowId: (row) => row.id, //required because row indexes will change
            }}
        >
            <DataTable.SectionToolBar<Topic, unknown>
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
            <DataTable.SectionContent<Topic, unknown>
                className=""
                aria-description="table wrapper"
                renderFn={({ columns, tableInstance, data }) => (
                    // <DataTableView
                    <DraggableContext topics={data}>
                        <DataTableViewCustom
                            className=""
                            table={tableInstance}
                            columns={columns}
                        />
                    </DraggableContext>
                )}
            />
            <DataTable.SectionPagination<Topic, unknown>
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

/** Table view with draggable
 *
 * reference: https://tanstack.com/table/v8/docs/framework/react/examples/row-dnd
 * @param param0
 * @returns
 */
function DataTableViewCustom<TData, TValue>({ table, columns, className, ...props }: DataTableViewProps<TData, TValue>) {
    const dataIds = React.useMemo(() => {
        return table.options.data.map((data) => {
            if (!isObjectWithId(data)) {
                throw new Error('data must be a object, data must be have properti id and data.id must be type string');
            }

            return data.id;
        });
    }, [table.options.data]);

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
                <SortableContext
                    items={dataIds}
                    strategy={verticalListSortingStrategy}
                >
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                            <RowDraggable
                                key={row.id}
                                row={row}
                            />
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
                </SortableContext>
            </TableBody>
        </Table>
    );
}

// Cell Component: CheckBox isCommited Topic (for cell in columndef)
function CheckBoxIsCommited({ topic }: { topic: Topic }) {
    const { toast } = useToast();
    const dispatch = useAppDispatch();

    function handleChangeStateCommited(state: boolean) {
        dispatch(
            updateTopic({
                topicId: topic.id,
                data: { ...topic, isCommited: state },
            })
        );
        toast({
            //@ts-ignore
            title: (
                <div className="flex items-center gap-x-1">
                    <PartyPopperIcon className="size-4 text-green-300" />
                    Successfully updated
                </div>
            ),
            description: `Topic: ${topic.title} updated to ${state ? 'commited' : 'uncommited'}`,
        });
    }
    return (
        <Checkbox
            checked={topic.isCommited}
            title={`mark to ${topic.isCommited ? 'uncommited' : 'commited'}`}
            className="data-[state=checked]:text-green-800 _size-3 _[&_svg]:size-3"
            onCheckedChange={(state) => {
                handleChangeStateCommited(Boolean(state));
            }}
        />
    );
}

//* Component drag
// Drag context (for wrapping data table)
function DraggableContext({ children, topics }: { children: ReactNode; topics: Topic[] }) {
    const dispatch = useAppDispatch();

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8, // 8px
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;

        if (!over) return;

        if (active.id !== over.id) {
            const oldIndex = topics.findIndex((item) => item.id === active.id);
            const newIndex = topics.findIndex((item) => item.id === over.id);
            if (oldIndex === -1 || newIndex === -1) {
                return;
            } else {
                const newTopics = arrayMove(topics, oldIndex, newIndex);
                if (newTopics.length === 0) {
                    throw new Error('reorder Topic canceled, because newTopics is 0');
                }
                dispatch(reorderTopic({ dataTopics: newTopics }));
            }
        }
    }

    return (
        <DndContext
            modifiers={[restrictToVerticalAxis]}
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <SortableContext
                items={topics}
                strategy={verticalListSortingStrategy}
            >
                {children}
            </SortableContext>
        </DndContext>
    );
}

// Cell Component: DragHandle (for cell in columndef)
const RowDragHandleCell = ({ rowId }: { rowId: string }) => {
    const { attributes, listeners } = useSortable({
        id: rowId,
    });
    return (
        // Alternatively, you could set these attributes on the rows themselves
        <Button
            className="h-fit w-fit px-[2px] py-[6px] cursor-grab"
            variant="ghost"
            {...attributes}
            {...listeners}
        >
            <GripVerticalIcon className="size-4" />
        </Button>
    );
};

// Row Component (for table body)
const RowDraggable = <TData extends RowData>({ row }: { row: Row<TData> }) => {
    const { transform, transition, setNodeRef, isDragging } = useSortable({
        id: isObjectWithId(row.original) ? row.original.id : row.id,
    });

    const style: CSSProperties = {
        transform: CSS.Transform.toString(transform), //let dnd-kit do its thing
        transition: transition,
        opacity: isDragging ? 0.8 : 1,
        zIndex: isDragging ? 1 : 0,
        position: 'relative',
    };
    return (
        // connect row ref to dnd-kit, apply important styles
        <TableRow
            ref={setNodeRef}
            style={style}
            data-state={row.getIsSelected() && 'selected'}
        >
            {row.getVisibleCells().map((cell) => (
                <TableCell
                    // style={{ width: cell.column.getSize() }}
                    key={cell.id}
                >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
            ))}
        </TableRow>
    );
};

//* Packages
function DrawerPkg({ trigger, topicId }: { topicId: Topic['id']; trigger: ReactNode }) {
    const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
    const topic = useAppSelector((state) => getTopic(state, topicId));

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
                    </div>
                </div>
            </DrawerContent>
        </Drawer>
    );
}

const DrawerPackage = memo(DrawerPkg, (prevProps, nextProps) => prevProps.topicId === nextProps.topicId);

function ListPackage({ topicId, isDrawerOpen }: { topicId: Topic['id']; isDrawerOpen: boolean }) {
    const topic = useAppSelector((state) => getTopic(state, topicId));

    const {
        data: fileInPackage,
        isError: fileInPackageError,
        isLoading: fileInPackageLoading,
        refetch,
    } = useServerActionQuery(() => grabPackage({ topic: topic }), [], {
        enabled: isDrawerOpen === true,
    });

    console.log('ListPackage', fileInPackage);

    return (
        <>
            {fileInPackageLoading ? (
                <p>loading...</p>
            ) : fileInPackageError ? (
                <p>error</p>
            ) : !fileInPackage ? (
                <p>data null</p>
            ) : (
                <TablePackage data={fileInPackage} />
            )}
        </>
    );
}

function TablePackage({ data }: { data: FileInPackage[] }) {
    return (
        <div className="h-full overflow-auto relative [&>div]:overflow-visible [&>div]:static">
            <Table className="text-xs">
                <TableCaption className="text-xs text-inherit">A list of properties schema</TableCaption>
                <TableHeader className="sticky top-0 bg-background">
                    <TableRow className=" [&>th]:h-fit [&>th]:py-2 [&>th]:text-inherit">
                        <TableHead className="w-[50px]">No</TableHead>
                        <TableHead className="text-nowrap">Package Name</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody className="">
                    {data.length > 0 ? (
                        data.map((fip, fipIdx) => (
                            <TableRow
                                className="[&>td]:h-fit [&>td]:py-2"
                                key={fip.packageName}
                            >
                                <TableCell className="font-light">{fipIdx + 1}</TableCell>
                                <TableCell className="font-medium text-nowrap">{fip.packageName}</TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>data empty</TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}

type FileInPackage = { packageName: string; paths: string[] };

async function grabPackage({ topic }: { topic: Topic | undefined }) {
    if (!topic) return [];

    const pakagesInFile = await getPagakage(topic.files.map((f) => f.path));
    const _pakagesInFile = new Set<string>([...pakagesInFile.flatMap((pif) => pif.pakages.flat(Infinity))]);

    const fileInPackages: FileInPackage[] = Array.from(_pakagesInFile)
        .sort((a, b) => a.localeCompare(b))
        .reduce((acc, packageName, idx) => {
            const paths = pakagesInFile.filter((pif) => pif.pakages.some((pn) => pn === packageName)).map((pif) => pif.path);
            const newElement: FileInPackage = {
                packageName: packageName,
                paths: paths,
            };

            acc.push(newElement);
            return acc;
        }, [] as FileInPackage[]);

    return fileInPackages;
}
