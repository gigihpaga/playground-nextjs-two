'use client';

import React, { type ReactNode, useCallback, useMemo, useState, useActionState, useEffect } from 'react';
import { FileTextIcon } from 'lucide-react';

import { cn } from '@/lib/classnames';
import { generatePathTree, transformPathTree2Flat, type FileGit } from '@/utils/transform-path';
import { useDebounceText } from '@/hooks/use-debounce-text';

import { type HistoryCommit as HistoryCommitType } from '@/server/git-command';
import {
    getHistoryCommitOfFile,
    getHistoryCommitFileInCurrentProject,
    type HistoryCommitFileInCurrentProject,
} from '../action/history-commit-of-file';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ButtonCopy } from '@/components/ui/custom/button-copy';
import { Input } from '@/components/ui/input';
import { useServerActionQuery } from '@/hooks/use-server-action-query';
import { TreeViewDynamic } from '../components/tree-view-dynamic';
import { DrawerListFileInCommit } from './drawer-list-file-in-commit';
import { useServerActionMutation } from '@/hooks/use-server-action-mutation';
import { LoadingElipseIcon } from '@/components/icons';

type DialogHistoryCommitOfFileProps = {
    trigger: ReactNode;
};

export function DialogHistoryCommitOfFile({ trigger }: DialogHistoryCommitOfFileProps) {
    const [open, setOpen] = useState<boolean>(false);

    function handleOpenChange(state: boolean) {
        setOpen(state);
    }
    return (
        <Dialog
            open={open}
            onOpenChange={handleOpenChange}
        >
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className="w-full max-w-[90vw] h-[90vh] flex gap-2 flex-col">
                <DialogHeader>
                    <DialogTitle className="flex gap-2">History commit of file</DialogTitle>
                    <DialogDescription>Search history commit of file</DialogDescription>
                </DialogHeader>
                <HistoryCommit dialogStateIsOpen={open} />
                {/* <DialogFooter className="justify-end items-end self-end"></DialogFooter> */}
            </DialogContent>
        </Dialog>
    );
}

function HistoryCommit({ dialogStateIsOpen }: { dialogStateIsOpen: boolean }) {
    const [pathActive, setPathActive] = useState<string | null>(null);

    const {
        data: itemsTree,
        isError,
        error,
        isLoading,
        refetch,
    } = useServerActionQuery(
        async () => {
            const filePaths = await getHistoryCommitFileInCurrentProject();
            const filePathTrees = generatePathTree(filePaths);
            return filePathTrees;
        },
        [],
        { enabled: dialogStateIsOpen === true }
    );

    console.log('HistoryCommit', itemsTree);

    return (
        <div className="gap-2 py-4 flex-1 p-1 overflow-y-hidden flex">
            <div className=" h-full gap-y-2 p-2 flex flex-col border border-border rounded-md w-[40%] min-w-[40%]">
                <Button
                    title="refect files"
                    size="sm"
                    className="h-fit p-1 w-fit"
                    onClick={() => void refetch()}
                >
                    refetch
                </Button>
                {isLoading ? (
                    <div className="h-full flex justify-center items-center">
                        <LoadingElipseIcon className="dark:fill-white" />
                    </div>
                ) : isError ? (
                    <p>fetching error</p>
                ) : !itemsTree ? (
                    <p>data null</p>
                ) : (
                    <TreeViewWithSearch
                        itemsTree={itemsTree}
                        onPathClick={(path) => setPathActive(path)}
                    />
                )}
            </div>
            <div className="h-full gap-y-2 p-2 flex flex-col border border-border rounded-md  w-full">
                <div className="w-full overflow-hidden">
                    <div className="flex flex-row gap-x-2">
                        <p className="text-2xs">active path</p>
                        <div
                            className="flex-1 truncate _line-clamp-1 _text-nowrap text-2xs tracking-widest underline-offset-4 underline"
                            title={pathActive || ''}
                        >
                            {typeof pathActive === 'string' ? `${pathActive.slice(0, 100)}${pathActive.length > 100 ? '...' : ''}` : ''}
                        </div>
                        <ButtonCopy
                            className="mr-1 size-4 [&_.btn-copy-icon-wrapper]:size-[10px] [&_svg]:size-[10px] rounded"
                            data={pathActive || ''}
                            title="copy active path"
                        />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto space-y-2.5">
                    <ListHistoryCommit path={pathActive} />
                </div>
            </div>
        </div>
    );
}

