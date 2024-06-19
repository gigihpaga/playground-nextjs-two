import { ReactNode } from 'react';

interface AuthLayoutProps {
    children: ReactNode | ReactNode[];
}

export default async function AuthLayout({ children }: AuthLayoutProps) {
    return (
        <div
            className="w-full flex justify-center items-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400 to-blue-800 dark:from-[#2471ca] dark:to-transparent"
            aria-description="Auth Layout"
        >
            {children}
        </div>
    );
}
