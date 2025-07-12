'use client';
import React, { ReactNode, useState } from 'react';

import { cn } from '@/lib/classnames';
import * as ScrollArea from '@radix-ui/react-scroll-area';

export type ToggleMenuMobileProps = {
    children?: ReactNode;
};

/**
 * component ini adalah component client. digunakan sebagai wrapper menu-mobile-content, agar menu-mobile-content tetap menjadi component server, tetapi tetap memiliki interaktifitas
 */
export function MenuMobileWrapper({ children }: ToggleMenuMobileProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    return (
        <>
            <ToggleBurger
                isExpanded={isExpanded}
                setIsExpanded={setIsExpanded}
            />

            {isExpanded ? children : null}
        </>
    );
}

type ToggleBurgerProps = {
    isExpanded: boolean;
    setIsExpanded: React.Dispatch<React.SetStateAction<boolean>>;
};

export function ToggleBurger({ isExpanded, setIsExpanded }: ToggleBurgerProps) {
    return (
        <button
            className="size-6 flex justify-center items-center"
            onClick={() => setIsExpanded((prev) => !prev)}
            data-expanded={String(isExpanded)}
        >
            <div className="w-[22px] cursor-pointer transition-all ease-linear duration-300 ">
                <div className="relative">
                    <span
                        className={cn(
                            'absolute top-0 left-0 inline-block w-full h-[2px] bg-cb-dark dark:bg-cb-light rounded transition-all ease-linear duration-200 rotate-0 translate-y-[6px]',
                            isExpanded && '-rotate-45 translate-y-0'
                        )}
                    />
                    <span
                        className={cn(
                            'absolute top-0 left-0 inline-block w-full h-[2px] bg-cb-dark dark:bg-cb-light rounded transition-all ease-linear duration-200 opacity-100',
                            isExpanded && 'opacity-0'
                        )}
                    />
                    <span
                        className={cn(
                            'absolute top-0 left-0 inline-block w-full h-[2px] bg-cb-dark dark:bg-cb-light rounded transition-all ease-linear duration-200 rotate-0 -translate-y-[7px]',
                            isExpanded && 'rotate-45 translate-y-0'
                        )}
                    />
                </div>
            </div>
        </button>
    );
}

export type MenuScrollableWrapperProps = {
    className?: string;
    children?: ReactNode | ReactNode[];
};

export function MenuMobileScrollableWrapper({ children, className }: MenuScrollableWrapperProps) {
    return (
        <ScrollArea.Root className="">
            <ScrollArea.Viewport
                className={cn(
                    'fixed h-[calc(100vh-var(--header-height))] bg-background w-full left-0 top-[var(--header-height)] overflow-hidden',
                    className
                )}
            >
                {children}
            </ScrollArea.Viewport>
            <ScrollArea.Scrollbar orientation="vertical">
                <ScrollArea.Thumb />
            </ScrollArea.Scrollbar>
            <ScrollArea.Scrollbar orientation="horizontal">
                <ScrollArea.Thumb />
            </ScrollArea.Scrollbar>
            <ScrollArea.Corner />
        </ScrollArea.Root>
    );
}
