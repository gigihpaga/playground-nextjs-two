import { ReactNode } from 'react';
import { NavBar2 } from '@/components/layout/navbar-v2/navbar-2';

export default async function RootTemplate({ children }: { children: ReactNode | ReactNode[] }) {
    return (
        <>
            <NavBar2 />
            <main className="flex flex-1 flex-col min-h-0">{children}</main>
        </>
    );
}
