'use client';

import { useState, useTransition, Suspense } from 'react';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { type ResetResult, reset } from '@/server/auth/reset';
import { ResetSchema, type TResetSchema } from '@/schemas/auth';

import { ReloadIcon } from '@radix-ui/react-icons';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import { CardWrapper } from '../components/card-wrapper';
import { FormError } from '../components/form-error';
import { FormSucces } from '../components/form-succes';
import { authRoutes } from '@/lib/auth/routes';

export function ResetForm() {
    return (
        <Suspense fallback={<div>loading...</div>}>
            <ResetFormNoSuspense />
        </Suspense>
    );
}

function ResetFormNoSuspense() {
    const [resultReset, setResetResult] = useState<ResetResult | null>(null);
    const [resetTransactionIsLoading, resetTransactionStart] = useTransition();

    const form = useForm<TResetSchema>({
        defaultValues: {
            email: '',
        },
        resolver: zodResolver(ResetSchema),
    });

    async function handleOnSubmit(data: TResetSchema) {
        // window.alert(JSON.stringify(data, null, 2));

        resetTransactionStart(async () => {
            const rst = await reset(data);
            setResetResult(rst);
        });
    }

    return (
        <CardWrapper
            headerLabel="Forgot your password?"
            backButtonLabel="Back to login"
            backButtonHref={authRoutes.login}
        >
            <Form {...form}>
                <form
                    className="space-y-6"
                    onSubmit={form.handleSubmit((d) => handleOnSubmit(d))}
                >
                    <div className="space-y-4">
                        <FormField
                            name="email"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            className="h-8"
                                            type="email"
                                            {...field}
                                            placeholder="john@doe@example.com"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    {resultReset && resultReset.succes ? <FormSucces message={resultReset.message} /> : <FormError message={resultReset?.message} />}
                    <Button
                        disabled={resetTransactionIsLoading}
                        className="w-full"
                        size="sm"
                    >
                        Send reset email
                        {resetTransactionIsLoading && <ReloadIcon className="size-3 ml-1 animate-spin" />}
                    </Button>
                </form>
            </Form>
        </CardWrapper>
    );
}
