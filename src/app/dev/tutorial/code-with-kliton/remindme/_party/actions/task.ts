'use server';

import prisma from '@/lib/prisma';
import { type createTaskSchemaType, createTaskSchema } from '../schema/create-task';
import { currentUser } from '@clerk/nextjs/server';
import { type dev_task } from '@prisma/client';

export async function addTaskMutation(form: createTaskSchemaType) {
    const user = await currentUser();
    if (!user) throw new Error('User not found');

    const task = await prisma.dev_task.create({
        data: {
            userId: user.id,
            content: form.content,
            expiresAt: form.expiresAt,
            collection: {
                connect: {
                    id: form.collectionId,
                },
            },
        },
    });

    return task;
}

export async function updateTaskDoneMutation(id: dev_task['id'], done: dev_task['done']) {
    const user = await currentUser();
    if (!user) throw new Error('User not found');

    const task = await prisma.dev_task.update({
        where: {
            userId: user.id,
            id: id,
        },
        data: {
            done: done,
        },
    });

    return task;
}
