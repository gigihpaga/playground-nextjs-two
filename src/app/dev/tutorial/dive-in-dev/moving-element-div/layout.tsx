import { ReactNode } from 'react';
import { TabPage } from './_party/features/tab-page';

export default function MovingElementDivLayout({ children }: { children: ReactNode | ReactNode[] }) {
    return (
        <div className="w-full">
            <TabPage />
            {children}
        </div>
    );
}
