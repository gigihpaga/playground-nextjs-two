import { NextResponse } from 'next/server';
import { redirect } from 'next/navigation';
import { type NextAuthConfig } from 'next-auth';
import GitHub from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';

import { LoginSchema, type TLoginSchema } from '@/schemas/auth';
import { getUserByEmail } from '@/models/user';
import { PrismaClient, type User } from '@prisma/client';
import { getErrorMessage } from '@/utils/get-error-message';

export default {
    providers: [
        Google({
            clientId: process.env.AUTH_GOOGLE_CLIENT_ID,
            clientSecret: process.env.AUTH_GOOGLE_CLIENT_SECRET,
        }),
        GitHub({
            clientId: process.env.AUTH_GITHUB_CLIENT_ID,
            clientSecret: process.env.AUTH_GITHUB_CLIENT_SECRET,
        }),
        Credentials({
            name: 'credentials',
            async authorize(credentials, request) {
                try {
                    // console.log('authorize callback: ');
                    // console.log('autorize url', request.url);

                    const validateFields = LoginSchema.safeParse(credentials);

                    if (validateFields.success) {
                        const { email, password } = validateFields.data;
                        const user = await getUserByEmail(email);

                        /**
                         * jika tidak ada user atau ada user tetapi password null,
                         * artinya user login dengan provider GitHub atau Google
                         */
                        // if (!user) return NextResponse.redirect(new URL("/auth/login?error=CredentialsSignin&code=credentials",request.url.));
                        if (!user) throw Error('user not found');
                        if (!user || !user.password) throw Error('email found on other metode provider like a Google or GitHub');
                        const passwordMatch = await bcrypt.compare(password, user.password);
                        // if (!passwordMatch) return NextResponse.redirect('/haha');
                        if (passwordMatch) {
                            return user;
                        } else {
                            throw new Error('password not incorect');
                        }
                    } else {
                        throw new Error('invalid field');
                    }
                } catch (error) {
                    console.log('error authorize', getErrorMessage(error));
                    // return null;
                    throw new Error(getErrorMessage(error));
                }
            },
        }),
    ],
} satisfies NextAuthConfig;
