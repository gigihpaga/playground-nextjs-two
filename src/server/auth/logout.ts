'use server';

import { signOut } from '@/lib/auth/auth-antonio';
import { authRoutes } from '@/lib/auth/routes';
import { redirect, permanentRedirect, RedirectType } from 'next/navigation';

export async function logout() {
    await signOut({ redirectTo: authRoutes.login });
    // redirect(authRoutes.login, RedirectType.push);
}
