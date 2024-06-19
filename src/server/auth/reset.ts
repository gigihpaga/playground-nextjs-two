'use server';

import { z } from 'zod';

import { ResetSchema, TResetSchema } from '@/schemas/auth';
import { getUserByEmail } from '@/models/user';

import { sendPasswordResetEmail } from '@/lib/auth/mail';
import { generatePasswordResetToken } from '@/lib/auth/tokens';
import { getErrorMessage } from '@/utils/get-error-message';

export async function reset(values: TResetSchema) {
    try {
        const validateFields = ResetSchema.safeParse(values);

        if (!validateFields.success) return { succes: false, message: 'Invalid field email!' };

        const { email } = validateFields.data;
        const existingUser = await getUserByEmail(email);
        // console.log('reset: ', existingUser);

        if (!existingUser) return { succes: false, message: 'Email not found!' };

        //? TODO: Generate token & email
        const passwordResetToken = await generatePasswordResetToken(email);
        // console.log('reset: ', passwordResetToken);

        await sendPasswordResetEmail(passwordResetToken.email, passwordResetToken.token);

        return { succes: true, message: 'Reset email sent' };
    } catch (error) {
        console.log('reset password Error: ', getErrorMessage(error));
        return { succes: false, message: 'Something wrong!' };
    }
}

export type ResetResult = Awaited<ReturnType<typeof reset>>;
