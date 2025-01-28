import React, { forwardRef } from 'react';
// import classNames from 'classnames';

import { getSuitColor } from './utilities';

import styles from './PlayingCard.module.scss';
import stylesBox from './PlayingBox.module.scss';
import { cn } from '@/lib/classnames';
import { ItemProps } from '@/app/dev/tutorial/official-dnd-kit/_party/components/Item';

export interface Props extends React.HtmlHTMLAttributes<HTMLDivElement> {
    value: string /* ItemProps['value'] */;
    index: number;
    /*   transform: {
        x: number;
        y: number;
    } | null; */
    transform: ItemProps['transform'];
    transition: ItemProps['transition'];
    isFadeIn: boolean;
    style?: React.CSSProperties;
    isPickedUp?: boolean;
    isDragging: boolean;
    isSorting: boolean;
    isMountAnimation?: boolean;
}

export const PlayingCard = forwardRef<HTMLDivElement, Props>((_props, ref) => {
    const { value, isDragging, isSorting, isMountAnimation, isFadeIn, isPickedUp, style, index, transform, transition, ...props } = _props;

    return (
        <div
            className={cn(styles.Wrapper, transform && styles.sorting)}
            style={
                {
                    '--translate-y': transform ? `${transform.y}px` : undefined,
                    '--index': index,
                    '--transition': transition,
                    zIndex: style?.zIndex,
                } as React.CSSProperties
            }
            ref={ref}
        >
            <div
                className={cn(
                    styles.PlayingCard,
                    isMountAnimation && styles.mountAnimation,
                    isPickedUp && styles.pickedUp,
                    isDragging && styles.dragging,
                    isFadeIn && styles.fadeIn
                )}
                style={
                    {
                        ...style,
                        '--scale': isPickedUp ? 1.075 : undefined,
                        color: getSuitColor(value),
                        zIndex: undefined,
                    } as React.CSSProperties
                }
                // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
                tabIndex={0}
                {...props}
            >
                <sup>{value}</sup>
                <strong>{value[value.length - 1]}</strong>
                <sub>{value}</sub>
            </div>
        </div>
    );
});

PlayingCard.displayName = 'PlayingCard';

export const PlayingBox = forwardRef<HTMLDivElement, Props>((_props, ref) => {
    const { value, isDragging, isSorting, isMountAnimation, isFadeIn, isPickedUp, style, index, transform, transition, ...props } = _props;

    return (
        <div
            className={cn(stylesBox.Wrapper, transform && stylesBox.sorting)}
            style={
                {
                    '--translate-y': transform ? `${transform.y}px` : undefined,
                    '--index': index,
                    '--transition': transition,
                    zIndex: style?.zIndex,
                } as React.CSSProperties
            }
            ref={ref}
        >
            <div
                className={cn(
                    stylesBox.PlayingBox,
                    isMountAnimation && stylesBox.mountAnimation,
                    isPickedUp && stylesBox.pickedUp,
                    isDragging && stylesBox.dragging,
                    isFadeIn && stylesBox.fadeIn
                )}
                style={
                    {
                        ...style,
                        '--scale': isPickedUp ? 1.075 : undefined,
                        color: getSuitColor(value),
                        zIndex: undefined,
                    } as React.CSSProperties
                }
                // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
                tabIndex={0}
                {...props}
            >
                <sup>{value}</sup>
                <strong>{value[value.length - 1]}</strong>
                <sub>{value}</sub>
            </div>
        </div>
    );
});

PlayingBox.displayName = 'PlayingBox';
