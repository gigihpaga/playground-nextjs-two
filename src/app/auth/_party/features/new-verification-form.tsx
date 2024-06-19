'use client';

import { Suspense, useCallback, useEffect, useState } from 'react';
import { CheckCircleIcon, ShieldCheckIcon, ShieldAlertIcon, RefreshCwIcon } from 'lucide-react';
import { CardWrapper } from '../components/card-wrapper';
import { useSearchParams } from 'next/navigation';
import { newVerificationToken, type ReturnNewVerificationToken } from '@/lib/auth/new-verification';
import { getErrorMessage } from '@/utils/get-error-message';
import { FormError } from '../components/form-error';
import { FormSucces } from '../components/form-succes';
import { authRoutes } from '@/lib/auth/routes';

export function NewVerificationForm() {
    return (
        <Suspense fallback={<div>loading...</div>}>
            <NewVerificationFormNoSuspense />
        </Suspense>
    );
}

function NewVerificationFormNoSuspense() {
    const [resultVerificationToken, setResultVerificationToken] = useState<ReturnNewVerificationToken | null>(null);

    const searchParams = useSearchParams();
    const token = searchParams.get('token'); // search params ini sesuai dengan "src/lib/auth/mail.ts"

    const handleOnSubmit = useCallback(() => {
        // if (succes || error) return;
        if (!token) {
            setResultVerificationToken({ succes: false, message: 'Missing token!' });
            return;
        }
        newVerificationToken(token)
            .then((result) => {
                setResultVerificationToken(result);
            })
            .catch((error) => {
                setResultVerificationToken({ succes: false, message: getErrorMessage(error) });
            });
    }, [token]);

    useEffect(() => {
        handleOnSubmit();
    }, [handleOnSubmit]);
    // setResultVerificationToken(null);
    return (
        <CardWrapper
            headerLabel="Confirming your verification"
            backButtonLabel="Back to login page"
            backButtonHref={authRoutes.login}
        >
            <div className="flex flex-col gap-4 items-center w-full justify-center mb-5">
                {resultVerificationToken && resultVerificationToken.succes ? (
                    <>
                        <ShieldCheckIcon className="size-10 text-green-400 dark:text-green-500" />
                        <FormSucces
                            className="w-full"
                            message={resultVerificationToken.message}
                        />
                    </>
                ) : resultVerificationToken && !resultVerificationToken.succes ? (
                    <>
                        <ShieldAlertIcon className="size-10 text-red-400 dark:text-red-500" />
                        <FormError
                            className="w-full"
                            message={resultVerificationToken?.message}
                        />
                    </>
                ) : (
                    <>
                        <RefreshCwIcon className="size-10 animate-spin text-muted-foreground" />
                        <FormSucces
                            className="w-full bg-muted text-muted-foreground"
                            message="Please wait..."
                        />
                    </>
                )}
            </div>
        </CardWrapper>
    );
}
