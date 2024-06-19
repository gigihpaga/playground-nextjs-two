import crypto from 'crypto';
import { v4 as uuid } from 'uuid';
import type { VerificationToken, PasswordResetToken, TwoFactorToken } from '@prisma/client';

import prisma from '@/lib/prisma';
import { getVerificationTokenByEmail } from '@/models/verification-token';
import { getPasswordResetTokenByEmail } from '@/models/password-reset-token';
import { getTwoFactorTokenByEmail } from '@/models/two-factor-token';

export async function generateVerificationToken(email: VerificationToken['email']) {
    try {
        const token = uuid();
        const expires = new Date(new Date().getTime() + 1000 * 60 * 60); // expires token in 1 hour

        const existingToken = await getVerificationTokenByEmail(email);

        if (existingToken) {
            const deletedToken = await prisma.verificationToken.delete({
                where: {
                    id: existingToken.id,
                },
            });
        }

        const verificationToken = await prisma.verificationToken.create({
            data: {
                email: email,
                token: token,
                expires: expires,
                identifier: null,
            },
        });

        return verificationToken;
    } catch (error) {
        console.log('generateVerificationToken', error);
        throw error;
    }
}

export async function generatePasswordResetToken(email: PasswordResetToken['email']) {
    try {
        const token = uuid();
        const expires = new Date(new Date().getTime() + 1000 * 60 * 60); // expires token in 1 hour
        const existingToken = await getPasswordResetTokenByEmail(email);
        // console.log('generatePasswordResetToken: ', existingToken);
        // return;
        if (existingToken) {
            const deletedToken = await prisma.passwordResetToken.delete({
                where: { id: existingToken.id },
            });
        }
        const passwordResetToken = await prisma.passwordResetToken.create({
            data: {
                email: email,
                token: token,
                expires: expires,
            },
        });

        return passwordResetToken;
    } catch (error) {
        console.log('generatePasswordResetToken: ', error);
        throw error;
    }
}

export async function generateTwoFactorToken(email: TwoFactorToken['email']) {
    const token = crypto.randomInt(100_000, 1_000_000).toString();

    const expires = new Date(new Date().getTime() + 1000 * 60 * 5); // expires token in 5 menit

    const existingToken = await getTwoFactorTokenByEmail(email);

    if (existingToken) {
        const deletedToken = await prisma.twoFactorToken.delete({
            where: { id: existingToken.id },
        });
    }

    const twoFactorToken = await prisma.twoFactorToken.create({
        data: {
            email: email,
            token: token,
            expires: expires,
        },
    });

    return twoFactorToken;
}
