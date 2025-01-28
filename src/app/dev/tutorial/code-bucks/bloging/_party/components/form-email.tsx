'use client';
import { cn } from '@/lib/classnames';
import React, { type FormHTMLAttributes } from 'react';
import { useForm } from 'react-hook-form';

interface FormEmailProps extends FormHTMLAttributes<HTMLFormElement> {}

export function FormEmail({ className, ...props }: FormEmailProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const onSubmit = (data: Record<string, string>) => window.alert(JSON.stringify(data, null, 4));
    // console.log(errors?.email);
    return (
        <form
            className={cn(
                'mt-6 w-full sm:w-[384px] _sm:min-w-[384px] flex items-stretch bg-cb-light dark:bg-cb-dark p-1 sm:p-2 rounded mx-4',
                className
            )}
            onSubmit={handleSubmit(onSubmit)}
            {...props}
        >
            <input
                className="
                w-full focus-visible:outline-none bg-transparent text-cb-dark dark:text-cb-light border-cb-dark focus:border-cb-accent dark:focus:border-cb-accent dark:border-cb-light ring-0 focus:ring-0 border-0 border-b mr-2 pb-1 pl-1 text-sm sm:text-base"
                type="email"
                placeholder="enter your email"
                {...register('email', { required: true })}
            />

            <input
                className="bg-cb-dark dark:bg-cb-light text-cb-light dark:text-cb-dark cursor-pointer font-medium rounded px-3 sm:px-5 py-1 hover:bg-cb-dark/90 dark:hover:bg-cb-light/90 transition-[background-color] ease-linear focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cb-accent text-sm sm:text-base"
                type="submit"
            />
        </form>
    );
}
