'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/classnames';
import { PanelLeftCloseIcon, PanelRightCloseIcon } from 'lucide-react';
import React, { useState } from 'react';

type TwoColumnWrapperProps = {
    leftComponent?: React.ReactNode;
    rightComponent?: React.ReactNode;
} & React.HtmlHTMLAttributes<HTMLDivElement>;

export function TwoColumnWrapper({ leftComponent, rightComponent, className, ...props }: TwoColumnWrapperProps) {
    const [rightOpen, setRightOpen] = useState(false);
    return (
        <div
            className={cn('flex gap-2 min-h-0 overflow-hidden', className)}
            {...props}
            data-component="Two-Column-Wrapper"
        >
            <div
                data-component="Two-Column-Wrapper-Left"
                className={cn('overflow-hidden _h-fit w-[100%]', rightOpen && 'flex-none w-[50%]')}
            >
                {leftComponent}
            </div>
            <div
                data-component="Two-Column-Wrapper-Right"
                className={cn(
                    'flex flex-col dark:bg-[#121418] bg-[#e8e9ed] rounded-md md:rounded-lg p-1 pt-0 md:p-2',
                    // eslint-disable-next-line quotes
                    `w-fit overflow-hidden transition-all [&>div:not(:first-child)]:hidden`,
                    // '_[&>div:nth-child(2)]:hidden',
                    'h-full overflow-auto',
                    // eslint-disable-next-line quotes
                    rightOpen && `w-full _[&>div:nth-child(2)]:block [&>div:not(:first-child)]:block`
                )}
            >
                <div className="dark:bg-[#121418] bg-[#e8e9ed] flex justify-end sticky top-0 left-0 right-0 z-[1] p-1">
                    <Button
                        title="togle sidebar"
                        className="h-fit w-fit p-1 text-xs"
                        size="sm"
                        onClick={() => setRightOpen((prev) => !prev)}
                    >
                        {rightOpen === true ? <PanelLeftCloseIcon className="size-3" /> : <PanelRightCloseIcon className="size-3" />}
                    </Button>
                </div>

                {rightComponent}
            </div>
        </div>
    );
}
