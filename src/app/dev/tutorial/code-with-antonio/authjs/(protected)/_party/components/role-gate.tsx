'use client';

import { type ReactNode } from 'react';
import { useCurrentRole } from '@/hooks/use-current-login';
import { FormError } from '@/app/auth/_party/components/form-error';

export type UserRole = 'ADMIN' | 'USER';

interface Props {
    children?: ReactNode | ReactNode[];
    allowRole: UserRole;
}

export function RoleGate({ children, allowRole }: Props) {
    const role = useCurrentRole();

    if (role !== allowRole) {
        return <FormError message="Youe do not have permission to view this content!" />;
    }

    return <>{children}</>;
}
