import { auth, signOut } from '@/lib/auth/auth-antonio';
import { authRoutes } from '@/lib/auth/routes';
import { redirect } from 'next/navigation';

interface PageProps {
    params: { [key: string]: string | string[] | undefined } | Record<string, never>;
    searchParams: { [key: string]: string | string[] | undefined } | Record<string, never>;
}

export default async function TestingServerPage(req: PageProps) {
    const session = await auth();
    return (
        <div className="w-full flex flex-col">
            <p>
                Testing Page <span className="text-green-400">Server Component</span>, session:
            </p>
            <pre>{JSON.stringify(session, null, 4)}</pre>
            <form
                action={async () => {
                    'use server';
                    await signOut({ redirectTo: authRoutes.login }); // kalo tidak dikasih redirectTo "url browser tidak mau berubah" walaupun tampilan web berubah
                    // redirect(authRoutes.login);
                }}
            >
                <button
                    className="bg-gray-500 px-3 py-2 rounded-lg hover:bg-gray-600 transition-[background-color] duration-300"
                    type="submit"
                >
                    sign out
                </button>
            </form>
        </div>
    );
}
