import NextAuth, { type DefaultSession, type NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { type Provider } from 'next-auth/providers';

import { PrismaAdapter } from '@auth/prisma-adapter';
import AuthConfig from '@/lib/auth/auth-config-antonio';
import prisma from '@/lib/prisma';

import { getUserById } from '@/models/user';
import { getAccountByUserId } from '@/models/account';
import { getTwoFactorConfirmationByUserId } from '@/models/two-factor-confirmation';

// https://authjs.dev/guides/pages/signin
//
import type { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from 'next';
import { authRoutes } from './routes';

export const {
    handlers,
    signIn,
    signOut,
    auth,
    unstable_update: update,
} = NextAuth({
    adapter: PrismaAdapter(prisma),
    session: { strategy: 'jwt' },
    logger: {
        error(code, ...message) {
            process.env.NODE_ENV === 'development' &&
                console.error('logger auth [error]: ', `code:${code}\nmessage: ${message.map((d) => JSON.stringify(d, null, 4)).join('\n')}\n\n`);
        },
        warn(code, ...message) {
            process.env.NODE_ENV === 'development' &&
                console.warn('logger auth [warn]: ', `code:${code}\nmessage: ${message.map((d) => JSON.stringify(d, null, 4)).join('\n')}\n\n`);
        },
        debug(code, ...message) {
            process.env.NODE_ENV === 'development' &&
                console.debug('logger auth [debug]: ', `code:${code}\nmessage: ${message.map((d) => JSON.stringify(d, null, 4)).join('\n')}\n\n`);
        },
    },
    pages: {
        /**
         * custome page url
         */
        signIn: authRoutes.login,
        newUser: authRoutes.register,
        error: authRoutes.error,
    },
    events: {
        async linkAccount({ user, account, profile }) {
            await prisma.user.update({
                where: { id: user.id },
                data: { emailVerified: new Date() },
            });
        },
    },
    callbacks: {
        async signIn({ user, credentials, account }) {
            /**
             * gunakan function signIn() jika ingin menggunakan confirm password dan 2FA (Two Factor Authentication)
             * signIn calback me-return boolean, default "true"
             */

            // allow OAuth without email verication
            if (account?.provider !== 'credentials') return true;

            if (user.id) {
                const existingUser = await getUserById(user.id);
                // Prevent sign in without email verification
                if (!existingUser?.emailVerified) return false; // ini akan memicu error login server action dengan code "AccessDenied"

                //? TODO: Add 2FA check
                // Prevent sign in when isTwoFactorEnable=true (2FA)
                if (existingUser.isTwoFactorEnable) {
                    // twoFactorConfirmation di buat di function login() server action
                    const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id);
                    if (!twoFactorConfirmation) return false;

                    //? TODO: Delete two factor confirmation for next sign in
                    await prisma.twoFactorConfirmation.delete({
                        where: { id: twoFactorConfirmation.id },
                    });

                    return true;
                }
            }

            return true;
        },

        async jwt({ user, token, session, trigger, account, profile }) {
            /**
             * value "token" sama dengan yang di return dari jwt(), atau dengan kata lain setelah flow "jwt" masuk ke flow session
             * jwt calback me-return token value
             * jwt tidak akan pernah di eksekusi selama "signin" callback me-return "false"
             */

            if (!token.sub) return token;

            const existingUser = await getUserById(token.sub);

            if (!existingUser) return token;

            const existingAccount = await getAccountByUserId(existingUser.id);

            // extend object token
            token.isOAuth = !!existingAccount;
            token.name = existingUser.name;
            token.email = existingUser.email;
            token.role = existingUser.role;
            token.isTwoFactorEnable = existingUser.isTwoFactorEnable;
            // token.myfield = 'custome value';

            // if (trigger === 'update') {
            //     return { ...token, ...session.user };
            // }

            // return { ...token, ...user };
            return token;
        },

        async session({ token, session }) {
            /**
             * value "token" sama dengan yang di return dari jwt(), atau dengan kata lain setelah flow "jwt" masuk ke flow session
             * session calback me-return session object yang dipakai di frontend atau backend app
             */

            if (token.sub && session.user) {
                // extend key "id" in session object
                session.user.id = token.sub;
                // session.user.myfield_x = token.myfield;
            }

            if (token.role && session.user) {
                // extend key "role" in session object. diambil dari token, karena di jwt callbak sudah menambahkan key "role"
                session.user.role = token.role;
            }

            if (session.user) {
                // extend key "isTwoFactorEnable" in session object. diambil dari token, karena di jwt callbak sudah menambahkan key "isTwoFactorEnable"
                session.user.isTwoFactorEnable = token.isTwoFactorEnable;
                session.user.email = token.email ?? '';
                session.user.name = token.name;
                session.user.isOAuth = token.isOAuth;
            }

            return session;
        },
    },
    ...AuthConfig,
});
