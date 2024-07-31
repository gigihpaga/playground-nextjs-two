import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export const devCollection = {
    create,
    resetSequence,
    deleteMany,
};

function create(size = 10) {
    return Array.from<Prisma.dev_collectionCreateInput>({ length: size }).map((_, idx) => {
        return prisma.dev_collection.create({
            data: {
                userId: 'clxjnddq40006cljsthhgwl4h',
                name: `This is sample colllection name ${idx + 1}`,
                color: 'candy',
                createAt: new Date(Date.now() + 1000 * 60 * 60),
            },
        });
    });
}

function resetSequence() {
    return prisma.$executeRaw`UPDATE "sqlite_sequence" SET "seq" = 0 WHERE "name" = "dev_collection"`;
}

function deleteMany() {
    return prisma.dev_collection.deleteMany();
}
