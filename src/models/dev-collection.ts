'use server';

import { type dev_collection } from '@prisma/client';
import prisma from '@/lib/prisma';
import { type createCollectionSchemaType } from '@/app/dev/tutorial/code-with-kliton/remindme/_party/schema/create-collection';

export async function getCollections() {
    const collections = await prisma.dev_collection.findMany({
        include: {
            tasks: true,
        },
    });

    return collections;
}

export async function addCollectionMutation(form: createCollectionSchemaType) {
    const user = { id: Math.floor(Math.random() * 9_999 + 1_000).toString() };
    if (!user) throw new Error('User not found');

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
    const user = { id: Math.floor(Math.random() * 9_999 + 1_000).toString() };
    if (!user) throw new Error('User not found');

    const collection = await prisma.dev_collection.delete({
        where: {
            userId: user.id,
            id: id,
        },
    });

    return collection;
}
