'use client';

import { Button } from '@/components/ui/button';
import { XIcon } from 'lucide-react';

interface Props {
    file: File;
    onDelete: (file: File) => void;
}

export function FileHeader({ file, onDelete }: Props) {
    return (
        <div className="flex justify-between items-center">
            <p>{file.name}</p>

            <Button
                className="size-7"
                size="icon"
                variant="ghost"
                onClick={() => onDelete(file)}
            >
                <XIcon className="size-4" />
            </Button>
        </div>
    );
}
