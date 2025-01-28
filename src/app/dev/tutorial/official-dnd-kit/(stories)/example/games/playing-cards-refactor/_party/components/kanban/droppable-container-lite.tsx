import React from 'react';
import { UniqueIdentifier } from '@dnd-kit/core';
import { AnimateLayoutChanges, defaultAnimateLayoutChanges, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { Item, ItemProps, Container, ContainerProps } from '@/app/dev/tutorial/official-dnd-kit/_party/components';
import type { StandartRecord, ItemData } from './types';

export type RenderColumnUIArg = { style: React.CSSProperties; isOverContainer: boolean } & ReturnType<typeof useSortable>;

export type DroppableContainerLiteProps<C extends StandartRecord = {}, I extends StandartRecord = {}> = {
    columnId: UniqueIdentifier;
    dataItems: ItemData<I>[];
    renderColumnUI: (useSortableArgs: RenderColumnUIArg) => React.ReactElement;
};

const animateLayoutChanges: AnimateLayoutChanges = (args) => defaultAnimateLayoutChanges({ ...args, wasDragging: true });

export function DroppableContainerLite<C extends StandartRecord = {}, I extends StandartRecord = {}>(_props: DroppableContainerLiteProps<C, I>) {
    const { columnId, dataItems, renderColumnUI } = _props;
    const useSortableArgs = useSortable({
        id: columnId,
        data: {
            type: 'container',
            childrens: dataItems,
        },
        animateLayoutChanges,
    });

    const style: React.CSSProperties = {
        transform: CSS.Transform.toString(useSortableArgs.transform),
        transition: useSortableArgs.transition,
    };

    // const isOverContainer = over ? (id === over.id && active?.data.current?.type !== 'container') || items.includes(over.id) : false;
    const isOverContainer = useSortableArgs.over
        ? (columnId === useSortableArgs.over.id && useSortableArgs.active?.data.current?.type !== 'container') ||
          dataItems.some((item) => item.id === useSortableArgs?.over?.id)
        : false; // Correct check

    return renderColumnUI({ style, isOverContainer, ...useSortableArgs });
}
