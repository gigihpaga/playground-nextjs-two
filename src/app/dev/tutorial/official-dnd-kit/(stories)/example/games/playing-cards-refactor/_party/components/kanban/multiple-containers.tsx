import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal, unstable_batchedUpdates } from 'react-dom';
import { v4 as uuid } from 'uuid';
import {
    CancelDrop,
    closestCenter,
    pointerWithin,
    rectIntersection,
    CollisionDetection,
    DndContext,
    DragOverlay,
    DropAnimation,
    getFirstCollision,
    KeyboardSensor,
    MouseSensor,
    TouchSensor,
    type Modifiers,
    useDroppable,
    type UniqueIdentifier,
    useSensors,
    useSensor,
    MeasuringStrategy,
    type KeyboardCoordinateGetter,
    defaultDropAnimationSideEffects,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { Arguments as ArgumentUseSortable } from '@dnd-kit/sortable/dist/hooks/useSortable';

import { coordinateGetter as multipleContainersCoordinateGetter } from '@/app/dev/tutorial/official-dnd-kit/(stories)/presets/Sortable/multipleContainersKeyboardCoordinates';
import { Item, ItemProps, Container, ContainerProps } from '@/app/dev/tutorial/official-dnd-kit/_party/components';
import { createRange } from '@/app/dev/tutorial/official-dnd-kit/_party/utilities';

import { ColumnAdapter, ColumnId, ColumnData, ItemData, NonUndefined, StandartRecord } from './types';
import { PLACEHOLDER_ID, TRASH_ID } from './constants';
import { getColor } from './utilities';
import { SortableItemProps } from './sortable-item';
import { cn } from '@/lib/classnames';
// import { ItemProps } from '../../../_party/components/Item/Item';

// export default { title: 'Presets/Sortable/Multiple Containers' };

const dropAnimation: DropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
        styles: {
            active: {
                opacity: '0.5',
            },
        },
    }),
};

// export type Items = Record<UniqueIdentifier, UniqueIdentifier[]>;
// export type Items = Record<UniqueIdentifier, { id: UniqueIdentifier; title?: string; childrens: Array<{ id: UniqueIdentifier; title?: string }> }>;
// export type Items = ColumnAdapter;

export interface MultipleContainersProps<C extends StandartRecord = {}, I extends StandartRecord = {}>
    extends React.HtmlHTMLAttributes<HTMLDivElement> {
    columns: ColumnAdapter<C, I>; // dibutuhkan oleh MultipleContainers & EachColumn
    // data?: Items;
    setColumns?: (items: ColumnAdapter<C, I> | ((items: ColumnAdapter<C, I>) => ColumnAdapter<C, I>)) => void;
    /** default: false */
    isAdjustScale?: boolean; // dibutukan oleh MultipleContainers
    cancelDrop?: CancelDrop; // dibutukan oleh MultipleContainers
    modifiers?: Modifiers; // dibutukan oleh MultipleContainers
    /**
     * default: false
     * digunakan untuk deleted item
     */
    isTrashable?: boolean; // dibutukan oleh MultipleContainers
    coordinateGetter?: KeyboardCoordinateGetter; // dibutukan oleh MultipleContainers
    /** default: false */
    isMinimal?: boolean; // dibutuhkan oleh MultipleContainers & DroppableContainer
    /** default false */
    isVertical?: boolean; // dibuthkan oleh MultipleContainers & EachColumn
    /**
     * function for start point component
     */
    render: (renderProps: {
        columns: ColumnAdapter<C, I>;
        // containerIds: MultipleContainersProps['items'][keyof MultipleContainersProps['items']];
        // containerIds: keyof MultipleContainersProps['items'][];
        // containerIds: (keyof Items)[];
        // columnIds: ColumnId<C, I>[];
        columnIds: (keyof MultipleContainersProps<C, I>['columns'])[];

        isMinimal: NonUndefined<MultipleContainersProps['isMinimal']>;
        // isHandle: NonUndefined<MultipleContainersProps['isHandle']>;
        isSortingContainer: boolean;
        getIndex: (id: UniqueIdentifier) => number;
        renderItemUI: MultipleContainersProps['renderItemUI'];
        addColumnFn(): void;
        removeColumnFn(containerId: UniqueIdentifier): void;
        getItemStyles: MultipleContainersProps['getItemStyles'];
    }) => React.ReactElement | React.ReactElement[];
    /**
     * function for render cutom item, if you have custom UI for item, you can render using this function
     */
    renderItemUI?: ItemProps['renderItem']; // dibutukan oleh MultipleContainers & SortableItem
    /**
     * function for render custom item drag overlay
     * if you passing component in renderItem (custom item), overlay automate using your custom component, but if you passing component to this function, default overlay will be replace
     */
    renderItemDragOverlay?(itemId: UniqueIdentifier): React.ReactElement;
    /**
     * function for render custom container drag overlay
     * container overlay have dafault ui for overlay, but you can replace custom container overlay using this function
     */
    renderContainerDragOverlay?(containerId: ColumnId<C, I>): React.ReactElement;
    /* getItemStyles?(args: {
        value: UniqueIdentifier;
        index: number;
        overIndex: number;
        isDragging: boolean;
        columnId: ColumnId;
        isSorting: boolean;
        isDragOverlay: boolean;
    }): React.CSSProperties; // dibutuhkan oleh SortableItem */
    getItemStyles: SortableItemProps['getItemStyles'];
}

