import { Poppins } from 'next/font/google';
import { cn } from '@/lib/classnames';
import { Button } from '@/components/ui/button';
import { LoginButton } from '@/app/auth/_party/components/login-button';
const poppins = Poppins({
    subsets: ['latin'],
    weight: ['300', '600'],
});

interface PageProps {
    params: { [key: string]: string | string[] | undefined } | Record<string, never>;
    searchParams: { [key: string]: string | string[] | undefined } | Record<string, never>;
}

export default async function AuthJsPage(req: PageProps) {
    return (
        <div className="flex w-full flex-col items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400 to-blue-800">
            <div className="space-y-6 text-center">
                <h1 className={cn('text-6xl font-semibold text-white drop-shadow-md', poppins.className)}>🔐 Auth</h1>
                <p className="text-white text-lg">A simple authentication service</p>
                <div>
                    <LoginButton>
                        <Button
                            variant="secondary"
                            size="lg"
                            className="rounded-full"
                        >
                            Sign in
                        </Button>
                    </LoginButton>
                    <LoginButton
                        asChild
                        mode="modal"
                    >
                        <Button
                            variant="secondary"
                            size="lg"
                            className="rounded-full"
                        >
                            Sign in modal
                        </Button>
                    </LoginButton>
                </div>
            </div>
        </div>
    );
}
