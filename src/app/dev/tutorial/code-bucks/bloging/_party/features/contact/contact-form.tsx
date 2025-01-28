'use client';

import { cn } from '@/lib/classnames';
import React, { InputHTMLAttributes } from 'react';
import { useForm } from 'react-hook-form';

export function ContactForm() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const onSubmit = (data: Record<string, string>) => window.alert(JSON.stringify(data, null, 4));
    console.log('contact form', JSON.stringify(errors, null, 4));

    return (
        <form
            className="mt-12 text-sm xs:text-base sm:text-lg font-medium leading-relaxed font-sans"
            onSubmit={handleSubmit((e) => onSubmit(e))}
        >
            Hello! My name is&nbsp;
            <Input
                type="text"
                placeholder="your name"
                {...register('name', { required: true })}
            />
            &nbsp;and I want to discuss a potential project. You can email me at &nbsp;
            <Input
                type="email"
                placeholder="your@email.com"
                {...register('email', { required: true, pattern: /^\S+@\S+$/i })}
            />
            &nbsp;or reach out to me on&nbsp;
            <Input
                type="tel"
                placeholder="your phone number"
                {...register('phoneNumber', { required: true })}
            />
            Here are some details about my project: <br />
            <textarea
                className="w-full outline-none border-0 p-0 mx-2 focus:ring-0 _placeholder:text-center placeholder:text-lg border-b _border-gray-400 focus:border-cb-accent bg-transparent"
                rows={3}
                placeholder="my project is about..."
                {...register('projectDetail', { required: true, maxLength: 225 })}
            />
            <input
                className="mt-8 font-medium inline-block capitalize text-sm sm:text-base py-1 sm:py-2 px-4 sm:px-5 border-2 border-solid _border-cb-dark rounded-lg bg-foreground hover:bg-foreground/90 transition-[background-color] text-background cursor-pointer"
                type="submit"
                value="send request"
            />
        </form>
    );
}

function Input({ className, children, ...props }: InputHTMLAttributes<HTMLInputElement>) {
    return (
        <input
            className={cn(
                'outline-none border-0 p-0 mx-2 focus:ring-0 placeholder:text-center placeholder:text-sm xs:placeholder:text-base sm:placeholder:text-lg border-b _border-gray-400 focus:border-cb-accent bg-transparent',
                className
            )}
            {...props}
        >
            {children}
        </input>
    );
}
