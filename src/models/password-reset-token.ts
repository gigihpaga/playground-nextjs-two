import prisma from '@/lib/prisma';
import { getErrorMessage } from '@/utils/get-error-message';
import { type PasswordResetToken } from '@prisma/client';

export async function getPasswordResetTokenByToken(token: PasswordResetToken['token']) {
    const passwordToken = await prisma.passwordResetToken.findUnique({
        where: { token: token },
    });

    return passwordToken;
}
export async function getPasswordResetTokenByEmail(email: PasswordResetToken['email']) {
    try {
        const passwordToken = await prisma.passwordResetToken.findFirst({
            where: { email: email },
        });

        return passwordToken;
    } catch (error) {
        console.log('getPasswordResetTokenByEmail : error: ', getErrorMessage(error));
        return null;
    }
}
