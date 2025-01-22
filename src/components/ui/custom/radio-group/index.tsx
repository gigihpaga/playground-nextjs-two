'use client';

import * as React from 'react';
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';

import { cn } from '@/lib/classnames';
import styles from './rg.module.scss';

export const RadioGroup = React.forwardRef<
    React.ElementRef<typeof RadioGroupPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root> & {
        resetStyle?: boolean;
    }
>(({ className, resetStyle = false, ...props }, ref) => {
    return (
        <RadioGroupPrimitive.Root
            className={cn(resetStyle !== true ? styles['rg'] : '', className)}
            {...props}
            ref={ref}
        />
    );
});
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

export const RadioGroupItem = React.forwardRef<
    React.ElementRef<typeof RadioGroupPrimitive.Item>,
    React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item> & {
        resetStyle?: boolean;
    }
>(({ className, resetStyle = false, ...props }, ref) => {
    return (
        <RadioGroupPrimitive.Item
            ref={ref}
            className={cn(resetStyle !== true ? styles['rg__item'] : '', className)}
            {...props}
        ></RadioGroupPrimitive.Item>
    );
});
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;
