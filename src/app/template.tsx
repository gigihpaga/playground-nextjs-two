import { ReactNode } from 'react';
import { NavBar } from '@/components/layout/navbar';

export default async function RootTemplate({ children }: { children: ReactNode | ReactNode[] }) {
    return (
        <>
            <NavBar />
            <main className="flex flex-1 flex-col min-h-0">{children}</main>
        </>
    );
}
