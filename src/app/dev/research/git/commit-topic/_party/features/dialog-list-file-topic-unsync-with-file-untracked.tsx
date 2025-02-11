'use client';

import { type ReactNode, useState } from 'react';

import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { useServerActionQuery } from '@/hooks/use-server-action-query';
import { getAllDependencys, getAllTopics, type Topic, type Dependency } from '../state/commit-topic-collection-slice';

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { getUntrackedAndModifiedFiles, type UntrackedAndModifiedFile } from '../action/untracked-modified-files';

import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ButtonCopy } from '@/components/ui/custom/button-copy';
import { SparkleIcon, SparklesIcon } from 'lucide-react';
import { LoadingElipseIcon } from '@/components/icons';
import { constants } from 'fs/promises';

export function DialogListFileTopicUnsyncWithFileUntracked({ trigger }: { trigger: ReactNode }) {
    const [dialogStateIsOpen, setDialogStateIsOpen] = useState<boolean>(false);

    return (
        <Dialog
            open={dialogStateIsOpen}
            onOpenChange={setDialogStateIsOpen}
        >
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className="flex flex-col _sm:max-w-[425px] h-[80vh] max-h-[80vh] max-w-[90vw] overflow-hidden gap-1">
                <DialogHeader>
                    <DialogTitle className="flex gap-2">DialogListFileTopicUnsyncWithFileUntracked</DialogTitle>
                    <DialogDescription>A list file used in Topic but not available in Filesystem (maybe file is deleted or renamed)</DialogDescription>
                </DialogHeader>
                <ListTopicFilesUnsyncWithUntrackedFiles dialogStateIsOpen={dialogStateIsOpen} />
            </DialogContent>
        </Dialog>
    );
}

function ListTopicFilesUnsyncWithUntrackedFiles({ dialogStateIsOpen }: { dialogStateIsOpen: boolean }) {
    const topics = useAppSelector(getAllTopics);

    const {
        data: untrackedFiles,
        isError,
        error,
        isLoading,
        refetch,
    } = useServerActionQuery(() => getUntrackedAndModifiedFiles(), [], {
        enabled: dialogStateIsOpen === true,
    });

    const diffFiles = getDiffFile({ topics: topics, untrackedFiles: untrackedFiles });

    return (
        <div className="flex-1 overflow-hidden">
            {isLoading ? (
                <div className="h-full flex justify-center items-center">
                    <LoadingElipseIcon className="dark:fill-white" />
                    <span className="sr-only">loading...</span>
                </div>
            ) : isError ? (
                <div>error: {error}</div>
            ) : !untrackedFiles ? (
                <div>data null</div>
            ) : diffFiles.length === 0 ? (
                <div className="flex h-full justify-center items-center gap-x-3">
                    hooray, all files in Topic are available in the filesystem
                    <SparklesIcon className="animate-ping text-yellow-200" />
                </div>
            ) : diffFiles.length > 0 ? (
                <div className="h-full overflow-auto [&>div]:overflow-visible">
                    <TableTopicFilesUnsyncWithUntrackedFiles diffFiles={diffFiles} />
                </div>
            ) : (
                <div>empty data</div>
            )}
        </div>
    );
}

function TableTopicFilesUnsyncWithUntrackedFiles({ diffFiles }: { diffFiles: Array<{ topicTitle: string; path: string }> }) {
    return (
        <Table>
            <TableCaption>A list file used in Topic but not available in Disk (maybe file is deleted or renamed).</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[60px]">No</TableHead>
                    <TableHead className="w-[100px]">Topic name</TableHead>
                    <TableHead>Path</TableHead>
                    {/* <TableHead className="w-[80px] text-center">Action</TableHead> */}
                </TableRow>
            </TableHeader>
            <TableBody>
                {diffFiles.map((file, idx) => (
                    <TableRow
                        // className={cn(dependency.isNew && 'text-green-400')}
                        key={`${file.path}-${file.topicTitle}`}
                    >
                        <TableCell className="font-light py-1 px-[6px]">{idx + 1}</TableCell>
                        <TableCell className="font-light py-1 px-[6px] text-nowrap">
                            <ButtonCopy
                                title="copy topic title"
                                className="size-[18px] [&_.btn-copy-icon-wrapper]:size-[10px] [&_svg]:size-[10px] rounded mr-1"
                                data={file.topicTitle}
                            />

                            {file.topicTitle}
                        </TableCell>
                        <TableCell className="font-light py-1 px-[6px] text-nowrap">
                            <ButtonCopy
                                title="copy file path"
                                className="size-[18px] [&_.btn-copy-icon-wrapper]:size-[10px] [&_svg]:size-[10px] rounded mr-1"
                                data={file.path}
                            />
                            {file.path}
                        </TableCell>
                        {/* <TableCell className="text-center font-light py-1 px-[6px]"></TableCell> */}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}

function getDiffFile({ untrackedFiles, topics }: { untrackedFiles: UntrackedAndModifiedFile[] | null; topics: Topic[] }) {
    if (!untrackedFiles) return [];

    const _untrackedFilePaths = new Set(untrackedFiles.map((uf) => uf.path));
    const _topicFilePaths = new Set(topics.filter((topic) => topic.isCommited != true).flatMap((topic) => topic.files.map((file) => file.path)));
    const _diff = _topicFilePaths.difference(_untrackedFilePaths);

    // const unsyncFiles = Array.from(_topicFilePaths).filter((tf) => !Array.from(_untrackedFilePaths).some((uf) => uf === tf));
    const unsyncFiles = Array.from(_diff);

    const unsyncFilesWithTopic = unsyncFiles.flatMap((path) => {
        return topics.filter((topic) => topic.files.some((file) => file.path === path)).map((topic) => ({ topicTitle: topic.title, path: path }));
    });

    return unsyncFilesWithTopic;
}
