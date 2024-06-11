'use client';

import { useMemo, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { type dev_task, type dev_collection } from '@prisma/client';

import { deleteCollectionMutation } from '../actions/collection';
import { getErrorMessage } from '@/utils/get-error-message';
import { cn } from '@/lib/classnames';
import { type CollectionColorType, CollectionColors } from '../constants/collection-color';

import { CaretDownIcon, CaretUpIcon, PlusIcon, TrashIcon } from '@radix-ui/react-icons';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTrigger,
    AlertDialogCancel,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from '@/components/ui/use-toast';

import { Plus } from '../components/icons/plus';
import { CreateTaskDialog } from './create-task-dialog';
import { TaskCard } from './task-card';

interface Props {
    collection: dev_collection & {
        tasks: dev_task[];
    };
}

export function CollectionCard({ collection }: Props) {
    const [isTransactionLoading, startTransaction] = useTransition();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);

    async function handleDeleteCollection() {
        try {
            const collect = await deleteCollectionMutation(collection.id);
            toast({
                title: 'Succes',
                description: 'Collection delete succesfully',
            });

            router.refresh();
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Cannot delete collection. Something went wrong, Please try again later',
                variant: 'destructive',
            });
            console.error('error add collection: ', getErrorMessage(error));
        }
    }

    const taskDone = useMemo(() => {
        return collection.tasks.filter((task) => task.done).length;
    }, [collection.tasks]);

    function progress() {
        const totalTasks = collection.tasks.length;
        const progressDone = totalTasks === 0 ? 0 : (taskDone / totalTasks) * 100;
        return progressDone;
    }

    // console.log('CollectionCard: ', 'Render');
    return (
        <>
            <CreateTaskDialog open={showCreateModal} setOpen={setShowCreateModal} collection={collection} />
            <Collapsible aria-description="collapsible" open={isOpen} onOpenChange={(s) => setIsOpen(s)}>
                <CollapsibleTrigger asChild>
                    <Button
                        variant="ghost"
                        className={cn(
                            'flex w-full justify-between p-6',
                            isOpen && 'rounded-b-none',
                            CollectionColors[collection.color as CollectionColorType]
                        )}
                    >
                        {collection.name}
                        {isOpen === true ? <CaretUpIcon className="w-6 h-6" /> : <CaretDownIcon className="w-6 h-6" />}
                    </Button>
                </CollapsibleTrigger>
                <CollapsibleContent aria-description="collapsible content" className="flex rounded-b-lg flex-col dark:bg-neutral-900 shadow-lg">
                    {collection.tasks.length < 1 ? (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="flex items-center justify-center gap-1 p-8 py-12 rounded-none"
                            onClick={() => setShowCreateModal(true)}
                        >
                            <p>There are no tasks yet: </p>
                            <span className={cn('text-sm bg-clip-text text-transparent', CollectionColors[collection.color as CollectionColorType])}>
                                Create one
                            </span>
                        </Button>
                    ) : (
                        <>
                            <Progress className="rounded-none" value={progress()} />
                            <div className="p-4 gap-3 flex flex-col">
                                {collection.tasks.map((task) => (
                                    <TaskCard key={task.id} task={task} />
                                ))}
                            </div>
                        </>
                    )}

                    <Separator />
                    <footer className="h-[40px] px-4 p-[2px] text-xs text-neutral-500 flex justify-between items-center">
                        <p>Created at {collection.createAt.toLocaleDateString('id-ID')}</p>
                        {isTransactionLoading ? (
                            <div>Deleting...</div>
                        ) : (
                            <div>
                                <Button variant="ghost" size="icon" className="size-8" onClick={() => setShowCreateModal(true)}>
                                    <Plus className="size-4" />
                                </Button>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="ghost" size="icon" className="size-8">
                                            <TrashIcon className="size-4" />
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This action cannot be undone, This will permanently delete your collection and all task inside it
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel variant="outline" size="sm">
                                                Cancel
                                            </AlertDialogCancel>
                                            <AlertDialogAction variant="default" size="sm" onClick={() => startTransaction(handleDeleteCollection)}>
                                                Procced
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        )}
                    </footer>
                </CollapsibleContent>
            </Collapsible>
        </>
    );
}
