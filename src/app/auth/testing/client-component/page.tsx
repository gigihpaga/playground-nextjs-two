'use client';

import { useCurrentUser } from '@/hooks/use-current-login';
import { auth, signOut as signOutServerComponent } from '@/lib/auth/auth-antonio';
import { logout } from '@/server/auth/logout';
import { useSession, signOut } from 'next-auth/react';
import { redirect } from 'next/navigation';

export default function TestingClientPage() {
    const session = useSession();
    const user = useCurrentUser();
    return (
        <div className="w-full flex flex-col">
            <p>
                Testing Page <span className="text-purple-500">Client Component</span>, session:
            </p>
            <pre>{JSON.stringify(session, null, 4)}</pre>
            <pre>{JSON.stringify(user, null, 2)}</pre>
            <form>
                <button
                    onClick={async () => await signOut()}
                    className="bg-gray-500 px-3 py-2 rounded-lg hover:bg-gray-600 transition-[background-color] duration-300"
                    type="button"
                >
                    sign out with signOut() next-auth/react
                </button>
                <button
                    onClick={async () => await logout()}
                    className="bg-gray-500 px-3 py-2 rounded-lg hover:bg-gray-600 transition-[background-color] duration-300"
                    type="button"
                >
                    sign out with logout() server action
                </button>
            </form>
        </div>
    );
}
