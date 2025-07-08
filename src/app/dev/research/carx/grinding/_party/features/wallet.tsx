import React, { ReactNode, useState } from 'react';
import { PenIcon, PlusIcon, Settings2Icon, SquarePenIcon, SquarePlusIcon, Trash2Icon } from 'lucide-react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { z } from 'zod';
import { useForm, DefaultValues, FieldValues, FieldValue } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { cn } from '@/lib/classnames';
import { WalletEntry } from '../types';
import { currencyIndonesianformatter, dateTimeIndonesianformatter } from '../utils';
import { selectAllWalletEntry, selectWalletEntry, addWalletEntry, updateWalletEntry, deleteWalletEntry } from '../state/carx-grinding-slice';

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
import { DataTableDateRangeFilter } from '../components/datatable-date-range-filter';
import dateBetweenFilterFn from '../utils/datatable';

export function DialogWallet({ trigger }: { trigger: ReactNode }) {
    const [dialogStateIsOpen, setDialogStateIsOpen] = useState<boolean>(false);

    return (
        <Dialog
            open={dialogStateIsOpen}
            onOpenChange={setDialogStateIsOpen}
        >
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className="flex flex-col _sm:max-w-[425px] h-[90vh] max-h-[90vh] max-w-[90vw] overflow-hidden gap-2">
                <DialogHeader>
                    <DialogTitle className="flex gap-2">Wallet</DialogTitle>
                    <DialogDescription>Manage wallet data</DialogDescription>
                </DialogHeader>

                <WalletView />
            </DialogContent>
        </Dialog>
    );
}

function WalletView() {
    const allWallets = useAppSelector(selectAllWalletEntry);
    return (
        <div className="flex-1 overflow-hidden">
            <TableWallet
                data={allWallets}
                colums={columnsDefTableWallet}
            />
        </div>
    );
}

//* Table
const columnsDefTableWallet: ColumnDef<WalletEntry>[] = [
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
        accessorKey: 'gold',
        header: ({ column }) => (
            <DataTableColumnHeaderWithFilter
                column={column}
                title="Gold"
            />
        ),
        cell: ({ row, getValue }) => {
            return (
                <div className="flex space-x-1.5">
                    <span className="max-w-[500px] truncate font-medium">{currencyIndonesianformatter(row.original.gold)}</span>
                </div>
            );
        },

        filterFn: (row, id, value: string[]) => {
            return value.includes(row.getValue(id));
        },
    },
    {
        accessorKey: 'silver',
        header: ({ column }) => (
            <DataTableColumnHeaderWithFilter
                column={column}
                title="Silver"
            />
        ),
        cell: ({ row, getValue }) => {
            return (
                <div className="flex space-x-1.5">
                    <span className="max-w-[500px] truncate font-medium">{currencyIndonesianformatter(row.original.silver)}</span>
                </div>
            );
        },

        filterFn: (row, id, value: string[]) => {
            return value.includes(row.getValue(id));
        },
    },
    {
        accessorKey: 'createdAt',
        header: ({ column, table }) => (
            <DataTableColumnHeaderWithFilter
                column={column}
                title="time"
                filterComponent={({ column, title }) => (
                    <DataTableDateRangeFilter
                        column={column}
                        title={title}
                        table={table}
                    />
                )}
            />
        ),

        cell: ({ row, getValue }) => {
            return (
                <div className="flex space-x-1.5">
                    <span className="max-w-[500px] truncate font-medium">{dateTimeIndonesianformatter.format(getValue() as unknown as Date)}</span>
                </div>
            );
        },
        enableGlobalFilter: false,
        accessorFn: (data) => new Date(data.createdAt), // convert string Date to object Date
        filterFn: (row, id, value) => dateBetweenFilterFn(row, id, value, () => {}),
    },
    {
        accessorKey: 'note',
        header: ({ column }) => (
            <DataTableColumnHeaderWithFilter
                column={column}
                title="Note"
            />
        ),
        cell: ({ row }) => {
            return (
                <div className="flex space-x-1.5">
                    <span className="max-w-[500px] truncate font-medium">{row.getValue('note')}</span>
                </div>
            );
        },

        filterFn: (row, id, value: string[]) => {
            return value.includes(row.getValue(id));
        },
    },
];

