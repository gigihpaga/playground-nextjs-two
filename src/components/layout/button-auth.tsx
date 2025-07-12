'use client';

import { useRouter } from 'next/navigation';

import { logout } from '@/server/auth/logout';
import { authRoutes } from '@/lib/auth/routes';
import { cn } from '@/lib/classnames';

import { Button, ButtonProps } from '@/components/ui/button';

export type ButtonLoginProps = Omit<ButtonProps, 'onClick'>;

export function ButtonLogin({ size = 'sm', className, children, ...props }: ButtonLoginProps) {
    const router = useRouter();
    return (
        <Button
            {...props}
            size={size}
            className={cn(className)}
            onClick={() => router.push(authRoutes.login)}
        >
            {children ? children : 'login'}
        </Button>
    );
}

export type ButtonLogoutProps = Omit<ButtonProps, 'onClick'>;

export function ButtonLogout({ size = 'sm', className, children, ...props }: ButtonLogoutProps) {
    const router = useRouter();
    return (
        <Button
            {...props}
            size={size}
            className={cn(className)}
            onClick={async () => await logout()}
        >
            {children ? children : 'logout'}
        </Button>
    );
}
