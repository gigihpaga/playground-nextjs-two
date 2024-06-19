'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import bcrypt from 'bcryptjs';

import { RegisterSchema, TRegisterSchema } from '@/schemas/auth';
import { getUserByEmail } from '@/models/user';
import prisma from '@/lib/prisma';
import { User, Account } from '@prisma/client';
import { generateVerificationToken } from '@/lib/auth/tokens';

import { getErrorMessage } from '@/utils/get-error-message';
import { wait } from '@/utils/wait';
import { sendVerificationEmail } from '@/lib/auth/mail';

export async function register(data: TRegisterSchema) {
    // await wait(7_000);
    try {
        const validateField = RegisterSchema.safeParse(data);
        // if (!validateField.success) return { error: validateField.error };
        if (!validateField.success) {
            return { error: 'Invalid field' };
        }

        const { name, email, password } = validateField.data;

        const existingUser = await getUserByEmail(email);

        if (existingUser) return { error: 'Email already in use!' };

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                name: name,
                email: email,
                password: hashedPassword,
            },
        });

        const verificationToken = await generateVerificationToken(email);

        //Send verification token email
        await sendVerificationEmail(verificationToken.email, verificationToken.token);

        // console.log('create user succed', newUser);
        // console.log('action register, your data: ', data);

        return {
            succes: 'Confirmation email sent!',
        };
    } catch (error) {
        console.error('Error register: ', getErrorMessage(error));
        return {
            error: `Register failed: ${getErrorMessage(error)}`,
        };
    }
}

export type RegisterResult = Awaited<ReturnType<typeof register>>;
