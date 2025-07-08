import React, { ReactNode, useState } from 'react';
import { PenIcon, PlusIcon, Settings2Icon, SquarePenIcon, SquarePlusIcon, Trash2Icon } from 'lucide-react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { z } from 'zod';
import { useForm, DefaultValues, FieldValues, FieldValue } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { cn } from '@/lib/classnames';
import { Club } from '../types';
import { breakDownDurationToTimeUnits, currencyIndonesianformatter, formatedDuration } from '../utils';
import { selectAllClubs, addClub, updateClub, selectClub, deleteClub } from '../state/carx-grinding-slice';

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import {
    DataTable,
    DataTableViewOptions,
    DataTableView,
    DataTableGlobalFilter,
    DataTablePagination,
    DataTableColumnHeaderWithFilter,
    DataTableColumnHeader,
    type ColumnDef,
} from '@/components/ui/custom/data-table';
import { colorList, colorObj } from '../constants';

export function DialogMasterClub({ trigger }: { trigger: ReactNode }) {
    const [dialogStateIsOpen, setDialogStateIsOpen] = useState<boolean>(false);

    return (
        <Dialog
            open={dialogStateIsOpen}
            onOpenChange={setDialogStateIsOpen}
        >
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className="flex flex-col _sm:max-w-[425px] h-[90vh] max-h-[90vh] max-w-[90vw] overflow-hidden gap-2">
                <DialogHeader>
                    <DialogTitle className="flex gap-2">Master club</DialogTitle>
                    <DialogDescription>Manage club data</DialogDescription>
                </DialogHeader>

                <MasterClub />
            </DialogContent>
        </Dialog>
    );
}

function MasterClub() {
    const allClubs = useAppSelector(selectAllClubs);
    return (
        <div className="flex-1 overflow-hidden">
            <TableClub
                data={allClubs}
                colums={columnsDefTableClub}
            />
        </div>
    );
}

