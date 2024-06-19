'use client';

import { useSearchParams } from 'next/navigation';
import { signIn, type SignInOptions } from 'next-auth/react';

import { Button } from '@/components/ui/button';
import { FcGoogle, FcDataConfiguration } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';
import { DEFAULT_LOGIN_REDIRECT } from '@/lib/auth/routes';
import { getErrorMessage } from '@/utils/get-error-message';

const DEBUGMODE = false;

interface Props {
    attribute?: string;
}

export function Social({ attribute }: Props) {
    const searchParams = useSearchParams(),
        callbackUrl = searchParams.get('callbackUrl');

    async function handleOnClick(provider: 'google' | 'github' | 'credentials', options?: SignInOptions) {
        await signIn(provider, { callbackUrl: callbackUrl || DEFAULT_LOGIN_REDIRECT, ...options });
    }

    return (
        <div className="flex items-center w-full gap-x-2">
            {DEBUGMODE && (
                <Button
                    size="sm"
                    className="w-full"
                    variant="outline"
                    onClick={async () => {
                        try {
                            const signinResult = await handleOnClick('credentials', {
                                email: 'test@mail.com',
                                password: '12345',
                                redirect: true,
                                // callbackUrl: authRoutes.login,
                            });
                        } catch (error) {
                            console.log('social login error', getErrorMessage(error));
                        }
                    }}
                >
                    <FcDataConfiguration className="size-5" />
                </Button>
            )}
            <Button
                size="sm"
                className="w-full"
                variant="outline"
                onClick={async () => await handleOnClick('google')}
            >
                <FcGoogle className="size-5" />
            </Button>
            <Button
                size="sm"
                className="w-full"
                variant="outline"
                onClick={async () => await handleOnClick('github')}
            >
                <FaGithub className="size-5" />
            </Button>
        </div>
    );
}
