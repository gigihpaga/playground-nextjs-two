'use client';

import React, { ReactNode, Suspense, useDeferredValue, useState } from 'react';
import {
    ArrowBigDown,
    BarChartBigIcon,
    BookAIcon,
    BookPlusIcon,
    BookXIcon,
    FileClockIcon,
    FileXIcon,
    FolderSyncIcon,
    Grid2x2XIcon,
    ListIcon,
    ListTreeIcon,
    PuzzleIcon,
    RefreshCwIcon,
} from 'lucide-react';
import { CaretDownIcon, CaretUpIcon } from '@radix-ui/react-icons';

import { useAppSelector } from '@/lib/redux/hooks';
import { cn } from '@/lib/classnames';
import { type UntrackedAndModifiedFile } from '@/server/git-command';
import { transformPathTree2Flat, generatePathTree, type FileGit } from '@/utils/transform-path';

import {
    getAllFileInWorkspace,
    getWorkspaceTopicActive,
    getAllWorkspaceTopic,
    type CommitTopicCollectionState,
} from '../state/commit-topic-collection-slice';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/custom/radio-group';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

import { DropdownTopic } from '../components/tree-view';
import { FileCard } from '../components/file-card';
import { DialogHistoryCommitOfFile } from './dialog-history-commit-of-file';
import { TreeViewDynamic } from '../components/tree-view-dynamic';
import { FilePathCard } from '../components/file-path-card';
import { useDebounceText } from '@/hooks/use-debounce-text';
import { DialogListDepedencyPackageJson } from './dialog-list-depedency-package-json';
import { DialogListFileTopicUnsyncWithFileUntracked } from './dialog-list-file-topic-unsync-with-file-untracked';

type TypeFileView = 'list' | 'tree';
type StateFileFeatTopic = 'all' | 'fileintopic' | 'filenotintopic';

