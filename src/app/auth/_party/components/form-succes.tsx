import { SVGProps, cloneElement, createElement, type HTMLAttributes } from 'react';
import { CheckCircledIcon } from '@radix-ui/react-icons';
import { cn } from '@/lib/classnames';
import Icon from './icon';

type Props = HTMLAttributes<HTMLDivElement> & {
    message?: string;
};

export function FormSucces({ className, message }: Props) {
    if (!message) return null;
    return (
        <div className={cn('bg-emerald-500/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-emerald-600', className)}>
            <CheckCircledIcon
                name="circle-check"
                className="size-5"
            />
            <p>{message}</p>
        </div>
    );
}
