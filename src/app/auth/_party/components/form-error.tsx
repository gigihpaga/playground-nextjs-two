import { cn } from '@/lib/classnames';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';
import { type HTMLAttributes } from 'react';

type Props = HTMLAttributes<HTMLDivElement> & {
    message?: string;
};

export function FormError({ className, message }: Props) {
    if (!message) return null;
    return (
        <div
            className={cn(
                'bg-destructive/10 dark:bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive dark:text-[#ffa8a9]',
                className
            )}
        >
            <ExclamationTriangleIcon className="size-4" />
            <p>{message}</p>
        </div>
    );
}
