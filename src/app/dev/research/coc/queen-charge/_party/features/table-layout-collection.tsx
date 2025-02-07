'use client';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ReloadIcon } from '@radix-ui/react-icons';

import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { getErrorMessage } from '@/utils/get-error-message';
import { addLayout, deleteLayout, getLayoutSelected, selectAllLayout, setLayoutSelected } from '../state/layout-collection-slice';

import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Table, TableCell, TableHead, TableHeader, TableRow, TableBody } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { useState } from 'react';
import { Trash2Icon } from 'lucide-react';
import { cn } from '@/lib/classnames';

type TableLayoutCollectionProps = {
    withSheet?: boolean;
};

export function TableLayoutCollection({ withSheet = true }: TableLayoutCollectionProps) {
    const layoutCollection = useAppSelector(selectAllLayout);
    const layoutActiveSelected = useAppSelector(getLayoutSelected);
    const dispatch = useAppDispatch();
    return (
        <div className="space-y-2">
            <p className="text-xs">
                Layout active: <br />
                <span className={cn('font-bold underline text-green-300', layoutActiveSelected === null && 'text-red-400')}>
                    {layoutActiveSelected ?? 'layout id not selected'}
                </span>
            </p>
            {withSheet && <CreateLayouCollectiontSheet />}
            <div className="overflow-hidden">
                <h2 className="font-bold">List of Layout Collections</h2>
                <p className="text-xs text-muted-foreground">Select layout to set layout active</p>
                <div className="h-[50vh] overflow-y-auto">
                    <Table style={{ fontSize: '10px' }}>
                        <TableHeader>
                            <TableRow className="[&>th:last-child]:text-right [&>th]:px-1">
                                <TableHead className="w-[70px]">ID Layout</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead className="w-[50px]">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {layoutCollection.map((layout) => (
                                <TableRow
                                    key={layout.layoutId}
                                    className={cn(
                                        'select-none cursor-pointer [&>td]:p-1 [&>td:last-child]:text-right',
                                        layout.layoutId === layoutActiveSelected && 'text-green-400'
                                    )}
                                    onClick={() => {
                                        dispatch(setLayoutSelected(layout.layoutId));
                                    }}
                                >
                                    <TableCell className="font-medium">{layout.layoutId.substring(0, 8)}</TableCell>
                                    <TableCell className="font-medium">{layout.name}</TableCell>
                                    <TableCell className="font-medium">
                                        <Button
                                            variant="destructive"
                                            size="icon"
                                            className="size-5"
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                dispatch(deleteLayout(layout.layoutId));
                                            }}
                                        >
                                            <Trash2Icon className="size-3" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}

const createLayoutSchema = z.object({
    name: z.string().min(4, { message: 'Layoutname name must be at least 4 characters' }),
});

type createLayoutSchemaType = z.infer<typeof createLayoutSchema>;

function CreateLayouCollectiontSheet() {
    const [sheetIsOpen, setSheetIsOpen] = useState(false);
    const dispatch = useAppDispatch();
    const form = useForm<createLayoutSchemaType>({
        resolver: zodResolver(createLayoutSchema),
        defaultValues: {
            name: '',
        },
    });

    function handleOnSubmit(form: createLayoutSchemaType) {
        try {
            dispatch(addLayout(form.name));
            toast({
                title: 'Succes',
                description: 'Collection created succesfully',
            });

            // close the sheet
            handleOpenChangeWrapper(false);
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
        setSheetIsOpen(open);
    }

    return (
        <Sheet
            open={sheetIsOpen}
            onOpenChange={(state) => handleOpenChangeWrapper(state)}
        >
            <Button
                onClick={() => setSheetIsOpen(true)}
                variant="outline"
                size="sm"
                className="w-full"
                data-tooltip="Create new layout collection"
            >
                Create new
            </Button>
            {/* <SheetTrigger asChild></SheetTrigger> */}
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Add new layout building</SheetTitle>
                    <SheetDescription className="text-xs">Make changes to your profile here. Click save when youre done.</SheetDescription>
                </SheetHeader>
                <Form {...form}>
                    <form
                        className="mb-8 space-y-4 flex flex-col"
                        onSubmit={form.handleSubmit((d) => handleOnSubmit(d))}
                    >
                        <FormField
                            name="name"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            className="h-8"
                                            placeholder="your name of layout"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>Layout name</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </form>
                </Form>
                <SheetFooter>
                    <Button
                        disabled={form.formState.isSubmitting}
                        size="sm"
                        className="text-xs"
                        variant="outline"
                        onClick={form.handleSubmit((d) => handleOnSubmit(d))}
                    >
                        Save
                        {form.formState.isSubmitting && <ReloadIcon className="ml-2 h-4 w-4 animate-spin" />}
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
