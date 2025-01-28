import { type ReactNode } from 'react';
import { InsightRoll } from '../_party/features/about';

export default function PersonalInfoLayout({ children }: { children: ReactNode | ReactNode[] }) {
    return (
        <main className="w-full flex flex-col items-center justify-between">
            <InsightRoll />
            {children}
        </main>
    );
}
