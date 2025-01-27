import { z } from 'zod';
import { type dev_task } from '@prisma/client';

export const inputNewTaskSchema = z.object({
    collectionId: z.coerce.number().nonnegative().min(1),
    // collectionId: z.number().or(z.string()).pipe(z.coerce.number()),
    content: z.string().min(8, { message: 'Task content must be at least 8 characters' }),
    expiresAt: z.coerce
        .date({
            errorMap: (issue, { defaultError }) => ({
                message: issue.code === 'invalid_date' ? 'Thats not a date!' : defaultError,
            }),
        })
        .optional(),
});

export type InputNewTask = z.infer<typeof inputNewTaskSchema>;

export const inputUpdateTaskSchema = inputNewTaskSchema
    .extend({
        id: z.coerce.number(),
    })
    .omit({
        collectionId: true,
    });

export type InputUpdateTask = z.infer<typeof inputUpdateTaskSchema>;

export const inputDeleteTaskSchema = z.object({
    id: z.coerce.number(),
});

export type InputDeleteTask = z.infer<typeof inputDeleteTaskSchema>;
