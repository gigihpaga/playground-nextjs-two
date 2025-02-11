'use client';

import React, { forwardRef, type ReactNode, useEffect, useRef, useState } from 'react';
import {
    ArrowLeftFromLine,
    BookOpenTextIcon,
    CheckCheckIcon,
    ChevronsUpDownIcon,
    CopyIcon,
    FileXIcon,
    LibraryBigIcon,
    ListIcon,
    ListTreeIcon,
    PencilIcon,
    PlusCircleIcon,
    RocketIcon,
    SaveIcon,
    Table2Icon,
    TrashIcon,
} from 'lucide-react';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { cn } from '@/lib/classnames';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { generatePathTree, type FileGit } from '@/utils/transform-path';
import { type UntrackedAndModifiedFile } from '@/server/git-command';

import {
    getWorkspaceTopicActive,
    getCommitTopicCollection,
    addTopic,
    getTopics,
    updateTopic,
    deleteFile,
    deleteTopic,
    type Topic,
    type WorkspaceTopic,
    getAllTopics,
} from '../state/commit-topic-collection-slice';

import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { RadioGroup, RadioGroupItem } from '@/components/ui/custom/radio-group';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { ButtonCopy } from '@/components/ui/custom/button-copy';

import { FileCard } from '../components/file-card';

import { SheetWorkspaceTopic } from './sheet-workspace-topic-collection';
import { SheetTopicCollection } from './sheet-topic-collection';
import { TreeViewDynamic } from '../components/tree-view-dynamic';
import { FilePathCard } from '../components/file-path-card';
import DialogTopicCollectionTable from './dialog-topic-collection-table';

export function SectionKanbanTopic() {
    const kanbanColumnRefs = React.useRef<Record<Topic['id'], HTMLDivElement | null>>({});

    function storeringKanbanColumnRefs(topicId: Topic['id'], element: HTMLDivElement | null) {
        kanbanColumnRefs.current[topicId] = element;
    }

    return (
        <section className="flex-1 flex flex-col h-full w-full overflow-hidden relative gap-1">
            <KanbanPanel kanbanColumnRefs={kanbanColumnRefs} />
            <KanbanBoard storeringKanbanColumnRefs={storeringKanbanColumnRefs} />
        </section>
    );
}

function KanbanBoard({ storeringKanbanColumnRefs }: { storeringKanbanColumnRefs(topicId: Topic['id'], element: HTMLDivElement | null): void }) {
    const dispath = useAppDispatch();
    const workspaceActive = useAppSelector(getWorkspaceTopicActive);
    const topics = useAppSelector((state) => getTopics(state, workspaceActive));

    function handleOnAddTopic() {
        if (!workspaceActive) {
            toast({ title: 'Error', description: 'you mush select commit topic collection first to add topic', variant: 'destructive' });
            return;
        }
        dispath(addTopic(workspaceActive));
    }

    return (
        <div className="flex-1 overflow-hidden flex flex-col gap-1">
            <div></div>
            <div
                className="flex-1 overflow-hidden"
                aria-description="kanban board"
            >
                <div className="h-full w-full gap-2 overflow-y-hidden overflow-x-auto flex">
                    <div className="flex gap-2">
                        {topics.map((topic) => (
                            <KanbanColumn
                                ref={(el) => storeringKanbanColumnRefs(topic.id, el)}
                                key={topic.id}
                                topic={topic}
                            />
                        ))}
                    </div>
                    <button
                        onClick={() => handleOnAddTopic()}
                        className="h-[60px] w-[350px] min-w-[350px] cursor-pointer rounded-lg bg bg-[#0D1117] border border-[#161C22] p-4 ring-rose-500 hover:ring-2 flex items-center gap-2"
                    >
                        <PlusCircleIcon />
                        Add Topic
                    </button>
                </div>
            </div>
        </div>
    );
}

type KanbanColumnProps = { topic: Topic };

