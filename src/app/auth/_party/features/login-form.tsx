'use client';

import { useState, useTransition, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { LoginResult, login } from '@/server/auth/login';
import { LoginSchema, type TLoginSchema } from '@/schemas/auth';

import { ReloadIcon } from '@radix-ui/react-icons';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PasswordInput } from '@/components/ui/password-input';

import { CardWrapper } from '../components/card-wrapper';
import { FormError } from '../components/form-error';
import { FormSucces } from '../components/form-succes';
import Link from 'next/link';

export function LoginForm() {
    return (
        <Suspense fallback={<div>loading...</div>}>
            <LoginFormNoSuspense />
        </Suspense>
    );
}

function LoginFormNoSuspense() {
    const searchParams = useSearchParams(),
        urlError = searchParams.get('error') === 'OAuthAccountNotLinked' ? 'Email already in use with different provider!' : '',
        callbackUrl = searchParams.get('callbackUrl');
    const [error, setError] = useState<string | undefined>(undefined);
    const [succes, setSucces] = useState<string | undefined>(undefined);
    const [showTwoFactor, setShowTwoFactor] = useState(false);
    const [loginTransactionIsLoading, loginTransactionStart] = useTransition();
    const form = useForm<TLoginSchema>({
        defaultValues: {
            email: '',
            password: '',
            code: '',
        },
        resolver: zodResolver(LoginSchema),
    });

    async function handleOnSubmit(data: TLoginSchema) {
        // window.alert(JSON.stringify(data, null, 2));
        loginTransactionStart(() => {
            login(data, callbackUrl)
                .then((loginResult) => {
                    if (loginResult?.error) {
                        // form.reset();
                        setError(loginResult.error);
                    }
                    if (loginResult?.twoFactor) {
                        // form.resetField('code');
                        // form.setValue('code', '');
                        setShowTwoFactor(true);
                    }
                })
                .catch((err) => setError('something xxxxx'));
            // setError(loginResult?.error);
            // setSucces(loginResult?.succes);
        });
    }

    return (
        <CardWrapper
            headerLabel="Welcome back"
            backButtonLabel="Don't have an account"
            backButtonHref="/auth/register"
            showSocial
        >
            <Form {...form}>
                <form
                    className="space-y-6"
                    onSubmit={form.handleSubmit((d) => handleOnSubmit(d))}
                >
                    <div className="space-y-4">
                        {showTwoFactor && (
                            <FormField
                                name="code"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Code</FormLabel>
                                        <FormControl>
                                            <Input
                                                className="h-8"
                                                type="text"
                                                {...field}
                                                placeholder="123456"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}
                        {!showTwoFactor && (
                            <>
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
                                            {/* <FormControl>
                                                <Input
                                                    className="h-8"
                                                    type="password"
                                                    {...field}
                                                    placeholder="*****"
                                                />
                                            </FormControl> */}
                                            <FormControl>
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
                                <Button
                                    size="sm"
                                    variant="link"
                                    asChild
                                    className="font-normal px-0"
                                >
                                    <Link
                                        prefetch={false}
                                        href="/auth/reset"
                                    >
                                        Forgot password
                                    </Link>
                                </Button>
                            </>
                        )}
                    </div>
                    <FormError message={error || urlError} />
                    <FormSucces message={succes} />
                    <Button
                        disabled={loginTransactionIsLoading}
                        className="w-full"
                        size="sm"
                    >
                        {showTwoFactor ? 'Confirm' : 'Login'}
                        {loginTransactionIsLoading && <ReloadIcon className="size-3 ml-1 animate-spin" />}
                    </Button>
                </form>
            </Form>
        </CardWrapper>
    );
}
