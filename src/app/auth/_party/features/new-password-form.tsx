'use client';

import { useState, useTransition, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { type ResetNewPassword, newPassword } from '@/server/auth/new-password';
import { NewPasswordSchema, type TNewPasswordSchema } from '@/schemas/auth';

import { ReloadIcon } from '@radix-ui/react-icons';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import { Button } from '@/components/ui/button';

import { CardWrapper } from '../components/card-wrapper';
import { FormError } from '../components/form-error';
import { FormSucces } from '../components/form-succes';
import { authRoutes } from '@/lib/auth/routes';

export function NewPasswordForm() {
    return (
        <Suspense fallback={<div>loading...</div>}>
            <NewPasswordFormNoSuspense />
        </Suspense>
    );
}

function NewPasswordFormNoSuspense() {
    const searchParams = useSearchParams(),
        token = searchParams.get('token');

    const [resultNewPassword, setResultNewPassword] = useState<ResetNewPassword | null>(null);
    const [resetTransactionIsLoading, resetTransactionStart] = useTransition();

    const form = useForm<TNewPasswordSchema>({
        defaultValues: {
            password: '',
        },
        resolver: zodResolver(NewPasswordSchema),
    });

    async function handleOnSubmit(data: TNewPasswordSchema) {
        // window.alert(JSON.stringify(data, null, 2));

        resetTransactionStart(async () => {
            const newPasswod = await newPassword(data, token);
            setResultNewPassword(newPasswod);
        });
    }

    return (
        <CardWrapper
            headerLabel="Enter a new password"
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
                            name="password"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        {/* <Input
                                            className="h-8"
                                            type="password"
                                            {...field}
                                            placeholder="******"
                                        /> */}
                                        <PasswordInput
                                            className="h-8"
                                            placeholder="******"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    {resultNewPassword && resultNewPassword.success ? (
                        <FormSucces message={resultNewPassword.message} />
                    ) : (
                        <FormError message={resultNewPassword?.message} />
                    )}
                    <Button
                        disabled={resetTransactionIsLoading}
                        className="w-full"
                        size="sm"
                    >
                        Reset Password
                        {resetTransactionIsLoading && <ReloadIcon className="size-3 ml-1 animate-spin" />}
                    </Button>
                </form>
            </Form>
        </CardWrapper>
    );
}