const KanbanColumn = forwardRef<HTMLDivElement, KanbanColumnProps>(({ topic }, ref) => {
    const dispath = useAppDispatch();
    const [fileView, setFileView] = useState<'list' | 'tree'>('list');
    const topicFileTree = generatePathTree(topic.files);

    function handleDeleteTopic(topicId: Topic['id']) {
        dispath(deleteTopic({ topicId: topicId }));
    }

    function handleChangeStateCommited(state: boolean) {
        dispath(
            updateTopic({
                topicId: topic.id,
                data: { ...topic, isCommited: state },
            })
        );
    }

    function handleRemoveFile(topicId: Topic['id'], pathWithRoot: FileGit<UntrackedAndModifiedFile>['pathWithRoot']) {
        dispath(
            deleteFile({
                topicId: topicId,
                pathWithRoot: pathWithRoot,
            })
        );
    }

    // console.log(`kanban colum ${topic.title} render`, topic.isCommited);

    return (
        <div
            ref={ref}
            className="bg-[#161C22] w-[350px] h-[450px] max-h-[450px] rounded-md flex flex-col"
        >
            {/* Column header */}
            <div
                aria-description="kanban column header"
                className="group/column-header bg-[#0D1117] text-md h-[60px] cursor-grab rounded-md rounded-b-none p-3 font-bold border-[#161C22] border-4 flex items-center justify-between"
            >
                <div className=" flex gap-2 items-start">
                    <div className="space-y-1">
                        <ButtonCopy
                            style={{ backgroundColor: topic.color }}
                            className="flex rounded-full size-4 [&_svg:first-child]:hidden [&_svg]:size-3 [&_.btn-copy-icon-wrapper]:size-3"
                            data={topic.title}
                            title="copy title"
                        />
                        <Checkbox
                            checked={topic.isCommited}
                            title={`mark to ${topic.isCommited ? 'uncommited' : 'commited'}`}
                            onCheckedChange={(state) => handleChangeStateCommited(Boolean(state))}
                        />
                    </div>
                    <div className="space-y-1">
                        <div className="relative leading-none">
                            {topic.title}
                            <p className="text-2xs ml-[2px] _bg-purple-500 font-light leading-none p-[2px] rounded-[2px] absolute top-[0px] left-[100%]">
                                {topic.files.length}
                            </p>
                        </div>
                        <p className="text-2xs leading-nonemin-h-2">{topic.description ?? ''}</p>
                    </div>
                </div>

                <div
                    aria-description="toolbar topic"
                    className="flex gap-1 "
                >
                    <PopoverFormTopic
                        topic={topic}
                        trigger={
                            <button
                                title="edit"
                                className="p-1.5 rounded hover:bg-[#161C22] group opacity-0 group-hover/column-header:opacity-100"
                            >
                                <PencilIcon className="size-3 stroke-gray-500 group-hover:stroke-white" />
                            </button>
                        }
                    />
                    <button
                        title="delete"
                        onClick={() => handleDeleteTopic(topic.id)}
                        className="p-1.5 rounded hover:bg-[#161C22] group opacity-0 group-hover/column-header:opacity-100"
                    >
                        <TrashIcon className="size-3 stroke-gray-500 group-hover:stroke-white" />
                    </button>
                </div>
            </div>

            {/* Column panel */}
            <div className="bg-[#171e28] px-3">
                <RadioGroup
                    // defaultValue=""
                    value={fileView}
                    onValueChange={(value: 'list' | 'tree') => setFileView(value)}
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

            {/* Column container */}
            <div className="flex flex-grow flex-col gap-4 p-2 overflow-x-auto overflow-y-auto">
                {fileView === 'list' ? (
                    topic.files.map((file) => {
                        return (
                            /**
                            <FileCard
                                className="_justify-between _items-start flex-col gap-1"
                                key={file.path}
                                item={file}
                            >
                                <Button
                                    title="remove file from topic"
                                    className="text-2xs h-fit w-fit p-1 rounded-sm leading-tight self-start _justify-center"
                                    onClick={() => handleRemoveFile(topic.id, file.pathWithRoot)}
                                >
                                    <FileXIcon className="size-3" />
                                </Button>
                            </FileCard>
                            */
                            <FilePathCard
                                item={file}
                                key={file.path}
                                deleteButton={
                                    <Button
                                        title="remove file from topic"
                                        className="text-destructive text-2xs h-fit w-fit p-1 rounded-sm leading-tight self-start _justify-center"
                                        onClick={() => handleRemoveFile(topic.id, file.pathWithRoot)}
                                    >
                                        <FileXIcon className="size-[10px]" />
                                    </Button>
                                }
                            />
                        );
                    })
                ) : (
                    // <TreeView itemsTree={topicFileTree} />
                    <TreeViewDynamic
                        itemsTree={topicFileTree}
                        render={(item) => (
                            <FilePathCard
                                item={item}
                                deleteButton={
                                    <Button
                                        title="remove file from topic"
                                        className="text-destructive text-2xs h-fit w-fit p-1 rounded-sm leading-tight self-start _justify-center"
                                        onClick={() => handleRemoveFile(topic.id, item.pathWithRoot)}
                                    >
                                        <FileXIcon className="size-[10px]" />
                                    </Button>
                                }
                            />
                        )}
                    />
                )}
            </div>

            {/* Column footer */}
            {/* {topic.title} */}
        </div>
    );
});
KanbanColumn.displayName = 'KanbanColumn';

