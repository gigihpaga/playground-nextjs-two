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
import { useServerActionQuery } from '@/hooks/use-server-action-query';
import { useServerActionMutation } from '@/hooks/use-server-action-mutation';
import { TreeViewDynamic } from '../components/tree-view-dynamic';
import { DrawerListFileInCommit } from './drawer-list-file-in-commit';
import { InputDebounce } from '@/app/dev/research/carx/grinding/_party/components/input-debounce';
import { getHistoryCommitOfFileByFolder, HistoryCommitOfFileByFolder } from '../action/history-commit-of-file-by-folder';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ButtonCopy } from '@/components/ui/custom/button-copy';
import { Input } from '@/components/ui/input';
import { LoadingElipseIcon } from '@/components/icons';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

type DialogHistoryCommitOfFileProps = {
    trigger: ReactNode;
};

export function DialogHistoryCommitOfFileByFolder({ trigger }: DialogHistoryCommitOfFileProps) {
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
                    <DialogTitle className="flex gap-2">History commit of file by folder</DialogTitle>
                    <DialogDescription>Search history commit of file by folder path</DialogDescription>
                </DialogHeader>
                <div className="flex-1 overflow-hidden">
                    <HistoryCommit dialogStateIsOpen={open} />
                </div>
            </DialogContent>
        </Dialog>
    );
}

function HistoryCommit({ dialogStateIsOpen }: { dialogStateIsOpen: boolean }) {
    const [pathFolder, setPathFolder] = useState('');
    const [isRecursiveScan, setIsRecursiveScan] = useState(false);

    const {
        data: fileWithhistoryCommits,
        isError,
        error,
        isLoading,
        refetch,
    } = useServerActionQuery(
        async () => {
            if (pathFolder === '') return [];
            // return await getHistoryCommitOfFileByFolder(pathFolder);
            const result = await getHistoryCommitOfFileByFolder(pathFolder, { recursive: isRecursiveScan });
            if (result.error) throw new Error(result.error);

            return result.data;
        },
        [pathFolder, isRecursiveScan],
        { enabled: pathFolder !== '' && dialogStateIsOpen === true }
    );

    console.log('HistoryCommit isRecursiveScan: ', isRecursiveScan);

    return (
        <div className="h-full gap-y-2 p-2 flex flex-col border border-border rounded-md  w-full">
            <InputDebounce
                className="text-xs h-8"
                type="search"
                placeholder="Search path folder, eg: src\app\dev\research\git\commit-topic\_party\features"
                value={pathFolder}
                onChange={(value) => setPathFolder(value.replace(/\\/g, '/'))}
            />
            <div className="flex gap-x-1">
                <Label className="text-xs">is recursive scan :</Label>
                <RadioGroup
                    value={String(isRecursiveScan)}
                    defaultValue={String(isRecursiveScan)}
                    className="flex flex-row"
                    onValueChange={(value) => setIsRecursiveScan(value === 'true')}
                >
                    {[true, false].map((value) => (
                        <div
                            key={`radio-is-recursive-scan-${String(value)}`}
                            className="flex items-center gap-2"
                        >
                            <RadioGroupItem
                                value={String(value)}
                                id={`radio-is-recursive-scan-${String(value)}`}
                            />
                            <Label
                                className="text-xs"
                                htmlFor={`radio-is-recursive-scan-${String(value)}`}
                            >
                                {value ? 'yes' : 'no'}
                            </Label>
                        </div>
                    ))}
                </RadioGroup>
            </div>
            {!pathFolder ? (
                <div className="h-full w-full flex justify-center items-center">
                    provide the folder path to display the files and their commit history
                </div>
            ) : isLoading ? (
                <div className="h-full flex justify-center items-center">
                    <LoadingElipseIcon className="dark:fill-white" />
                </div>
            ) : isError ? (
                <p>{error ? `error: ${error}` : 'history commit error'}</p>
            ) : !fileWithhistoryCommits ? (
                <p>data null</p>
            ) : fileWithhistoryCommits.length === 0 ? (
                <div className="h-full w-full flex justify-center items-center">nothing history for selected file</div>
            ) : (
                <>
                    <p className="text-xs">total files: {fileWithhistoryCommits.length}</p>
                    <List fileWithhistoryCommits={fileWithhistoryCommits} />
                </>
            )}
        </div>
    );
}

function List({ fileWithhistoryCommits }: { fileWithhistoryCommits: HistoryCommitOfFileByFolder[] }) {
    type GroupBy = 'file-name' | 'hash';
    const [groupBy, setGroupBy] = useState<GroupBy>('file-name');

    return (
        <div className="flex-1 overflow-hidden">
            <div className="h-full flex flex-col">
                <div>
                    <div className="flex gap-x-1">
                        <Label className="text-xs">group by:</Label>
                        <RadioGroup
                            value={groupBy}
                            defaultValue={groupBy}
                            className="flex flex-row"
                            onValueChange={(value) => setGroupBy(value as GroupBy)}
                        >
                            <div className="flex items-center gap-2">
                                <RadioGroupItem
                                    value="file-name"
                                    id="file-name"
                                />
                                <Label
                                    className="text-xs"
                                    htmlFor="file-name"
                                >
                                    file name
                                </Label>
                            </div>
                            <div className="flex items-center gap-2">
                                <RadioGroupItem
                                    value="hash"
                                    id="hash"
                                />
                                <Label
                                    className="text-xs"
                                    htmlFor="hash"
                                >
                                    hash
                                </Label>
                            </div>
                        </RadioGroup>
                    </div>
                </div>
                <div className="flex-1 overflow-hidden">
                    {groupBy === 'file-name' ? (
                        <GroupByFileName fileWithhistoryCommits={fileWithhistoryCommits} />
                    ) : (
                        <GroupByHasCommit fileWithhistoryCommits={fileWithhistoryCommits} />
                    )}
                </div>
            </div>
        </div>
    );
}

