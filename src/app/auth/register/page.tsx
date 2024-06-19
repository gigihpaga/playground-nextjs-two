import { RegisterForm } from '../_party/features/register-form';

interface PageProps {
    params: { [key: string]: string | string[] | undefined } | Record<string, never>;
    searchParams: { [key: string]: string | string[] | undefined } | Record<string, never>;
}

export default async function RegisterPage(req: PageProps) {
    return <RegisterForm />;
}
