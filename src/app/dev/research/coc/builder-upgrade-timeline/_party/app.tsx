'use client';
import React from 'react';
import ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';
import { rectSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ArrowLeftFromLineIcon, GripVerticalIcon, MoveHorizontal, PlusIcon, SaveIcon, SquarePenIcon, TrashIcon, XIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { v4 as uuid } from 'uuid';

import { cn } from '@/lib/classnames';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormItem, FormField, FormControl, FormDescription, FormMessage, FormLabel } from '@/components/ui/form';
import { Select, SelectValue, SelectTrigger, SelectContent, SelectItem } from '@/components/ui/select';
import {
    MultipleContainers,
    DroppableContainer,
    DroppableContainerLite,
    SortableItem,
    EachItem,
    EachColum,
    type ColumnAdapter,
    type ItemData,
    type RenderColumnUIArg,
    type RenderItemArgs,
    type ColumnData,
    type ColumnId,
} from '@/app/dev/tutorial/official-dnd-kit/(stories)/example/games/playing-cards-refactor/_party/components/kanban';

import style from './app.module.scss';

import { Timeline } from 'vis-timeline/standalone';
import { TimelineOptions as InternalTimelineOptions, DataItem, DataGroup /* TimelineItem */ } from 'vis-timeline/types';
import { template, templateOptimaze } from '@/app/dev/research/lab/vis-timeline/first-try/_party/components/mytimeline';
import { UniqueIdentifier } from '@dnd-kit/core';

type ColumnType = { isWork: boolean };

type ItemType = {
    /** default now() */
    start?: Date;
    end?: Date;
    /** duration in milisecond */
    duration: number;
    durationCutDown?: {
        byGoldPass?: number;
        byBuilderApprentice?: number;
    };
    duratationAfterCutDown?: number;
    builderApprentice: {
        /** 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8, default: 0 */
        level: number;
    };
    goldPass: {
        /** 0 | 10 | 15 | 20, default: 0 */
        boost: number;
    };
};
type DataKanban = ColumnAdapter<ColumnType, ItemType>;

const initialDataKanban: DataKanban = {
    paga: {
        id: 'paga',
        title: 'ini PAGA',
        isWork: true,
        childrens: [
            {
                id: 'a',
                title: 'ini A',
                start: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 0, 1, 6),
                end: new Date(new Date().setDate(new Date().getDate() + 1)),
                duration: 86_400_000,
                builderApprentice: { level: 7 },
                goldPass: { boost: 20 },
            },
            // { id: 'b', title: 'ini B', start: new Date() },
            // { id: 'c', title: 'ini C', start: new Date() },
        ],
    },
    gigih: {
        id: 'gigih',
        title: 'ini GIGIH',
        isWork: true,
        childrens: [
            { id: 'x', title: 'ini X', duration: 129_600_000, builderApprentice: { level: 0 }, goldPass: { boost: 0 } },
            { id: 'y', title: 'ini Y', duration: 172_800_000, builderApprentice: { level: 0 }, goldPass: { boost: 0 } },
            { id: 'z', title: 'ini Z', duration: 259_200_000, builderApprentice: { level: 0 }, goldPass: { boost: 0 } },
        ],
    },
};

export function App() {
    const [columns, setColumns] = React.useState<DataKanban>(/* initialDataKanban */ {});

    console.log('app state columns', columns);
    return (
        <div className={cn(style['app'], 'h-full overflow-hidden')}>
            <TimeLine
                columns={columns}
                setColumns={setColumns}
            />
            <div className="w-full overflow-y-auto">
                <KanbanBoard
                    columns={columns}
                    setColumns={setColumns}
                />
            </div>
        </div>
    );
}

//* Kanban
function KanbanBoard({ columns, setColumns }: { columns: DataKanban; setColumns: React.Dispatch<React.SetStateAction<DataKanban>> }) {
    return (
        <MultipleContainers
            aria-description="kanban board"
            className="w-fit dark:[&>button]:!text-primary"
            columns={columns}
            setColumns={setColumns}
            isTrashable={true}
            isMinimal={false}
            render={({ columnIds, isMinimal, isSortingContainer, columns, getIndex, renderItemUI, getItemStyles, addColumnFn, removeColumnFn }) => (
                <EachColum
                    columns={columns}
                    columnIds={columnIds}
                    isMinimal={isMinimal}
                    isSortingContainer={isSortingContainer}
                    addColumFn={addColumnFn}
                    renderColumns={({ dataItems, dataColumn, columnId, indexContainer }) => {
                        return (
                            <DroppableContainerLite
                                key={columnId}
                                columnId={columnId}
                                dataItems={dataItems}
                                renderColumnUI={(renderColumnUIArgs) => (
                                    <ColumnKanban
                                        {...renderColumnUIArgs}
                                        dataColumn={dataColumn}
                                        setColumns={setColumns}
                                        columnId={columnId}
                                    >
                                        <EachItem
                                            dataItems={dataItems}
                                            strategy={rectSortingStrategy}
                                            renderList={({ itemIndex, dataItem }) => {
                                                return (
                                                    <SortableItem
                                                        disabled={isSortingContainer}
                                                        // disabled={false}
                                                        key={dataItem.id}
                                                        id={dataItem.id}
                                                        index={itemIndex}
                                                        isHandle={true}
                                                        // wrapperStyle={() => ({})}
                                                        getItemStyles={getItemStyles}
                                                        renderItemUI={({ ref, ...renderItemUIArgs }) => (
                                                            <ItemKanban
                                                                ref={ref}
                                                                {...renderItemUIArgs}
                                                                dataItem={dataItem}
                                                                setColumns={setColumns}
                                                            />
                                                        )}
                                                        columnId={columnId}
                                                        getIndex={getIndex}
                                                    />
                                                );
                                            }}
                                        />
                                    </ColumnKanban>
                                )}
                            />
                        );
                    }}
                />
            )}
            getItemStyles={({ value, index, overIndex, isDragging, columnId, isSorting, isDragOverlay }) => {
                const dataItems = columns[columnId].childrens || [];
                const calculatedZIndex = isDragOverlay ? undefined : isDragging ? dataItems.length - overIndex : dataItems.length - index;
                // console.log(`isDragOverlay ${columnId}`, isDragOverlay, `zIndex:${calculatedZIndex} `);
                return {
                    zIndex: calculatedZIndex,
                };
            }}
        />
    );
}

