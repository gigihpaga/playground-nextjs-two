'use client';

import React, { type CSSProperties } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import styles from './bs.module.scss';

import { cn } from '@/lib/classnames';
import { OmitNull } from '@/types/utilities';
import { z } from 'zod';

export type BaseShapeVariants2 = {
    theme: NonNullable<Required<VariantProps<typeof baseShapeVariants>>['theme']>;
    shapeType: NonNullable<Required<VariantProps<typeof baseShapeVariants>>['shapeType']>;
};

export type _BaseShapeVariants<T = Required<VariantProps<typeof baseShapeVariants>>> = {
    // [Variant in keyof T]: OmitNull<OmitUndefined<T[Variant]>>;
    // [Variant in keyof T]: NonNullable<T[Variant]>;
    [Variant in keyof T]: OmitNull<T[Variant]>;
};

type ThemeInlineStyle = Record<_BaseShapeVariants['theme'], { colorA: `#${string}`; colorB: `#${string}`; colorC: `#${string}` }>;

export const ThemeList = ['neutral', 'red', 'blue', 'yellow', 'purple', 'green', 'revolver'] as const;

const ShapeList = ['circle', 'square', 'triangel', 'octagon', 'pentagon', 'hexagon', 'rombus'] as const;

export const baseShapeVariantsSchema = z.object({
    theme: z.enum(ThemeList),
    shapeType: z.enum(ShapeList),
});

export type BaseShapeVariants = z.infer<typeof baseShapeVariantsSchema>;

type VariantsShape = {
    theme: {
        [key in (typeof ThemeList)[number]]: string;
    };
    shapeType: {
        [key in (typeof ShapeList)[number]]: string;
    };
};

export const baseShapeVariants = cva<VariantsShape>('rounded border', {
    variants: {
        theme: {
            neutral: 'bg-[#a6a4aa] dark:bg-[#87848b] border-[#bebac4] text-white',
            red: 'bg-[#4F1D32] dark:bg-[#361422] border-[#BC5379] text-white',
            blue: 'bg-[#0D3664] dark:bg-[#081D38] border-[#0F64C6] text-white',
            yellow: 'bg-[#4D3E21] dark:bg-[#51340A] border-[#D59C44] text-white',
            purple: 'bg-[#542865] dark:bg-[#241830] border-[#8651B4] text-white',
            green: 'bg-[#32573A] dark:bg-[#192B1D] border-[#4DA159] text-white',
            revolver: 'bg-[#1E1023] border-[#79418E] text-[#A569BB] text-white',
        },
        shapeType: {
            circle: styles['circle'],
            square: styles['square'],
            triangel: styles['triangel'],
            octagon: styles['octagon'],
            pentagon: styles['pentagon'],
            hexagon: styles['hexagon'],
            rombus: styles['rombus'],
        },
    },
    defaultVariants: {
        theme: 'blue',
        // shapeType: 'pentagon',
    },
});

export const themeInlineStyle: ThemeInlineStyle = {
    neutral: {
        colorA: '#a6a4aa',
        colorB: '#bebac4',
        colorC: '#e9e7ee',
    },
    red: {
        colorA: '#4F1D32',
        colorB: '#BC5379',
        colorC: '#FF2E8C',
    },
    blue: {
        colorA: '#0D3664',
        colorB: '#0F64C6',
        colorC: '#3670FF',
    },
    yellow: {
        colorA: '#4D3E21',
        colorB: '#D59C44',
        colorC: '#FF8126',
    },
    purple: {
        colorA: '#542865',
        colorB: '#8651B4',
        colorC: '#AA36FF',
    },
    green: {
        colorA: '#32573A',
        colorB: '#4DA159',
        colorC: '#38FF5D',
    },
    revolver: {
        colorA: '#1E1023',
        colorB: '#A569BB',
        colorC: '#7639FF',
    },
};

export const themeInlineStyleList = Object.entries(themeInlineStyle).map(([key, dataColor]) => {
    return {
        colorName: key as keyof typeof themeInlineStyle,
        ...dataColor,
    };
});

interface MyCustomCSS extends CSSProperties {
    '--color-a': string;
    '--color-b': string;
}

export interface BaseShapeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof baseShapeVariants> {
    // theme: NonNullable<Required<VariantProps<typeof baseShapeVariants>>['theme']>;
    theme?: _BaseShapeVariants['theme'];
}

export function BaseShape({ theme = 'blue', shapeType, style, children, className, ...props }: BaseShapeProps) {
    return (
        <div
            style={
                {
                    '--color-a': themeInlineStyle[theme].colorB,
                    '--color-b': themeInlineStyle[theme].colorA,
                    ...style,
                } as MyCustomCSS
            }
            className={cn(baseShapeVariants({ theme, shapeType, className }))}
            {...props}
        >
            {children}
        </div>
    );
}
