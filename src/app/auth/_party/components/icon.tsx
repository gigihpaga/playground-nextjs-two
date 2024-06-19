import React, { lazy, Suspense } from 'react';
import { LucideProps } from 'lucide-react';
import dynamicIconImports from 'lucide-react/dynamicIconImports';

interface IconProps extends Omit<LucideProps, 'ref'> {
    name: keyof typeof dynamicIconImports;
}

export default function Icon({ name, ...props }: IconProps) {
    const LucideIcon = lazy(dynamicIconImports[name]);

    return (
        <Suspense fallback={<div style={{ background: '#ddd', width: 24, height: 24 }} />}>
            <LucideIcon {...props} />
        </Suspense>
    );
}
