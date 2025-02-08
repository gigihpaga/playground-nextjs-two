import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/classnames';

export const boxVariants = cva('rounded border', {
    variants: {
        theme: {
            red: 'bg-[#4F1D32] dark:bg-[#361422] border-[#BC5379] text-white',
            blue: 'bg-[#0D3664] dark:bg-[#081D38] border-[#0F64C6] text-white',
            yellow: 'bg-[#4D3E21] dark:bg-[#51340A] border-[#D59C44] text-white',
            purple: 'bg-[#542865] dark:bg-[#241830] border-[#8651B4] text-white',
            green: 'bg-[#32573A] dark:bg-[#192B1D] border-[#4DA159] text-white',
            revolver: 'bg-[#1E1023] border-[#79418E] text-[#A569BB]',
        },
    },
    defaultVariants: {
        theme: 'blue',
    },
});

export interface BoxProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof boxVariants> {
    //
}

export function Box({ theme, children, className, ...props }: BoxProps) {
    return (
        <div
            className={cn(boxVariants({ theme, className }))}
            {...props}
        >
            {children}
        </div>
    );
}
