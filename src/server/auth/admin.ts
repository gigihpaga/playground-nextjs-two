'use server';

import { currentRole } from '@/lib/auth/current-login';

export async function admin() {
    const role = await currentRole();

    if (role !== 'ADMIN') return { success: false, message: 'Forbidden access action admin' };

    return { success: true, message: 'Allow access action admin' };
}
