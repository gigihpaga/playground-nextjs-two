import prisma from '@/lib/prisma';
import { getErrorMessage } from '@/utils/get-error-message';
import { Prisma, type User } from '@prisma/client';

// email: NonNullable<user['email']>

// export async function getUserByField<T extends user, K extends keyof T>(field: K, values: NonNullable<T[K]>) {
//     try {
//         const user = await prisma.user.findUnique({
//             where: {
//                 [field]: values,
//             },
//         });
//         return user;
//     } catch (error) {
//         console.error('error, getUserByEmail', getErrorMessage(error));
//         return null;
//     }
// }

export async function getUserByEmail(email: NonNullable<User['email']>) {
    try {
        const user = await prisma.user.findUnique({
            where: {
                email: email,
            },
        });
        return user;
    } catch (error) {
        console.error('error, getUserByEmail', getErrorMessage(error));
        return null;
    }
}

export async function getUserById(id: NonNullable<User['id']>) {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: id,
            },
        });
        return user;
    } catch (error) {
        console.error('error, getUserById', getErrorMessage(error));
        return null;
    }
}
