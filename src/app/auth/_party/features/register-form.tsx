'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { type RegisterResult, register } from '@/server/auth/register';
import { RegisterSchema, type TRegisterSchema } from '@/schemas/auth';

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import { Button } from '@/components/ui/button';

import { CardWrapper } from '../components/card-wrapper';
import { FormError } from '../components/form-error';
import { FormSucces } from '../components/form-succes';
import { ReloadIcon } from '@radix-ui/react-icons';
import { authRoutes } from '@/lib/auth/routes';

export function RegisterForm() {
    const [error, setError] = useState<string | undefined>(undefined);
    const [succes, setSucces] = useState<string | undefined>(undefined);
    const [registerTransactionIsLoading, registerTransactionStart] = useTransition();
    const form = useForm<TRegisterSchema>({
        defaultValues: {
            email: '',
            password: '',
            name: '',
        },
        resolver: zodResolver(RegisterSchema),
    });

    async function handleOnSubmit(data: TRegisterSchema) {
        // window.alert(JSON.stringify(data, null, 2));
        registerTransactionStart(async () => {
            const loginResult = await register(data);
            setError(loginResult.error);
            setSucces(loginResult.succes);
        });
    }

    return (
        <CardWrapper
            headerLabel="Create an account"
            backButtonLabel="Already have an account"
            backButtonHref={authRoutes.login}
            showSocial
        >
            <Form {...form}>
                <form
                    className="space-y-6"
                    onSubmit={form.handleSubmit((d) => handleOnSubmit(d))}
                >
                    <div className="space-y-2">
                        <FormField
                            name="name"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            className="h-8"
                                            type="text"
                                            {...field}
                                            placeholder="john doe"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
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
                                            placeholder="*****"
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
                    <FormError message={error} />
                    <FormSucces message={succes} />
                    <Button
                        disabled={registerTransactionIsLoading}
                        className="w-full"
                        size="sm"
                    >
                        Register
                        {registerTransactionIsLoading && <ReloadIcon className="size-3 ml-1 animate-spin" />}
                    </Button>
                </form>
            </Form>
        </CardWrapper>
    );
}
