import type { ReactNode } from 'react';
import '@xyflow/react/dist/style.css';

export default async function DrawLayout({ children }: { children: ReactNode | ReactNode[] }) {
    return <>{children}</>;
}
