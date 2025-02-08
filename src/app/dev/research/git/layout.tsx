import type { ReactNode } from 'react';
import '@xyflow/react/dist/style.css';

export default async function GitLayout({ children }: { children: ReactNode | ReactNode[] }) {
    return <>{children}</>;
}
