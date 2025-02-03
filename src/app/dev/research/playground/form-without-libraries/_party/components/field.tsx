import { cn } from '@/lib/classnames';
import { type HtmlHTMLAttributes, type InputHTMLAttributes, type HTMLAttributes } from 'react';

export function Field({ className, name, ...props }: InputHTMLAttributes<HTMLInputElement> & { name: string }) {
    return (
        <div className="w-full flex flex-row items-center justify-between">
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label
                className="inline-flex w-[20%]"
                htmlFor={name}
            >
                {name}
            </label>
            <input
                className={cn('w-[75%]', className)}
                name={name}
                id={name}
                {...props}
            />
        </div>
    );
}
