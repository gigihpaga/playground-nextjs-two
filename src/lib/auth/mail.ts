import { Resend } from 'resend';
import type { VerificationToken, PasswordResetToken, TwoFactorToken } from '@prisma/client';

import { getErrorMessage } from '@/utils/get-error-message';

const resend = new Resend(process.env.RESEND_API_KEY);
const domain = process.env.NEXT_PUBLIC_APP_URL;
const mail = process.env.RESEND_MAIL_ADDRESS;

export async function sendPasswordResetEmail(email: PasswordResetToken['email'], token: PasswordResetToken['token']) {
    const confirmLink = `${domain}/auth/new-password?token=${token}`;
    try {
        await resend.emails.send({
            from: mail ?? 'onboarding@resend.dev',
            to: email,
            subject: 'Reset your password on app playground-nextjs-two',
            html: `<div>
                        <p>Click <a style="padding: 5px 15px;background-color: rgb(219, 135, 115);color: white;border-radius: 15px;font-weight: 600;" href="${confirmLink}">here</a> to reset password. </p>
                        <p>by gigih paga</p>
                    </div>`,
        });
    } catch (error) {
        console.log('sendPasswordResetEmail Error: ', getErrorMessage(error));
    }
}

export async function sendVerificationEmail(email: VerificationToken['email'], token: VerificationToken['token']) {
    const confirmLink = `${domain}/auth/new-verification?token=${token}`;
    try {
        await resend.emails.send({
            from: mail ?? 'onboarding@resend.dev',
            to: email,
            subject: 'Confirm your email on app playground-nextjs-two',
            html: `<div>
                        <p>Click <a style="padding: 5px 15px;background-color: #e2a2e2;border-radius: 15px;font-weight: 600;" href="${confirmLink}">here</a> to confirm email. </p>
                        <p>by gigih paga</p>
                    </div>`,
        });
    } catch (error) {
        console.log('sendVerificationEmail Error: ', getErrorMessage(error));
    }
}

export async function sendTwoFactorTokenEmail(email: TwoFactorToken['email'], token: TwoFactorToken['token']) {
    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: '2 Factor Authentication on app playground-nextjs-two',
            html: `
                    <div>
                        <p>Your 2FA code</p>
                        <p style="font-size: 2rem;font-weight: 800;">${token}</p>
                        <p>by <i style="font-weight: 600;">gigih paga</i> on playground-nextjs-two</p>
                    </div>
                `,
        });
    } catch (error) {
        console.log('sendTwoFactorTokenEmail Error: ', getErrorMessage(error));
    }
}
