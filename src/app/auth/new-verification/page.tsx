import { NewVerificationForm } from '../_party/features/new-verification-form';

interface PageProps {
    params: { [key: string]: string | string[] | undefined } | Record<string, never>;
    searchParams: { [key: string]: string | string[] | undefined } | Record<string, never>;
}

export default async function NewVerificationPage(req: PageProps) {
    return <NewVerificationForm />;
}
