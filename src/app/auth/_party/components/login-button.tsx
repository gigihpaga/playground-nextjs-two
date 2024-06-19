'use client';

import { useRouter } from 'next/navigation';
import { ReactNode } from 'react';

import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { LoginForm } from '../features/login-form';
import { authRoutes } from '@/lib/auth/routes';

interface Props {
    children: ReactNode;
    mode?: 'modal' | 'redirect';
    asChild?: boolean;
}

export function LoginButton({ children, mode = 'redirect', asChild }: Props) {
    const router = useRouter();
    function handleOnClick() {
        router.push(authRoutes.login);
    }

    if (mode === 'modal') {
        return (
            <Dialog>
                <DialogTrigger asChild={asChild}>{children}</DialogTrigger>
                <DialogContent className="p-0 w-auto bg-transparent border-none">
                    <LoginForm />
                </DialogContent>
            </Dialog>
        );
    }

    return (
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
        <span
            className="cursor-pointer"
            onClick={() => handleOnClick()}
        >
            {children}
        </span>
    );
}
