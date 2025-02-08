import { z } from 'zod';
export const createCommitedSchema = z.object({
    message: z
        .string()
        .min(1, { message: 'Commited message must be at least 8 characters' })
        .max(30, { message: 'Commited must contain at most 30 characters' }),
});

export type createCommitedSchemaType = z.infer<typeof createCommitedSchema>;
