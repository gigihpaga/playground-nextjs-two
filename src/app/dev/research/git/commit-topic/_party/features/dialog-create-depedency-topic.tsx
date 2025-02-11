'use client';

import { useState, type ReactNode } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { cn } from '@/lib/classnames';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';

import { addDependency, addWorkspace, getWorkspaceTopic, updateWorkspace, type WorkspaceTopic } from '../state/commit-topic-collection-slice';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

export const createDependencySchema = z.object({
    title: z.string().min(4, { message: 'Dependency name must be at least 4 characters' }),
});

export type CreateDepedencySchemaType = z.infer<typeof createDependencySchema>;

type DialogCreateWorkspaceTopicActualProps = {
    trigger: ReactNode;
};

export function DialogCreateDepedencyTopic({ trigger }: DialogCreateWorkspaceTopicActualProps) {
    const [open, setOpen] = useState<boolean>(false);
    const dispatch = useAppDispatch();

    const form = useForm<CreateDepedencySchemaType>({
        resolver: zodResolver(createDependencySchema),
        defaultValues: {
            title: '',
        },
    });

    function handleOpenChange(state: boolean) {
        setOpen(state);
        form.reset();
    }

    function handleOnSubmit(data: CreateDepedencySchemaType) {
        dispatch(addDependency(data));
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
                    <DialogTitle className="flex gap-2">Add depedency</DialogTitle>
                    <DialogDescription>Add a depedency to your topic. You can add as many depedencys as you want to a topic.</DialogDescription>
                </DialogHeader>
                <div className="gap-4 py-4">
                    <Form {...form}>
                        <form
                            className="space-y-4 flex flex-col"
                            onSubmit={form.handleSubmit((d) => handleOnSubmit(d))}
                        >
                            <FormField
                                name="title"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Title</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="title depedency"
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
