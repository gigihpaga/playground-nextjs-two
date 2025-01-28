import { cn } from '@/lib/classnames';
import Link, { type LinkProps } from 'next/link';
import { type AnchorHTMLAttributes } from 'react';

export type TagProps = AnchorHTMLAttributes<HTMLAnchorElement> & LinkProps & {};

export function Tag({ href = '#', className, children, ...props }: TagProps) {
    return (
        <Link
            href={href}
            className={cn(
                'inline-block py-1 sm:py-3 px-4 sm:px-6 md:px-10 bg-cb-dark text-cb-light rounded-full capitalize font-semibold border sm:border-2 border-solid border-cb-light hover:scale-105 transition-[transform] ease-linear duration-200 text-sm sm:text-base',
                className
            )}
            {...props}
        >
            {children}
        </Link>
    );
}
