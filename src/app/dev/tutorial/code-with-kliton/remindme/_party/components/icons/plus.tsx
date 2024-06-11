import { cn } from '@/lib/classnames';
import React from 'react';

export function Plus({ className, fill, stroke, viewBox, strokeWidth, ...props }: React.SVGAttributes<SVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill={fill ?? 'none'}
            viewBox={viewBox ?? '0 0 24 24'}
            strokeWidth={strokeWidth ?? 1.5}
            stroke={stroke ?? 'currentColor'}
            className={cn('w-6 h-6', className)}
            {...props}
        >
            <path
                fillRule="evenodd"
                d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z"
                clipRule="evenodd"
            />
        </svg>
    );
}
