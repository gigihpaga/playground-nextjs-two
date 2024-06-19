'use client';

import { currentUser } from '@/lib/auth/current-login';
import { UserInfo } from '../_party/components/user-info';
import { useCurrentUser } from '@/hooks/use-current-login';
import { useSession, getSession } from 'next-auth/react';

interface PageProps {
    params: { [key: string]: string | string[] | undefined } | Record<string, never>;
    searchParams: { [key: string]: string | string[] | undefined } | Record<string, never>;
}

export default function ClientPage(req: PageProps) {
    const userHook = useCurrentUser();
    // const useSessionHook = useSession();
    // const getSessionHook = getSession();
    return (
        <>
            <UserInfo
                label="Client Component"
                user={userHook}
            />
            <div className="space-y-5">
                <div className="bg-red-500">
                    userHook
                    {/* {JSON.stringify(userHook, null, 4)} */}
                </div>
                <div className="bg-purple-500">
                    useSessionHook
                    {/* {JSON.stringify(useSessionHook, null, 4)} */}
                </div>
                <div className="bg-green-300">
                    getSessionHook
                    {/* {JSON.stringify(
                        getSessionHook.then((d) => d?.user).catch(() => 'err'),
                        null,
                        4
                    )} */}
                </div>
            </div>
        </>
    );
}
