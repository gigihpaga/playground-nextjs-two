'use client';

import { memo, ReactNode, useState } from 'react';
import { ChevronDownIcon, ChevronRightIcon, CopyIcon, FileIcon, FileSymlinkIcon, MinusIcon } from 'lucide-react';

import {
    ContextMenu,
    ContextMenuCheckboxItem,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuLabel,
    ContextMenuRadioGroup,
    ContextMenuRadioItem,
    ContextMenuSeparator,
    ContextMenuShortcut,
    ContextMenuSub,
    ContextMenuSubContent,
    ContextMenuSubTrigger,
    ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { type UntrackedAndModifiedFile } from '@/server/git-command';
import { transformPathTree2Flat, generatePathTree, type FileGit } from '@/utils/transform-path';

import { cn } from '@/lib/classnames';
import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks';
import { getTopics, getWorkspaceTopicActive, addFile, type Topic, deleteFile } from '../state/commit-topic-collection-slice';
import { Input } from '@/components/ui/input';
import { useDebounceText } from '@/hooks/use-debounce-text';

type BaseRecordFile<T> = { path: string; name: string; children: BaseRecordFile<T>[]; type: 'file' | 'folder' };

type TreeViewDynamicProps<T extends Record<string, unknown> & { path: string }> = {
    loc?: string;
    dept?: number;
    // itemsTree: FileGit<UntrackedAndModifiedFile>[];
    itemsTree: FileGit<T>[];
    // render: (item: FileGit<UntrackedAndModifiedFile>) => ReactNode;
    renderFolder?: (item: FileGit<T>, onCollapse: () => void) => ReactNode;

    render: (item: FileGit<T>) => ReactNode;
};

export function TreeViewDynamic<T extends Record<string, unknown> & { path: string }>({
    itemsTree,
    dept = 0,
    loc = '',
    renderFolder,
    render,
}: TreeViewDynamicProps<T>) {
    return (
        <ul className="text-2xs space-y-1 ">
            {itemsTree.map((d, idx) => {
                return (
                    <TreeChild
                        key={d.pathWithRoot}
                        item={d}
                        posinset={idx}
                        dept={dept}
                        loc={`${loc}`}
                        renderFolder={renderFolder}
                        render={render}
                    />
                );
            })}
        </ul>
    );
}

export const _TreeViewDynamic = memo(TreeViewDynamic, (prev, next) => prev.itemsTree.length !== next.itemsTree.length);

type TreeChildProps<T extends Record<string, unknown> & { path: string }> = {
    loc: string;
    dept: number;
    // item: FileGit<UntrackedAndModifiedFile>;
    item: FileGit<T>;
    posinset: number;
    // render: (item: FileGit<UntrackedAndModifiedFile>) => ReactNode;
    renderFolder?: (item: FileGit<T>, toggleOpen: () => void) => ReactNode;
    render: (item: FileGit<T>) => ReactNode;
};

export function TreeChild<T extends Record<string, unknown> & { path: string }>({
    item,
    posinset,
    dept,
    loc,
    renderFolder,
    render,
}: TreeChildProps<T>) {
    const [isOpen, setIsOpen] = useState<boolean>(true);

    const dataLoc = loc === '' ? `${posinset + 1}` : `${loc}-${posinset + 1}`;
    if (item.type === 'file') {
        // dataCounter += 1;
    }
    // console.log(`Item render ${itemsTree.path}`);

    function handleToggleOpen() {
        setIsOpen((prev) => !prev);
    }

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
                    renderFolder ? (
                        renderFolder(item, handleToggleOpen)
                    ) : (
                        <ContextFolder
                            item={item}
                            onClick={handleToggleOpen}
                        />
                    )
                ) : (
                    render(item)
                )}
            </div>
            {item.children && item.children.length > 0 && isOpen === true ? (
                <TreeViewDynamic
                    dept={dept + 1}
                    itemsTree={item.children}
                    loc={dataLoc}
                    renderFolder={renderFolder}
                    render={render}
                />
            ) : null}
        </li>
    );
}

const _TreeChild = memo(TreeChild, (prev, next) => prev.item.path !== next.item.path);

// function getFiles(chindren: FileGit<UntrackedAndModifiedFile>['children']) {
function getFiles<T extends Record<string, unknown>>(chindren: FileGit<T>[]) {
    return transformPathTree2Flat(chindren).filter((a) => a.type === 'file');
}