//* Table
const columnsDefTableClub: ColumnDef<Club>[] = [
    {
        id: 'select',
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllRowsSelected() ||
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && 'indeterminate') ||
                    (table.getIsSomeRowsSelected() && 'indeterminate')
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
                className="translate-y-[2px]"
            />
        ),
        cell: ({ row, getValue }) => (
            <Checkbox
                checked={row.getIsSelected()}
                disabled={!row.getCanSelect()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
                className="translate-y-[2px]"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    /** 
    {
        id: 'select',
        header: ({ table }) => (
            <IndeterminateCheckbox2
                {...{
                    checked: table.getIsAllRowsSelected(),
                    indeterminate: table.getIsSomeRowsSelected(),
                    onChange: table.getToggleAllRowsSelectedHandler(),
                }}
            />
        ),
        cell: ({ row }) => (
            <div className="px-1">
                <IndeterminateCheckbox2
                    {...{
                        checked: row.getIsSelected(),
                        disabled: !row.getCanSelect(),
                        indeterminate: row.getIsSomeSelected(),
                        onChange: row.getToggleSelectedHandler(),
                    }}
                />
            </div>
        ),
    },
    */
    {
        id: 'NUM_ROW',
        header: ({ column }) => (
            <DataTableColumnHeader
                column={column}
                title="No"
            />
        ),
        cell: ({ row, cell, column }) => {
            return (
                <div className="flex space-x-2">
                    <span className="max-w-[500px] truncate font-medium">{row.index + 1}</span>
                </div>
            );
        },
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: 'name',
        header: ({ column }) => (
            <DataTableColumnHeaderWithFilter
                column={column}
                title="Name"
            />
        ),
        cell: ({ row }) => {
            return (
                <div className="flex space-x-1.5">
                    <span className="max-w-[500px] truncate font-medium">{row.getValue('name')}</span>
                </div>
            );
        },

        filterFn: (row, id, value: string[]) => {
            return value.includes(row.getValue(id));
        },
    },
    {
        accessorKey: 'class',
        header: ({ column }) => (
            <DataTableColumnHeaderWithFilter
                column={column}
                title="Class"
            />
        ),
        cell: ({ row, getValue }) => {
            return (
                <div className="flex space-x-1.5">
                    {/* <span className="max-w-[500px] truncate font-medium">{row.original.class}</span> */}
                    <span className="max-w-[500px] truncate font-medium">{String(getValue())}</span>
                </div>
            );
        },

        filterFn: (row, id, value: string[]) => {
            return value.includes(row.getValue(id));
        },
    },
    {
        accessorKey: 'color',
        header: ({ column }) => (
            <DataTableColumnHeaderWithFilter
                column={column}
                title="Color"
            />
        ),
        cell: ({ row, getValue }) => {
            return (
                <div className="flex space-x-1.5">
                    <div
                        title={row.original.color}
                        className={cn('size-4 rounded-full border border-border', colorObj[row.original.color]?.background ?? 'notfound-color')}
                    />
                </div>
            );
        },

        filterFn: (row, id, value: string[]) => {
            return value.includes(row.getValue(id));
        },
    },
    {
        accessorKey: 'car',
        header: ({ column }) => (
            <DataTableColumnHeaderWithFilter
                column={column}
                title="Car"
            />
        ),
        cell: ({ row, getValue }) => {
            return (
                <div className="flex space-x-1.5">
                    <span className="max-w-[500px] truncate font-medium uppercase">{row.original.car}</span>
                </div>
            );
        },

        filterFn: (row, id, value: string[]) => {
            return value.includes(row.getValue(id));
        },
    },
    {
        accessorKey: 'quest.cooldownTime',
        header: ({ column }) => (
            <DataTableColumnHeaderWithFilter
                column={column}
                title="Cooldown"
            />
        ),
        cell: ({ row, getValue }) => {
            return (
                <div className="flex space-x-1.5">
                    <span className="max-w-[500px] truncate font-medium">{formatedDuration(row.original.quest.cooldownTime)}</span>
                </div>
            );
        },

        filterFn: (row, id, value: string[]) => {
            return value.includes(row.getValue(id));
        },
    },
    {
        accessorKey: 'quest.gold',
        header: ({ column }) => (
            <DataTableColumnHeaderWithFilter
                column={column}
                title="Gold"
            />
        ),
        cell: ({ row, getValue }) => {
            return (
                <div className="flex space-x-1.5">
                    <span className="max-w-[500px] truncate font-medium">{currencyIndonesianformatter(row.original.quest.gold)}</span>
                </div>
            );
        },

        filterFn: (row, id, value: string[]) => {
            return value.includes(row.getValue(id));
        },
    },
    {
        accessorKey: 'quest.silver',
        header: ({ column }) => (
            <DataTableColumnHeaderWithFilter
                column={column}
                title="Silver"
            />
        ),
        cell: ({ row, getValue }) => {
            return (
                <div className="flex space-x-1.5">
                    <span className="max-w-[500px] truncate font-medium">{currencyIndonesianformatter(row.original.quest.silver)}</span>
                </div>
            );
        },

        filterFn: (row, id, value: string[]) => {
            return value.includes(row.getValue(id));
        },
    },
];

function TableClub({ data, colums }: { data: Club[]; colums: ColumnDef<Club>[] }) {
    return (
        <DataTable
            columns={colums}
            data={data}
            className=""
            aria-description="table container"
            tableOptios={{ enablePagination: true, debugMode: false }}
        >
            <DataTable.SectionToolBar<Club, unknown>
                className=""
                aria-description="table toolbar"
                renderFn={({ columns, data, tableInstance }) => {
                    /**
                     * (selected row tanstack table)[https://tanstack.com/table/v8/docs/guide/row-selection#access-row-selection-state]
                     * - tableInstance.getState().rowSelection //get the row selection state - { 1: true, 2: false, etc... }
                     * - tableInstance.getSelectedRowModel().rows //get full client-side selected rows
                     * - tableInstance.getFilteredSelectedRowModel().rows //get filtered client-side selected rows
                     * - tableInstance.getGroupedSelectedRowModel().rows //get grouped client-side selected rows
                     */
                    const clubSelecteds = tableInstance.getFilteredSelectedRowModel().flatRows.map((clubRow) => clubRow.original);

                    return (
                        <>
                            <DataTableGlobalFilter table={tableInstance} />
                            <div className="flex gap-2">
                                {/* <ButtonTips content={{ title: 'About data', description: 'data dependencies in this table from package json' }} /> */}
                                <ActionClub clubs={clubSelecteds} />
                                <DataTableViewOptions
                                    trigger={
                                        <Button
                                            size="icon"
                                            variant="outline"
                                            className="size-6"
                                            title="view columns"
                                        >
                                            <Settings2Icon className="size-4" />
                                        </Button>
                                    }
                                    table={tableInstance}
                                />
                            </div>
                        </>
                    );
                }}
            />
            <DataTable.SectionContent<Club, unknown>
                className=""
                aria-description="table wrapper"
                renderFn={({ columns, tableInstance }) => (
                    <DataTableView
                        className=""
                        table={tableInstance}
                        columns={columns}
                    />
                )}
            />
            <DataTable.SectionPagination<Club, unknown>
                className=""
                aria-description="table pagination"
                renderFn={({ columns, data, tableInstance }) => (
                    //
                    <DataTablePagination table={tableInstance} />
                )}
            />
        </DataTable>
    );
}

function IndeterminateCheckbox({ indeterminate, className = '', ...rest }: { indeterminate?: boolean } & React.HTMLProps<HTMLInputElement>) {
    const ref = React.useRef<HTMLInputElement>(null!);

    React.useEffect(() => {
        if (typeof indeterminate === 'boolean') {
            ref.current.indeterminate = !rest.checked && indeterminate;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ref, indeterminate]);

    return (
        <input
            type="checkbox"
            ref={ref}
            className={cn(' cursor-pointer bg-red-500', className)}
            {...rest}
        />
    );
}

function ActionClub({ clubs }: { clubs: Club[] }) {
    const dispatch = useAppDispatch();
    const isEditable = clubs.length === 1;
    const isDeletable = clubs.length > 0;

    function handleDeleteClub() {
        dispatch(deleteClub(clubs.map((club) => club.id)));
    }

    return (
        <div
            aria-description="ActionClub"
            className="flex gap-2"
        >
            <DialogFormClub
                trigger={
                    <Button
                        title="add club"
                        className="text-xs h-6 p-1 flex gap-1"
                    >
                        <PlusIcon className="size-[14px]" />
                        Add
                    </Button>
                }
            />
            <DialogFormClub
                idClub={isEditable ? clubs[0].id : undefined}
                trigger={
                    <Button
                        variant="outline"
                        className="text-xs h-6 p-1 flex gap-1 bg-[#1d3c7f] hover:bg-[#17326b]"
                        title="edit club"
                        disabled={!isEditable}
                    >
                        <PenIcon className="size-4" />
                        Edit
                    </Button>
                }
            />
            <Button
                variant="destructive"
                className="text-xs h-6 p-1 flex gap-1"
                title="delete club"
                disabled={!isDeletable}
                onClick={() => handleDeleteClub()}
            >
                <Trash2Icon className="size-4" />
                Delete
            </Button>
        </div>
    );
}

//* Form
const formClubSchema = z.object({
    name: z.string().min(3).max(255),
    class: z.string().min(2).max(255),
    color: z.enum(colorList),
    car: z.string().min(1).max(255),
    hour: z.number().nonnegative(),
    minute: z.number().nonnegative(),
    // cooldownTime: z.number().nonnegative(),
    gold: z.number().nonnegative(),
    silver: z.number().nonnegative(),
});

export type FormClubSchemaType = z.infer<typeof formClubSchema>;

/**
 * Form dynamic bisa Add dan bisa Edit
 * @param param0
 * @returns
 */
function DialogFormClub({ trigger, idClub }: { trigger: ReactNode; idClub?: Club['id'] }) {
    const [dialogIsOpen, setDialogIsOpen] = useState<boolean>(false);

    const dispatch = useAppDispatch();
    const clubSelected = useAppSelector((state) => selectClub(state, idClub));
    const isEditMode = !!(idClub && clubSelected);

    const formDefaultValues: FormClubSchemaType = isEditMode
        ? {
              name: clubSelected.name,
              class: clubSelected.class,
              color: clubSelected.color,
              car: clubSelected.car,
              hour: breakDownDurationToTimeUnits(clubSelected.quest.cooldownTime).hours,
              minute: breakDownDurationToTimeUnits(clubSelected.quest.cooldownTime).minutes,
              gold: clubSelected.quest.gold,
              silver: clubSelected.quest.silver,
          }
        : {
              name: '',
              class: '',
              color: 'red',
              car: '',
              hour: 0,
              minute: 0,
              gold: 0,
              silver: 0,
          };

    // console.log('DialogFormClub', { idClub, isEditMode, clubSelected, formDefaultValues });

    const form = useForm<FormClubSchemaType>({
        resolver: zodResolver(formClubSchema),
        defaultValues: { ...formDefaultValues },
        values: { ...formDefaultValues },
    });

    function handleOnSubmit(data: FormClubSchemaType) {
        const minuteInMilisecond = 1_000 * 60;
        const duration = data.hour * 60 * minuteInMilisecond + data.minute * minuteInMilisecond;
        const dataClub = {
            name: data.name,
            class: data.class,
            color: data.color,
            car: data.car,
            quest: { cooldownTime: duration, gold: data.gold, silver: data.silver },
        };
        if (!isEditMode) {
            // add
            dispatch(addClub(dataClub));
        } else {
            // edit
            dispatch(updateClub({ id: idClub, ...dataClub }));
        }

        handleDialogOpenChange(false);
    }

    function handleDialogOpenChange(state: boolean) {
        setDialogIsOpen(state);
        form.reset();
    }

    return (
        <Dialog
            open={dialogIsOpen}
            onOpenChange={handleDialogOpenChange}
        >
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent
                aria-description="DialogFormClub"
                className="sm:max-w-[425px]"
            >
                <DialogHeader>
                    <DialogTitle className="flex gap-2">{isEditMode ? 'Edit' : 'Add'} club</DialogTitle>
                    <DialogDescription>{isEditMode ? 'Edit' : 'Add'} club data</DialogDescription>
                </DialogHeader>
                <div className="gap-4 py-4">
                    <Form {...form}>
                        <form
                            // onSubmit={form.handleSubmit((a) => handleOnSubmit(a))}
                            className="space-y-2"
                        >
                            <FormField
                                name="name"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="name club"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                name="class"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Class</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="class club"
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
                                    <FormItem className="flex-1">
                                        <FormLabel>Color</FormLabel>
                                        <Select
                                            onValueChange={(v) => field.onChange(v)}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Color" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className="max-h-[280px]">
                                                {colorList.map((color) => (
                                                    <SelectItem
                                                        className="py-[2px]"
                                                        key={color}
                                                        value={color}
                                                    >
                                                        <div className="flex gap-x-1 w-full items-center">
                                                            <div
                                                                className={cn(
                                                                    'size-4 rounded-full border border-border',
                                                                    colorObj[color]?.background ?? 'notfound-color'
                                                                )}
                                                            />
                                                            <span className="d-block"> {color}</span>
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                name="car"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Car</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="name car"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="flex gap-x-2">
                                <FormField
                                    name="gold"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Gold</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    min={0}
                                                    placeholder="reward gold"
                                                    {...field}
                                                    onChange={(event) => field.onChange(+event.target.value)}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    name="silver"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Silver</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    min={0}
                                                    placeholder="reward silver"
                                                    {...field}
                                                    onChange={(event) => field.onChange(+event.target.value)}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="flex gap-x-2">
                                <FormField
                                    name="hour"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormLabel>Hour</FormLabel>
                                            <Select
                                                onValueChange={(v) => field.onChange(Number(v))}
                                                defaultValue={String(field.value)}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Hour" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent className="max-h-[280px]">
                                                    {Array.from({ length: 13 }, (_, i) => (
                                                        <SelectItem
                                                            className="py-[2px]"
                                                            key={i}
                                                            value={i.toString()}
                                                        >
                                                            {i.toString()}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    name="minute"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormLabel>Minute</FormLabel>
                                            <Select
                                                onValueChange={(v) => field.onChange(Number(v))}
                                                defaultValue={String(field.value)}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Minute" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent className="max-h-[280px]">
                                                    {Array.from({ length: 61 }, (_, i) => (
                                                        <SelectItem
                                                            className="py-[2px]"
                                                            key={i}
                                                            value={i.toString()}
                                                        >
                                                            {i.toString()}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </form>
                    </Form>
                </div>
                <DialogFooter>
                    <Button
                        size="sm"
                        className={cn('w-full')}
                        onClick={form.handleSubmit((data) => handleOnSubmit(data))}
                    >
                        Confirm
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
