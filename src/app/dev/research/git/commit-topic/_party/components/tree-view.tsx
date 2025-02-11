'use client';

import { useState } from 'react';
import { ChevronDownIcon, ChevronRightIcon, CopyIcon, FileIcon, FileSymlinkIcon, MinusIcon } from 'lucide-react';

import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { type UntrackedAndModifiedFile } from '@/server/git-command';
import { transformPathTree2Flat, generatePathTree, type FileGit } from '@/utils/transform-path';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { ButtonCopy } from '@/components/ui/custom/button-copy';

import {
    addTopic,
    addFile,
    getWorkspaceTopicActive,
    getCommitTopicCollection,
    getTopics,
    getTopicInFile,
    updateTopic,
    type Topic,
} from '../state/commit-topic-collection-slice';
import { FileCard } from './file-card';
import { cn } from '@/lib/classnames';

export function TreeView({ itemsTree, dept = 0, loc = '' }: { loc?: string; dept?: number; itemsTree: FileGit<UntrackedAndModifiedFile>[] }) {
    return (
        <ul className="text-2xs space-y-1 ">
            {itemsTree.map((d, idx) => (
                <TreeChild
                    key={d.pathWithRoot}
                    item={d}
                    posinset={idx}
                    dept={dept}
                    loc={`${loc}`}
                />
            ))}
        </ul>
    );
}

function TreeChild({ item, posinset, dept, loc }: { loc: string; dept: number; item: FileGit<UntrackedAndModifiedFile>; posinset: number }) {
    const [isOpen, setIsOpen] = useState<boolean>(true);

    const dataLoc = loc === '' ? `${posinset + 1}` : `${loc}-${posinset + 1}`;
    if (item.type === 'file') {
        // dataCounter += 1;
    }
    // console.log(`Item render ${itemsTree.path}`);
    return (
        <li
            className={cn('relative group/list-tree', dept > 0 && 'ml-[14px]')}
            aria-posinset={posinset + 1}
            data-dept={dept}
            data-loc={dataLoc}
            // data-counter={dataCounter}
            // data-loc={loc}
            // data-counter={dataLoc.split('-').reduce((acc, curr) => acc + Number(curr), 0)}
        >
            {item.children.length > 0 && isOpen ? (
                <div
                    className="absolute w-[1px] h-[calc(100%-15px)] bg-muted-foreground/50 left-[7px] top-[14px] opacity-0 group-hover/list-tree:opacity-100"
                    aria-description="line"
                />
            ) : null}
            <div className="flex items-center">
                {/* icon */}
                <span className="size-4 flex justify-center items-center">
                    {item.type === 'file' ? (
                        <FileIcon className="size-[10px] mr-[3px]" />
                    ) : item.type === 'folder' && isOpen === true && item.children && item.children.length > 0 ? (
                        <ChevronDownIcon className="size-4" />
                    ) : item.type === 'folder' && isOpen === false && item.children && item.children.length > 0 ? (
                        <ChevronRightIcon className="size-4" />
                    ) : (
                        <MinusIcon className="size-4" />
                    )}
                </span>
                {item.type === 'folder' /* && itemsTree.children && itemsTree.children.length > 0 */ ? (
                    <button
                        className="flex gap-x-1 items-center"
                        onClick={() => {
                            setIsOpen((prev) => !prev);
                        }}
                    >
                        {item.name}
                        <span className="text-3xs py-[1px] px-[2px] border border-purple-300 _bg-purple-500 rounded-[2px] leading-none">
                            {getFiles(item.children).length}
                        </span>
                    </button>
                ) : (
                    <FileCard
                        className="_flex-row-reverse _justify-end _items-start flex-col gap-1"
                        item={item}
                    >
                        {/* <Button
                            style={{ fontSize: '10px' }}
                            className="h-full w-fit py-0 px-1 rounded-sm leading-tight _self-end _justify-end"
                        >
                            <MoreHorizontalIcon className="size-3" />
                        </Button> */}
                        <div className="space-x-1">
                            <DropdownTopic item={item} />
                            <ButtonCopy
                                title="copy path"
                                className="text-2xs h-fit w-fit p-1 rounded-sm leading-tight [&_svg]:size-3 [&_.btn-copy-icon-wrapper]:size-3"
                                data={item.path}
                            />
                        </div>
                    </FileCard>
                )}
            </div>
            {item.children && item.children.length > 0 && isOpen === true ? (
                <TreeView
                    dept={dept + 1}
                    itemsTree={item.children}
                    loc={dataLoc}
                />
            ) : null}
        </li>
    );
}

export function DropdownTopic({ item }: { item: FileGit<UntrackedAndModifiedFile> }) {
    const dispath = useAppDispatch();
    const workspaceActive = useAppSelector(getWorkspaceTopicActive);
    const topics = useAppSelector((state) => getTopics(state, workspaceActive));
    const topicInFile = useAppSelector((state) => getTopicInFile(state));

    function handleAddFile(topicId: Topic['id']) {
        if (!workspaceActive) {
            toast({ title: 'Error', description: 'you mush select commit topic collection first to add topic', variant: 'destructive' });
            return;
        }
        dispath(addFile({ file: item, topicId: topicId }));
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    title="add to topic"
                    className="text-2xs h-fit w-fit p-1 rounded-sm leading-tight _self-end _justify-end"
                >
                    <FileSymlinkIcon className="size-3" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Topics</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup className="max-h-[350px] overflow-y-auto">
                    {topics.length ? (
                        topics.map((topic) => (
                            <DropdownMenuItem
                                className="gap-1 text-xs"
                                key={topic.id}
                                disabled={topicInFile[item.pathWithRoot]?.some((tif) => tif.id === topic.id) ?? false}
                                onClick={() => handleAddFile(topic.id)}
                            >
                                <div
                                    style={{ backgroundColor: topic.color }}
                                    className="size-3"
                                    aria-description="circle color topic"
                                />
                                {topic.title}
                            </DropdownMenuItem>
                        ))
                    ) : (
                        <DropdownMenuLabel className="text-center font-normal text-muted-foreground">No topic</DropdownMenuLabel>
                    )}

                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger className="hidden">Invite users</DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                                <DropdownMenuItem>Email</DropdownMenuItem>
                                <DropdownMenuItem>Message</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>More...</DropdownMenuItem>
                            </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                    </DropdownMenuSub>
                </DropdownMenuGroup>

                {/* <DropdownMenuSeparator /> */}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export function getFiles(chindren: FileGit<UntrackedAndModifiedFile>['children']) {
    return transformPathTree2Flat(chindren).filter((a) => a.type === 'file');
}
