import { type ReactNode } from 'react';
import { ClerkProvider as ClerkProviderOri } from '@clerk/nextjs';

export function ClerkProvider({ children }: { children: ReactNode | ReactNode[] }) {
    return <ClerkProviderOri>{children}</ClerkProviderOri>;
}
