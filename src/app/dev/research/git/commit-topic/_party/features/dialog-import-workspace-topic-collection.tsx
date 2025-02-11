'use client';

import React, { ReactNode, useRef, useState } from 'react';
import { number, z } from 'zod';
import { CheckIcon, OctagonAlertIcon, RefreshCcwIcon, UploadIcon, XIcon } from 'lucide-react';

import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks';
import {
    Dependency,
    getAllWorkspaceTopic,
    getWorkspaceTopicActive,
    importDependency,
    importTopic,
    Topic,
    WorkspaceTopic,
} from '../state/commit-topic-collection-slice';

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/classnames';
import { useToast } from '@/components/ui/use-toast';
import { addOrUpdateWorkspace as addOrUpdateWorkspaceIdb } from '../state/commit-topic-flow-transaction';
import { Edge, MarkerType, Node } from '@xyflow/react';
import { FileGit } from '@/utils/transform-path';
import { UntrackedAndModifiedFile } from '@/server/git-command';
import { LoadingElipseIcon } from '@/components/icons';

interface Props {
    trigger: ReactNode;
}

export function DialogImportWorkspaceTopicCollection({ trigger }: Props) {
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
            <DialogContent className="w-[90vw] max-w-[90vw] h-[90vh] max-h-[90vh] gap-2 flex flex-col overflow-hidden">
                <DialogHeader>
                    <DialogTitle className="flex gap-2">import workspace topic</DialogTitle>
                    <DialogDescription>Add a task to your collection. You can add as many tasks as you want to a collection.</DialogDescription>
                </DialogHeader>
                <div className="flex-1 overflow-hidden">
                    <ImportWorkspaceTopicCollection />
                </div>
            </DialogContent>
        </Dialog>
    );
}

