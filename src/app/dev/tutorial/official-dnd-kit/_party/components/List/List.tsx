import React, { forwardRef } from 'react';
// import classNames from 'classnames';

import styles from './List.module.scss';
import { cn } from '@/lib/classnames';

export interface Props {
    children: React.ReactNode;
    columns?: number;
    style?: React.CSSProperties;
    horizontal?: boolean;
}

export const List = forwardRef<HTMLUListElement, Props>(({ children, columns = 1, horizontal, style }: Props, ref) => {
    return (
        // eslint-disable-next-line jsx-a11y/role-supports-aria-props
        <ul
            aria-description="ul list"
            ref={ref}
            style={
                {
                    ...style,
                    '--columns': columns,
                } as React.CSSProperties
            }
            className={cn(styles.List, horizontal && styles.horizontal)}
        >
            {children}
        </ul>
    );
});

List.displayName = 'List';
