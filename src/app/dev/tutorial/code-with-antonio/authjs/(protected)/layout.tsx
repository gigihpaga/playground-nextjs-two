import { type ReactNode } from 'react';
import { Navbar } from './_party/components/navbar';

export default function LayoutProtected({ children }: { children: ReactNode | ReactNode[] }) {
    return (
        <div
            aria-description="layout protected group"
            className="container w-full flex flex-col gap-y-10 py-6 items-center _justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400 to-blue-800 dark:from-[#2471ca] dark:to-transparent"
        >
            <Navbar />
            {children}
        </div>
    );
}
