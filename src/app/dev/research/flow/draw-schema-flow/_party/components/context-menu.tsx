'use client';

import React, { forwardRef, useState } from 'react';
import { cn } from '@/lib/classnames';
import { Button, type ButtonProps } from '@/components/ui/button';
import { ChevronRightIcon } from 'lucide-react';

export const ContextMenu = forwardRef<HTMLDivElement, React.HtmlHTMLAttributes<HTMLDivElement>>(({ children, className, ...props }, ref) => {
    return (
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
        <div
            className={cn('context-menu bg-background border shadow-lg absolute z-50 flex flex-col min-w-[8rem] rounded-md p-1 gap-y-1', className)}
            // aria-description="context menu node"
            {...props}
            tabIndex={-1}
            role="menu"
        >
            {children}
        </div>
    );
});

ContextMenu.displayName = 'ContextMenu';

type DropdownGroupProps = React.HTMLAttributes<HTMLDivElement> & {
    label: string;
};

export function DropdownGroup({ label, children, className, ...props }: DropdownGroupProps) {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
            className={cn(
                // _[&>ul]:hover:-right-[100%] _[&>ul]:hover:opacity-100 _[&>ul]:hover:h-fit _[&>ul]:block
                'rounded-md hover:bg-accent hover:text-accent-foreground text-xs px-3 py-1 relative',
                className
            )}
            {...props}
        >
            <span className="flex items-center justify-between">
                {label}
                <ChevronRightIcon className="size-3" />
            </span>
            <ul
                data-state={String(isOpen)}
                className={cn(
                    'p-1 absolute bg-background w-full top-0 rounded',
                    isOpen ? '-right-[100%] opacity-100 h-fit block' : '-right-[0%] opacity-0 h-0 hidden'
                )}
            >
                {children}
            </ul>
        </div>
    );
}

type DropDownItemProps = React.HTMLAttributes<HTMLLIElement>;

export function DropDownItem({ className, ...props }: DropDownItemProps) {
    return (
        <li
            className={cn('p-1 bg-background', className)}
            {...props}
        />
    );
}

type ButtonContextProps = ButtonProps;

export function ContextMenuItem({ className, ...props }: ButtonContextProps) {
    return (
        <Button
            size="sm"
            variant="ghost"
            className={cn('h-fit justify-between w-full py-1', className)}
            {...props}
        />
    );
}
