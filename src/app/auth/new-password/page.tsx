import { NewPasswordForm } from '../_party/features/new-password-form';

interface PageProps {
    params: { [key: string]: string | string[] | undefined } | Record<string, never>;
    searchParams: { [key: string]: string | string[] | undefined } | Record<string, never>;
}

export default async function NewResetPasswordPage(req: PageProps) {
    return <NewPasswordForm />;
}
