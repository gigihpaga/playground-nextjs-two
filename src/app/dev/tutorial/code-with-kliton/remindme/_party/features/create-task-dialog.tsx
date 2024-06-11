import { useRouter } from 'next/navigation';
import { type dev_task, type dev_collection } from '@prisma/client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';

import { addTaskMutation } from '../actions/task';
import { createTaskSchema, type createTaskSchemaType } from '../schema/create-task';
import { CollectionColors, type CollectionColorType } from '../constants/collection-color';
import { cn } from '@/lib/classnames';
import { getErrorMessage } from '@/utils/get-error-message';

import { CalendarIcon, ReloadIcon } from '@radix-ui/react-icons';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

interface Props {
    open: boolean;
    setOpen: (open: boolean) => void;
    collection: dev_collection & {
        tasks: dev_task[];
    };
}
export function CreateTaskDialog({ open, setOpen, collection }: Props) {
    const router = useRouter();
    const form = useForm<createTaskSchemaType>({
        resolver: zodResolver(createTaskSchema),
        defaultValues: {
            collectionId: collection.id,
        },
    });

    function handleOpenChange(state: boolean) {
        setOpen(state);
        form.reset();
    }

    async function handleOnSubmit(data: createTaskSchemaType) {
        try {
            // console.info('form task submitted', data);
            const task = await addTaskMutation(data);
            toast({
                title: 'Succes',
                description: 'Task created succesfully',
            });

            handleOpenChange(false);
            router.refresh();
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Cannot create Task. Something went wrong, Please try again later',
                variant: 'destructive',
            });
            console.error('error add task: ', getErrorMessage(error));
        }
    }
    // console.log('CreateTaskDialog: ', 'Render');
    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex gap-2">
                        Add Task to collection{' '}
                        <span className={cn('p-[1px] bg-clip-text text-transparent', CollectionColors[collection.color as CollectionColorType])}>
                            {collection.name}
                        </span>
                    </DialogTitle>
                    <DialogDescription>Add a task to your collection. You can add as many tasks as you want to a collection.</DialogDescription>
                </DialogHeader>
                <div className="gap-4 py-4">
                    <Form {...form}>
                        <form className="space-y-4 flex flex-col" onSubmit={form.handleSubmit((d) => handleOnSubmit(d))}>
                            <FormField
                                name="content"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Content</FormLabel>
                                        <FormControl>
                                            <Textarea rows={5} placeholder="Task content here" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                name="expiresAt"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Expires At</FormLabel>
                                        <FormDescription>When should this task expire?</FormDescription>
                                        <FormControl>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        className={cn(
                                                            'justify-start text-left font-normal w-full',
                                                            !field.value && 'text-muted-foreground'
                                                        )}
                                                    >
                                                        <CalendarIcon className="mr-2 size-4" />
                                                        {field.value ? <span>{format(field.value, 'PP')}</span> : <span>No expiration</span>}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent>
                                                    <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus></Calendar>
                                                </PopoverContent>
                                            </Popover>
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </form>
                    </Form>
                </div>
                <DialogFooter>
                    <Button
                        disabled={form.formState.isSubmitting}
                        size="sm"
                        className={cn('w-full dark:text-white text-white', CollectionColors[collection.color as CollectionColorType])}
                        onClick={form.handleSubmit((d) => handleOnSubmit(d))}
                    >
                        Confirm
                        {form.formState.isSubmitting && <ReloadIcon className="size-4 animate-spin ml-2" />}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
