import React from 'react';
import { UniqueIdentifier } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';

import {
    Item,
    type ItemProps,
    type RenderItemArgs as RenderItemArgsOri,
    Container,
    ContainerProps,
} from '@/app/dev/tutorial/official-dnd-kit/_party/components';
import { StandartRecord, ColumnId } from './types';
import { useMountStatus } from './use-mount-status';
import { getColor } from './utilities';

export type RenderItemArgs = RenderItemArgsOri;

export interface SortableItemProps<C extends StandartRecord = {}, I extends StandartRecord = {}> {
    columnId: ColumnId<C, I>;
    id: UniqueIdentifier;
    index: number;
    isHandle: boolean;
    disabled?: boolean;

    getItemStyles?(args: {
        value: SortableItemProps['id'];
        index: SortableItemProps['index'];
        isDragging: boolean;
        columnId: SortableItemProps['columnId'];
        isSorting: boolean;
        overIndex: number;
        isDragOverlay?: boolean;
    }): React.CSSProperties;

    getIndex(id: UniqueIdentifier): number;
    renderItemUI: ItemProps['renderItem'] /* & {
        setNodeRef: Pick<ReturnType<typeof useSortable>, 'setNodeRef'>[keyof Pick<ReturnType<typeof useSortable>, 'setNodeRef'>];
    } */;
    wrapperStyle?({ index }: { index: number }): React.CSSProperties;
}

export function SortableItem<C extends StandartRecord = {}, I extends StandartRecord = {}>(_props: SortableItemProps<C, I>) {
    const { disabled, id, index, isHandle, renderItemUI, getItemStyles, columnId, getIndex, wrapperStyle } = _props;

    const { setNodeRef, setActivatorNodeRef, listeners, isDragging, isSorting, over, overIndex, transform, transition } = useSortable({
        id,
    });

    const mounted = useMountStatus();
    const mountedWhileDragging = isDragging && !mounted;

    return renderItemUI instanceof Function ? (
        renderItemUI({
            ref: setNodeRef,
            value: id,
            index: index,
            isDragging,
            isDragOverlay: false,
            isSorting,
            isFadeIn: false,
            style: getItemStyles?.({
                index,
                value: id,
                isDragging,
                isSorting,
                overIndex: over ? getIndex(over.id) : overIndex,
                columnId,
                // isDragOverlay: undefined,
            }),
            listeners,
            transform,
            transition,
        })
    ) : (
        <Item
            ref={disabled ? undefined : setNodeRef}
            value={id}
            dragging={isDragging}
            sorting={isSorting}
            handle={isHandle}
            handleProps={isHandle ? { ref: setActivatorNodeRef } : undefined}
            index={index}
            wrapperStyle={wrapperStyle?.({ index })}
            style={getItemStyles?.({
                index,
                value: id,
                isDragging,
                isSorting,
                overIndex: over ? getIndex(over.id) : overIndex,
                columnId,
                // isDragOverlay: undefined,
            })}
            color={getColor(id)}
            transition={transition}
            transform={transform}
            fadeIn={mountedWhileDragging}
            listeners={listeners}
            renderItem={renderItemUI}
        />
    );
}