const empty: UniqueIdentifier[] = [];
const emptyChildrens: MultipleContainersProps['columns'][keyof MultipleContainersProps['columns']]['childrens'] = [];

/**
 * 
 ```tsx
 <MultipleContainers
    render={
        <EachColum
            renderColumn={
                <DroppableContainer> //|<<====[UI Column]====>>|
                    <EachItem
                        renderList={
                            <SortableItem> //|<<====[UI Card]====>>|
                            </SortableItem> 
                        }
                    >
                    </EachItem>
                </DroppableContainer>
            }
        >
        </EachColum>
    }
 >
 </MultipleContainers>
 ```
 */
export function MultipleContainers<C extends StandartRecord = {}, I extends StandartRecord = {}>(_props: MultipleContainersProps<C, I>) {
    const {
        columns,
        setColumns,
        className,
        isAdjustScale = false,
        cancelDrop,
        coordinateGetter = multipleContainersCoordinateGetter,
        modifiers,
        isMinimal = false,
        isTrashable = false,
        isVertical = false,
        render,
        renderItemUI,
        renderItemDragOverlay = renderSortableItemDragOverlayDefault,
        renderContainerDragOverlay = renderContainerDragOverlayDefault,
        getItemStyles = () => ({}),
        ...props
    } = _props;

    // const [columnIds, setColumnIds] = useState(Object.keys(columns) as ColumnId[]);
    const columnIds = Object.keys(columns) as ColumnId<C, I>[];
    const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
    const lastOverId = useRef<UniqueIdentifier | null>(null);
    const recentlyMovedToNewContainer = useRef(false);
    const isSortingContainer = activeId != null ? columnIds.includes(activeId) : false;

    /**
     * Custom collision detection strategy optimized for multiple containers
     *
     * - First, find any droppable containers intersecting with the pointer.
     * - If there are none, find intersecting containers with the active draggable.
     * - If there are no intersecting containers, return the last matched intersection
     *
     */
    const collisionDetectionStrategy: CollisionDetection = useCallback(
        (args) => {
            if (activeId && activeId in columns) {
                return closestCenter({
                    ...args,
                    droppableContainers: args.droppableContainers.filter((container) => container.id in columns),
                });
            }

            // Start by finding any intersecting droppable
            const pointerIntersections = pointerWithin(args);
            const intersections =
                pointerIntersections.length > 0
                    ? // If there are droppables intersecting with the pointer, return those
                      pointerIntersections
                    : rectIntersection(args);
            let overId = getFirstCollision(intersections, 'id');

            if (overId != null) {
                if (overId === TRASH_ID) {
                    // If the intersecting droppable is the trash, return early
                    // Remove this if you're not using trashable functionality in your app
                    return intersections;
                }

                if (overId in columns) {
                    // const containerItems = items[overId];
                    const containerItems = columns[overId].childrens;

                    // If a container is matched and it contains items (columns 'A', 'B', 'C')
                    if (containerItems.length > 0) {
                        // Return the closest droppable within that container
                        /*   overId = closestCenter({
                            ...args,
                            droppableContainers: args.droppableContainers.filter(
                                (container) => container.id !== overId && containerItems.includes(container.id)
                            ),
                        })[0]?.id; */
                        overId = closestCenter({
                            ...args,
                            droppableContainers: args.droppableContainers.filter(
                                (container) => container.id !== overId && containerItems.some((child) => child.id === container.id)
                            ),
                        })[0]?.id;
                    }
                }

                lastOverId.current = overId;

                return [{ id: overId }];
            }

            // When a draggable item moves to a new container, the layout may shift
            // and the `overId` may become `null`. We manually set the cached `lastOverId`
            // to the id of the draggable item that was moved to the new container, otherwise
            // the previous `overId` will be returned which can cause items to incorrectly shift positions
            if (recentlyMovedToNewContainer.current) {
                lastOverId.current = activeId;
            }

            // If no droppable is matched, return the last match
            return lastOverId.current ? [{ id: lastOverId.current }] : [];
        },
        [activeId, columns]
    );
    const [clonedItems, setClonedItems] = useState<ColumnAdapter<C, I> | null>(null);
    const sensors = useSensors(
        useSensor(MouseSensor),
        useSensor(TouchSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter,
        })
    );
    const findContainer = (id: UniqueIdentifier) => {
        if (id in columns) {
            return id;
        }

        // return Object.keys(items).find((key) => items[key].includes(id));
        return Object.keys(columns).find((key) => columns[key].childrens.some((child) => child.id === id));
    };

    const getIndex = (id: UniqueIdentifier) => {
        const container = findContainer(id);

        if (!container) {
            return -1;
        }

        // const index = items[container].indexOf(id);
        const index = columns[container].childrens.findIndex((child) => child.id === id);

        return index;
    };

    const getItemData = (itemId: UniqueIdentifier) => {
        return Object.keys(columns)
            .flatMap((containerid) => columns[containerid].childrens)
            .find((child) => child.id == itemId);
    };

    const onDragCancel = () => {
        if (clonedItems) {
            // Reset items to their original state in case items have been
            // Dragged across containers
            setColumns?.(clonedItems);
        }

        setActiveId(null);
        setClonedItems(null);
    };

    useEffect(() => {
        requestAnimationFrame(() => {
            recentlyMovedToNewContainer.current = false;
        });
    }, [columns]);

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={collisionDetectionStrategy}
            measuring={{
                droppable: {
                    strategy: MeasuringStrategy.Always,
                },
            }}
            onDragStart={({ active }) => {
                setActiveId(active.id);
                setClonedItems(columns);
            }}
            onDragOver={({ active, over }) => {
                const overId = over?.id;

                if (overId == null || overId === TRASH_ID || active.id in columns) {
                    return;
                }

                const overContainer = findContainer(overId);
                const activeContainer = findContainer(active.id);

                if (!overContainer || !activeContainer) {
                    return;
                }

                if (activeContainer !== overContainer) {
                    setColumns?.((items) => {
                        // const activeItems = items[activeContainer]; // old
                        const activeItems = items[activeContainer].childrens;
                        // const overItems = items[overContainer]; // old
                        const overItems = items[overContainer].childrens;
                        // const overIndex = overItems.indexOf(overId);
                        const overIndex = overItems.findIndex((item) => item.id === overId);
                        // const activeIndex = activeItems.indexOf(active.id);
                        const activeIndex = activeItems.findIndex((item) => item.id === active.id);

                        let newIndex: number;

                        if (overId in items) {
                            // newIndex = overItems.length + 1;
                            newIndex = overItems.length;
                        } else {
                            /*  const isBelowOverItem =
                                over && active.rect.current.translated && active.rect.current.translated.top > over.rect.top + over.rect.height;
                            */
                            const isBelowOverItem =
                                over && active.rect.current.translated && active.rect.current.translated.top > over.rect.top + over.rect.height / 2; // Use half height for better precision
                            const modifier = isBelowOverItem ? 1 : 0;

                            // newIndex = overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
                            newIndex = overIndex >= 0 ? overIndex + modifier : overItems.length; // Correct placement logic
                        }

                        recentlyMovedToNewContainer.current = true;

                        /*  return {
                            ...items,
                            [activeContainer]: items[activeContainer].filter((item) => item !== active.id),
                            [overContainer]: [
                                ...items[overContainer].slice(0, newIndex),
                                items[activeContainer][activeIndex],
                                ...items[overContainer].slice(newIndex, items[overContainer].length),
                            ],
                        }; */
                        return {
                            ...items,
                            [activeContainer]: {
                                ...items[activeContainer],
                                childrens: items[activeContainer].childrens.filter((item) => item.id !== active.id),
                            },
                            [overContainer]: {
                                ...items[overContainer],
                                childrens: [...overItems.slice(0, newIndex), activeItems[activeIndex], ...overItems.slice(newIndex)],
                            },
                        } satisfies ColumnAdapter;
                    });
                }
            }}
            onDragEnd={({ active, over }) => {
                //! Column Reordering
                /*            if (active.id in columns && over?.id) {
                    setColumnIds((columnIds) => {
                        const activeIndex = columnIds.indexOf(active.id);
                        const overIndex = columnIds.indexOf(over.id);

                        return arrayMove(columnIds, activeIndex, overIndex);
                    });
                } */

                const activeContainer = findContainer(active.id);

                if (!activeContainer) {
                    setActiveId(null);
                    return;
                }

                const overId = over?.id;

                if (overId == null) {
                    setActiveId(null);
                    return;
                }

                //! Trash Functionality
                if (overId === TRASH_ID) {
                    /* setItems((items) => ({
                        ...items,
                        [activeContainer]: items[activeContainer].filter((id) => id !== activeId),
                    })); */
                    // setItems((items) => ({
                    //     ...items,
                    //     [activeContainer]: {
                    //         ...items[activeContainer],
                    //         children: items[activeContainer].childrens.filter((item) => item.id !== activeId),
                    //     },
                    // }));
                    setColumns?.((items) => ({
                        ...items,
                        [activeContainer]: {
                            ...items[activeContainer],
                            childrens: items[activeContainer].childrens.filter((item) => item.id !== active.id),
                        },
                    }));
                    setActiveId(null);
                    return;
                }

                //! Adding New Column:
                if (overId === PLACEHOLDER_ID) {
                    const newContainerId = getNextContainerId();

                    unstable_batchedUpdates(() => {
                        // setColumnIds((containers) => [...containers, newContainerId]);
                        /*  setItems((items) => ({
                            ...items,
                            [activeContainer]: items[activeContainer].filter((id) => id !== activeId),
                            [newContainerId]: [active.id],
                        })); */
                        /*   setItems((items) => {
                            return {
                                ...items,
                                [activeContainer]: {
                                    ...items[activeContainer],
                                    childrens: items[activeContainer].childrens.filter((item) => item.id !== activeId),
                                },
                                [newContainerId]: { id: newContainerId, childrens: [{ id: active.id }] },
                            };
                        }); */
                        setColumns?.((items) => {
                            const dataChildren = getItemData(active.id)!;
                            const newItems: ColumnAdapter<C, I> = {
                                ...items,
                                [activeContainer]: {
                                    ...items[activeContainer],
                                    childrens: items[activeContainer].childrens.filter((item) => item.id !== active.id),
                                },
                                [newContainerId as UniqueIdentifier]: {
                                    id: newContainerId as UniqueIdentifier,
                                    childrens: [
                                        {
                                            ...dataChildren,
                                            id: active.id,
                                            // title: active.data.current?.title,
                                        },
                                    ],
                                } as ColumnData<C, I>, // Assuming you want to copy the title as well, adjust as needed
                            };
                            return newItems;
                        });
                        setActiveId(null);
                    });
                    return;
                }

                //! Moving Within or Between Columns:
                const overContainer = findContainer(overId);

                if (overContainer) {
                    // const activeIndex = items[activeContainer].indexOf(active.id);
                    const activeIndex = columns[activeContainer].childrens.findIndex((item) => item.id === active.id);
                    // const overIndex = items[overContainer].indexOf(overId);
                    const overIndex = columns[overContainer].childrens.findIndex((item) => item.id === overId);

                    if (activeIndex !== overIndex) {
                        /*  setItems((items) => ({
                            ...items,
                            [overContainer]: arrayMove(items[overContainer], activeIndex, overIndex),
                        })); */
                        /*   setItems((items) => ({
                            ...items,
                            [overContainer]: { ...items[overContainer], childrens: arrayMove(items[overContainer].childrens, activeIndex, overIndex) },
                        })); */
                        setColumns?.((column) => ({
                            ...column,
                            [overContainer]: {
                                ...column[overContainer],
                                childrens: arrayMove(column[overContainer].childrens, activeIndex, overIndex),
                            },
                        }));
                    }
                }

                //! Column Reordering
                if (active.id in columns && over?.id) {
                    const activeIndex = columnIds.indexOf(active.id);
                    const overIndex = columnIds.indexOf(over.id);
                    const newColumnIds = arrayMove(columnIds, activeIndex, overIndex);

                    // Update both columnIds AND columns to keep them in sync
                    unstable_batchedUpdates(() => {
                        // setColumnIds(newColumnIds);
                        setColumns?.((items) => {
                            const reorderedColumns: ColumnAdapter<C, I> = {};
                            newColumnIds.forEach((id) => {
                                reorderedColumns[id] = items[id];
                            });
                            return reorderedColumns;
                        });
                    });
                }

                setActiveId(null);
            }}
            cancelDrop={cancelDrop}
            onDragCancel={onDragCancel}
            modifiers={modifiers}
        >
            <div
                style={{
                    display: 'inline-grid',
                    boxSizing: 'border-box',
                    padding: 20,
                    gridAutoFlow: isVertical ? 'row' : 'column',
                    ...props.style,
                }}
                className={cn(className)}
                {...props}
            >
                {render({
                    columns,
                    columnIds,
                    isMinimal,
                    isSortingContainer,
                    // isHandle,
                    getIndex,
                    renderItemUI,
                    addColumnFn: handleAddColumn,
                    getItemStyles,
                    removeColumnFn: handleRemoveColumn,
                })}
            </div>
            {createPortal(
                <DragOverlay
                    adjustScale={isAdjustScale}
                    dropAnimation={dropAnimation}
                >
                    {activeId ? (columnIds.includes(activeId) ? renderContainerDragOverlay(activeId) : renderItemDragOverlay(activeId)) : null}
                </DragOverlay>,
                document.body
            )}
            {isTrashable && activeId && !columnIds.includes(activeId) ? <Trash id={TRASH_ID} /> : null}
        </DndContext>
    );

    function renderSortableItemDragOverlayDefault(itemId: UniqueIdentifier) {
        return (
            <Item
                value={itemId}
                // handle={isHandle}
                style={getItemStyles({
                    columnId: findContainer(itemId) as UniqueIdentifier,
                    overIndex: -1,
                    index: getIndex(itemId),
                    value: itemId,
                    isSorting: true,
                    isDragging: true,
                    isDragOverlay: true,
                })}
                color={getColor(itemId)}
                // wrapperStyle={wrapperStyle({ index: 0 })}
                renderItem={renderItemUI}
                // dragOverlay
            />
        );
    }

    function renderContainerDragOverlayDefault(columnId: UniqueIdentifier) {
        return (
            <Container
                label={`Column ${columnId}`}
                // columns={columns}
                style={{
                    height: '100%',
                }}
                isShadow
                isUnstyled={false}
            >
                {columns[columnId].childrens.map((item, index) => (
                    <Item
                        key={item.id}
                        value={item.id}
                        // handle={isHandle}
                        style={getItemStyles({
                            columnId,
                            overIndex: -1,
                            index: getIndex(item.id),
                            value: item.id,
                            isDragging: false,
                            isSorting: false,
                            isDragOverlay: false,
                        })}
                        color={getColor(item.id)}
                        // wrapperStyle={wrapperStyle({ index })}
                        renderItem={renderItemUI}
                    />
                ))}
            </Container>
        );
    }

    function handleRemoveColumn(containerID: UniqueIdentifier) {
        // setColumnIds((containers) => containers.filter((id) => id !== containerID));
        setColumns?.((columns) => {
            const { [containerID]: deletedColumn, ...updatedColums } = columns;
            return updatedColums;
        });
    }

    function handleAddColumn() {
        const newContainerId = getNextContainerId();
        unstable_batchedUpdates(() => {
            // setColumnIds((containers) => [...containers, newContainerId]);
            setColumns?.((items) => ({
                ...items,
                // [newContainerId]: [],
                [newContainerId]: {
                    id: newContainerId,
                    childrens: [] as ItemData<I>[],
                } as ColumnData<C, I>,
            }));
        });
    }

    function getNextContainerId() {
        // const containerIds = Object.keys(columns);
        // const lastContainerId = containerIds[containerIds.length - 1] as string | undefined;
        // const _result = lastContainerId ? String.fromCharCode(lastContainerId.charCodeAt(0) + 1) : 'a';
        const result = `CON_${uuid()}`;

        return result;
    }
}

function Trash({ id }: { id: UniqueIdentifier }) {
    const { setNodeRef, isOver } = useDroppable({
        id,
    });

    return (
        <div
            ref={setNodeRef}
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'fixed',
                left: '50%',
                marginLeft: -150,
                bottom: 20,
                width: 300,
                height: 60,
                borderRadius: 5,
                border: '1px solid',
                borderColor: isOver ? 'red' : '#DDD',
            }}
        >
            Drop here to delete
        </div>
    );
}
