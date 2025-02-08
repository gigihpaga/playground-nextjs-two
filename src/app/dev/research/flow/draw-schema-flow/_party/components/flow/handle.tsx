import React from 'react';
import { Handle as HandleCore, Position, type HandleProps, type HandleType } from '@xyflow/react';
import { type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/classnames';
import { baseShapeVariants, themeInlineStyle } from '../base-shape';

type KeyEnumPosition = keyof typeof Position;
type ValueEnumPosition = `${Position}`;

export interface HandleCustom extends Omit<HandleProps, 'position' | 'type'>, VariantProps<typeof baseShapeVariants> {
    position?: `${Position}`;
    type?: HandleType;
}

export const Handle = React.forwardRef<HTMLDivElement, HandleCustom>(
    ({ theme = 'yellow', position = 'left', type = 'target', style, className, ...props }, ref) => {
        return (
            <HandleCore
                style={{
                    backgroundColor: `${theme && themeInlineStyle[theme].colorA}`,
                    borderColor: `${theme && themeInlineStyle[theme].colorB}`,
                    ...style,
                }}
                ref={ref}
                type={type ?? 'target'}
                className={cn(
                    '!rounded-md',
                    position === 'left' || position === 'right' ? '!h-[25px] !w-[11px]' : '!h-[11px] !w-[25px]',
                    baseShapeVariants({ theme, className })
                )}
                position={(position as Position) ?? 'left'}
                {...props}
            />
        );
    }
);

Handle.displayName = 'HandleCustom';
