import NextAuth, { type DefaultSession } from 'next-auth';

export type ExtendedUser = DefaultSession['user'] & {
    role: string /* 'ADMIN' | 'USER' */;
    isTwoFactorEnable: boolean;
    isOAuth: boolean;
};

declare module 'next-auth' {
    interface Session {
        user: ExtendedUser;
    }
}

import { JWT } from '@auth/core/jwt';

declare module '@auth/core/jwt' {
    interface JWT {
        role: string /*  'ADMIN' | 'USER' */;
        isTwoFactorEnable: boolean /*  'ADMIN' | 'USER' */;
        isOAuth: boolean;
    }
}
