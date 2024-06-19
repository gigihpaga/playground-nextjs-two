import { currentUser } from '@/lib/auth/current-login';
import { UserInfo } from '../_party/components/user-info';

interface PageProps {
    params: { [key: string]: string | string[] | undefined } | Record<string, never>;
    searchParams: { [key: string]: string | string[] | undefined } | Record<string, never>;
}

export default async function ServerPage(req: PageProps) {
    const user = await currentUser();
    return (
        <UserInfo
            label="Server Component"
            user={user}
        />
    );
}
