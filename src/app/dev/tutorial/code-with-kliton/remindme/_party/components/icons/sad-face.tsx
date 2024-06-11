import { cn } from '@/lib/classnames';
import React from 'react';

export function SadFace({ className, fill, stroke, viewBox, strokeWidth, ...props }: React.SVGAttributes<SVGElement>) {
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
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.182 16.318A4.486 4.486 0 0 0 12.016 15a4.486 4.486 0 0 0-3.198 1.318M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z"
            />
        </svg>
    );
}
