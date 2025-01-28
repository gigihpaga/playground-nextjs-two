'use client';

import { cn } from '@/lib/classnames';
import React from 'react';

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ style, children, className, ...props }, ref) => (
    <div
        style={style}
        className={cn(
            'bg-[#0D1117] [&>:is(textarea,p)::-webkit-scrollbar-thumb]:bg-sky-500 overflow-hidden group/TaskCard p-2.5 h-[100px] min-h-[100px] items-center flex text-left rounded-xl cursor-grab relative hover:ring-2 hover:ring-inset hover:ring-blue-500',
            className
        )}
        {...props}
    >
        {children}
    </div>
));

Card.displayName = 'Card-Draggable';

export { Card };