export default function SectionFileTrees({ itemsTree }: { itemsTree: FileGit<UntrackedAndModifiedFile>[] }) {
    // const [textSearch, setTextSearch] = useState('');
    // const [textSearchDefered, setTtextSearchDefered] = useState('');
    // const textSearchDefered = useDeferredValue(textSearch);

    // const [textSearch, setTextSearch] = useDebounceValue('', 500);

    const { setText: setTextSearch, text: textSearch, textDefered: textSearchDefered, isLoading: textSearchIsLoading } = useDebounceText('');

    const [fileView, setFileView] = useState<TypeFileView>('tree');
    const [fileFeatTopic, setFileFeatTopic] = useState<StateFileFeatTopic>('all');

    const [itemsTreeRender, setItemsTreeRender] = useState(itemsTree);
    //

    const allFilesInWorkspace = useAppSelector(getAllFileInWorkspace);

    // console.log(JSON.stringify(itemsFlat.slice(100, 120)));

    function handleSearch(text: string) {
        setTextSearch(text.replace(/\\/g, '/'));
        if (text === '') {
            setItemsTreeRender(itemsTree);
            if (fileFeatTopic !== 'all') {
                setFileFeatTopic('all');
            }
        }
    }

    function handleRadioView(type: TypeFileView) {
        setFileView(type);
    }

    function handleRadioFileFeatTopic(state: StateFileFeatTopic) {
        setFileFeatTopic(state);
        switch (state) {
            case 'all':
                if (textSearch !== '') {
                    const fileWithFilterSearch = transformPathTree2Flat(itemsTree, (file) => file.type === 'file').filter((item) =>
                        item.pathWithRoot.includes(textSearch)
                    );
                    setItemsTreeRender(generatePathTree(fileWithFilterSearch));
                } else {
                    setItemsTreeRender(itemsTree);
                }
                break;
            case 'fileintopic':
                setItemsTreeRender(generatePathTree(allFilesInWorkspace));
                // code block
                break;
            case 'filenotintopic':
                // eslint-disable-next-line no-case-declarations
                const fileFlat = transformPathTree2Flat(itemsTree, (file) => file.type === 'file').filter(
                    (f) => !allFilesInWorkspace.some((f2) => f2.pathWithRoot === f.pathWithRoot)
                );
                setItemsTreeRender(generatePathTree(fileFlat));
                break;
            default:
                break;
        }
    }

    console.log('SectionFileTrees RENDER');

    return (
        <section className="relative pr-2 _h-full space-y-2 overflow-auto min-w-[300px] h-[calc(100vh-79px)] max-w-[45vw]">
            <div className=" py-1 sticky top-0 right-0 left-0 bg-background space-y-1 z-[2]">
                <Button
                    className="hidden"
                    onClick={() => {
                        const flat = transformPathTree2Flat(itemsTree)
                            .filter((s) => s.type === 'file')
                            .map((s) => s.pathWithRoot.replace('root/', ''));
                        console.log(flat);
                    }}
                >
                    test
                </Button>
                {/* <DebugLocalStorageTopic /> */}

                {/* toolbar */}
                <div className="bg-accent rounded-md px-1 py-1.5 flex gap-x-1">
                    <DialogHistoryCommitOfFile
                        trigger={
                            <Button
                                className="h-fit w-fit p-1"
                                size="sm"
                                title="history commit of file"
                            >
                                <FileClockIcon className="size-3" />
                            </Button>
                        }
                    />
                    <DialogListDepedencyPackageJson
                        trigger={
                            <Button
                                className="h-fit w-fit p-1"
                                size="sm"
                                title="compare dependency in package json"
                            >
                                <PuzzleIcon className="size-3" />
                            </Button>
                        }
                    />
                    <DialogListFileTopicUnsyncWithFileUntracked
                        trigger={
                            <Button
                                className="h-fit w-fit p-1"
                                size="sm"
                                title="check topic files not sync with untracked files"
                            >
                                <Grid2x2XIcon className="size-3" />
                            </Button>
                        }
                    />
                </div>

                {/* search */}
                <Input
                    type="search"
                    className="px-4 pr-0 mt-[10px]"
                    placeholder="search..."
                    value={textSearch}
                    onChange={(event) => {
                        handleSearch(event.target.value);
                    }}
                />

                <FilterContainer classNameContent="space-y-1">
                    <div className="_bg-[#171e28] px-3 flex gap-2 items-center">
                        <Label>view</Label>
                        <RadioGroup
                            value={fileView}
                            onValueChange={(value: TypeFileView) => handleRadioView(value)}
                            className="w-fit border border-border rounded-md [&>button:first-child]:!-mr-[3px] [&>button:last-child]:!-ml-[3px] [&>button[aria-checked='true']:after]:!bg-purple-400"
                        >
                            <RadioGroupItem
                                value="list"
                                id="list"
                                title="list"
                                className="!min-w-fit !h-fit !w-fit !p-[6px] !border !border-border"
                            >
                                <ListIcon className="size-4" />
                            </RadioGroupItem>
                            <RadioGroupItem
                                value="tree"
                                id="tree"
                                title="tree"
                                className="!min-w-fit !h-fit !w-fit !p-[6px]"
                            >
                                <ListTreeIcon className="size-4" />
                            </RadioGroupItem>
                        </RadioGroup>
                    </div>
                    <div className="_bg-[#171e28] px-3 flex gap-2 items-center">
                        <Label>file feat topic</Label>
                        <RadioGroup
                            value={fileFeatTopic}
                            onValueChange={(value: StateFileFeatTopic) => handleRadioFileFeatTopic(value)}
                            className="w-fit border border-border rounded-md [&>button:first-child]:!-mr-[3px] [&>button:last-child]:!-ml-[3px] [&>button[aria-checked='true']:after]:!bg-purple-400"
                        >
                            <RadioGroupItem
                                value="all"
                                id="all"
                                title="all"
                                className="!min-w-fit !h-fit !w-fit !p-[6px] !border !border-border"
                            >
                                <BookAIcon className="size-4" />
                            </RadioGroupItem>
                            <RadioGroupItem
                                value="fileintopic"
                                id="fileintopic"
                                title="file in topic"
                                className="!min-w-fit !h-fit !w-fit !p-[6px]"
                            >
                                <BookPlusIcon className="size-4" />
                            </RadioGroupItem>
                            <RadioGroupItem
                                value="filenotintopic"
                                id="filenotintopic"
                                title="file not in topic"
                                className="!min-w-fit !h-fit !w-fit !p-[6px]"
                            >
                                <BookXIcon className="size-4" />
                            </RadioGroupItem>
                        </RadioGroup>
                    </div>
                </FilterContainer>
            </div>
            {textSearchIsLoading ? (
                <div>loading</div>
            ) : fileView === 'tree' ? (
                <TreeViewWithSearch
                    itemsTree={itemsTreeRender}
                    querySearch={textSearchDefered}
                />
            ) : fileView === 'list' ? (
                <ListViewRender
                    itemsTree={itemsTreeRender}
                    querySearch={textSearchDefered}
                />
            ) : null}
        </section>
    );
}

