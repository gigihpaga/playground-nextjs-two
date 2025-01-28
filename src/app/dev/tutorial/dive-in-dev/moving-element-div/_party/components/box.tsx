import { cn } from '@/lib/classnames';
import { forwardRef, type ElementRef, type ComponentPropsWithoutRef } from 'react';

type ParentProps = ComponentPropsWithoutRef<'div'> & {
    halo?: string;
};

const Parent = forwardRef<ElementRef<'div'>, ParentProps>(({ className, children, ...props }, ref) => {
    return (
        <div
            ref={ref}
            className={cn('bg-fuchsia-800 h-[calc(75vh)] p-8 relative overflow-hidden', className)}
            {...props}
        >
            {children}
        </div>
    );
});

Parent.displayName = 'Parent';

type ChildProps = ComponentPropsWithoutRef<'div'> & {};

const Child = forwardRef<ElementRef<'div'>, ChildProps>(({ className, children, ...props }, ref) => {
    return (
        <div
            ref={ref}
            className={cn('absolute h-[50px] w-[50px] bg-fuchsia-600 top-0 left-0 select-none cursor-grab', className)}
            {...props}
        >
            {children}
        </div>
    );
});

Child.displayName = 'Child';

export { Parent, Child };