function ListHistoryCommit({ path }: { path: string | null }) {
    const {
        data: historyCommits,
        isError,
        error,
        isLoading,
        refetch,
    } = useServerActionQuery(
        async () => {
            if (!path) return null;
            return getHistoryCommitOfFile(path);
        },
        [path],
        { enabled: path !== null }
    );

    console.log('ListHistoryCommit', historyCommits);

    return (
        <>
            {!path ? (
                <div className="h-full w-full flex justify-center items-center">select file to view history commit</div>
            ) : isLoading ? (
                <div className="h-full flex justify-center items-center">
                    <LoadingElipseIcon className="dark:fill-white" />
                </div>
            ) : isError ? (
                <p>{error ? `error: ${error}` : 'history commit error'}</p>
            ) : !historyCommits ? (
                <p>data null</p>
            ) : historyCommits.length === 0 ? (
                <div className="h-full w-full flex justify-center items-center">nothing history for selected file</div>
            ) : (
                historyCommits.map((historyCommit, idx) => (
                    <div
                        className="bg-[#6b6b7b] flex flex-col p-1 rounded-md gap-y-1 w-full"
                        key={historyCommit.hash}
                    >
                        <div className="bg-[#666677] p-1 text-xs">
                            <ButtonCopy
                                className="mr-1 size-4 [&_.btn-copy-icon-wrapper]:size-[10px] [&_svg]:size-[10px] rounded"
                                data={historyCommit.date}
                                title="copy date"
                            />

                            <span>date: {historyCommit.date}</span>
                        </div>
                        <div className="bg-[#666677] p-1 text-xs flex flex-row">
                            <ButtonCopy
                                className="mr-1 size-4 [&_.btn-copy-icon-wrapper]:size-[10px] [&_svg]:size-[10px] rounded"
                                data={historyCommit.hash}
                                title="copy hash"
                            />

                            <span className="flex-1">hash: {historyCommit.hash}</span>
                            <DrawerListFileInCommit
                                hash={historyCommit.hash}
                                trigger={
                                    <Button
                                        className="size-4 p-0 rounded"
                                        title="show list in this commit"
                                    >
                                        <FileTextIcon className="size-[10px]" />
                                    </Button>
                                }
                            />
                        </div>
                        <div className="bg-[#666677] p-1 text-xs">
                            <ButtonCopy
                                className="mr-1 size-4 [&_.btn-copy-icon-wrapper]:size-[10px] [&_svg]:size-[10px] rounded"
                                data={historyCommit.subject}
                                title="copy subject"
                            />
                            <span>
                                subject: <span className="underline">{historyCommit.subject}</span>
                            </span>
                        </div>
                        <div className="bg-[#666677] p-1 text-xs space-y-1">
                            <ButtonCopy
                                className="mr-1 size-4 [&_.btn-copy-icon-wrapper]:size-[10px] [&_svg]:size-[10px] rounded"
                                data={historyCommit.body}
                                title="copy body"
                            />
                            <span>body:</span>
                            {historyCommit.body.split('\n').map((word) => (word ? <p key={`${idx}_${word}_${historyCommit.hash}`}>{word}</p> : null))}
                        </div>
                    </div>
                ))
            )}
        </>
    );
}

type TreeViewWithSearchProps = { onPathClick?: (path: string) => void; itemsTree: FileGit<HistoryCommitFileInCurrentProject>[] };

function TreeViewWithSearch({ itemsTree, onPathClick }: TreeViewWithSearchProps) {
    const { setText: setTextSearch, text: textSearch, textDefered: textSearchDefered, isLoading: textSearchIsLoading } = useDebounceText('');
    return (
        <>
            <div>
                <Input
                    value={textSearch}
                    type="search"
                    className="text-xs h-7"
                    placeholder="search path or file name, eg: src\index.tsx or src/index.tsx"
                    onChange={(event) => setTextSearch(event.target.value)}
                />
            </div>
            <div className="_bg-purple-500 flex-1 overflow-y-auto">
                {textSearchIsLoading ? (
                    <div>writing...</div>
                ) : (
                    <TreeViewRender
                        searcQuery={textSearchDefered}
                        itemsTree={itemsTree}
                        onPathClick={onPathClick}
                    />
                )}
            </div>
        </>
    );
}

type TreeViewRenderProps = {
    searcQuery?: string;
    onPathClick?: (path: string) => void;
    itemsTree: FileGit<HistoryCommitFileInCurrentProject>[];
};

function TreeViewRender({ itemsTree, onPathClick, searcQuery }: TreeViewRenderProps) {
    const itemsTreeRender = filterData();

    function filterData() {
        if (typeof searcQuery !== 'string' || searcQuery === '') return itemsTree;
        const fileWithFilterSearch = transformPathTree2Flat(itemsTree, (file) => file.type === 'file').filter((item) =>
            item.path.includes(searcQuery.replace(/\\/g, '/'))
        );
        return generatePathTree(fileWithFilterSearch);
    }
    return (
        <TreeViewDynamic
            itemsTree={itemsTreeRender}
            render={(item) => (
                <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                        'w-fit h-fit p-[2px] text-2xs',
                        item.status === 'untracked' && 'text-green-300',
                        item.status === 'modified' && 'text-orange-300'
                    )}
                    onClick={() => {
                        if (onPathClick instanceof Function) {
                            onPathClick(item.path);
                        }
                    }}
                >
                    <p>{item.name}</p>
                </Button>
            )}
        />
    );
}