type ColumnKanbanProps = RenderColumnUIArg & {
    children: React.ReactNode;
    dataColumn: ColumnData<ColumnType, ItemType>;
    columnId: ColumnId<ColumnType, ItemType>;
    setColumns: React.Dispatch<React.SetStateAction<DataKanban>>;
};

function ColumnKanban(_props: ColumnKanbanProps) {
    const {
        // ui
        setNodeRef,
        isOverContainer,
        isDragging,
        listeners,
        attributes,
        // state
        dataColumn,
        columnId,
        setColumns,
        // other
        children,
    } = _props;
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [isEditMode, setIsEditMode] = React.useState(false);

    function handleAddItem() {
        setColumns((prev) => {
            const { [columnId]: dataEditable, ...dataOld } = prev;

            const columnIds = Object.keys(prev) as (keyof DataKanban)[]; // temp column order

            const allItemCount = columnIds.reduce((count: number, colId) => count + prev[colId].childrens.length, 0);

            const newData: ColumnData<ColumnType, ItemType> = {
                ...dataEditable,
                childrens: [
                    ...dataEditable.childrens,
                    {
                        id: uuid(),
                        duration: 0,
                        start: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 0, 1, 6),
                        builderApprentice: { level: 0 },
                        goldPass: { boost: 0 },
                        title: `item ${allItemCount + 1}`,
                    },
                ],
            };

            // merge all old data with new data updated
            const dataUpdated: DataKanban = { ...dataOld, [columnId]: newData };

            // to keep the column order unchanged
            const dataUpdatedWithOldOrderedColum = columnIds.reduce((acc, currColId) => {
                return { ...acc, [currColId]: dataUpdated[currColId] };
            }, {} as DataKanban);

            return dataUpdatedWithOldOrderedColum;
        });
    }

    return (
        <div
            ref={setNodeRef}
            className={cn(
                'flex flex-col overflow-hidden min-w-[350px] m-[10px] rounded-[5px] min-h-[200px] bg-[#f6f6f6] border border-[#0000000d]',
                isOverContainer && 'bg-[#ebebeb]'
            )}
            style={style}
        >
            <div className="group/column-header flex items-center _justify-between bg-[#fff] rounded-tl-[5px] rounded-tr-[5px] border-b border-[#00000014] py-[5px] pr-[8px] pl-[20px]">
                <div className="flex-1 overflow-x-hidden">
                    {isEditMode ? (
                        <Input
                            onBlur={(e) => {
                                setColumns((prev) => {
                                    const columEditable = prev[columnId];
                                    return {
                                        ...prev,
                                        [columnId]: {
                                            ...columEditable,
                                            title: e.target.value,
                                        },
                                    };
                                });
                                setIsEditMode(false);
                            }}
                            defaultValue={dataColumn.title}
                        />
                    ) : (
                        <p className="text-nowrap">{dataColumn.title}</p>
                    )}
                </div>
                <div className="flex">
                    {isEditMode ? (
                        <>
                            <Button
                                title="save"
                                variant="ghost"
                                className="group-hover/column-header:opacity-100 opacity-0 text-[#919eab] bg-transparent hover:bg-[#0000000d] w-fit h-fit py-[12px] px-[6px]"
                                onClick={() => setIsEditMode(false)}
                            >
                                <SaveIcon className="size-[14px]" />
                            </Button>
                            <Button
                                title="cancel edit"
                                variant="ghost"
                                className="group-hover/column-header:opacity-100 opacity-0 text-[#919eab] bg-transparent hover:bg-[#0000000d] w-fit h-fit py-[12px] px-[6px]"
                                onClick={() => setIsEditMode(false)}
                            >
                                <ArrowLeftFromLineIcon className="size-[14px]" />
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button
                                title="edit"
                                variant="ghost"
                                className="group-hover/column-header:opacity-100 opacity-0 text-[#919eab] bg-transparent hover:bg-[#0000000d] w-fit h-fit py-[12px] px-[6px]"
                                onClick={() => setIsEditMode(true)}
                            >
                                <SquarePenIcon className="size-[14px]" />
                            </Button>
                            <Button
                                title="delete"
                                variant="ghost"
                                className="group-hover/column-header:opacity-100 opacity-0 text-[#919eab] bg-transparent hover:bg-[#0000000d] w-fit h-fit py-[12px] px-[6px]"
                                onClick={() => {
                                    setColumns((prev) => {
                                        const { [columnId]: deletetedData, ...newData } = prev;
                                        return newData;
                                    });
                                }}
                            >
                                <XIcon className="size-[14px]" />
                            </Button>
                        </>
                    )}
                    <Button
                        variant="ghost"
                        className={cn(
                            'cursor-grab text-[#919eab] bg-transparent hover:bg-[#0000000d] w-fit h-fit py-[12px] px-[6px]',
                            isDragging && 'cursor-grabbing'
                        )}
                        {...attributes}
                        {...listeners}
                    >
                        <GripVerticalIcon className="size-[14px]" />
                    </Button>
                </div>
            </div>

            <ul className="flex-1 flex flex-col _grid gap-[10px] p-[20px] m-0 _grid-cols-[repeat(var(--columns,1),1fr)]">{children}</ul>
            <div className="bg-[#fff] border-t border-[#0000000d] py-2 px-2">
                <Button
                    title="Add item"
                    variant="outline"
                    className="w-fit h-fit p-1 text-[#919eab]"
                    onClick={() => handleAddItem()}
                >
                    <PlusIcon className="size-4" />
                </Button>
            </div>
        </div>
    );
}

