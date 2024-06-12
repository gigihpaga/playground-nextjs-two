import React, { type CSSProperties } from 'react';
import { cn } from '@/lib/classnames';
import styles from './skeleton.module.css';

interface MyCustomCSS extends CSSProperties {
    '--color-one': string;
    '--color-two': string;
}

type SkeletonProps = React.HTMLAttributes<HTMLDivElement> & { colorOne?: string; colorTwo?: string };

export function Skeleton({ colorOne, colorTwo, className, children, ...props }: SkeletonProps) {
    const a = {
        '--color-one': colorOne,
        '--color-two': colorTwo,
    } as MyCustomCSS;
    return (
        <div
            style={a}
            className={cn(styles['skel'], '', className)}
            {...props}
        >
            {children}
        </div>
    );
}
