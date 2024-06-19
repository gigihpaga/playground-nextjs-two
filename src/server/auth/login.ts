'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';

import { AuthError, Session } from 'next-auth';
import { PrismaClient, type User } from '@prisma/client';

import { signIn } from '@/lib/auth/auth-antonio';
import { DEFAULT_LOGIN_REDIRECT } from '@/lib/auth/routes';
import { generateVerificationToken, generateTwoFactorToken } from '@/lib/auth/tokens';
import { sendVerificationEmail, sendTwoFactorTokenEmail } from '@/lib/auth/mail';

import prisma from '@/lib/prisma';
import { getUserByEmail } from '@/models/user';

import { LoginSchema, TLoginSchema } from '@/schemas/auth';

import { wait } from '@/utils/wait';
import { getErrorMessage } from '@/utils/get-error-message';
import { getTwoFactorTokenByEmail } from '@/models/two-factor-token';
import { getTwoFactorConfirmationByUserId } from '@/models/two-factor-confirmation';

const SETTING = {
    ACTIVE_EMAIL_VERIFICATION: true,
};

export async function login(data: TLoginSchema, callbackUrl?: string | null) {
    // await wait(7_000);

    const validateField = LoginSchema.safeParse(data);
    // if (!validateField.success) return { error: validateField.error };
    if (!validateField.success) {
        return { error: 'Invalid field' };
    }

    const { email, password, code } = validateField.data;

    const existingUser = await getUserByEmail(email);

    /**
     * "!existingUser.password" artinya user login dengan OAuth (google/github)
     */
    if (!existingUser || !existingUser.email || !existingUser.password) {
        return { error: 'Email does not exist, try login with google or github. Or create new account' };
    }

    /**
     * ini kayanya tidak akan pernah di eksekusi, karena signIn() callback di auth-antonio.ts akan mengembalikan "false"
     * jika !existingUser.emailVerified, setalah itu akan langsung masuk ke catch block dengan code "AccessDenied"
     */
    /* if (!existingUser.emailVerified) {
        const verificationToken = await generateVerificationToken(existingUser.email);
        //Send verification token email
        await sendVerificationEmail(verificationToken.email, verificationToken.token);
        return { succes: 'Confirm email sent' };
    } */
    //! TOLONG ini nanti di refactor logic ini karena send email terus terusan di eksekusi
    if (existingUser.isTwoFactorEnable && existingUser.email) {
        if (code) {
            // todo verify code
            const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);
            if (!twoFactorToken) return { error: '2fa code not found' };
            if (twoFactorToken.token !== code) return { error: 'code 2fa not match' };

            const hasExpired = new Date(twoFactorToken.expires) < new Date();

            if (hasExpired) return { error: 'code 2da expired!' };

            await prisma.twoFactorToken.delete({
                where: { id: twoFactorToken.id },
            });

            const existingConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id);
            if (existingConfirmation) {
                await prisma.twoFactorConfirmation.delete({
                    where: { id: existingConfirmation.id },
                });
            }

            // data ini nanti akan di delete di callback signIn()
            await prisma.twoFactorConfirmation.create({
                data: { userId: existingUser.id },
            });

            // disini jangan di return agar bisa lanjut mengeksekusi callback signIn()
        } else {
            // send code verification via email
            const twoFactorToken = await generateTwoFactorToken(existingUser.email);
            await sendTwoFactorTokenEmail(twoFactorToken.email, twoFactorToken.token);
            return { twoFactor: true };
        }
    }

    try {
        const responseSignIn = await signIn('credentials', {
            email,
            password,
            // redirect: true,
            redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT,
        });
        // .catch((err) => console.log('masuk signIn() : ', getErrorMessage(err)));
        // revalidatePath('/settings');
        /*  return {
            data: 'succes login',
        }; */
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                case 'CallbackRouteError':
                    return { error: 'Invalid credentials!' }; //  pemicunya function authorize() di auth-config-antonio.ts
                case 'AccessDenied':
                    return { error: 'Access denied!' }; // pemicunya callback signIn() di auth-antonio.ts yang me-return false || seharus nya message ini tidak akan pernah tampil karena sudah di tangani oleh ==> if (!existingUser.emailVerified)
                default:
                    // return redirect(`${authRoutes.login}?error=${error.type}`);
                    return {
                        // error: 'Invalid credentials!',
                        error: `Something went wrong! ${error.type} ${error.message}`,
                    };
            }
        } else {
            throw error;
        }
        // console.error('server action login: ', getErrorMessage(error));
        // return {
        //     error: 'Something went wrong! oke',
        // };
    }
}

export type LoginResult = Awaited<ReturnType<typeof login>>;
