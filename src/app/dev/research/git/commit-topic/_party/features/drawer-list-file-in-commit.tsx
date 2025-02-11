'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { XIcon } from 'lucide-react';

import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';

import { useServerActionMutation } from '@/hooks/use-server-action-mutation';
import { generatePathTree, transformPathTree2Flat } from '@/utils/transform-path';
import { getFilesFromCommit } from '../action/history-commit-of-file';
import { TreeViewDynamic } from '../components/tree-view-dynamic';

type DrawerListFileInCommitProps = {
    trigger: ReactNode;
    hash: string;
};

export function DrawerListFileInCommit({ trigger, hash }: DrawerListFileInCommitProps) {
    // const { data, state, action, isLoading, isError, isSucces, error } = useServerActionMutation(getFilesFromCommit, []);
    const [drawerState, setDrawerState] = useState<boolean>(false);
    const [paths, setSetPaths] = useState<string[]>([]);

    useEffect(() => {
        if (drawerState === false) {
            return;
        }
        async function run() {
            const pathsInCommit = await getFilesFromCommit(hash);
            setSetPaths(pathsInCommit);
        }

        run();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [drawerState]);

    return (
        <Drawer
            open={drawerState}
            onOpenChange={setDrawerState}
        >
            <DrawerTrigger asChild>{trigger}</DrawerTrigger>
            <DrawerContent
                aria-description="DrawerContent"
                className="mt-12"
            >
                <DrawerHeader className="flex">
                    <div className="flex-1">
                        <DrawerTitle>Files from commit</DrawerTitle>
                        <DrawerDescription>Hash: {hash}</DrawerDescription>
                    </div>
                    <DrawerClose asChild>
                        <Button
                            size="icon"
                            className="h-fit w-fit p-1.5"
                            variant="outline"
                        >
                            <XIcon className="size-4" />
                        </Button>
                    </DrawerClose>
                </DrawerHeader>
                <div className="px-4 py-2 h-[70vh] flex flex-col overflow-hidden">
                    <h2 className="underline mb-2">list dependency</h2>
                    {paths.length > 0 ? (
                        <FilesInCommit paths={paths} />
                    ) : (
                        <div className="flex-1 flex justify-center items-center">no data to show</div>
                    )}
                </div>
            </DrawerContent>
        </Drawer>
    );
}

function FilesInCommit({ paths }: { paths: string[] }) {
    const pathTree = generatePathTree(paths.map((d) => ({ path: d })));
    const pathList = transformPathTree2Flat(pathTree, (d) => d.type === 'file');
    return (
        <>
            <div className="flex-1 overflow-auto">
                <TreeViewDynamic
                    itemsTree={pathTree}
                    render={(item) => <p>{item.name}</p>}
                />
            </div>
        </>
    );
}
