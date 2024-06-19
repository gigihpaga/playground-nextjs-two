'use server';

import { PrismaClient, type VerificationToken } from '@prisma/client';

import prisma from '@/lib/prisma';
import { getUserByEmail } from '@/models/user';
import { getVerificationTokenByToken } from '@/models/verification-token';

export async function newVerificationToken(token: VerificationToken['token']) {
    const existingToken = await getVerificationTokenByToken(token);

    if (!existingToken) return { succes: false, message: 'Token does not exist' };

    const hasExpired = new Date(existingToken.expires) < new Date();

    if (hasExpired) return { succes: false, message: 'Token has expired' };

    const existingUser = await getUserByEmail(existingToken.email);

    if (!existingUser) return { succes: false, message: 'Email does not exist' };

    const updatedUser = await prisma.user.update({
        where: { id: existingUser.id },
        data: {
            emailVerified: new Date(),
            email: existingToken.email,
        },
    });

    const deletedToken = await prisma.verificationToken.delete({
        where: { id: existingToken.id },
    });

    return { succes: true, message: 'email verified' };
}

export type ReturnNewVerificationToken = Awaited<ReturnType<typeof newVerificationToken>>;
