'use server';

import prisma from '@/lib/prisma';
import { currentUser } from '@/lib/auth/current-login';
import { type createCollectionSchemaType } from '../schema/create-collection';
import { type dev_collection } from '@prisma/client';

export async function addCollectionMutation(form: createCollectionSchemaType) {
    const user = await currentUser();
    if (!user?.id) throw new Error('User not found');

    const collection = await prisma.dev_collection.create({
        data: {
            userId: user.id,
            color: form.color,
            name: form.name,
        },
    });

    return collection;
}

export async function deleteCollectionMutation(id: dev_collection['id']) {
    const user = await currentUser();
    if (!user?.id) throw new Error('User not found');

    const collection = await prisma.dev_collection.delete({
        where: {
            userId: user.id,
            id: id,
        },
    });

    return collection;
}
