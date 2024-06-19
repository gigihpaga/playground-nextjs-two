import { z } from 'zod';

export const NewPasswordSchema = z.object({
    password: z.string().min(5, {
        message: 'Minimum password 5 characters',
    }),
});

export type TNewPasswordSchema = z.infer<typeof NewPasswordSchema>;

export const ResetSchema = z.object({
    email: z.string().min(1, {
        message: 'Email is required',
    }),
});

export type TResetSchema = z.infer<typeof ResetSchema>;

export const LoginSchema = z.object({
    email: z
        .string()
        .min(1, {
            message: 'Email is required',
        })
        .email({ message: 'Email is invalid' }),
    password: z.string().min(1, {
        message: 'Password is required',
    }),
    code: z.optional(z.string()),
});

export type TLoginSchema = z.infer<typeof LoginSchema>;

export const RegisterSchema = z.object({
    email: z
        .string()
        .min(1, {
            message: 'Email is required',
        })
        .email({ message: 'Email is invalid' }),
    password: z.string().min(5, {
        message: 'Password must be 6 characters',
    }),
    name: z.string().min(1, {
        message: 'Name is required',
    }),
});

export type TRegisterSchema = z.infer<typeof RegisterSchema>;

export const SettingUserSchema = z
    .object({
        name: z
            .string()
            .min(4, {
                message: 'Name must contain at least 4 character(s)',
            })
            .max(100, {
                message: 'Name must contain at most 100 character(s)',
            }),
        email: z
            .string()
            .min(4, {
                message: 'Email must contain at least 4 character(s)',
            })
            .max(100, {
                message: 'Email must contain at most 100 character(s)',
            })
            .email(),
        password: z.optional(
            z.string()
            // .min(5, {
            //     message: 'Password must contain at least 5 character(s)',
            // })
            // .max(75, {
            //     message: 'Password must contain at most 75 character(s)',
            // })
        ),
        newPassword: z.optional(
            z.string()
            // .min(5, {
            //     message: 'New Password must contain at least 5 character(s)',
            // })
            // .max(75, {
            //     message: 'New Password must contain at most 75 character(s)',
            // })
        ),
        role: z.enum(['ADMIN', 'USER']),
        image: z.string().optional(),
        isTwoFactorEnable: z.boolean().optional(),
    })
    .refine(
        (data) => {
            if (data.password && !data.newPassword) return false;
            return true;
        },
        { message: 'New Password is required', path: ['newPassword'] }
    )
    .refine(
        (data) => {
            if (data.newPassword && !data.password) return false;
            return true;
        },
        { message: 'Password is required', path: ['password'] }
    );
/* 
    .refine(
        (data) => {
            return data.password === data.newPassword;
        },
        {
            message: 'Passwords must match!',
            path: ['confirmPassword'],
        }
    ); */

export type TSettingUserSchema = z.infer<typeof SettingUserSchema>;