function PopoverFormTopic({ trigger, topic }: { trigger: ReactNode; topic: Topic }) {
    const [isPopoverOpen, setIsPopoverOpen] = useState<boolean>(false);

    return (
        <Popover
            open={isPopoverOpen}
            onOpenChange={(state) => setIsPopoverOpen(state)}
        >
            <PopoverTrigger asChild>{trigger}</PopoverTrigger>
            <PopoverContent className="min-w-80">
                <div className="grid gap-4">
                    <div className="space-y-2">
                        <h4 className="font-medium leading-none">Form Topic</h4>
                        <p className="text-sm text-muted-foreground">Set the dimensions for the layer.</p>
                    </div>
                    <div className="grid gap-2">
                        <FormTopic
                            setIsPopoverOpen={setIsPopoverOpen}
                            topic={topic}
                        />
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}

const topicSchema = z.object({
    title: z.string().min(4, { message: 'Collection name must be at least 4 characters' }),
    description: z.string().optional(),
    color: z.custom<`#${string}`>((value: unknown) => {
        const colorPatter = /^#?([a-fA-F0-9]{3}|[a-fA-F0-9]{4}|[a-fA-F0-9]{6}|[a-fA-F0-9]{8})$/;
        return typeof value === 'string' ? colorPatter.test(value) : false;
    }),
});

type TopicSchemaType = z.infer<typeof topicSchema>;

function FormTopic({ topic, setIsPopoverOpen }: { topic: Topic; setIsPopoverOpen: React.Dispatch<React.SetStateAction<boolean>> }) {
    const dispath = useAppDispatch();
    const workspaceActive = useAppSelector(getWorkspaceTopicActive);

    const form = useForm<TopicSchemaType>({
        resolver: zodResolver(topicSchema),
        defaultValues: {
            title: topic.title,
            description: topic.description,
            color: topic.color,
        },
    });

    function handleOnSubmit(data: TopicSchemaType) {
        if (!workspaceActive) {
            toast({ title: 'Error', description: 'you mush select commit topic collection first to add topic', variant: 'destructive' });
            return;
        }

        dispath(
            updateTopic({
                topicId: topic.id,
                data: { ...topic, ...data },
            })
        );

        setIsPopoverOpen(false);
    }
    const { isSubmitted, isSubmitSuccessful, isDirty } = form.formState;
    // console.table({ topicId: topic.id, isPopoverOpen, isSubmitted, isSubmitSuccessful, isDirty });

    return (
        <Form {...form}>
            <form
                className="grid gap-2"
                onSubmit={form.handleSubmit((d) => handleOnSubmit(d))}
            >
                <FormField
                    name="title"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem className="grid grid-cols-3 items-center gap-4">
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                                <Input
                                    className="col-span-2 h-8 px-2"
                                    placeholder="title topic"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    name="description"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem className="grid grid-cols-3 items-center gap-4">
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Input
                                    className="col-span-2 h-8 px-2"
                                    placeholder="description topic"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    name="color"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem className="grid grid-cols-3 items-center gap-4">
                            <FormLabel>Color</FormLabel>
                            <FormControl>
                                <Input
                                    type="color"
                                    className="col-span-2 h-8 px-2 py-0"
                                    placeholder="color topic"
                                    title="choose your color"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex gap-x-2 mt-3">
                    <Button
                        title="save changes"
                        type="button"
                        className="h-fit py-1.5 text-xs w-full"
                        onClick={() => {
                            form.handleSubmit((d) => handleOnSubmit(d))();
                        }}
                    >
                        Save
                    </Button>
                    <Button
                        title="cancel"
                        type="button"
                        variant="outline"
                        className="h-fit py-1.5 text-xs w-full"
                        onClick={() => {
                            form.reset();
                            setIsPopoverOpen(false);
                        }}
                    >
                        Cancel
                    </Button>
                </div>
            </form>
        </Form>
    );
}

function KanbanPanel({ kanbanColumnRefs }: { kanbanColumnRefs: React.MutableRefObject<Record<Topic['id'], HTMLDivElement | null>> }) {
    const workspaceActive = useAppSelector(getWorkspaceTopicActive);
    const topics = useAppSelector((state) => getTopics(state, workspaceActive));

    function handleFocus(topicId: Topic['id']) {
        const ColumnElement = kanbanColumnRefs?.current?.[topicId];
        if (ColumnElement) {
            ColumnElement.scrollIntoView({ behavior: 'smooth', inline: 'start' });
        }
    }
    return (
        <div
            aria-description="kanban panel"
            className=" bg-gray-900 sticky top-0 w-full right-0 left-0 flex py-1 px-2 justify-between items-center rounded-md"
        >
            <TextWorkspaceActive />
            <div
                aria-description="toolbar workspace"
                className="flex flex-row gap-x-1"
            >
                <ButtonCopyAllTopicTitle />
                <TopicIdSelector
                    topics={topics}
                    handleFocus={handleFocus}
                    trigger={
                        <Button
                            title="focus to topic"
                            aria-label="Search topic..."
                            role="combobox"
                            className="text-xs h-fit w-fit py-1 px-2 self-end"
                        >
                            <RocketIcon className="size-3" />
                        </Button>
                    }
                />
                <SheetTopicCollection
                    trigger={
                        <Button
                            className="text-xs h-fit w-fit py-1 px-2 self-end"
                            title="topic collection lists"
                            variant="ghost"
                        >
                            <LibraryBigIcon className="size-3" />
                        </Button>
                    }
                />
                <DialogTopicCollectionTable
                    trigger={
                        <Button
                            className="text-xs h-fit w-fit py-1 px-2 self-end"
                            title="topic collection table"
                            variant="ghost"
                        >
                            <Table2Icon className="size-3" />
                        </Button>
                    }
                />
                <SheetWorkspaceTopic
                    trigger={
                        <Button
                            className="text-xs h-fit w-fit py-1 px-2 self-end"
                            title="workspace collections"
                        >
                            <BookOpenTextIcon className="size-3" />
                        </Button>
                    }
                />
            </div>
        </div>
    );
}

function TopicIdSelector({ topics, handleFocus, trigger }: { topics: Topic[]; handleFocus(topicId: Topic['id']): void; trigger: React.ReactNode }) {
    return (
        <Popover>
            <PopoverTrigger asChild>{trigger}</PopoverTrigger>
            <PopoverContent className="w-[300px] p-0">
                <Command>
                    <CommandInput placeholder="Search topic..." />
                    <CommandList>
                        <CommandEmpty>No topic found.</CommandEmpty>
                        <CommandGroup heading="Topics">
                            {topics.map((topic) => (
                                <CommandItem
                                    className="py-1 text-xs w-full cursor-pointer"
                                    key={topic.id}
                                    onSelect={() => {
                                        handleFocus(topic.id);
                                    }}
                                >
                                    <ButtonCopy
                                        variant="ghost"
                                        title="copy title"
                                        className="text-2xs h-fit w-fit p-1 rounded-sm leading-tight [&_svg]:size-[10px] [&_.btn-copy-icon-wrapper]:size-[10px]"
                                        data={topic.title}
                                    />
                                    {topic.title}
                                    {/* <CheckCheckIcon className={cn('ml-auto', topicIdSelected === topic.id ? 'opacity-100' : 'opacity-0')} /> */}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}

function TextWorkspaceActive() {
    const workspaceActive = useAppSelector(getWorkspaceTopicActive);
    const { length: topicLength } = useAppSelector(getAllTopics);
    const commitTopicActive = useAppSelector((state) => getCommitTopicCollection(state, workspaceActive));
    // const topicInFile = useAppSelector((state) => getTopicInFile(state));

    return (
        <span
            className="text-xs relative"
            style={{}}
        >
            workspace:
            <span className="_inline ml-1 space-x-1">
                {commitTopicActive ? (
                    <>
                        <span>{`${commitTopicActive.title} |`}</span>
                        <span className="text-green-400 font-bold">{commitTopicActive.id.substring(4, 8)}</span>
                        <span className="border border-purple-400 leading-none py-[1px] px-1 rounded">{topicLength}</span>
                    </>
                ) : (
                    'null'
                )}
            </span>
        </span>
    );
}

function ButtonCopyAllTopicTitle() {
    const workspaceActive = useAppSelector(getWorkspaceTopicActive);
    const topics = useAppSelector((state) => getTopics(state, workspaceActive));

    return (
        <ButtonCopy
            className="h-5 w-6 [&_svg]:size-3 [&_.btn-copy-icon-wrapper]:size-3"
            title="copy all topic title"
            variant="ghost"
            data={topics
                .map((topic) => topic.title)
                .sort((a, b) => a.localeCompare(b))
                .join('\n')}
        />
    );
}