function TableWallet({ data, colums }: { data: WalletEntry[]; colums: ColumnDef<WalletEntry>[] }) {
    return (
        <DataTable
            columns={colums}
            data={data}
            className=""
            aria-description="table container"
            tableOptios={{
                enablePagination: true,
                debugMode: false,
                initialState: {
                    columnVisibility: {
                        note: false,
                    },
                },
            }}
        >
            <DataTable.SectionToolBar<WalletEntry, unknown>
                className=""
                aria-description="table toolbar"
                renderFn={({ columns, data, tableInstance }) => {
                    const walletSelecteds = tableInstance.getFilteredSelectedRowModel().flatRows.map((walletRow) => walletRow.original);

                    return (
                        <>
                            <DataTableGlobalFilter table={tableInstance} />
                            <div className="flex gap-2">
                                {/* <ButtonTips content={{ title: 'About data', description: 'data dependencies in this table from package json' }} /> */}
                                <ActionWallet wallets={walletSelecteds} />
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
            <DataTable.SectionContent<WalletEntry, unknown>
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
            <DataTable.SectionPagination<WalletEntry, unknown>
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

function ActionWallet({ wallets }: { wallets: WalletEntry[] }) {
    const dispatch = useAppDispatch();
    const isEditable = wallets.length === 1;
    const isDeletable = wallets.length > 0;

    function handleDeleteWallet() {
        dispatch(deleteWalletEntry(wallets.map((wallet) => wallet.id)));
    }

    return (
        <div
            aria-description="ActionWallet"
            className="flex gap-2"
        >
            <DialogFormWallet
                trigger={
                    <Button
                        title="add wallet"
                        className="text-xs h-6 p-1 flex gap-1"
                    >
                        <PlusIcon className="size-[14px]" />
                        Add
                    </Button>
                }
            />
            <DialogFormWallet
                idWallet={isEditable ? wallets[0].id : undefined}
                trigger={
                    <Button
                        variant="outline"
                        className="text-xs h-6 p-1 flex gap-1 bg-[#1d3c7f] hover:bg-[#17326b]"
                        title="edit wallet"
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
                title="delete wallet"
                disabled={!isDeletable}
                onClick={() => handleDeleteWallet()}
            >
                <Trash2Icon className="size-4" />
                Delete
            </Button>
        </div>
    );
}

//* Form

const formWalletSchema = z.object({
    gold: z.number().nonnegative(),
    silver: z.number().nonnegative(),
    note: z.string().optional(),
});

export type FormWalletSchemaType = z.infer<typeof formWalletSchema>;

/**
 * Form dynamic bisa Add dan bisa Edit
 * @param param0
 * @returns
 */
function DialogFormWallet({ trigger, idWallet }: { trigger: ReactNode; idWallet?: WalletEntry['id'] }) {
    const [dialogIsOpen, setDialogIsOpen] = useState<boolean>(false);

    const dispatch = useAppDispatch();
    const walletSelected = useAppSelector((state) => selectWalletEntry(state, idWallet));
    const isEditMode = !!(idWallet && walletSelected);

    const formDefaultValues: FormWalletSchemaType = isEditMode
        ? {
              note: walletSelected.note,
              gold: walletSelected.gold,
              silver: walletSelected.silver,
          }
        : {
              note: '',
              gold: 0,
              silver: 0,
          };

    // console.log('DialogFormWallet', { idWallet, isEditMode, walletSelected, formDefaultValues });

    const form = useForm<FormWalletSchemaType>({
        resolver: zodResolver(formWalletSchema),
        defaultValues: { ...formDefaultValues },
        values: { ...formDefaultValues },
    });

    function handleOnSubmit(data: FormWalletSchemaType) {
        const minuteInMilisecond = 1_000 * 60;
        const dataWallet = {
            note: data.note,
            gold: data.gold,
            silver: data.silver,
        };
        if (!isEditMode) {
            // add
            dispatch(addWalletEntry(dataWallet));
        } else {
            // edit
            if (!walletSelected) return;
            dispatch(updateWalletEntry({ ...walletSelected, ...dataWallet }));
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
                aria-description="DialogFormWallet"
                className="sm:max-w-[425px]"
            >
                <DialogHeader>
                    <DialogTitle className="flex gap-2">{isEditMode ? 'Edit' : 'Add'} wallet</DialogTitle>
                    <DialogDescription>{isEditMode ? 'Edit' : 'Add'} wallet data</DialogDescription>
                </DialogHeader>
                <div className="gap-4 py-4">
                    <Form {...form}>
                        <form
                            // onSubmit={form.handleSubmit((a) => handleOnSubmit(a))}
                            className="space-y-2"
                        >
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
                            <FormField
                                name="note"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Note</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="your notes"
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
                        onClick={form.handleSubmit((data) => handleOnSubmit(data))}
                    >
                        Confirm
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