function FilterContainer({
    children,
    className,
    classNameContent,
}: {
    children: ReactNode | ReactNode[];
    className?: string;
    classNameContent?: string;
}) {
    const [isOpen, setIsOpen] = useState(true);
    return (
        <Collapsible
            aria-description="collapsible filter"
            open={isOpen}
            onOpenChange={(s) => setIsOpen(s)}
            className={className}
        >
            <CollapsibleTrigger asChild>
                <Button
                    variant="ghost"
                    className={cn('flex w-full justify-between h-fit px-2 py-1', isOpen && 'rounded-b-none dark:bg-neutral-900')}
                >
                    Filter
                    {isOpen === true ? <CaretUpIcon className="w-6 h-6" /> : <CaretDownIcon className="w-6 h-6" />}
                </Button>
            </CollapsibleTrigger>
            <CollapsibleContent
                aria-description="collapsible content"
                className={cn('flex rounded-b-lg flex-col dark:bg-neutral-900 shadow-lg', classNameContent)}
            >
                <Separator className="my-1" />
                {children}
            </CollapsibleContent>
        </Collapsible>
    );
}

function TreeViewWithSearch({ itemsTree, querySearch }: { itemsTree: FileGit<UntrackedAndModifiedFile>[]; querySearch: string }) {
    const dataRender = querySearch !== '' ? filterData() : itemsTree;

    function filterData() {
        const fileWithFilterSearch = transformPathTree2Flat(itemsTree, (file) => file.type === 'file').filter((item) =>
            item.pathWithRoot.includes(querySearch)
        );
        return generatePathTree(fileWithFilterSearch);
    }
    console.log('TreeViewWithSearch RENDER');
    // return <TreeView itemsTree={dataRender} />;
    return (
        <TreeViewDynamic
            itemsTree={dataRender}
            render={(item) => {
                return <FilePathCard item={item} />;
            }}
        />
    );
}

function ListViewRender({ itemsTree, querySearch }: { itemsTree: FileGit<UntrackedAndModifiedFile>[]; querySearch: string }) {
    const itemsList = transformPathTree2Flat(itemsTree, (file) => file.type === 'file');
    const dataRender = querySearch !== '' ? itemsList.filter((item) => item.pathWithRoot.includes(querySearch)) : itemsList;

    console.log('ListViewRender RENDER');
    return (
        <>
            <div>{dataRender.length}</div>
            {dataRender.map((file) => (
                <FileCard
                    className="_justify-between _items-start flex-col gap-1"
                    key={file.path}
                    item={file}
                >
                    <DropdownTopic item={file} />
                </FileCard>
            ))}
        </>
    );
}

function DebugLocalStorageTopic() {
    const workspaceActive = useAppSelector(getWorkspaceTopicActive);
    const [renderCount, setRenderCount] = useState(1);
    // JSON.parse(JSON.parse(localStorage.getItem("persist:gitCommitTopicCollection")).workspaceTopics)
    const collectionString = window?.localStorage.getItem('persist:gitCommitTopicCollection');
    const collectionObj = collectionString ? (JSON.parse(collectionString) as { workspaceTopicActive: string; workspaceTopics: string }) : null;
    const workspaceString = collectionObj ? collectionObj.workspaceTopics : null;
    const workspaceTopics = workspaceString ? (JSON.parse(workspaceString) as CommitTopicCollectionState['workspaceTopics']) : null;

    const workspaceTopic = workspaceTopics?.find((w) => w.id === workspaceActive);

    return (
        <div className="flex items-center gap-x-1">
            {/*  */}
            <div className="flex-1">
                {workspaceTopics ? (
                    workspaceTopic ? (
                        <p className="text-2xs leading-tight text-green-400">jumlah topic: {workspaceTopic.topics.length}</p>
                    ) : (
                        <p className="text-2xs leading-tight text-red-400">cannot find workspaceId: {workspaceActive}</p>
                    )
                ) : (
                    <p className="text-2xs leading-tight text-red-400">cannot read local storage</p>
                )}
            </div>
            <Button
                title="refresh topic"
                className="w-fit h-fit p-1"
                onClick={() => setRenderCount((prev) => prev + 1)}
            >
                <RefreshCwIcon className="size-[10px]" />
            </Button>
            <Button
                title="migrate topic from localStorage to indexedDB"
                className="w-fit h-fit p-1"
                onClick={() => {
                    console.log(collectionObj);
                }}
            >
                <FolderSyncIcon className="size-[10px]" />
            </Button>
        </div>
    );
}
