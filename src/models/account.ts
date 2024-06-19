import prisma from '@/lib/prisma';
import { type Account } from '@prisma/client';

export async function getAccountByUserId(userId: Account['userId']) {
    const twoFactorToken = await prisma.account.findFirst({
        where: { userId: userId },
    });

    return twoFactorToken;
}
