'use client';

import { useSession, getSession } from 'next-auth/react';

/**
 * get session on client
 * @returns
 */
export function useCurrentUser() {
    const session = useSession();
    return session.data?.user;
}

/**
 * get session role on client
 * @returns
 */
export function useCurrentRole() {
    const session = useSession();
    return session.data?.user.role;
}
