import prisma from '@/lib/prisma';
import { Prisma, type VerificationToken } from '@prisma/client';

export async function getVerificationTokenByToken(token: VerificationToken['token']) {
    const verifacationToken = await prisma.verificationToken.findUnique({
        where: {
            token: token,
        },
    });
    return verifacationToken;
}

export async function getVerificationTokenByEmail(email: VerificationToken['email']) {
    const verifacationToken = await prisma.verificationToken.findFirst({
        where: {
            email: email,
        },
    });
    return verifacationToken;
}
