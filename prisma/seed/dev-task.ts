import { Prisma } from '@prisma/client';
import prisma from '@/lib/prisma';

export const devTask = {
    create,
    resetSequence,
    deleteMany,
};

function create(size = 10) {
    let tasks: Prisma.dev_taskCreateInput[] = [];
    for (let idx = 0; idx < size; idx++) {
        tasks.push({
            content: `Dummy task from seeder ${idx + 1}`,
            userId: 'clxjnddq40006cljsthhgwl4h',
            done: false,
            collection: {
                connectOrCreate: {
                    where: { id: 1 },
                    create: {
                        userId: 'clxjnddq40006cljsthhgwl4h',
                        name: 'Collectiong testing',
                        color: 'candy',
                        createAt: new Date(Date.now() + 1000 * 60 * 60),
                    },
                },
            },
        });
    }
    return tasks.map((task) => prisma.dev_task.create({ data: task }));
}

function resetSequence() {
    return prisma.$executeRaw`UPDATE "sqlite_sequence" SET "seq" = 0 WHERE "name" = "dev_task"`;
}

function deleteMany() {
    return prisma.dev_task.deleteMany();
}
