'use client';

import { type ReactNode } from 'react';
import { CableIcon, EllipsisIcon, PencilIcon, TrashIcon } from 'lucide-react';

import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';

import {
    getAllWorkspaceTopic,
    setWorkspaceActive,
    deleteWorkspace,
    type WorkspaceTopic,
    getWorkspaceTopicActive,
} from '../state/commit-topic-collection-slice';

import { deleteWorkspace as deleteWorkspaceidb } from '../state/commit-topic-flow-transaction';

import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { DialogCreateWorkspaceTopic } from './dialog-create-workspace-topic';
import { DialogImportWorkspaceTopicCollection } from './dialog-import-workspace-topic-collection';

export function SheetWorkspaceTopic({ trigger }: { trigger: ReactNode }) {
    const workspaceActive = useAppSelector(getWorkspaceTopicActive);
    return (
        <Sheet>
            <SheetTrigger asChild>{trigger}</SheetTrigger>

            <SheetContent className="_z-[1000] flex flex-col w-1/3 sm:max-w-[50%]">
                <SheetHeader>
                    <SheetTitle>Workspace Topic</SheetTitle>
                    <SheetDescription>You can search for tutorial data then click to navigate to the page.</SheetDescription>
                </SheetHeader>

                <DialogImportWorkspaceTopicCollection
                    trigger={
                        <Button
                            className="text-xs h-fit py-1"
                            title="import workspace topic"
                            disabled={workspaceActive === null}
                        >
                            Import
                        </Button>
                    }
                />
                <DialogCreateWorkspaceTopic
                    trigger={
                        <Button
                            className="text-xs h-fit py-1"
                            title="create new workspace topic"
                        >
                            New
                        </Button>
                    }
                />

                <div className="_flex-1 h-[76%] overflow-y-auto pl-1 pr-3">
                    <ListWorkspaceTopic />
                </div>
            </SheetContent>
        </Sheet>
    );
}

function ListWorkspaceTopic() {
    const dispatch = useAppDispatch();
    const CommitTopicCollections = useAppSelector(getAllWorkspaceTopic);
    const workspaceActive = useAppSelector(getWorkspaceTopicActive);

    function handleSetCommitTopicCollectionActive(CommitTopicCollectionId: string) {
        dispatch(setWorkspaceActive(CommitTopicCollectionId));
    }

    function handleDeleteWorkspace(workspaceId: WorkspaceTopic['id']) {
        dispatch(deleteWorkspace({ workspaceId: workspaceId }));
        deleteWorkspaceidb(workspaceId);
        if (workspaceActive === workspaceId) {
            dispatch(setWorkspaceActive(null));
        }
    }

    return (
        <ul className="space-y-2">
            {CommitTopicCollections.length === 0 ? (
                <div>empty</div>
            ) : (
                CommitTopicCollections.map((workspace) => (
                    <li
                        className="border-border border py-1 px-2 rounded-md flex gap-2"
                        key={workspace.id}
                        title={workspace.title}
                    >
                        <div className="flex flex-col flex-1 overflow-x-hidden">
                            <span className="leading-tight text-nowrap">{workspace.title}</span>
                            <span className="text-2xs text-muted-foreground">{workspace.id}</span>
                            <span className="text-2xs text-muted-foreground font-bold">{workspace.createAt}</span>
                        </div>
                        <div className="flex flex-col justify-between">
                            <Button
                                className="text-xs w-fit h-fit p-1"
                                title="set active"
                                onClick={() => handleSetCommitTopicCollectionActive(workspace.id)}
                            >
                                <CableIcon className="size-3" />
                            </Button>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        className="text-xs w-fit h-fit p-1"
                                        variant="outline"
                                        title="more action"
                                        onClick={() => handleSetCommitTopicCollectionActive(workspace.id)}
                                    >
                                        <EllipsisIcon className="size-3" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DialogCreateWorkspaceTopic
                                        workspaceId={workspace.id}
                                        trigger={
                                            <Button
                                                className="font-normal text-sm h-fit w-full px-2 py-1.5 justify-start flex gap-x-1"
                                                title="edit workspace topic"
                                                variant="ghost"
                                            >
                                                <PencilIcon className="size-[10px]" />
                                                Edit
                                            </Button>
                                        }
                                    />
                                    <DropdownMenuItem
                                        className="cursor-pointer flex gap-x-1"
                                        onClick={() => handleDeleteWorkspace(workspace.id)}
                                    >
                                        <TrashIcon className="size-[10px]" />
                                        Delete
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </li>
                ))
            )}
        </ul>
    );
}
