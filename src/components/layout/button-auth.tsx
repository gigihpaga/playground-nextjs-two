'use client';

import { useRouter } from 'next/navigation';

import { logout } from '@/server/auth/logout';
import { authRoutes } from '@/lib/auth/routes';

import { Button } from '@/components/ui/button';

export function ButtonLogin() {
    const router = useRouter();
    return (
        <Button
            size="sm"
            onClick={() => router.push(authRoutes.login)}
        >
            login
        </Button>
    );
}

export function ButtonLogout() {
    const router = useRouter();
    return (
        <Button
            size="sm"
            onClick={async () => await logout()}
        >
            logout
        </Button>
    );
}