type ItemKanbanProps = RenderItemArgs & {
    dataItem: ItemData<ItemType>;
    setColumns: React.Dispatch<React.SetStateAction<DataKanban>>;
};

function ItemKanban_(_props: ItemKanbanProps, ref: React.ForwardedRef<HTMLLIElement>) {
    const {
        // ui
        transform,
        transition,
        isDragging,
        // ref: _ref,
        listeners,
        // state
        dataItem,
        setColumns,
    } = _props;
    const style: React.CSSProperties = {
        transform: transform ? CSS.Transform.toString(transform) : undefined,
        transition: transition || undefined,
    };

    const formatedDurationOriginal = formatedDuration(dataItem.duration);

    const formatedDurationCutDownByGoldPass = formatedDuration(dataItem.durationCutDown?.byGoldPass ?? 0);
    const formatedDurationCutDownByBuilderApprentice = formatedDuration(dataItem.durationCutDown?.byBuilderApprentice ?? 0);

    const formatedDuratationFinal = formatedDuration(dataItem.duratationAfterCutDown || dataItem.duration);

    function handleDeleteItem() {
        setColumns((prev) => {
            const columnId = findContainer(prev, dataItem.id);
            if (!columnId) throw new Error(`id column not found for item with id:${dataItem.id}`);
            const { [columnId]: dataEditable, ...dataOld } = prev;

            const columnIds = Object.keys(prev) as (keyof DataKanban)[]; // temp column order

            const newData: ColumnData<ColumnType, ItemType> = {
                ...dataEditable,
                childrens: dataEditable.childrens.filter((item) => item.id !== dataItem.id),
            };

            // merge all old data with new data updated
            const dataUpdated: DataKanban = { ...dataOld, [columnId]: newData };

            // to keep the column order unchanged
            const dataUpdatedWithOldOrderedColum = columnIds.reduce((acc, currColId) => {
                return { ...acc, [currColId]: dataUpdated[currColId] };
            }, {} as DataKanban);

            return dataUpdatedWithOldOrderedColum;
        });
    }

    return (
        <div
            ref={ref as React.ForwardedRef<HTMLDivElement>}
            className={cn('_bg-red-400 group/item-card h-fit bg-[#fff] p-2 rounded-md flex items-center', isDragging && 'opacity-40')}
            style={{
                ...style,
                boxShadow: '0 0 0 calc(1px / var(--scale-x, 1)) rgba(63, 63, 68, 0.05), 0 1px calc(3px / var(--scale-x, 1)) 0 rgba(34, 33, 81, 0.15)',
            }}
        >
            <div className="flex-1 flex flex-col text-2xs">
                <div>
                    <span>Title: </span>
                    <span>{dataItem.title}</span>
                </div>
                <div className="mb-2">
                    <span>Duration: </span>
                    <span className="font-bold">{formatedDurationOriginal.word}</span>&nbsp;
                    <span className="text-3xs italic">({formatedDurationOriginal.numSeparate})</span>
                </div>
                <div>
                    <span>Gold pass boost: </span>
                    <span>{dataItem.goldPass.boost}</span>
                </div>
                <div className="mb-2">
                    <span>Duration cut down by gold pass: </span>
                    <span className="font-bold">{formatedDurationCutDownByGoldPass.word}</span>&nbsp;
                    <span className="text-3xs italic">({formatedDurationCutDownByGoldPass.numSeparate})</span>
                </div>
                <div>
                    <span>Builder apprentice level: </span>
                    <span>{dataItem.builderApprentice.level}</span>
                </div>
                <div className="mb-2">
                    <span>Duration cut down by builder apprentice: </span>
                    <span className="font-bold">{formatedDurationCutDownByBuilderApprentice.word}</span>&nbsp;
                    <span className="text-3xs italic">({formatedDurationCutDownByBuilderApprentice.numSeparate})</span>
                </div>
                <div>
                    <span>Duration Final: </span>
                    <span className="font-bold underline">{formatedDuratationFinal.word}</span>&nbsp;
                    <span className="text-3xs italic">({formatedDuratationFinal.numSeparate})</span>
                </div>
            </div>
            <div className="flex items-center">
                <div className="flex flex-col group-hover/item-card:opacity-100 opacity-0 ">
                    <DialogCreateItemKanban
                        dataItem={dataItem}
                        setColumns={setColumns}
                        trigger={
                            <Button
                                title="edit item"
                                variant="ghost"
                                className=" text-[#919eab] bg-transparent hover:bg-[#0000000d] w-fit h-fit py-[6px] px-[6px]"
                            >
                                <SquarePenIcon className="size-[14px]" />
                            </Button>
                        }
                    />
                    <Button
                        title="delete item"
                        variant="ghost"
                        className=" text-[#919eab] bg-transparent hover:bg-[#0000000d] w-fit h-fit py-[6px] px-[6px]"
                        onClick={() => handleDeleteItem()}
                    >
                        <TrashIcon className="size-[14px]" />
                    </Button>
                </div>
                <Button
                    variant="ghost"
                    className={cn(
                        'cursor-grab text-[#919eab] bg-transparent hover:bg-[#0000000d] w-fit h-fit py-[12px] px-[6px]',
                        isDragging && 'cursor-grabbing'
                    )}
                    {...listeners}
                >
                    <GripVerticalIcon className="size-[14px]" />
                </Button>
            </div>
        </div>
    );
}

