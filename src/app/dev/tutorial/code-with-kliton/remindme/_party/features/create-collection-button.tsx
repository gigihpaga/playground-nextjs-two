'use client';

import { Button } from '@/components/ui/button';
import { CreateCollectionSheet } from './create-collection-sheet';
import { useState } from 'react';

export function CreateCollectionButton() {
    const [open, setOpen] = useState(false);
    function handleOpen(open: boolean) {
        setOpen(open);
    }
    return (
        <div className="w-full rounded-md bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 p-[1px]">
            <Button
                onClick={() => setOpen(true)}
                variant="outline"
                size="sm"
                className="group dark:text-white text-foreground w-full dark:bg-neutral-950 dark:hover:bg-neutral-900 bg-white"
            >
                <span className="bg-gradient-to-r from-red-500 to-orange-500 group-hover:to-orange-600 group-hover:from-red-400 bg-clip-text text-transparent">
                    Create Collection
                </span>
            </Button>
            <CreateCollectionSheet
                open={open}
                onOpenChange={handleOpen}
            />
        </div>
    );
}
