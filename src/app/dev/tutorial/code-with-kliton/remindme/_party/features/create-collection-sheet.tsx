import { useRouter } from 'next/navigation';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { createCollectionSchema, type createCollectionSchemaType } from '../schema/create-collection';
import { CollectionColors, type CollectionColorType } from '../constants/collection-color';
import { cn } from '@/lib/classnames';
import { addCollectionMutation } from '../actions/collection';
import { getErrorMessage } from '@/utils/get-error-message';

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { ReloadIcon } from '@radix-ui/react-icons';

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function CreateCollectionSheet({ open, onOpenChange }: Props) {
    const router = useRouter();
    const form = useForm<createCollectionSchemaType>({
        resolver: zodResolver(createCollectionSchema),
        defaultValues: {
            name: '',
        },
    });

    async function handleOnSubmit(data: createCollectionSchemaType) {
        try {
            // console.log('data submited: ', data);
            const collection = await addCollectionMutation(data);
            toast({
                title: 'Succes',
                description: 'Collection created succesfully',
            });

            // close the sheet
            handleOpenChangeWrapper(false);
            router.refresh();
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Something went wrong, Please try again later',
                variant: 'destructive',
            });
            console.error('error add collection: ', getErrorMessage(error));
        }
    }

    function handleOpenChangeWrapper(open: boolean) {
        form.reset();
        onOpenChange(open);
    }

    return (
        <Sheet open={open} onOpenChange={(state) => handleOpenChangeWrapper(state)}>
            <SheetContent>
                {/*  */}
                <SheetHeader>
                    <SheetTitle>Add new collection</SheetTitle>
                    <SheetDescription>Collection are away to group your tasks</SheetDescription>
                </SheetHeader>
                {/*  */}
                <Form {...form}>
                    <form className="mb-8 space-y-4 flex flex-col" onSubmit={form.handleSubmit((d) => handleOnSubmit(d))}>
                        <FormField
                            name="name"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input className="h-8" placeholder="Personal" {...field}></Input>
                                    </FormControl>
                                    <FormDescription>Collection name</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            name="color"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Color</FormLabel>
                                    <FormControl>
                                        <Select onValueChange={(color) => field.onChange(color)}>
                                            <SelectTrigger
                                                className={cn('w-full h-8 _text-white', CollectionColors[field.value as CollectionColorType])}
                                            >
                                                <SelectValue placeholder="Color" className="w-full" />
                                            </SelectTrigger>
                                            <SelectContent className="w-full">
                                                {(Object.keys(CollectionColors) as Array<CollectionColorType>).map((color) => (
                                                    <SelectItem
                                                        key={color}
                                                        value={color}
                                                        className={cn(
                                                            'w-full h-8 rounded-md my-1 text-white focus:text-white focus:font-bold focus:ring-1 ring-neutral-600 focus:ring-inset dark:focus:ring-white focus:px-8 transition-[padding]',
                                                            CollectionColors[color]
                                                        )}
                                                    >
                                                        {color}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormDescription>Select a color for your collection</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </form>
                </Form>
                <div className="flex flex-col gap-3">
                    <Separator />
                    <Button
                        disabled={form.formState.isSubmitting}
                        size="sm"
                        variant="outline"
                        className={cn(
                            form.watch('color') && CollectionColors[form.getValues('color') as CollectionColorType]
                            // form.watch('color') && CollectionColors[form.getValues('color') as CollectionColorType] ? 'text-white' : 'text-background'
                        )}
                        onClick={form.handleSubmit((d) => handleOnSubmit(d))}
                    >
                        Confirm
                        {form.formState.isSubmitting && <ReloadIcon className="ml-2 h-4 w-4 animate-spin" />}
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    );
}