function GroupByFileName({ fileWithhistoryCommits }: { fileWithhistoryCommits: HistoryCommitOfFileByFolder[] }) {
    return (
        <ul className="h-full overflow-y-auto space-y-3">
            {fileWithhistoryCommits.map((fwhc) => (
                <li key={fwhc.name}>
                    <p>{fwhc.name}</p>
                    <ul className="space-y-1">
                        {fwhc.commits.length === 0 ? (
                            <li>belum ada commit</li>
                        ) : (
                            fwhc.commits.map((commit, idx) => (
                                <CardCommit
                                    key={commit.hash}
                                    commit={commit}
                                />
                            ))
                        )}
                    </ul>
                </li>
            ))}
        </ul>
    );
}

function GroupByHasCommit({ fileWithhistoryCommits }: { fileWithhistoryCommits: HistoryCommitOfFileByFolder[] }) {
    const historyCommitByHashs = generateHistoryCommitByHash(fileWithhistoryCommits);

    return (
        <ul className="h-full overflow-y-auto space-y-3">
            {historyCommitByHashs.map((hcbh) => (
                <div key={hcbh.hash}>
                    <Accordion
                        type="single"
                        collapsible
                        className="w-full"
                        defaultValue="no-item"
                    >
                        <AccordionItem value="item-1">
                            <AccordionTrigger className="text-xs py-1">{hcbh.files.length} files</AccordionTrigger>
                            <AccordionContent className="flex flex-col gap-4 text-balance">
                                <p className="text-2xs">{hcbh.files.map((file) => file.name).join(', ')}</p>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                    <CardCommit commit={{ body: hcbh.body, date: hcbh.date, hash: hcbh.hash, subject: hcbh.subject }} />
                </div>
            ))}
        </ul>
    );
}

function CardCommit({ commit }: { commit: HistoryCommitType }) {
    return (
        <li className="bg-[#6b6b7b] flex flex-col p-1 rounded-md gap-y-1 w-full">
            <div className="bg-[#666677] p-1 text-xs">
                <ButtonCopy
                    className="mr-1 size-4 [&_.btn-copy-icon-wrapper]:size-[10px] [&_svg]:size-[10px] rounded"
                    data={commit.date}
                    title="copy date"
                />

                <span>date: {commit.date}</span>
            </div>
            <div className="bg-[#666677] p-1 text-xs flex flex-row">
                <ButtonCopy
                    className="mr-1 size-4 [&_.btn-copy-icon-wrapper]:size-[10px] [&_svg]:size-[10px] rounded"
                    data={commit.hash}
                    title="copy hash"
                />

                <span className="flex-1">hash: {commit.hash}</span>
                <DrawerListFileInCommit
                    hash={commit.hash}
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
                    data={commit.subject}
                    title="copy subject"
                />
                <span>
                    subject: <span className="underline">{commit.subject}</span>
                </span>
            </div>
            <div className="bg-[#666677] p-1 text-xs space-y-1">
                <ButtonCopy
                    className="mr-1 size-4 [&_.btn-copy-icon-wrapper]:size-[10px] [&_svg]:size-[10px] rounded"
                    data={commit.body}
                    title="copy body"
                />
                <span>body:</span>
                {commit.body.split('\n').map((word) => (word ? <p key={`${commit.hash}_${word}_${commit.hash}`}>{word}</p> : null))}
            </div>
        </li>
    );
}

//* helper
type HistoryCommitByHash = HistoryCommitType & { files: Array<Omit<HistoryCommitOfFileByFolder, 'commits'>> };

function generateHistoryCommitByHash(fileWithhistoryCommits: HistoryCommitOfFileByFolder[]): HistoryCommitByHash[] {
    const commitsByHash = new Map<HistoryCommitByHash['hash'], HistoryCommitByHash>();

    for (const file of fileWithhistoryCommits) {
        // Informasi file yang akan ditambahkan ke setiap commit
        const fileInfoForCommit: Omit<HistoryCommitOfFileByFolder, 'commits'> = {
            fullPath: file.fullPath,
            name: file.name,
            path: file.path,
        };
        for (const commit of file.commits) {
            // Jika hash commit belum ada di map, inisialisasi entri baru
            if (!commitsByHash.has(commit.hash)) {
                commitsByHash.set(commit.hash, {
                    ...commit, // Salin semua properti dari HistoryCommitType
                    files: [], // Inisialisasi array file kosong
                });
            }

            // Tambahkan informasi file ke array 'files' dari commit yang sesuai
            commitsByHash.get(commit.hash)?.files.push(fileInfoForCommit);
        }
    }
    // Kembalikan semua nilai dari map sebagai array
    const result = Array.from(commitsByHash.values()).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return result;
}
