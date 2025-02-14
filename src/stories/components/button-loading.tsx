'use client';

import { useState } from 'react';
import { UploadIcon } from 'lucide-react';

import { LoadingElipseIcon } from '@/components/icons';
import { Button } from '@/components/ui/button';

export function ButtonLoading() {
    const [isLoading, setIsLoading] = useState(false);

    return (
        <Button
            className="size-7 _flex-shrink-0 text-xs p-0 flex"
            onClick={() => void console.log('halo')}
        >
            {isLoading === false ? <LoadingElipseIcon className="size-4" /> : <UploadIcon className="size-3 " />}
        </Button>
    );
}
