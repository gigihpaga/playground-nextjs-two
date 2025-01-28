'use client';
import React from 'react';
import { rectSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ArrowLeftFromLineIcon, GripVerticalIcon, SaveIcon, SquarePenIcon, XIcon } from 'lucide-react';

import { cn } from '@/lib/classnames';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MultipleContainers as MultipleContainersOri } from '@/app/dev/tutorial/official-dnd-kit/(stories)/presets/Sortable/MultipleContainers';
import {
    MultipleContainers,
    type ColumnAdapter,
    DroppableContainer,
    DroppableContainerLite,
    SortableItem,
    EachItem,
    EachColum,
    type RenderColumnUIArg,
    type ColumnId as ColumnIdOriginal,
    type ColumnData as ColumnDataOriginal,
} from '../components/kanban';
import {
    PlayingBox,
    PlayingCard,
} from '@/app/dev/tutorial/official-dnd-kit/(stories)/example/games/playing-cards/_party/components/playing-card/PlayingCard';

type ColumnType = { isWork: boolean };
type ItemType = { price: number };

type DataKanban = ColumnAdapter<ColumnType, ItemType>;

type ColumnData = ColumnDataOriginal<ColumnType, ItemType>;

type ColumnId = keyof DataKanban;

export function KanbanBoard() {
    const [columns, setColumns] = React.useState<DataKanban>({
        paga: {
            id: 'paga',
            title: 'ini PAGA',
            isWork: true,
            childrens: [
                { id: 'a', title: 'ini A', price: 1 },
                { id: 'b', title: 'ini B', price: 2 },
                { id: 'c', title: 'ini C', price: 3 },
            ],
        },
        gigih: {
            id: 'gigih',
            title: 'ini GIGIH',
            isWork: true,
            childrens: [
                { id: 'x', title: 'ini X', price: 9 },
                { id: 'y', title: 'ini Y', price: 10 },
                { id: 'z', title: 'ini Z', price: 11 },
            ],
        },
    });

    // return <MultipleContainersOri renderItem={({ value, listeners }) => <div {...listeners}>{value}</div>} />;
    return (
        <Example2
            columns={columns}
            setColumns={setColumns}
        />
        /*  <Example1
            columns={columns}
            setColumns={setColumns}
        /> */
    );
}

function Example2({ columns, setColumns }: { columns: DataKanban; setColumns: React.Dispatch<React.SetStateAction<DataKanban>> }) {
    return (
        <MultipleContainers
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
                                        setColumns={setColumns}
                                        dataColumn={dataColumn}
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
                                                        renderItemUI={renderItemUI}
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
            /* renderItem={({ value, isDragOverlay, isDragging, isSorting, isFadeIn, index, listeners, ref, style: _style, transform, transition }) => {
                return (
                    <PlayingCard
                        //
                        ref={ref as React.ForwardedRef<HTMLDivElement>}
                        value={value as string}
                        isDragging={isDragging}
                        isPickedUp={isDragOverlay}
                        isSorting={isSorting}
                        style={_style}
                        index={index || 0}
                        transform={transform}
                        transition={transition}
                        // mountAnimation={!dragOverlay && !isMounted}
                        isFadeIn={isFadeIn}
                        {...listeners}
                    />
                    // <div className="bg-red-400 py-2" style={style} ref={ref as React.ForwardedRef<HTMLDivElement>} {...listeners}>{value}</div>
                );
            }} */
        />
    );
}
function Example1({ columns, setColumns }: { columns: DataKanban; setColumns: React.Dispatch<React.SetStateAction<DataKanban>> }) {
    return (
        <MultipleContainers
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
                            <DroppableContainer
                                key={columnId}
                                columnId={columnId}
                                label={isMinimal ? undefined : `Column ${columnId}`}
                                dataItems={dataItems}
                                isUnstyled={isMinimal}
                                onRemove={() => removeColumnFn(columnId)}
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
                                                renderItemUI={renderItemUI}
                                                columnId={columnId}
                                                getIndex={getIndex}
                                            />
                                        );
                                    }}
                                />
                            </DroppableContainer>
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
            renderItemUI={({ value, isDragOverlay, isDragging, isSorting, isFadeIn, index, listeners, ref, style: _style, transform, transition }) => {
                return (
                    <PlayingCard
                        //
                        ref={ref as React.ForwardedRef<HTMLDivElement>}
                        value={value as string}
                        isDragging={isDragging}
                        isPickedUp={isDragOverlay}
                        isSorting={isSorting}
                        style={_style}
                        index={index || 0}
                        transform={transform}
                        transition={transition}
                        // mountAnimation={!dragOverlay && !isMounted}
                        isFadeIn={isFadeIn}
                        {...listeners}
                    />
                    // <div className="bg-red-400 py-2" style={style} ref={ref as React.ForwardedRef<HTMLDivElement>} {...listeners}>{value}</div>
                );
            }}
        />
    );
}

type ColumnKanbanProps = {
    children: React.ReactNode;

    dataColumn: ColumnData;
    columnId: ColumnId;
    setColumns: React.Dispatch<React.SetStateAction<DataKanban>>;
} & RenderColumnUIArg;

function ColumnKanban(_props: ColumnKanbanProps) {
    const {
        setNodeRef,
        isOverContainer,
        style,
        attributes,
        listeners,
        children,
        //
        dataColumn,
        columnId,
        setColumns,
    } = _props;
    const [isEditMode, setIsEditMode] = React.useState(false);
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
                            >
                                <XIcon className="size-[14px]" />
                            </Button>
                        </>
                    )}
                    <Button
                        variant="ghost"
                        className="text-[#919eab] bg-transparent hover:bg-[#0000000d] w-fit h-fit py-[12px] px-[6px]"
                        {...attributes}
                        {...listeners}
                    >
                        <GripVerticalIcon className="size-[14px]" />
                    </Button>
                </div>
            </div>

            <ul className="grid gap-[10px] p-[20px] m-0 grid-cols-[repeat(var(--columns,1),1fr)]">{children}</ul>
        </div>
    );
}
