import { PrismaClient, type Prisma } from '@prisma/client';

const isDevelopment = process.env.NODE_ENV === 'development';
const log: Prisma.PrismaClientOptions['log'] | undefined = isDevelopment
    ? [
          {
              emit: 'stdout',
              level: 'query',
          },
      ]
    : undefined;

const prismaClientSingleton = () => {
    return new PrismaClient({
        // commented this "log" for non-active logger
        log: log,
    });
};

declare const globalThis: {
    prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma;