export function ContextFolder<T extends Record<string, unknown> & { path: string }>({ item, onClick }: { item: FileGit<T>; onClick?: () => void }) {
    const dispatch = useAppDispatch();
    const workspaceActive = useAppSelector(getWorkspaceTopicActive);
    const topics = useAppSelector((state) => getTopics(state, workspaceActive));
    const { setText: setTextSearch, text: textSearch, textDefered: textSearchDefered, isLoading: textSearchIsLoading } = useDebounceText('');

    const topicsFiltered = textSearch ? topics.filter((topic) => topic.title.toLowerCase().includes(textSearch.toLowerCase())) : topics;

    function handleAddFile(topicId: Topic['id'], children: FileGit<Record<string, unknown>>['children']) {
        const files = getFiles(children as FileGit<UntrackedAndModifiedFile>['children']);
        dispatch(addFile({ file: files, topicId: topicId }));
    }

    function handleDeleteFile(topicId: Topic['id'], children: FileGit<Record<string, unknown>>['children']) {
        const files = getFiles(children as FileGit<UntrackedAndModifiedFile>['children']);
        dispatch(deleteFile({ topicId: topicId, pathWithRoot: files.map((f) => f.pathWithRoot) }));
    }

    return (
        <ContextMenu>
            <ContextMenuTrigger
                asChild
                // className="flex h-[150px] w-[300px] items-center justify-center rounded-md border border-dashed text-sm"
            >
                <button
                    className="flex gap-x-1 py-[2px] px-[5px] rounded items-center hover:bg-neutral-500"
                    onClick={onClick}
                >
                    {item.name}
                    <span className="text-3xs py-[1px] px-[2px] border border-purple-300 _bg-purple-500 rounded-[2px] leading-none">
                        {getFiles(item.children).length}
                    </span>
                </button>
            </ContextMenuTrigger>
            <ContextMenuContent className="w-64">
                {/* <ContextMenuItem
                    inset
                    disabled
                >
                    Forward
                    <ContextMenuShortcut>⌘]</ContextMenuShortcut>
                </ContextMenuItem>
                <ContextMenuItem inset>
                    Reload
                    <ContextMenuShortcut>⌘R</ContextMenuShortcut>
                </ContextMenuItem> */}
                <ContextMenuSub>
                    <ContextMenuSubTrigger inset>Add to topic</ContextMenuSubTrigger>
                    <ContextMenuSubContent className="max-h-[50vh] gap-y-1 overflow-hidden flex flex-col">
                        <Input
                            className="h-7 text-xs"
                            type="search"
                            value={textSearch}
                            placeholder="search topic"
                            onChange={(event) => setTextSearch(event.target.value)}
                        />
                        <div className="flex-1 overflow-auto">
                            {textSearchIsLoading ? (
                                <div className="text-xs flex justify-center items-center h-7">loading...</div>
                            ) : topicsFiltered.length ? (
                                topicsFiltered.map((topic) => (
                                    <ContextMenuItem
                                        className="text-xs text-nowrap"
                                        key={topic.id}
                                        onClick={() => handleAddFile(topic.id, item.children)}
                                    >
                                        {topic.title}
                                    </ContextMenuItem>
                                ))
                            ) : (
                                <div className="text-xs flex justify-center items-center h-7">no topic result</div>
                            )}
                        </div>
                    </ContextMenuSubContent>
                </ContextMenuSub>
                <ContextMenuSub>
                    <ContextMenuSubTrigger inset>Delete from topic</ContextMenuSubTrigger>
                    <ContextMenuSubContent className="max-h-[50vh] gap-y-1 overflow-hidden flex flex-col">
                        <Input
                            className="h-7 text-xs"
                            type="search"
                            value={textSearch}
                            placeholder="search topic"
                            onChange={(event) => setTextSearch(event.target.value)}
                        />
                        <div className="flex-1 overflow-auto">
                            {textSearchIsLoading ? (
                                <div className="text-xs flex justify-center items-center h-7">loading...</div>
                            ) : topicsFiltered.length ? (
                                topicsFiltered.map((topic) => (
                                    <ContextMenuItem
                                        className="text-xs text-nowrap"
                                        key={topic.id}
                                        onClick={() => handleDeleteFile(topic.id, item.children)}
                                    >
                                        {topic.title}
                                    </ContextMenuItem>
                                ))
                            ) : (
                                <div className="text-xs flex justify-center items-center h-7">no topic result</div>
                            )}
                        </div>
                    </ContextMenuSubContent>
                </ContextMenuSub>
                {/*  <ContextMenuSeparator />
                <ContextMenuCheckboxItem checked>
                    Show Bookmarks Bar
                    <ContextMenuShortcut>⌘⇧B</ContextMenuShortcut>
                </ContextMenuCheckboxItem>
                <ContextMenuCheckboxItem>Show Full URLs</ContextMenuCheckboxItem>
                <ContextMenuSeparator /> */}
            </ContextMenuContent>
        </ContextMenu>
    );
}
