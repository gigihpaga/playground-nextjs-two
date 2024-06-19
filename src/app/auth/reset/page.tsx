import { ResetForm } from '../_party/features/reset-form';

interface PageProps {
    params: { [key: string]: string | string[] | undefined } | Record<string, never>;
    searchParams: { [key: string]: string | string[] | undefined } | Record<string, never>;
}

export default async function ResetPage(req: PageProps) {
    return <ResetForm />;
}
