import React, { useEffect } from 'react';
// import classNames from 'classnames';

import type { DraggableSyntheticListeners } from '@dnd-kit/core';
import type { Transform } from '@dnd-kit/utilities';

import { Handle, Remove } from './components';

import styles from './Item.module.scss';
import { cn } from '@/lib/classnames';

export type RenderItemArgs = {
    isDragOverlay: boolean;
    isDragging: boolean;
    isSorting: boolean;
    index: number | undefined;
    isFadeIn: boolean;
    listeners: DraggableSyntheticListeners;
    ref: React.ForwardedRef<HTMLLIElement> /* |React.Ref<HTMLElement | HTMLDivElement>  */;
    style: React.CSSProperties | undefined;
    transform: ItemProps['transform'];
    transition: ItemProps['transition'];
    value: ItemProps['value'];
};

export interface ItemProps extends React.HTMLAttributes<HTMLDivElement> {
    dragOverlay?: boolean;
    color?: string;
    disabled?: boolean;
    dragging?: boolean;
    handle?: boolean;
    handleProps?: any;
    height?: number;
    index?: number;
    fadeIn?: boolean;
    transform?: Transform | null;
    listeners?: DraggableSyntheticListeners;
    sorting?: boolean;
    style?: React.CSSProperties;
    transition?: string | null;
    wrapperStyle?: React.CSSProperties;
    value: React.ReactNode;
    onRemove?(): void;
    renderItem?(args: RenderItemArgs): React.ReactElement;
}

const Item_ = (_props: ItemProps, ref: React.ForwardedRef<HTMLLIElement>) => {
    const {
        color,
        dragOverlay,
        dragging,
        disabled,
        fadeIn,
        handle,
        handleProps,
        height,
        index,
        listeners,
        onRemove,
        renderItem,
        sorting,
        style,
        transition,
        transform,
        value,
        wrapperStyle,
        ...props
    } = _props;

    useEffect(() => {
        if (!dragOverlay) {
            return;
        }

        document.body.style.cursor = 'grabbing';

        return () => {
            document.body.style.cursor = '';
        };
    }, [dragOverlay]);

    return renderItem ? (
        renderItem({
            isDragOverlay: Boolean(dragOverlay),
            isDragging: Boolean(dragging),
            isSorting: Boolean(sorting),
            index,
            isFadeIn: Boolean(fadeIn),
            listeners,
            ref: ref,
            style,
            transform,
            transition,
            value,
        })
    ) : (
        // eslint-disable-next-line jsx-a11y/role-supports-aria-props
        <li
            aria-description="item li"
            className={cn(styles.Wrapper, fadeIn && styles.fadeIn, sorting && styles.sorting, dragOverlay && styles.dragOverlay)}
            style={
                {
                    ...wrapperStyle,
                    transition: [transition, wrapperStyle?.transition].filter(Boolean).join(', '),
                    '--translate-x': transform ? `${Math.round(transform.x)}px` : undefined,
                    '--translate-y': transform ? `${Math.round(transform.y)}px` : undefined,
                    '--scale-x': transform?.scaleX ? `${transform.scaleX}` : undefined,
                    '--scale-y': transform?.scaleY ? `${transform.scaleY}` : undefined,
                    '--index': index,
                    '--color': color,
                } as React.CSSProperties
            }
            ref={ref}
        >
            <div
                aria-description="item li>div"
                className={cn(
                    styles.Item,
                    dragging && styles.dragging,
                    handle && styles.withHandle,
                    dragOverlay && styles.dragOverlay,
                    disabled && styles.disabled,
                    color && styles.color
                )}
                style={style}
                data-cypress="draggable-item"
                {...(!handle ? listeners : undefined)}
                {...props}
                tabIndex={!handle ? 0 : undefined}
            >
                {value}
                <span className={styles.Actions}>
                    {onRemove ? (
                        <Remove
                            className={styles.Remove}
                            onClick={onRemove}
                        />
                    ) : null}
                    {handle ? (
                        <Handle
                            {...handleProps}
                            {...listeners}
                        />
                    ) : null}
                </span>
            </div>
        </li>
    );
};

export const Item = React.memo(React.forwardRef<HTMLLIElement, ItemProps>((a, b) => Item_(a, b)));
