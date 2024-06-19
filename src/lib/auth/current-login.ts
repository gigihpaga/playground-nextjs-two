import { auth } from '@/lib/auth/auth-antonio';

/**
 * get session on server
 * gunakan ini untuk:
 * - server component
 * - server action
 * - API route
 * @returns
 */
export async function currentUser() {
    const session = await auth();
    return session?.user;
}

/**
 * get session role on server
 * gunakan ini untuk:
 * - server component
 * - server action
 * - API route
 * @returns
 */
export async function currentRole() {
    const session = await auth();
    return session?.user.role;
}