const ItemKanban = React.memo(React.forwardRef<HTMLLIElement, ItemKanbanProps>((a, b) => ItemKanban_(a, b)));

type DialogCreateItemKanbanlProps = {
    trigger: React.ReactNode;
    dataItem: ItemData<ItemType>;
    setColumns: React.Dispatch<React.SetStateAction<DataKanban>>;
};

function DialogCreateItemKanban({ trigger, dataItem, setColumns }: DialogCreateItemKanbanlProps) {
    const [isOpenDialog, setIsOpenDialog] = React.useState<boolean>(false);

    return (
        <Dialog
            open={isOpenDialog}
            onOpenChange={setIsOpenDialog}
        >
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className="">
                <DialogHeader>
                    <DialogTitle className="flex gap-2">Add depedency {dataItem.id}</DialogTitle>
                    <DialogDescription>Add a depedency to your topic. You can add as many depedencys as you want to a topic.</DialogDescription>
                </DialogHeader>
                <div className="gap-4 py-4">
                    <FormItemKanban
                        dataItem={dataItem}
                        setColumns={setColumns}
                        setIsOpenDialog={setIsOpenDialog}
                    />
                </div>
                {/*     <DialogFooter>
                    <Button
                        size="sm"
                        className={cn('w-full')}
                        // onClick={form.handleSubmit((d) => handleOnSubmit(d))}
                    >
                        Confirm
                    </Button>
                </DialogFooter> */}
            </DialogContent>
        </Dialog>
    );
}

const GOLDPASS_BOST = [0, 10, 15, 20] as const;
const BUILDER_APPRENTICE_LEVEL = [0, 1, 2, 3, 4, 5, 6, 7, 8] as const;

function numberEnum<T extends number>(values: readonly T[]) {
    const set = new Set<unknown>(values);
    return (v: number, ctx: z.RefinementCtx): v is T => {
        if (!set.has(v)) {
            ctx.addIssue({
                code: z.ZodIssueCode.invalid_enum_value,
                received: v,
                options: [...values],
            });
        }
        return z.NEVER;
    };
}

const itemKanbanSchema = z.object({
    title: z.string().min(1, { message: 'title is required' }),
    minute: z.number().gte(0, { message: 'this is to small' }).lte(60, { message: 'this is to large' }),
    hour: z.number().gte(0, { message: 'this is to small' }).lte(24, { message: 'this is to large' }),
    day: z.number().gte(0, { message: 'this is to small' }).lte(30, { message: 'this is to large' }),
    month: z.number().gte(0, { message: 'this is to small' }).lte(12, { message: 'this is to large' }),
    // goldPassBost: ,
    builderApprenticeLevel: z.number().superRefine(numberEnum(BUILDER_APPRENTICE_LEVEL)),
    goldPassBost: z.number().superRefine(numberEnum(GOLDPASS_BOST)),
});

type ItemKanbanSchema = z.infer<typeof itemKanbanSchema>;

type FormItemKanbanProps = {
    setIsOpenDialog: React.Dispatch<React.SetStateAction<boolean>>;
    setColumns: React.Dispatch<React.SetStateAction<DataKanban>>;
    dataItem: ItemData<ItemType>;
};

