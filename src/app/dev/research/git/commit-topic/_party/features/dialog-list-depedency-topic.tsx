'use client';

import { useState, type ReactNode } from 'react';

import { cn } from '@/lib/classnames';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';

import {
    addDependency,
    addWorkspace,
    getAllDependencys,
    getWorkspaceTopic,
    updateWorkspace,
    type WorkspaceTopic,
} from '../state/commit-topic-collection-slice';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ButtonCopy } from '@/components/ui/custom/button-copy';
import { RadioGroup, RadioGroupItem } from '@/components/ui/custom/radio-group';

type DialogCreateWorkspaceTopicActualProps = {
    trigger: ReactNode;
};

export function DialogListDepedencyTopic({ trigger }: DialogCreateWorkspaceTopicActualProps) {
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
            <DialogContent className="flex flex-col _sm:max-w-[425px] h-[80vh] max-h-[80vh] max-w-[90vw] overflow-hidden gap-1">
                <DialogHeader>
                    <DialogTitle className="flex gap-2">List depedency</DialogTitle>
                    <DialogDescription>List dependencys in flow.</DialogDescription>
                </DialogHeader>
                <DependencyList />
            </DialogContent>
        </Dialog>
    );
}

function DependencyList() {
    const dispatch = useAppDispatch();
    const dependencysTopic = useAppSelector(getAllDependencys);
    /**
     * @example
     * // sorted for newer JavaScript environments
     * const dependencysTopicOrdered = dependencysTopic.toSorted((a, b) => a.title.localeCompare(b.title));
     */
    const dependencysTopicOrdered = dependencysTopic.slice().sort((a, b) => a.title.localeCompare(b.title));

    const [dependencyStatus, setDependencyStatus] = useState<'all' | 'new' | 'old'>('all');
    const [dataDependencys, setDataDependencys] = useState(dependencysTopicOrdered);
    function handleRadioStatusChange(status: 'all' | 'new' | 'old') {
        setDependencyStatus(status);
        switch (status) {
            case 'all':
                setDataDependencys(dependencysTopicOrdered);
                break;
            case 'new':
                setDataDependencys(dependencysTopicOrdered.filter((dependency) => dependency.isNew === true));
                break;
            case 'old':
                setDataDependencys(dependencysTopicOrdered.filter((dependency) => dependency.isNew === false));
                break;
            default:
                break;
        }
    }
    return (
        <div className="gap-4 py-4 flex-1 overflow-hidden px-2 space-y-4 flex flex-col">
            <div className="border border-border rounded-md p-2 space-y-2">
                <h4 className="text-sm font-bold">Filter</h4>
                <div className="flex gap-x-2 items-end justify-between">
                    <div className="flex gap-x-2 items-center">
                        <span className="text-xs">Status:</span>
                        <RadioGroup
                            value={dependencyStatus}
                            // defaultValue="all"
                            onValueChange={(value: 'all' | 'new' | 'old') => handleRadioStatusChange(value)}
                            className="w-fit border border-border rounded-md [&>button:first-child]:!-mr-[3px] [&>button:last-child]:!-ml-[3px] _[&>button[aria-checked='true']:after]:!bg-purple-400"
                        >
                            <RadioGroupItem
                                value="all"
                                id="all"
                                title="all"
                                className="!min-w-fit !h-fit !w-[40px] !py-[4px] !px-[6px] !border !border-border text-white"
                            >
                                <span>all</span>
                            </RadioGroupItem>
                            <RadioGroupItem
                                value="new"
                                id="new"
                                title="new"
                                className="!min-w-fit !h-fit !w-[40px] !py-[4px] !px-[6px]"
                            >
                                <span>new</span>
                            </RadioGroupItem>
                            <RadioGroupItem
                                value="old"
                                id="old"
                                title="old"
                                className="!min-w-fit !h-fit !w-[40px] !py-[4px] !px-[6px]"
                            >
                                <span>old</span>
                            </RadioGroupItem>
                        </RadioGroup>
                    </div>
                    <ButtonCopy
                        size="sm"
                        className="size-6 [&_.btn-copy-icon-wrapper]:size-3 [&_svg]:size-3"
                        data={dataDependencys.map((dependency) => dependency.title).join('\n')}
                        title="copy title in view table"
                    />
                </div>
            </div>
            <div className="h-full overflow-auto p-2 rounded-md">
                <Table>
                    <TableCaption>A list of depedency in flow.</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[60px]">No</TableHead>
                            <TableHead className="w-[100px]">Title</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="w-[80px] text-center">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {dataDependencys.map((dependency, idx) => (
                            <TableRow
                                className={cn(dependency.isNew && 'text-green-400')}
                                key={dependency.id}
                            >
                                <TableCell className="font-light py-1 px-[6px]">{idx + 1}</TableCell>
                                <TableCell className="font-light py-1 px-[6px] text-nowrap">{dependency.title}</TableCell>
                                <TableCell className="font-light py-1 px-[6px]">{dependency.isNew ? 'new' : 'old'}</TableCell>
                                <TableCell className="text-center font-light py-1 px-[6px]">
                                    <ButtonCopy
                                        title="copy title"
                                        className="size-[18px] [&_.btn-copy-icon-wrapper]:size-[10px] [&_svg]:size-[10px] rounded"
                                        data={dependency.title}
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
