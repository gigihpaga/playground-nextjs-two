import React from 'react';
// import classNames from 'classnames';

import styles from './Wrapper.module.scss';
import { cn } from '@/lib/classnames';

interface Props {
    children: React.ReactNode;
    center?: boolean;
    style?: React.CSSProperties;
}

export function Wrapper({ children, center, style }: Props) {
    return (
        <div
            aria-description="wrapper"
            className={cn(styles.Wrapper, center && styles.center)}
            style={style}
        >
            {children}
        </div>
    );
}