function FormItemKanban({ dataItem, setColumns, setIsOpenDialog }: FormItemKanbanProps) {
    const duration = breakDownDurationToTimeUnits(dataItem.duration);
    const form = useForm<ItemKanbanSchema>({
        defaultValues: {
            title: dataItem.title,
            minute: duration.minutes,
            hour: duration.hours,
            day: duration.days,
            month: duration.months,
            builderApprenticeLevel: dataItem.builderApprentice.level as (typeof BUILDER_APPRENTICE_LEVEL)[number],
            goldPassBost: dataItem.goldPass.boost as (typeof GOLDPASS_BOST)[number],
        },
        resolver: zodResolver(itemKanbanSchema),
    });

    function handleUpdateItem(data: ItemKanbanSchema) {
        // window.alert(JSON.stringify({ ...data, duration }, null, 2));

        /**
         * update data item
         */
        setColumns((prev) => {
            const columnId = findContainer(prev, dataItem.id);
            if (!columnId) throw new Error(`id column not found for item with id:${dataItem.id}`);

            const { [columnId]: dataEditable, ...dataOld } = prev;

            const columnIds = Object.keys(prev) as (keyof DataKanban)[]; // temp column order

            // *

            // updated item
            const newData: ColumnData<ColumnType, ItemType> = {
                ...dataEditable,

                childrens: prev[columnId].childrens.map((item) => {
                    if (item.id === dataItem.id) {
                        const durationOriginal = timeUnitsToMilliseconds({
                            months: data.month,
                            days: data.day,
                            hours: data.hour,
                            minutes: data.minute,
                        });

                        const cutDownByGoldPass = calculateDiscountGoldPass(durationOriginal, data.goldPassBost);
                        const duratationAfterCutDownByGoldPass = durationOriginal - cutDownByGoldPass;
                        const cutDownByBuilderApprentice = calculateDiscountBuilderApprentice(
                            duratationAfterCutDownByGoldPass,
                            data.builderApprenticeLevel
                        );

                        console.log('log dicount', {
                            name: item.title,
                            durationOriginal,
                            cutDownByGoldPass,
                            duratationAfterCutDownByGoldPass,
                            cutDownByBuilderApprentice,
                        });

                        const duratationAfterCutDown = duratationAfterCutDownByGoldPass - cutDownByBuilderApprentice;

                        const newData: ItemData<ItemType> = {
                            ...item,
                            title: data.title,
                            goldPass: {
                                ...item.goldPass,
                                boost: data.goldPassBost,
                            },
                            builderApprentice: {
                                ...item.builderApprentice,
                                level: data.builderApprenticeLevel,
                            },
                            duration: durationOriginal,
                            durationCutDown: {
                                byGoldPass: cutDownByGoldPass,
                                byBuilderApprentice: cutDownByBuilderApprentice,
                            },
                            duratationAfterCutDown: duratationAfterCutDown,
                        };

                        return newData;
                    }
                    return item;
                }),
            };

            // merge all old data with new data updated
            const dataUpdated: DataKanban = { ...dataOld, [columnId]: newData };

            // to keep the column order unchanged
            const dataUpdatedWithOldOrderedColum = columnIds.reduce((acc, currColId) => {
                return { ...acc, [currColId]: dataUpdated[currColId] };
            }, {} as DataKanban);

            return dataUpdatedWithOldOrderedColum;
        });

        setIsOpenDialog(false);
    }

    // console.log('form state', form.formState);

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit((d) => handleUpdateItem(d))}>
                <div className="space-y-2 mb-8">
                    <FormField
                        name="title"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem className="space-y-1">
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input
                                        className="h-8"
                                        {...field}
                                        placeholder="John Wick"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div>
                        <FormLabel htmlFor="month">Duration</FormLabel>
                        <div className="flex items-center space-x-2">
                            <FormField
                                name="month"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem className="flex items-center space-y-0 space-x-1">
                                        <FormLabel>Mont</FormLabel>
                                        <Select
                                            // disabled={isLoading}
                                            defaultValue={field.value.toString()}
                                            onValueChange={(val) => field.onChange(Number(val))}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="h-8">
                                                    <SelectValue placeholder="Select a role" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className="max-h-[200px]">
                                                {Array.from({ length: 13 }, (_, index) => index.toString()).map((month) => (
                                                    <SelectItem
                                                        key={`month-${month}`}
                                                        className="text-xs py-1"
                                                        value={month}
                                                    >
                                                        {month}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                name="day"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem className="flex items-center space-y-0 space-x-1">
                                        <FormLabel>Day</FormLabel>
                                        <Select
                                            // disabled={isLoading}
                                            defaultValue={field.value.toString()}
                                            onValueChange={(val) => field.onChange(Number(val))}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="h-8">
                                                    <SelectValue placeholder="Select a role" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className="max-h-[200px]">
                                                {Array.from({ length: 31 }, (_, index) => index.toString()).map((day) => (
                                                    <SelectItem
                                                        key={`day-${day}`}
                                                        className="text-xs py-1"
                                                        value={day}
                                                    >
                                                        {day}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                name="hour"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem className="flex items-center space-y-0 space-x-1">
                                        <FormLabel>Hour</FormLabel>
                                        <Select
                                            // disabled={isLoading}
                                            defaultValue={field.value.toString()}
                                            onValueChange={(val) => field.onChange(Number(val))}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="h-8">
                                                    <SelectValue placeholder="Select a role" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className="max-h-[200px]">
                                                {Array.from({ length: 25 }, (_, index) => index.toString()).map((hour) => (
                                                    <SelectItem
                                                        key={`hour-${hour}`}
                                                        className="text-xs py-1"
                                                        value={hour}
                                                    >
                                                        {hour}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                name="minute"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem className="flex items-center space-y-0 space-x-1">
                                        <FormLabel>Minute</FormLabel>
                                        <Select
                                            // disabled={isLoading}
                                            defaultValue={field.value.toString()}
                                            onValueChange={(val) => field.onChange(Number(val))}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="h-8">
                                                    <SelectValue placeholder="Select a role" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className="max-h-[200px]">
                                                {Array.from({ length: 61 }, (_, index) => index.toString()).map((minute) => (
                                                    <SelectItem
                                                        key={`minute-${minute}`}
                                                        className="text-xs py-1"
                                                        value={minute}
                                                    >
                                                        {minute}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                    <FormField
                        name="goldPassBost"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem className="space-y-1">
                                <FormLabel>Gold Pass Bost</FormLabel>
                                <Select
                                    // disabled={isLoading}
                                    defaultValue={field.value.toString()}
                                    onValueChange={(val) => field.onChange(Number(val))}
                                >
                                    <FormControl>
                                        <SelectTrigger className="h-8">
                                            <SelectValue placeholder="Select a role" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent className="max-h-[200px]">
                                        {Array.from(GOLDPASS_BOST, (value) => value.toString()).map((bost) => (
                                            <SelectItem
                                                key={`gold-pass-bost-${bost}`}
                                                className="text-xs py-1"
                                                value={bost}
                                            >
                                                {bost}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        name="builderApprenticeLevel"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem className="space-y-1">
                                <FormLabel>Builder apprentice level</FormLabel>
                                <Select
                                    // disabled={isLoading}
                                    defaultValue={field.value.toString()}
                                    onValueChange={(val) => field.onChange(Number(val))}
                                >
                                    <FormControl>
                                        <SelectTrigger className="h-8">
                                            <SelectValue placeholder="Select a role" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent className="max-h-[200px]">
                                        {Array.from(BUILDER_APPRENTICE_LEVEL, (value) => value.toString()).map((level) => (
                                            <SelectItem
                                                key={`builder-apprentice-level-${level}`}
                                                className="text-xs py-1"
                                                value={level}
                                            >
                                                {level}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <Button
                    size="default"
                    // disabled={isLoading}
                    type="submit"
                    className="w-full h-7"
                >
                    save
                    {/* {isLoading && <RefreshCwIcon className="ml-1 size-3 animate-spin" />} */}
                </Button>
            </form>
        </Form>
    );
}

//* Timeline

type TimelineItem = DataItem & { data: { duration: number; durationCutDown: number } };
type TimelineGroup = DataGroup & {};

const CardTimeline: React.FC<{ item: TimelineItem }> = ({ item }) => (
    <div className=" bg-[#fff] flex h-[40px] max-h-[40px] overflow-y-hidden p-[2px] text-2xs gap-x-1">
        <div className=" border-[#00000014] border h-full p-[4px] flex justify-center items-center rounded ">
            <h2 className="text-xs">{item.content}</h2>
        </div>
        <div className="flex flex-col bg-[#f6f6f6]">
            <div className="flex text-3xs">
                <span>Duration:</span>&nbsp;
                <strong>{formatedDuration(item.data.duration).word}</strong>
            </div>
            <div className="flex text-3xs">
                <span>Cutdown:</span>&nbsp;
                <strong>{formatedDuration(item.data.durationCutDown).word}</strong>
            </div>
        </div>
    </div>
);

const timelineOptions: InternalTimelineOptions = {
    stack: false,
    editable: true,
    start: new Date(),
    end: new Date(new Date().setMonth(new Date().getMonth() + 3)),
    margin: {
        item: 25,
        axis: 25,
    },
    orientation: 'bottom',
    align: 'left',
    groupHeightMode: 'fitItems',
    template: (item?: TimelineItem, element?: HTMLDivElement, data?: TimelineItem) => {
        // console.log('template', { item, data });
        if (!item || !element) {
            return '';
        }

        const root = createRoot(element); // createRoot(container!) if you use TypeScript
        root.render(<CardTimeline item={item} />);
        return '';
    },
};

function TimeLine({ columns, setColumns }: { columns: DataKanban; setColumns: React.Dispatch<React.SetStateAction<DataKanban>> }) {
    const timelineRef = React.useRef<HTMLDivElement | null>(null);
    const timelineInstance = React.useRef<Timeline | null>(null);

    React.useEffect(() => {
        const container = timelineRef.current;
        if (container) {
            const { timelineItems, timelineGroups, ...timelineMaraton } = generateTimelineMaraton(columns);
            console.log('timelineMaraton', { timelineItems, timelineGroups, ...timelineMaraton });

            timelineInstance.current = new Timeline(container, timelineItems, timelineGroups, timelineOptions);

            // timelineInstance.current.on('change', handleTimelineChange);
        }

        return () => {
            timelineInstance.current?.destroy();
        };
    }, [columns]);

    return (
        <div>
            <div
                ref={timelineRef}
                id="visualization-timeline"
                className="flex-1 bg-white shadow rounded-lg border p-4 mb-2"
            />
            <div className="flex justify-center gap-x-1">
                <Button
                    variant="outline"
                    title="Go to now"
                    onClick={() => {
                        if (!timelineInstance.current) return;
                        timelineInstance.current.moveTo(new Date());
                    }}
                >
                    Now
                </Button>
                <Button
                    variant="outline"
                    title="Show All Items"
                    onClick={() => {
                        if (!timelineInstance.current) return;
                        timelineInstance.current.fit();
                    }}
                >
                    <MoveHorizontal />
                </Button>
                <Button
                    variant="outline"
                    title="Show 1 week"
                    onClick={() => {
                        if (!timelineInstance.current) return;
                        timelineInstance.current.setWindow(new Date(), new Date(new Date().setDate(new Date().getDate() + 7)));
                    }}
                >
                    1 week
                </Button>
                <Button
                    variant="outline"
                    title="Show 1 month"
                    onClick={() => {
                        if (!timelineInstance.current) return;
                        timelineInstance.current.setWindow(new Date(), new Date(new Date().setMonth(new Date().getMonth() + 1)));
                    }}
                >
                    1 month
                </Button>
                <Button
                    variant="outline"
                    title="Show 3 month"
                    onClick={() => {
                        if (!timelineInstance.current) return;
                        timelineInstance.current.setWindow(new Date(), new Date(new Date().setMonth(new Date().getMonth() + 3)));
                    }}
                >
                    3 month
                </Button>
            </div>
        </div>
    );
}

//* Utility
function getTimeInMilisecond() {
    const inMilisecond = 1,
        inSecond = 1000 * inMilisecond,
        inMinute = 60 * inSecond,
        inHour = 60 * inMinute,
        inDay = 24 * inHour,
        inMonth = 30 * inDay;

    return { inMilisecond, inSecond, inMinute, inHour, inDay, inMonth };
}

/**
 * decompose duration, for compose duration use `timeUnitsToMilliseconds`
 * @param time - in milisecond
 * @returns
 */
function breakDownDurationToTimeUnits(time: number) {
    const inMilisecond = 1,
        inSecond = 1000 * inMilisecond,
        inMinute = 60 * inSecond,
        inHour = 60 * inMinute,
        inDay = 24 * inHour,
        inMonth = 30 * inDay;

    let remainingTime = time;

    const months = Math.floor(remainingTime / inMonth);
    remainingTime %= inMonth;

    const days = Math.floor(remainingTime / inDay);
    remainingTime %= inDay;

    const hours = Math.floor(remainingTime / inHour);
    remainingTime %= inHour;

    const minutes = Math.floor(remainingTime / inMinute);
    remainingTime %= inMinute;

    const seconds = Math.floor(remainingTime / inSecond);
    remainingTime %= inSecond;

    const miliseconds = Math.floor(remainingTime / inMilisecond);

    return {
        miliseconds,
        seconds,
        minutes,
        hours,
        days,
        months,
    };
}

/**
 * compose duration, for decompose duration use `breakDownDurationToTimeUnits`
 * @param {{ miliseconds?: number; seconds?: number; minutes?: number; hours?: number; days?: number; months?: number }} time
 * @returns {number}
 */
function timeUnitsToMilliseconds(time: { miliseconds?: number; seconds?: number; minutes?: number; hours?: number; days?: number; months?: number }) {
    const inMilisecond = 1,
        inSecond = 1000 * inMilisecond,
        inMinute = 60 * inSecond,
        inHour = 60 * inMinute,
        inDay = 24 * inHour,
        inMonth = 30 * inDay;
    return (
        (time.miliseconds || 0) * inMilisecond +
        (time.seconds || 0) * inSecond +
        (time.minutes || 0) * inMinute +
        (time.hours || 0) * inHour +
        (time.days || 0) * inDay +
        (time.months || 0) * inMonth
    );
}

const findContainer = (columns: DataKanban, id: UniqueIdentifier) => {
    return (Object.keys(columns) as (keyof DataKanban)[]).find((key) => columns[key].childrens.some((child) => child.id === id));
};

function calculateDiscountGoldPass(duration: number, boost: number) {
    return (duration / 100) * boost;
}

/**
 * Fungsi untuk menghitung waktu selesai Builder Apprentice
 * - blueprint:
 * >- Builder Apprentice level 0, akan menghasilkan cutoff time 0
 * >- Builder Apprentice level 1, akan menghasilkan cutoff time 0
 * >- Builder Apprentice level 2-8, akan menghitung cutoff
 * @param {number} duration - in milisecond
 * @param {number} level
 * @returns {number}
 */
function calculateDiscountBuilderApprentice(duration: number, level: number) {
    if (level === 0) return 0;

    // Define constants
    const TOTAL_WORK_MS = duration; // 864000000 10 days in milliseconds
    const MS_PER_HOUR = 3_600_000;
    const HOURS_IN_A_DAY = 24;

    // Robot modes
    const NORMAL_SPEED = 1; // 1 unit per hour
    const BOOST_SPEED = level; // 6 6 units per hour

    // Calculate total work in units
    const TOTAL_WORK_UNITS = TOTAL_WORK_MS / MS_PER_HOUR;

    // Daily work breakdown
    const BOOST_HOURS = 1; // Boost period is 1 hour per day
    const NORMAL_HOURS = HOURS_IN_A_DAY - BOOST_HOURS; // Remaining hours in normal mode

    // Units completed in a day
    const DAILY_UNITS = BOOST_SPEED * BOOST_HOURS + NORMAL_SPEED * NORMAL_HOURS;

    // Calculate total days and remaining work
    const fullDays = Math.floor(TOTAL_WORK_UNITS / DAILY_UNITS);
    const remainingUnits = TOTAL_WORK_UNITS % DAILY_UNITS;

    // Calculate remaining time on the last day
    let extraTimeMs = 0;
    if (remainingUnits > 0) {
        // Calculate time in boost mode
        if (remainingUnits <= BOOST_SPEED) {
            extraTimeMs = (remainingUnits / BOOST_SPEED) * MS_PER_HOUR;
        } else {
            // Time in boost mode
            extraTimeMs += MS_PER_HOUR;
            // Remaining work in normal mode
            const remainingNormalUnits = remainingUnits - BOOST_SPEED;
            extraTimeMs += (remainingNormalUnits / NORMAL_SPEED) * MS_PER_HOUR;
        }
    }

    // Total time in milliseconds
    const totalTimeMs = fullDays * HOURS_IN_A_DAY * MS_PER_HOUR + extraTimeMs;

    // Convert total time to a readable format
    // const totalHours = Math.floor(totalTimeMs / MS_PER_HOUR);
    // const totalDays = Math.floor(totalHours / HOURS_IN_A_DAY);
    // const remainingHours = totalHours % HOURS_IN_A_DAY;

    // console.log(`Total time: ${totalDays} days and ${remainingHours} hours`);

    return TOTAL_WORK_MS - totalTimeMs;
}

/**
 * Function for formated duration
 * @param {number} duration - in milisecond
 */
function formatedDuration(duration: number) {
    const breakDown = breakDownDurationToTimeUnits(duration);
    const word = `${breakDown.months}M ${breakDown.days}d ${breakDown.hours}h ${breakDown.minutes}m`;
    const withSeparate = new Intl.NumberFormat('id-ID').format(duration);

    return {
        raw: breakDown,
        /** example: 10M 31d 23h 59m */
        word: word,
        /** example: 300000 to 300.000 */
        numSeparate: withSeparate,
    };
}

function generateTimelineMaraton(columns: DataKanban) {
    const DATE_NOW = new Date();

    const columnIds = Object.keys(columns) as (keyof DataKanban)[];

    const columnOriginal = columns;

    //! by ai
    const columnWithMaraton = columnIds.reduce((acc, currColumnId) => {
        const dataColumn = columns[currColumnId];
        const dataItems = dataColumn.childrens;

        const dataItemsNew = dataItems.reduce((accItem, currItem, idxItem) => {
            let newItem = { ...currItem };
            if (idxItem !== 0) {
                const prevEndDate = accItem[idxItem - 1].end!;
                newItem.start = prevEndDate;
            }
            newItem.end = new Date((newItem.start || DATE_NOW).valueOf() + (newItem.duratationAfterCutDown || newItem.duration));
            accItem.push(newItem);
            return accItem;
        }, [] as ItemData<ItemType>[]);

        return { ...acc, [currColumnId]: { ...dataColumn, childrens: dataItemsNew } };
    }, {} as DataKanban);

    const timelineItems: TimelineItem[] = columnIds.flatMap((columnId) => {
        return columnWithMaraton[columnId].childrens.map((task) => {
            const duration = task.duratationAfterCutDown || task.duration;
            const durationCutDown = (task.durationCutDown?.byBuilderApprentice || 0) + (task.durationCutDown?.byGoldPass || 0);
            const start = task.start || DATE_NOW;
            const end = task.end || new Date(start.valueOf() + duration);

            return {
                id: task.id,
                content: task.title!,
                start,
                end,
                group: columnId,
                data: { duration, durationCutDown },
            } satisfies TimelineItem;
        });
    });

    const timelineGroups: TimelineGroup[] = columnIds.map((columnId) => {
        return {
            id: columnId,
            content: columnWithMaraton[columnId].title!,
        } satisfies TimelineGroup;
    });

    return {
        timelineItems,
        timelineGroups,
        columnOriginal,
        columnWithMaraton,
    };
}
