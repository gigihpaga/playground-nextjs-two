import React from 'react';
import { UniqueIdentifier } from '@dnd-kit/core';
import { AnimateLayoutChanges, defaultAnimateLayoutChanges, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { Item, ItemProps, Container, ContainerProps } from '@/app/dev/tutorial/official-dnd-kit/_party/components';
import type { StandartRecord, ItemData } from './types';

export type DroppableContainerProps<C extends StandartRecord = {}, I extends StandartRecord = {}> = ContainerProps & {
    disabled?: boolean;
    columnId: UniqueIdentifier;
    // items: UniqueIdentifier[];
    // items: MultipleContainersProps['items'][keyof MultipleContainersProps['items']]['childrens'];
    dataItems: ItemData<I>[];
    style?: React.CSSProperties;
};

const animateLayoutChanges: AnimateLayoutChanges = (args) => defaultAnimateLayoutChanges({ ...args, wasDragging: true });

type A = ReturnType<typeof useSortable>;

export function DroppableContainer<C extends StandartRecord = {}, I extends StandartRecord = {}>({
    children,
    columns = 1,
    disabled,
    columnId,
    dataItems,
    style,
    ...props
}: DroppableContainerProps<C, I>) {
    const { active, attributes, data, isDragging, isOver, isSorting, listeners, over, setNodeRef, transition, transform } = useSortable({
        id: columnId,
        data: {
            type: 'container',
            childrens: dataItems,
        },
        animateLayoutChanges,
    });
    // const isOverContainer = over ? (id === over.id && active?.data.current?.type !== 'container') || items.includes(over.id) : false;
    const isOverContainer = over
        ? (columnId === over.id && active?.data.current?.type !== 'container') || dataItems.some((item) => item.id === over.id)
        : false; // Correct check

    return (
        <Container
            ref={disabled ? undefined : setNodeRef}
            style={{
                ...style,
                transition,
                transform: CSS.Translate.toString(transform),
                opacity: isDragging ? 0.5 : undefined,
            }}
            isHover={isOverContainer}
            handleProps={{
                ...attributes,
                ...listeners,
            }}
            columns={columns}
            {...props}
        >
            {children}
        </Container>
    );
}
