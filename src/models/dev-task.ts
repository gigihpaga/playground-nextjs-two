'use server';

import { type dev_task } from '@prisma/client';
import prisma from '@/lib/prisma';
import { currentUser } from '@/lib/auth/current-login';
import {
    inputNewTaskSchema,
    type InputNewTask,
    inputUpdateTaskSchema,
    type InputUpdateTask,
    inputDeleteTaskSchema,
    type InputDeleteTask,
} from '@/schemas/dev-task';

export async function getTasks() {
    const tasks = await prisma.dev_task.findMany();

    return tasks;
}

export async function getTasksPagination(pageNum?: number, options?: { take: number }) {
    const pgNum = !pageNum || pageNum < 1 ? 1 : pageNum;
    const take = !options || !options.take ? 10 : options.take;

    const [tasks, total] = await prisma.$transaction([
        prisma.dev_task.findMany({
            take: take,
            skip: pgNum * take - take,
            orderBy: {
                id: 'asc',
            },
        }),
        prisma.dev_task.count(),
    ]);

    return {
        data: tasks,
        metadata: {
            take,
            totalData: total,
            currentPage: pgNum,
            totalPage: Math.ceil(total / take),
            hasNextPage: pgNum < Math.ceil(total / take),
            // hasNextPage: skip + take < total,
        },
    };
}

export async function addTask(form: InputNewTask) {
    const user = await currentUser();
    if (!user?.id) throw new Error('User not found');

    const formValid = inputNewTaskSchema.safeParse(form);
    if (!formValid.success) throw Error('invalid payload addTask');

    const { collectionId, content, expiresAt } = formValid.data;

    const task = await prisma.dev_task.create({
        data: {
            userId: user.id /* 'clxjnddq40006cljsthhgwl4h' */,
            content: content,
            expiresAt: expiresAt,
            collection: {
                connect: {
                    id: collectionId,
                },
            },
        },
    });

    return task;
}

export async function updateTask(form: InputUpdateTask) {
    const user = await currentUser();
    if (!user?.id) throw new Error('User not found');

    const formValid = inputUpdateTaskSchema.safeParse(form);
    if (!formValid.success) throw Error('invalid payload editTask');

    const { id, content, expiresAt } = formValid.data;

    const task = await prisma.dev_task.update({
        where: { id: id },
        data: {
            content: content,
            expiresAt: expiresAt,
        },
    });

    return task;
}

export async function deleteTask(form: InputDeleteTask) {
    const user = await currentUser();
    if (!user?.id) throw new Error('User not found');

    const formValid = inputDeleteTaskSchema.safeParse(form);
    if (!formValid.success) throw Error('invalid payload deleteTask');

    const { id } = formValid.data;

    const task = await prisma.dev_task.delete({
        where: { id: id },
    });

    return task;
}
