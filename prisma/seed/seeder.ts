import prisma from '@/lib/prisma';
import { devCollection } from './dev-collection';
import { devTask } from './dev-task';

// const prisma = new PrismaClient();

async function main() {
    // await prisma.$queryRaw`TRUNCATE TABLE "dev_collection" RESTART IDENTITY CASCADE`;

    // create a sample user
    await prisma.user.upsert({
        where: { id: 'clxjnddq40006cljsthhgwl4h' },
        update: {},
        create: {
            name: 'admin',
            email: 'admin@mail.com',
            password: '$2a$10$c1EQTA2333Fc/OKhnFA6rOs82Ik90hytaBETERRff7iMkSFoaOte6',
            emailVerified: new Date(Date.now()),
            role: 'ADMIN',
            isTwoFactorEnable: false,
        },
    });

    const transaction = await prisma.$transaction([
        // collection
        devCollection.deleteMany(),
        devCollection.resetSequence(),
        ...devCollection.create(2),
        // tasks
        devTask.deleteMany(),
        devTask.resetSequence(),
        ...devTask.create(11),
    ]);

    console.log(
        `seeder dev_collection finish delete:${JSON.stringify(transaction[0])} update:${JSON.stringify(transaction[1])} create:${JSON.stringify(transaction[2])}`
    );
}

main()
    .catch((err) => {
        console.log('Seed prisma Error: ', err);
        process.exit(1);
    })
    .finally(async () => {
        console.log('all seeder finish');
        await prisma.$disconnect();
    });
