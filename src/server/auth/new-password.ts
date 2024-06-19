'use server';

import bcrypt from 'bcryptjs';

import prisma from '@/lib/prisma';
import { getPasswordResetTokenByToken } from '@/models/password-reset-token';
import { getUserByEmail } from '@/models/user';
import { NewPasswordSchema, type TNewPasswordSchema } from '@/schemas/auth';
import { getErrorMessage } from '@/utils/get-error-message';

export async function newPassword(values: TNewPasswordSchema, token: string | null) {
    try {
        if (!token) return { success: false, message: 'Missing token!' };

        const validateFields = NewPasswordSchema.safeParse(values);

        if (!validateFields.success) return { success: false, message: 'Invalid field password!' };
        const { password } = validateFields.data;

        const existingToken = await getPasswordResetTokenByToken(token);

        if (!existingToken) return { success: false, message: 'Token does not exist!' };

        const hasExpired = new Date(existingToken.expires) < new Date();

        if (hasExpired) return { success: false, message: 'Token has expired' };

        const existingUser = await getUserByEmail(existingToken.email);

        if (!existingUser) return { success: false, message: 'Email does not exist!' };

        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.user.update({
            where: { id: existingUser.id },
            data: { password: hashedPassword },
        });

        await prisma.passwordResetToken.delete({
            where: { id: existingToken.id },
        });

        return { success: true, message: 'Password updated!' };
    } catch (error) {
        process.env.NODE_ENV === 'development' && console.log('newPassword Error: ', error);
        return {
            success: false,
            message: process.env.NODE_ENV === 'development' ? getErrorMessage(error) : 'Something wrong on server',
        };
    }
}

export type ResetNewPassword = Awaited<ReturnType<typeof newPassword>>;
