import prisma from '@/lib/prisma';
import { type TwoFactorToken } from '@prisma/client';

export async function getTwoFactorTokenByToken(token: TwoFactorToken['token']) {
    const twoFactorToken = await prisma.twoFactorToken.findUnique({
        where: { token: token },
    });

    return twoFactorToken;
}

export async function getTwoFactorTokenByEmail(email: TwoFactorToken['email']) {
    const twoFactorToken = await prisma.twoFactorToken.findFirst({
        where: { email: email },
    });

    return twoFactorToken;
}
