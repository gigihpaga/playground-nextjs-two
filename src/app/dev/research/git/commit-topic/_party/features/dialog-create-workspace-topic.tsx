'use client';

import { useState, type ReactNode } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { cn } from '@/lib/classnames';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';

import { addWorkspace, getWorkspaceTopic, getAllWorkspaceTopic, updateWorkspace, type WorkspaceTopic } from '../state/commit-topic-collection-slice';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast, useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { OctagonAlertIcon } from 'lucide-react';

export const createWorkspaceSchema = z.object({
    id: z.string().optional(),
    title: z.string().min(4, { message: 'Worspace name must be at least 4 characters' }),
    description: z.string().optional(),
});

export type CreateWorkspaceSchemaType = z.infer<typeof createWorkspaceSchema>;

function _DialogCreateWorkspaceTopic({ workspaceId, trigger }: { workspaceId?: WorkspaceTopic['id']; trigger: ReactNode }) {
    const [open, setOpen] = useState<boolean>(false);
    return (
        <DialogCreateWorkspaceTopic
            // open={open}
            // setOpen={setOpen}
            trigger={trigger}
            workspaceId={workspaceId}
        />
    );
}

type DialogCreateWorkspaceTopicActualProps = {
    trigger: ReactNode;
    workspaceId?: WorkspaceTopic['id'];
    /*  open: boolean;
    setOpen: (open: boolean) => void; */
};

export function DialogCreateWorkspaceTopic({ workspaceId, trigger /* open, setOpen */ }: DialogCreateWorkspaceTopicActualProps) {
    const { toast } = useToast();
    const [open, setOpen] = useState<boolean>(false);
    const [radioIdMode, setRadioIdMode] = useState<'auto-id' | 'custom-id'>('auto-id');
    const dispatch = useAppDispatch();
    const workspace = useAppSelector((state) => getWorkspaceTopic(state, workspaceId));
    const workspaceAll = useAppSelector(getAllWorkspaceTopic);
    const isEditMode = !!(workspaceId && workspace);

    const form = useForm<CreateWorkspaceSchemaType>({
        resolver: zodResolver(createWorkspaceSchema),
        defaultValues: {
            // id: isEditMode || radioIdMode === 'auto-id' ? undefined : '',
            id: '',
            title: isEditMode ? workspace.title : '',
            description: isEditMode ? workspace.description : undefined,
        },
    });

    function handleOpenChange(state: boolean) {
        setOpen(state);
        form.reset();
    }

    function handleOnSubmit(data: CreateWorkspaceSchemaType) {
        const { id, title, description } = data;
        if (isEditMode) {
            dispatch(
                updateWorkspace({
                    workspaceId: workspaceId,
                    data: { ...workspace, title: title, description: description },
                })
            );
        } else {
            if (radioIdMode === 'custom-id') {
                const indexWorkspaceById = workspaceAll.findIndex((workspace) => workspace.id === id);
                if (indexWorkspaceById === -1) {
                    dispatch(addWorkspace({ id: id, title: title, description: description }));
                } else {
                    toast({
                        //@ts-ignore
                        title: (
                            <div className="flex items-center gap-x-1">
                                <OctagonAlertIcon className="size-4 text-red-400" />
                                Error, Id is exist
                            </div>
                        ),
                        description: `cannot use custom id: ${id}, because this id is exist`,
                    });
                    return;
                }
            } else {
                dispatch(addWorkspace({ id: undefined, title: title, description: description }));
            }
        }
        handleOpenChange(false);
    }

    return (
        <Dialog
            open={open}
            onOpenChange={handleOpenChange}
        >
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex gap-2">{isEditMode ? 'Edit' : 'Add'} workspace topic</DialogTitle>
                    <DialogDescription>Add a task to your collection. You can add as many tasks as you want to a collection.</DialogDescription>
                </DialogHeader>
                <div className="gap-4 py-4">
                    <Form {...form}>
                        <form
                            className="space-y-4 flex flex-col"
                            onSubmit={form.handleSubmit((d) => handleOnSubmit(d))}
                        >
                            {isEditMode ? null : (
                                <FormField
                                    name="id"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Id</FormLabel>
                                            <RadioGroup
                                                className="flex flex-col"
                                                value={radioIdMode}
                                                onValueChange={(value: 'auto-id' | 'custom-id') => setRadioIdMode(value)}
                                            >
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem
                                                        value="auto-id"
                                                        id="auto-id"
                                                    />
                                                    <Label htmlFor="auto-id">auto generate</Label>
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
                                                    {radioIdMode === 'custom-id' && (
                                                        <div className="w-full">
                                                            <FormControl>
                                                                <Input
                                                                    className="w-full"
                                                                    placeholder="eg: CTC_tv_rP0kuucCFDXDpvE25R"
                                                                    {...field}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </div>
                                                    )}
                                                </div>
                                            </RadioGroup>
                                        </FormItem>
                                    )}
                                />
                            )}
                            <FormField
                                name="title"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Title</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="title collection"
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
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                rows={5}
                                                placeholder="description collection"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </form>
                    </Form>
                </div>
                <DialogFooter>
                    <Button
                        size="sm"
                        className={cn('w-full')}
                        onClick={form.handleSubmit((d) => handleOnSubmit(d))}
                    >
                        Confirm
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
