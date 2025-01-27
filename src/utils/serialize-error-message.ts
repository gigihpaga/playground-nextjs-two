import { Prisma } from '@prisma/client';
import { ZodError as ZodErrorOriginal } from 'zod';
import { getErrorMessage } from './get-error-message';

type TypePrismaError = 'prisma';
type TypeZodError = 'zod';
type TypeUnknowError = 'unknow';

export type PrismaError = {
    errorType: TypePrismaError;
    errorCode: string;
    message: string;
    errorMeta?: Record<string, unknown>;
};

export type ZodError = {
    errorType: TypeZodError;
    errors: Array<{ message: string }>;
};

export type UnkowError = {
    errorType: TypeUnknowError;
    message: string;
};

export function serializeErrorMessage(error: unknown) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
        return {
            errorType: 'prisma',
            message: error.message,
            errorCode: error.code,
            errorMeta: error.meta,
        } satisfies PrismaError as PrismaError;
    } else if (error instanceof ZodErrorOriginal) {
        const fieldZodErrors = error.flatten().fieldErrors;
        return Object.entries(fieldZodErrors).reduce(
            (acc, [key, value], idx, data) => {
                let newErrors = acc?.errors;
                if (value?.length) {
                    const errZod = value.map((errText) => {
                        return { message: `field: ${key}, error: ${errText}` };
                    });
                    newErrors = [...newErrors, ...errZod];
                }
                return {
                    ...acc,
                    errors: newErrors,
                };
            },
            { errorType: 'zod', errors: [] } satisfies ZodError as ZodError
        );
    } else {
        return {
            errorType: 'unknow',
            message: getErrorMessage(error),
        } satisfies UnkowError as UnkowError;
    }
}
