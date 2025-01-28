import React, { forwardRef } from 'react';
// import classNames from 'classnames';

import { Handle, Remove } from '../Item';

import styles from './Container.module.scss';
import { cn } from '@/lib/classnames';

export interface Props {
    children: React.ReactNode;
    columns?: number;
    label?: string;
    style?: React.CSSProperties;
    isHorizontal?: boolean;
    isHover?: boolean;
    handleProps?: React.HTMLAttributes<any>;
    isScrollable?: boolean;
    isShadow?: boolean;
    isPlaceholder?: boolean;
    isUnstyled?: boolean;
    onClick?(): void;
    onRemove?(): void;
}

const Container_ = (_props: Props, ref: React.ForwardedRef<HTMLDivElement | HTMLButtonElement>) => {
    const {
        children,
        columns = 1,
        handleProps,
        isHorizontal,
        isHover,
        onClick,
        onRemove,
        label,
        isPlaceholder,
        style,
        isScrollable,
        isShadow,
        isUnstyled,
        ...props
    } = _props;

    const Component = onClick ? 'button' : 'div';

    return (
        <Component
            {...props}
            // @ts-ignore
            ref={ref}
            style={
                {
                    ...style,
                    '--columns': columns,
                } as React.CSSProperties
            }
            className={cn(
                styles.Container,
                isUnstyled && styles.unstyled,
                isHorizontal && styles.horizontal,
                isHover && styles.hover,
                isPlaceholder && styles.placeholder,
                isScrollable && styles.scrollable,
                isShadow && styles.shadow
            )}
            onClick={onClick ? onClick : undefined}
            tabIndex={onClick ? 0 : undefined}
        >
            {label ? (
                <div className={styles.Header}>
                    {label}
                    <div className={styles.Actions}>
                        {onRemove ? <Remove onClick={onRemove} /> : undefined}
                        <Handle {...handleProps} />
                    </div>
                </div>
            ) : null}
            {isPlaceholder ? children : <ul>{children}</ul>}
        </Component>
    );
};

export const Container = forwardRef<HTMLDivElement | HTMLButtonElement, Props>(Container_);

Container.displayName = 'Container';
