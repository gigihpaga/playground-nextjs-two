'use client';

import { useRef, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';

import { Field } from './field';

export function Form1() {
    const formRef = useRef<HTMLFormElement | null>(null);

    function handleOnSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!formRef.current) return;

        const dataForm = Object.fromEntries(new FormData(formRef.current));
        console.log(dataForm);
    }

    return (
        <>
            <h1 className="mb-[20px]">Form 1</h1>
            <form
                ref={formRef}
                onSubmit={handleOnSubmit}
                className="flex flex-col space-y-5 px-2"
            >
                <Field name="nama" />
                <Field
                    type="number"
                    name="nohp"
                />
                <Button
                    className="w-fit h-7"
                    variant="default"
                    size="sm"
                >
                    Sumbit
                </Button>
            </form>
        </>
    );
}
