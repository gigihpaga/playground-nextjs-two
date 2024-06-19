import { SessionProvider } from 'next-auth/react';
import { auth } from '@/lib/auth/auth-antonio';

import { type ReactNode } from 'react';

export async function NextAuthProvider({ children }: { children: ReactNode | ReactNode[] }) {
    const session = await auth();
    return <SessionProvider session={session}>{children}</SessionProvider>;
}
