import { LoginForm } from '../_party/features/login-form';

interface PageProps {
    params: { [key: string]: string | string[] | undefined } | Record<string, never>;
    searchParams: { [key: string]: string | string[] | undefined } | Record<string, never>;
}

export default async function LoginPage(req: PageProps) {
    return <LoginForm />;
}
