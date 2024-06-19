import prisma from '@/lib/prisma';
import { type TwoFactorConfirmation } from '@prisma/client';

export async function getTwoFactorConfirmationByUserId(userId: TwoFactorConfirmation['userId']) {
    const twoFactorConfirmation = await prisma.twoFactorConfirmation.findUnique({
        where: { userId: userId },
    });

    return twoFactorConfirmation;
}
