'use server';

import bcrypt from 'bcryptjs';
import { currentUser } from '@/lib/auth/current-login';
import { sendVerificationEmail } from '@/lib/auth/mail';
import { generateVerificationToken } from '@/lib/auth/tokens';
import prisma from '@/lib/prisma';
import { getUserByEmail, getUserById } from '@/models/user';
import { SettingUserSchema, TSettingUserSchema } from '@/schemas/auth';
import { wait } from '@/utils/wait';
import { update } from '@/lib/auth/auth-antonio';
import { getAccountByUserId } from '@/models/account';

export async function settingUser(_form: TSettingUserSchema): Promise<{ suceess: boolean; message: string }> {
    // await wait(4_000);
    //    get session
    const sessionUser = await currentUser();
    // if not has session
    if (!sessionUser) return { suceess: false, message: 'Unauthorized action settings' };
    // if no has session.id
    if (!sessionUser.id) return { suceess: false, message: 'session id not found' };
    // get user on database
    const dbUser = await getUserById(sessionUser.id);
    // check user by userId on database is exist
    if (!dbUser) return { suceess: false, message: 'data user not found' };

    // check user type OAuth
    if (sessionUser.isOAuth) {
        /**
         * karena type user ada 2, menggunakan "credential" atau menggunakan "OAuth"
         * jika user login dengan metode OAuth, system tidak boleh meng-update:
         * email, password, isTwoFactorEnable
         * email: (karena email sudah di menage olah system OAuth sendiri)
         * password: (karena system OAuth tidak menggunakan password)
         * isTwoFactorEnable: (karena system OAuth tidak menggunakan 2FA (two factor authentication))
         */
        _form.email = undefined as unknown as string;
        _form.password = undefined;
        _form.newPassword = undefined;
        _form.isTwoFactorEnable = undefined;
    }

    // jika user tidak mengubah email maka proses verifikasi send email tidak dikirim
    if (_form.email && _form.email !== sessionUser.email) {
        const existingUser = await getUserByEmail(_form.email);
        if (existingUser && existingUser.id !== sessionUser.id) return { suceess: false, message: 'Email already in use!' };

        const verificationToken = await generateVerificationToken(_form.email);
        // send email verification
        await sendVerificationEmail(verificationToken.email, verificationToken.token);

        return { suceess: true, message: `Verification email sent to: ${_form.email}` };
    }

    // Prevent update password when password === ""
    if (_form.password === '') {
        _form.password = undefined;
    }

    // check password
    if (_form.password && _form.newPassword && dbUser.password) {
        const isPasswordMatch = await bcrypt.compare(_form.password, dbUser.password);
        if (!isPasswordMatch) return { suceess: false, message: 'Incorret password!' };
        const hashedPassword = await bcrypt.hash(_form.newPassword, 10);

        // modify value _form to update DB
        _form.password = hashedPassword;
    }

    _form.newPassword = undefined;

    try {
        // update user on database
        const updatedUser = await prisma.user.update({
            where: { id: dbUser.id },
            data: { ..._form },
        });

        const existingAccount = await getAccountByUserId(updatedUser.id);

        // update session
        update({
            user: {
                name: updatedUser.name,
                email: updatedUser.email,
                isTwoFactorEnable: updatedUser.isTwoFactorEnable,
                role: updatedUser.role,
                isOAuth: !!existingAccount,
            },
        });
        return { suceess: true, message: `success update user ${JSON.stringify(_form, null, 4)}` };
    } catch (error) {
        console.log('setting server acttion error: ', error);
        return { suceess: false, message: 'fail update user' };
    }
}

export type ResponseSettingUser = Awaited<ReturnType<typeof settingUser>>;
