/* eslint-disable jsx-a11y/interactive-supports-focus */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
'use client';

import { logout } from '@/server/auth/logout';
import { signOut } from 'next-auth/react';
import { ReactNode } from 'react';

interface Props {
    children?: ReactNode | ReactNode[];
}

export function LogoutButton({ children }: Props) {
    return (
        <span
            role="button"
            className="cursor-pointer"
            onClick={async () => await logout()}
        >
            {children}
        </span>
    );
}
