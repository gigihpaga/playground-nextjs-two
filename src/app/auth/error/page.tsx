import { CardError } from '../_party/features/card-error';

interface PageProps {
    params: { [key: string]: string | string[] | undefined } | Record<string, never>;
    searchParams: { [key: string]: string | string[] | undefined } | Record<string, never>;
}

export default async function AuthErroPage(req: PageProps) {
    return <CardError />;
}