function ImportWorkspaceTopicCollection() {
    const workspaceActive = useAppSelector(getWorkspaceTopicActive);
    const workspaceTopics = useAppSelector(getAllWorkspaceTopic);
    const dispatch = useAppDispatch();
    const { toast } = useToast();

    const inputFileRef = useRef<HTMLInputElement | null>(null);
    /** state data topic, trigger by input-file */
    const [dataTopics, setDataTopics] = useState<ReturnType<typeof validationFileImport> | null>(null);
    /** state topicId selected, trigger by select */
    const [topicIdSelected, setTopicIdSelected] = useState<WorkspaceTopic['id'] | null>(null);

    /** state target workspace id, trigger by radio-button */
    const [radioTargetWorkspace, setRadioTargetWorkspace] = useState<'active-workspace-id' | 'custom-id'>('active-workspace-id');
    /** state target workspace id, trigger by input-text. this state available when radioTargetWorkspace==="custom-id" */
    const [inputCustomWorkspaceId, setInputCustomWorkspaceId] = useState<string>('');

    const [isProcessingImport, setIsProcessingImport] = useState<boolean>(false);

    function handleInputFileOnChange(event: React.ChangeEvent<HTMLInputElement>) {
        const target = event.target;
        const file = target.files?.[0];
        if (!file) return;

        const fileReader = new FileReader();
        fileReader.onload = (event) => handleFileRead(event);
        fileReader.readAsText(file); // as text as string

        function handleFileRead(event: ProgressEvent<FileReader>) {
            const contentString = fileReader.result as string;
            // const contentResult = validationFileImport2(contentString);
            // const contentResult = validationFileImport(JSON.stringify(exampleData));
            const resultValidation = validationFileImport(contentString);
            setDataTopics(resultValidation);
            if (resultValidation && resultValidation.data && resultValidation.data.workspaceIds.length > 0) {
                setTopicIdSelected(resultValidation.data.workspaceIds[0]);
            }
        }
    }

    function handleInputFileReset(event: React.MouseEvent<HTMLButtonElement>) {
        setDataTopics(null);
        if (inputFileRef.current && inputFileRef.current.files) {
            inputFileRef.current.files = null;
            inputFileRef.current.value = '';
        }
    }

    async function handleImportTopic() {
        if (radioTargetWorkspace === 'active-workspace-id') {
            if (!workspaceActive) {
                toasterErrorRun({
                    title: 'Error, target workspace topic',
                    description: 'you choice target workspace is "active workspace id" but workspace id not selected. you must select active topic',
                });
                return;
            }
            update(workspaceActive);
        } else if (radioTargetWorkspace === 'custom-id') {
            if (!inputCustomWorkspaceId) {
                toasterErrorRun({
                    title: 'Error, target workspace topic',
                    description: 'you choice target workspace is "custom-id" but workspace id is empty. you must fill text custom-id',
                });
                return;
            }
            if (!workspaceTopics.some((workspace) => workspace.id === inputCustomWorkspaceId)) {
                toasterErrorRun({
                    title: 'Error, workspace not found',
                    description: `workspace id: "${inputCustomWorkspaceId} not found in collection"`,
                });
                return;
            }
            update(inputCustomWorkspaceId);
        }

        function toasterErrorRun({ title, description }: { title: string; description: string }) {
            toast({
                //@ts-ignore
                title: (
                    <div className="flex items-center gap-x-1">
                        <OctagonAlertIcon className="size-4 text-red-400" />
                        {title}
                    </div>
                ),
                description: description,
                variant: 'destructive',
            });
        }

        async function update(targetWorkspaceId: WorkspaceTopic['id']) {
            if (!dataTopics?.data) {
                toasterErrorRun({ title: 'Error', description: 'data topic empty' });
                return;
            }

            if (!topicIdSelected) {
                toasterErrorRun({ title: 'Error', description: 'select data topic' });
                return;
            }

            const dataTarget = dataTopics.data.content[topicIdSelected];

            if (!dataTarget) {
                toasterErrorRun({ title: 'Error', description: 'data target not found' });
                return;
            }
            setIsProcessingImport(true);
            dispatch(importTopic({ data: dataTarget.workspace.topics, commitTopicCollectionId: targetWorkspaceId }));
            await sleep(1500);
            dispatch(importDependency({ data: dataTarget.workspace.dependencys, commitTopicCollectionId: targetWorkspaceId }));
            await sleep(1000);
            await addOrUpdateWorkspaceIdb({ id: targetWorkspaceId, node: dataTarget.flow.node, edge: dataTarget.flow.edge });

            toast({
                //@ts-ignore
                title: (
                    <div className="flex items-center gap-x-1">
                        <CheckIcon className="size-4 text-green-500" />
                        Succes, import topic
                    </div>
                ),
                description: 'if flow not updated can press F5 to refresh the page, dont press "resyc" on flow',
            });
            setIsProcessingImport(false);
        }
    }

    return (
        <div className="h-full flex flex-col gap-y-2 ">
            <div
                className="space-y-1"
                aria-description="toolbar import workspace topic"
            >
                <div className="flex items-center gap-x-1">
                    <div className="w-[20%] flex-shrink-0 flex items-center gap-x-1">
                        <div
                            aria-description="indicator status file"
                            className={cn(
                                'size-4 rounded-full bg-purple-500 flex-shrink-0',
                                dataTopics === null && 'bg-slate-400',
                                dataTopics?.errors && 'bg-red-500',
                                dataTopics?.data && 'bg-green-500'
                            )}
                            title={
                                dataTopics === null
                                    ? 'file status not selected'
                                    : dataTopics?.errors
                                      ? 'file status error'
                                      : dataTopics?.data
                                        ? 'file status valid'
                                        : 'file status unknow'
                            }
                        />
                        <Label
                            htmlFor="input-file"
                            className="text-nowrap"
                        >
                            Select file
                        </Label>
                    </div>
                    <Input
                        className="h-7 text-xs py-1 px-1.5 file:text-xs file:bg-[#1a1a1d]"
                        id="input-file"
                        ref={inputFileRef}
                        type="file"
                        accept=".json"
                        onChange={handleInputFileOnChange}
                    />
                    <Button
                        className="size-7 flex-shrink-0 text-xs p-0 flex"
                        disabled={dataTopics == null}
                        onClick={handleInputFileReset}
                    >
                        <XIcon className="size-3 " />
                    </Button>
                    <AlertDialogConfirmImport
                        actionConfirm={() => handleImportTopic()}
                        description={
                            <span>{`This action cannot be undone. This will permanently replace data topic,topicId: ${radioTargetWorkspace === 'active-workspace-id' ? workspaceActive : inputCustomWorkspaceId}`}</span>
                        }
                        trigger={
                            <Button
                                className="size-7 flex-shrink-0 text-xs p-0 flex"
                                disabled={dataTopics == null || dataTopics.errors != null || isProcessingImport}
                            >
                                {isProcessingImport ? <LoadingElipseIcon className="size-4" /> : <UploadIcon className="size-3 " />}
                            </Button>
                        }
                    />
                </div>
                <div className="flex items-center gap-x-1 h-7">
                    <Label
                        className="w-[20%] text-nowrap"
                        htmlFor="active-workspace-id"
                    >
                        Target workspace
                    </Label>
                    <RadioGroup
                        className="flex"
                        value={radioTargetWorkspace}
                        onValueChange={(value: 'active-workspace-id' | 'custom-id') => setRadioTargetWorkspace(value)}
                    >
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem
                                value="active-workspace-id"
                                id="active-workspace-id"
                            />
                            <Label htmlFor="active-workspace-id">active workspace id</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem
                                value="custom-id"
                                id="custom-id"
                            />
                            <Label
                                htmlFor="custom-id"
                                className="text-nowrap"
                            >
                                custom id
                            </Label>
                            {radioTargetWorkspace === 'custom-id' && (
                                <Input
                                    type="search"
                                    placeholder="eg: CTC_tv_rP0kuucCFDXDpvE25R"
                                    className="h-7 text-xs py-1 px-1.5 file:text-xs"
                                    value={inputCustomWorkspaceId}
                                    onChange={(event) => setInputCustomWorkspaceId(event.target.value)}
                                />
                            )}
                        </div>
                    </RadioGroup>
                </div>
            </div>
            <div>
                {dataTopics && dataTopics.data && dataTopics.data.workspaceIds ? (
                    <div className="flex items-center gap-x-1">
                        <Label
                            className="w-[20%] text-nowrap"
                            htmlFor="workspace-id-in-file"
                        >
                            Workspace id in file
                        </Label>
                        <Select
                            value={topicIdSelected || undefined}
                            onValueChange={(value) => setTopicIdSelected(value)}
                        >
                            <SelectTrigger
                                id="workspace-id-in-file"
                                className="_w-[180px] h-7 text-xs"
                            >
                                <SelectValue placeholder="Select a fruit" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {/* <SelectLabel>Fruits</SelectLabel> */}
                                    {dataTopics.data.workspaceIds.map((workspaceId) => (
                                        <SelectItem
                                            className="text-xs"
                                            key={workspaceId}
                                            value={workspaceId}
                                        >
                                            {dataTopics.data.content[workspaceId].workspace.title}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                ) : null}
            </div>

            <div
                aria-description="table wrapper"
                className="flex-1 overflow-hidden bg-[#1a1a1d] rounded-lg"
            >
                {dataTopics === null ? (
                    <div className="h-full flex justify-center items-center">plese select file</div>
                ) : dataTopics.errors ? (
                    <TableError dataError={dataTopics.errors} />
                ) : dataTopics.data ? (
                    <TableData
                        data={dataTopics.data}
                        workspaceIdSelected={topicIdSelected}
                    />
                ) : (
                    <div className="h-full flex justify-center items-center">unknown</div>
                )}
            </div>
        </div>
    );
}

type TableDataProps = {
    data: NonNullable<ReturnType<typeof validationFileImport>['data']>;
    workspaceIdSelected: WorkspaceTopic['id'] | null;
};

function TableData({ data, workspaceIdSelected }: TableDataProps) {
    return (
        <Tabs
            defaultValue="data-workspace"
            className="flex flex-col h-full overflow-hidden"
        >
            <TabsList className="grid w-full grid-cols-2 h-8">
                <TabsTrigger
                    className="text-xs"
                    value="data-workspace"
                >
                    data-workspace
                </TabsTrigger>
                <TabsTrigger
                    className="text-xs"
                    value="data-node"
                >
                    data-node
                </TabsTrigger>
            </TabsList>
            <TabsContent
                value="data-workspace"
                className="flex-1 overflow-hidden"
            >
                <div className="h-full overflow-auto [&>div]:overflow-visible ">
                    <TableDataWorkspace
                        data={data}
                        workspaceIdSelected={workspaceIdSelected}
                    />
                </div>
            </TabsContent>
            <TabsContent
                className="flex-1 overflow-hidden"
                value="data-node"
            >
                <div className="h-full overflow-auto [&>div]:overflow-visible ">
                    <TableDataNode
                        data={data}
                        workspaceIdSelected={workspaceIdSelected}
                    />
                </div>
            </TabsContent>
        </Tabs>
    );
}

function TableDataWorkspace({ data, workspaceIdSelected }: TableDataProps) {
    return (
        <Table className="text-xs">
            <TableCaption className="text-xs text-inherit">A list of properties schema</TableCaption>
            <TableHeader className="">
                <TableRow className=" [&>th]:h-fit [&>th]:py-2 [&>th]:text-inherit">
                    <TableHead className="w-[50px]">No</TableHead>
                    <TableHead>Id</TableHead>
                    <TableHead className="text-nowrap">Is commit</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Color</TableHead>
                    <TableHead className="text-nowrap">Files count</TableHead>
                    <TableHead>Description</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody className="">
                {!workspaceIdSelected ? (
                    <TableRow>please select data to showing</TableRow>
                ) : !data.content[workspaceIdSelected] ? (
                    <TableRow>data your choice not found</TableRow>
                ) : data.content[workspaceIdSelected].workspace.topics.length > 0 ? (
                    data.content[workspaceIdSelected].workspace.topics.map((topic, topicIdx) => (
                        <TableRow
                            className="[&>td]:h-fit [&>td]:py-2"
                            key={topic.id}
                        >
                            <TableCell className="font-light">{topicIdx + 1}</TableCell>
                            <TableCell className="font-medium text-nowrap">{topic.id}</TableCell>
                            <TableCell className="text-nowrap">{String(topic.isCommited)}</TableCell>
                            <TableCell className="text-nowrap">{topic.title}</TableCell>
                            <TableCell className="text-nowrap">{topic.color}</TableCell>
                            <TableCell className="text-nowrap">{topic.files.length}</TableCell>
                            <TableCell className="text-nowrap">{topic.description}</TableCell>
                        </TableRow>
                    ))
                ) : (
                    <TableRow>data empty</TableRow>
                )}
            </TableBody>
        </Table>
    );
}

function TableDataNode({ data, workspaceIdSelected }: TableDataProps) {
    return (
        <Table className="text-xs">
            <TableCaption className="text-xs text-inherit">A list of properties schema</TableCaption>
            <TableHeader className="">
                <TableRow className=" [&>th]:h-fit [&>th]:py-2 [&>th]:text-inherit">
                    <TableHead className="w-[50px]">No</TableHead>
                    <TableHead className="w-[100px]">Id</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Data</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody className="">
                {!workspaceIdSelected ? (
                    <TableRow>please select data to showing</TableRow>
                ) : !data.content[workspaceIdSelected] ? (
                    <TableRow>data your choice not found</TableRow>
                ) : data.content[workspaceIdSelected].flow.node.length > 0 ? (
                    data.content[workspaceIdSelected].flow.node.map((node, nodeIdx) => (
                        <TableRow
                            className="[&>td]:h-fit [&>td]:py-2"
                            key={node.id}
                        >
                            <TableCell className="font-light">{nodeIdx + 1}</TableCell>
                            <TableCell className="font-medium">{node.id}</TableCell>
                            <TableCell className="text-nowrap">{node.type}</TableCell>
                            <TableCell className="flex flex-col">
                                {node.type === 'topic-node' ? (
                                    <>
                                        <span>title: {node.data.title}</span>
                                        <span>color: {node.data.color}</span>
                                        <span>isCommited: {String(node.data.isCommited)}</span>
                                        <span>description: {String(node.data.description)}</span>
                                    </>
                                ) : (
                                    <>
                                        <span>title: {node.data.title}</span>
                                        <span>isNew: {String((node.data as unknown as { isNew: string | undefined })?.isNew)}</span>
                                    </>
                                )}
                            </TableCell>
                        </TableRow>
                    ))
                ) : (
                    <TableRow>data empty</TableRow>
                )}
            </TableBody>
        </Table>
    );
}

function TableError({ dataError }: { dataError: NonNullable<ReturnType<typeof validationFileImport>['errors']> }) {
    return (
        <div className="h-full overflow-auto [&>div]:overflow-visible ">
            <Table className="text-xs">
                <TableCaption className="text-xs text-inherit">A list of properties schema</TableCaption>
                <TableHeader className="">
                    <TableRow className=" [&>th]:h-fit [&>th]:py-2 [&>th]:text-inherit">
                        <TableHead className="w-[50px]">No</TableHead>
                        <TableHead className="w-[100px]">Code</TableHead>
                        <TableHead>Message</TableHead>
                        <TableHead>Expected</TableHead>
                        <TableHead>Received</TableHead>
                        <TableHead>Path</TableHead>
                        <TableHead>Detail</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody className="">
                    {dataError.map((error, idxError) => (
                        <TableRow
                            className="[&>td]:h-fit [&>td]:py-2"
                            key={error.path}
                        >
                            <TableCell className="font-light">{idxError + 1}</TableCell>
                            <TableCell className="font-medium">{error.code}</TableCell>
                            <TableCell>{error.message}</TableCell>
                            <TableCell>{error?.expected}</TableCell>
                            <TableCell>{error?.received}</TableCell>
                            <TableCell className="_text-right">{String(error.path)}</TableCell>
                            <TableCell className="">
                                <DrawerErrorDetail
                                    dataErrorDetail={error.details}
                                    dataInput={error.dataInput}
                                    trigger={
                                        <Button
                                            variant="default"
                                            size="icon"
                                            disabled={error?.details?.length ? false : true}
                                            className="text-3xs size-6"
                                        >
                                            show
                                        </Button>
                                    }
                                />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}

function DrawerErrorDetail({
    dataErrorDetail,
    dataInput,
    trigger,
}: {
    dataInput: NonNullable<ReturnType<typeof validationFileImport>['errors']>[number]['dataInput'];
    dataErrorDetail: NonNullable<ReturnType<typeof validationFileImport>['errors']>[number]['details'];
    trigger: ReactNode;
}) {
    return (
        <Drawer>
            <DrawerTrigger asChild>{trigger}</DrawerTrigger>
            <DrawerContent className="mt-0 h-[90vh]">
                <DrawerHeader className="flex">
                    <div className="flex-1">
                        <DrawerTitle>List detail erros</DrawerTitle>
                        <DrawerDescription>This action cannot be undone.</DrawerDescription>
                    </div>
                    <DrawerClose asChild>
                        <Button
                            variant="outline"
                            className="h-fit w-fit p-1"
                        >
                            <XIcon className="size-4" />
                        </Button>
                    </DrawerClose>
                </DrawerHeader>
                <div className="px-4">
                    <DialogErrorDetailData
                        text={typeof dataInput === 'object' ? JSON.stringify(dataInput, null, 2) : String(dataInput)}
                        trigger={
                            <Button
                                variant="default"
                                size="icon"
                                disabled={dataInput ? false : true}
                                className="text-2xs h-6 w-full"
                            >
                                show
                            </Button>
                        }
                    />
                </div>
                <div className="flex-1 overflow-hidden px-4 py-2">
                    <Table className="text-xs">
                        <TableCaption className="text-xs text-inherit">A list of properties schema</TableCaption>
                        <TableHeader className="">
                            <TableRow className=" [&>th]:h-fit [&>th]:py-2 [&>th]:text-inherit">
                                <TableHead className="w-[50px]">No</TableHead>
                                <TableHead className="w-[100px]">Code</TableHead>
                                <TableHead>Message</TableHead>
                                <TableHead>Expected</TableHead>
                                <TableHead>Received</TableHead>
                                <TableHead>Path</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="">
                            {dataErrorDetail?.map((error, idxError) => (
                                <TableRow
                                    className="[&>td]:h-fit [&>td]:py-2"
                                    key={error.path}
                                >
                                    <TableCell className="font-light">{idxError + 1}</TableCell>
                                    <TableCell className="font-medium">{error.code}</TableCell>
                                    <TableCell>{error.message}</TableCell>
                                    <TableCell>{error?.expected}</TableCell>
                                    <TableCell>{error?.received}</TableCell>
                                    <TableCell className="_text-right">{String(error.path)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </DrawerContent>
        </Drawer>
    );
}

function DialogErrorDetailData({ trigger, text }: { trigger: ReactNode; text: string }) {
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
            <DialogContent className="w-[90vw] max-w-[90vw] h-[90vh] max-h-[90vh] gap-2 flex flex-col overflow-hidden">
                <DialogHeader>
                    <DialogTitle className="flex gap-2">import workspace topic</DialogTitle>
                    <DialogDescription>Add a task to your collection. You can add as many tasks as you want to a collection.</DialogDescription>
                </DialogHeader>
                <div className="flex-1 overflow-hidden bg-[#1a1a1d] rounded-lg">
                    <div className="h-full overflow-auto py-1 px-2">
                        {text.split('\n').map((word, idxWord) => (
                            <code
                                key={`${word}-${idxWord}`}
                                className="block text-xs"
                            >
                                {word}
                            </code>
                        ))}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

function AlertDialogConfirmImport({
    trigger,
    actionConfirm,
    description,
}: {
    trigger: ReactNode;
    actionConfirm?: () => void;
    description?: ReactNode;
}) {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    {description && <AlertDialogDescription>{description}</AlertDialogDescription>}
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel
                        variant="outline"
                        size="sm"
                    >
                        Cancel
                    </AlertDialogCancel>
                    {actionConfirm instanceof Function ? (
                        <AlertDialogAction
                            size="sm"
                            onClick={() => actionConfirm()}
                        >
                            Continue
                        </AlertDialogAction>
                    ) : null}
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

//* Helpers
const sleep = (ms: number = 1000) => new Promise((resolve) => setTimeout(resolve, ms));

function getValueObjectFromPath(obj: Record<string, unknown> | Array<unknown>, path: string, delimiter = '.'): unknown {
    const pathArray = path.split(delimiter);
    let current: unknown = obj;

    for (const segment of pathArray) {
        const index = parseInt(segment, 10);
        if (isNaN(index)) {
            //if it's not a number, assume it's a key
            if (typeof current !== 'object' || current === null || !(segment in current)) {
                return undefined; // Handle cases where path segment is not found
            }
            // Type assertion here: we know it's an object, so access it as one.
            current = (current as Record<string, unknown>)[segment];
        } else {
            //if it's a number, assume it's an array index
            if (!Array.isArray(current) || index < 0 || index >= current.length) {
                return undefined; // Handle cases where array index is out of bounds or negative
            }
            current = (current as unknown[])[index];
        }
    }

    return current;
}

//! Schema
const dependencyNodeSchema: z.ZodSchema<Node<Omit<Dependency, 'id'>, 'dependency-node'>> = z.object({
    id: z.string(),
    data: z.object({
        title: z.string(),
        isNew: z.boolean(),
    }),
    type: z.literal('dependency-node'),
    position: z.object({
        x: z.number(),
        y: z.number(),
    }),
    measured: z
        .object({
            width: z.number(),
            height: z.number(),
        })
        .optional(),
    selected: z.boolean().optional(),
    dragging: z.boolean().optional(),
});

const topicNodeSchema: z.ZodSchema<Node<Omit<Topic, 'files' | 'id'>, 'topic-node'>> = z.object({
    id: z.string(),
    data: z.object({
        title: z.string(),
        description: z.string().optional(),
        color: z.custom<`#${string}`>(
            (val) => {
                return typeof val === 'string' ? /^#[a-fA-F0-9]{6}$/.test(val) : false;
            },
            { message: 'Invalid color format. Use #RRGGBB (e.g., #0000ff)', params: { code: 'haha' } }
        ),
        isCommited: z.boolean(),
    }),
    type: z.literal('topic-node'),
    position: z.object({
        x: z.number(),
        y: z.number(),
    }),
    measured: z
        .object({
            width: z.number(),
            height: z.number(),
        })
        .optional(),
    selected: z.boolean().optional(),
    dragging: z.boolean().optional(),
});

const edgeSchema: z.ZodSchema<Edge> = z.object({
    source: z.string(),
    target: z.string(),
    animated: z.boolean().optional(),
    id: z.string(),
    markerEnd: z
        .object({ type: z.nativeEnum(MarkerType) })
        .or(z.string())
        .optional(),
    style: z
        .object({
            strokeWidth: z.number(),
            stroke: z.string(),
        })
        .optional(),
    selected: z.boolean().optional(),
});

const fileGitSchema: z.ZodSchema<FileGit<UntrackedAndModifiedFile>> = z.object({
    name: z.string(),
    pathWithRoot: z.string(),
    type: z.union([z.literal('folder'), z.literal('file')]),
    children: z.array(z.lazy(() => fileGitSchema)), // <-- Recursive reference
    counterFile: z.number().optional(),
    key: z.string(),

    path: z.string(),
    status: z.union([z.literal('untracked'), z.literal('modified')]),
    // status: z.union([z.literal("untracked"),z.literal("modified")])
});

const dependencySchema: z.ZodSchema<Dependency> = z.object({
    id: z.string(),
    title: z.string(),
    isNew: z.boolean(),
});

const topicSchema: z.ZodSchema<Topic> = z.object({
    id: z.string(),
    title: z.string(),
    description: z.string().optional(),
    isCommited: z.boolean(),
    // color: z.string().regex(/^#[a-fA-F0-9]{6}$/, { message: 'Invalid color format. Use #RRGGBB (e.g., #0000ff)' }),
    color: z.custom<`#${string}`>(
        (val) => {
            return typeof val === 'string' ? /^#[a-fA-F0-9]{6}$/.test(val) : false;
        },
        { message: 'Invalid color format. Use #RRGGBB (e.g., #0000ff)', params: { code: 'haha' } }
    ),

    files: z.array(fileGitSchema),
});

const workspaceTopicSchema: z.ZodSchema<WorkspaceTopic> = z.object({
    id: z.string(),
    title: z.string(),
    description: z.string().optional(),
    createAt: z.string(),
    topics: z.array(topicSchema),
    dependencys: z.array(dependencySchema),
});

/* const fileImportSchema = z.object({
    node: z.array(z.union([dependencyNodeSchema, topicNodeSchema])),
    edge: z.array(edge),
}); */
const fileImportSchema = z.record(
    z.string(),
    z.object({
        flow: z.object({
            node: z.array(z.union([dependencyNodeSchema, topicNodeSchema])),
            edge: z.array(edgeSchema),
        }),
        workspace: workspaceTopicSchema,
    })
);

type FileImport = z.infer<typeof fileImportSchema>;

//? Validation
function validationFileImport(content: string) {
    try {
        const contentObj = JSON.parse(content);
        // let dataRaw = contentObj[Object.keys(contentObj)?.[0]];
        let dataRaw = contentObj;
        // data.node = data.node.slice(0, 5);
        // console.log(data.node[71]);
        console.log(contentObj);

        // const fileImportSchemaValid = fileImportSchema.passthrough().safeParse(data);
        const fileImportSchemaValid = fileImportSchema.safeParse(contentObj);

        type PupulateIssuesInvalidUnion = {
            code: string;
            path: string;
            message: string;
            expected: string;
            received: string;
            dataInput: unknown;
            details: {
                code: string;
                path: string;
                message: string;
                expected: string;
                received: string;
            }[];
        };

        if (!fileImportSchemaValid.success) {
            const errs = fileImportSchemaValid.error;
            const issues = errs.issues;
            const aaaaa = issues[0].code;

            const pupulateIssuesInvalidUnion: PupulateIssuesInvalidUnion[] = issues
                .filter((currError, idx) => currError.code === 'invalid_union')
                .map((currError) => {
                    /*//** using let and forEach 
                    let details = [] as PupulateIssuesInvalidUnion['details'];
                    currError.unionErrors.forEach((uep) => {
                        uep.issues.forEach((uepIssue) => {
                            details.push({
                                childCode: uepIssue.code,
                                childPath: uepIssue.path.join('.'),
                                // @ts-ignore
                                expected: uepIssue?.expected || 'nothing_expected',
                                // @ts-ignore
                                received: uepIssue?.received || 'nothing_received',
                            });
                        });
                    }); */

                    const details = currError.unionErrors.reduce(
                        (acc, unErr) => [
                            ...acc,
                            ...unErr.issues.map((unIssue) => ({
                                code: unIssue.code,
                                message: unIssue.message,
                                path: unIssue.path.join('.'),
                                // @ts-ignore
                                expected: unIssue.expected ?? 'nothing_expected',
                                // @ts-ignore
                                received: unIssue.received ?? 'nothing_received',
                            })),
                        ],
                        [] as PupulateIssuesInvalidUnion['details']
                    );

                    return {
                        code: currError.code,
                        message: currError.message,
                        path: currError.path.join('.'),
                        // @ts-ignore
                        expected: currError.expected ?? 'nothing_expected',
                        // @ts-ignore
                        received: currError.received ?? 'nothing_received',
                        details,
                        dataInput: getValueObjectFromPath(dataRaw, currError.path.join('.')),
                    } satisfies PupulateIssuesInvalidUnion;
                });
            // console.error('testZodVariantThemeFlow, faild', issues);
            const pupulateIssuesGlobal = issues.map((currError) => {
                return {
                    code: currError.code,
                    message: currError.message,
                    path: currError.path.join('.'),
                    details: null,
                    dataInput: getValueObjectFromPath(dataRaw, currError.path.join('.')),
                    // @ts-ignore
                    expected: (currError.expected as string | undefined) ?? 'nothing_expected',
                    // @ts-ignore
                    received: (currError.received as string | undefined) ?? 'nothing_received',
                };
            });
            console.error(
                'testZodVariantThemeFlow, failed',
                pupulateIssuesInvalidUnion.length > 0 ? pupulateIssuesInvalidUnion : pupulateIssuesGlobal
            );
            return { errors: pupulateIssuesInvalidUnion.length > 0 ? pupulateIssuesInvalidUnion : pupulateIssuesGlobal, data: null };
        } else {
            console.log('testZodVariantThemeFlow, success', fileImportSchemaValid.data);
            const data = fileImportSchemaValid.data;

            return { errors: null, data: { content: data, workspaceIds: Object.keys(data) } };
        }
    } catch (error) {
        console.error(error);
        return {
            errors: [
                {
                    path: 'validationFileImport',
                    code: (error as unknown as Error)?.name || 'unknow_error',
                    message: (error as unknown as Error)?.message
                        ? `function validationFileImport ${(error as unknown as Error)?.message}`
                        : 'nothing message error',
                    expected: null,
                    received: null,
                    details: null,
                    dataInput: null,
                },
            ],
            data: null,
        };
    }
}

function validationFileImport2(content: string) {
    try {
        const contentObj = JSON.parse(content);
        if (Array.isArray(contentObj)) throw new Error('content must be object, but recieve array');
        if (typeof contentObj !== 'object') throw new Error(`content must be object, but recieve ${typeof content}`);
        const data = contentObj[Object.keys(contentObj)?.[0]]; // get frst key || fist topic
        if (!('node' in data)) throw new Error('object must be have key "node"');

        console.log(data);
    } catch (error) {
        console.error(error);
    }
}
