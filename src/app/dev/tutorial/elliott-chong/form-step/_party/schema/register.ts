import { z } from 'zod';

export const registerSchema = z.object({
    email: z
        .string()
        .email()
        .min(5, {
            message: 'email must contain at least 5 character(s)',
        })
        .max(255, {
            message: 'email must contain at most 255 character(s)',
        }),
    name: z.string().min(3).max(255),
    studentId: z
        .string()
        .min(7)
        .max(7)
        .refine((val) => !isNaN(val as unknown as number), {
            message: 'student id must be number',
        }),
    year: z
        .string()
        .min(2)
        .max(2)
        .refine((val) => !isNaN(val as unknown as number), {
            message: 'year must be number',
        }),
    password: z.string().min(5).max(100),
    comfirmPassword: z.string().min(5).max(100),
});

export type TRegisterSchema = z.infer<typeof registerSchema>;

export const registerSchemaOptional = registerSchema.partial({
    email: true,
    name: true,
    studentId: true,
    year: true,
    password: true,
    comfirmPassword: true,
});

export type TRegisterSchemaOptional = z.infer<typeof registerSchemaOptional>;
