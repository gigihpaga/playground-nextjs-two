import React, { ReactNode, useState } from 'react';
import { PenIcon, PlusIcon, Settings2Icon, SquarePenIcon, SquarePlusIcon, Trash2Icon } from 'lucide-react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { z } from 'zod';
import { useForm, DefaultValues, FieldValues, FieldValue } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { cn } from '@/lib/classnames';
import { Club, HistoryQuestClub } from '../types';
import { currencyIndonesianformatter, dateTimeIndonesianformatter, fromInputDatetimeLocalValue, toInputDatetimeLocalValue } from '../utils';
import dateBetweenFilterFn from '../utils/datatable';
import {
    selectAllClubs,
    addClub,
    updateClub,
    selectClub,
    deleteClub,
    selectAllHistoryQuestClub,
    selectHistoryQuestClub,
    deleteHistoryQuestClub,
    updateHistoryQuestClub,
} from '../state/carx-grinding-slice';

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
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
    type DataTableInstance,
} from '@/components/ui/custom/data-table';
import { DataTableDateRangeFilter } from '../components/datatable-date-range-filter';

/**
 * proses:
 * - Roll-up Pendapatan Quest Harian
 * - Proses Konsolidasi Pendapatan Quest Harian
 * - Proses Finalisasi Transaksi Quest Harian
 * - Proses Agregasi dan Settlement Pendapatan Quest Harian
 * - data warehousing
 */
export function DialogHistoryQuestClub({ trigger }: { trigger: ReactNode }) {
    const [dialogStateIsOpen, setDialogStateIsOpen] = useState<boolean>(false);

    return (
        <Dialog
            open={dialogStateIsOpen}
            onOpenChange={setDialogStateIsOpen}
        >
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className="flex flex-col _sm:max-w-[425px] h-[90vh] max-h-[90vh] max-w-[90vw] overflow-hidden gap-2">
                <DialogHeader>
                    <DialogTitle className="flex gap-2">History quest club</DialogTitle>
                    <DialogDescription>Manage history quest club data</DialogDescription>
                </DialogHeader>

                <HistoryQuestClubView />
            </DialogContent>
        </Dialog>
    );
}

type HistoryQuestAssociatedClub = HistoryQuestClub & {
    club?: Club; // Club bisa jadi undefined jika tidak ditemukan berdasarkan idClub
};

function HistoryQuestClubView() {
    const allHistoryQuestClub = useAppSelector(selectAllHistoryQuestClub);
    const allClubs = useAppSelector(selectAllClubs);

    /**
     * - Memperkaya objek HistoryQuestClub dengan data Club yang sesuai. Data Club disimpan dalam properti 'club'.
     * - Menghubungkan setiap HistoryQuestClub dengan objek Club berdasarkan idClub. Objek Club yang terhubung disimpan pada properti 'club'.
     * - Memperkaya (Enriching)
     * - Menghubungkan (Linking/Relating)
     * - Menyertakan (Including/Embedding)
     * - Memetakan (Mapping)
     * - Mengasosiasikan (Associating)
     * - Populasi (Populating)
     */
    const historyQuestAssociatedClubs: HistoryQuestAssociatedClub[] = allHistoryQuestClub.map((history) => {
        const club = allClubs.find((club) => club.id === history.idClub);
        return {
            ...history,
            club: club, // Properti 'club' akan berisi objek Club atau undefined jika tidak ditemukan
        };
    });

    return (
        <div className="flex-1 overflow-hidden">
            <TableHistoryQuestClub
                data={historyQuestAssociatedClubs}
                colums={columnsDefTableHistoryQuestClub}
            />
        </div>
    );
}

//* Table

const columnsDefTableHistoryQuestClub: ColumnDef<HistoryQuestAssociatedClub>[] = [
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
        accessorKey: 'id',
        header: ({ column }) => (
            <DataTableColumnHeaderWithFilter
                column={column}
                title="Id"
            />
        ),
        cell: ({ row }) => {
            return (
                <div className="flex space-x-1.5">
                    <span className="max-w-[500px] truncate font-medium">{row.getValue('id')}</span>
                </div>
            );
        },

        filterFn: (row, id, value: string[]) => {
            return value.includes(row.getValue(id));
        },
    },
    {
        accessorKey: 'idClub',
        id: 'idClub',
        header: ({ column }) => (
            <DataTableColumnHeaderWithFilter
                column={column}
                title="Id Club"
            />
        ),
        cell: ({ row, getValue }) => {
            return (
                <div className="flex space-x-1.5">
                    <span className="max-w-[500px] truncate font-medium">{String(getValue())}</span>
                </div>
            );
        },
        enableHiding: true,
        filterFn: (row, id, value: string[]) => {
            return value.includes(row.getValue(id));
        },
    },
    {
        accessorKey: 'club.name',
        id: 'clubName',
        header: ({ column }) => (
            <DataTableColumnHeaderWithFilter
                column={column}
                title="Club name"
            />
        ),
        cell: ({ row, getValue }) => {
            return (
                <div className="flex space-x-1.5">
                    <span className="max-w-[500px] truncate font-medium">{row.original.club?.name ?? 'club not found'}</span>
                </div>
            );
        },

        filterFn: (row, id, value: string[]) => {
            return value.includes(row.getValue(id));
        },
    },
    {
        accessorKey: 'club.class',
        header: ({ column }) => (
            <DataTableColumnHeaderWithFilter
                column={column}
                title="Class"
            />
        ),
        cell: ({ row, getValue }) => {
            return (
                <div className="flex space-x-1.5">
                    <span className="max-w-[500px] truncate font-medium">{row.original.club?.class ?? 'club not found'}</span>
                </div>
            );
        },

        filterFn: (row, id, value: string[]) => {
            return value.includes(row.getValue(id));
        },
    },
    {
        accessorKey: 'isWin',
        header: ({ column }) => (
            <DataTableColumnHeaderWithFilter
                column={column}
                title="Status winning"
            />
        ),
        cell: ({ row, getValue }) => {
            return (
                <div className="flex space-x-1.5">
                    <span className={cn('max-w-[500px] truncate font-medium text-green-400', row.original.isWin === false && 'text-red-400')}>
                        {getValue<string>()}
                    </span>
                </div>
            );
        },
        accessorFn: (data) => (data.isWin === true ? 'win' : 'lose'), // convert boolean to string
        filterFn: (row, id, value: string[]) => {
            return value.includes(row.getValue(id));
        },
    },
    {
        accessorKey: 'club.quest.gold',
        header: ({ column }) => (
            <DataTableColumnHeaderWithFilter
                column={column}
                title="Gold"
            />
        ),
        cell: ({ row, getValue }) => {
            return (
                <div className="flex space-x-1.5">
                    <span className="max-w-[500px] truncate font-medium">{row.original.club?.quest.gold ?? 'club not found'}</span>
                </div>
            );
        },

        filterFn: (row, id, value: string[]) => {
            return value.includes(row.getValue(id));
        },
        footer: ({ table }) => {
            const totalRows = table.getFilteredRowModel().rows.length;
            const totalGold = table
                .getFilteredRowModel()
                .rows.filter((row) => row.original.isWin === true) // Filter hanya jika isWin adalah true
                .reduce((sum, row) => {
                    const gold = row.original.club?.quest.gold;
                    return sum + (gold ?? 0);
                }, 0);
            return totalRows === 0 ? null : <div className="font-bold underline">{totalGold}</div>;
        },
    },
    {
        accessorKey: 'club.quest.silver',
        header: ({ column }) => (
            <DataTableColumnHeaderWithFilter
                column={column}
                title="Silver"
            />
        ),
        cell: ({ row, getValue }) => {
            return (
                <div className="flex space-x-1.5">
                    <span className="max-w-[500px] truncate font-medium">
                        {getValue<number | undefined>() ? currencyIndonesianformatter(getValue<number>()) : 'club not found'}
                    </span>
                </div>
            );
        },

        filterFn: (row, id, value: string[]) => {
            return value.includes(row.getValue(id));
        },
        footer: ({ table }) => {
            const totalRows = table.getFilteredRowModel().rows.length;
            const totalSilver = table
                .getFilteredRowModel()
                .rows.filter((row) => row.original.isWin === true) // Filter hanya jika isWin adalah true
                .reduce((sum, row) => {
                    const silver = row.original.club?.quest.silver;
                    return sum + (silver ?? 0);
                }, 0);

            return totalRows === 0 ? null : <div className="font-bold underline">{currencyIndonesianformatter(totalSilver)}</div>;
        },
    },
    {
        accessorKey: 'timeOn',
        header: ({ column, table }) => (
            <DataTableColumnHeaderWithFilter
                column={column}
                title="timeOn"
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
                    {/* <span className="max-w-[500px] truncate font-medium">{questClubDateformatter.format(new Date(row.original.timeOn))}</span> */}
                    {/* <span className="max-w-[500px] truncate font-medium">{`${(getValue() as unknown as Date).toISOString()} || ${questClubDateformatter.format(getValue() as unknown as Date)}`}</span> */}
                    <span className="max-w-[500px] truncate font-medium">{dateTimeIndonesianformatter.format(getValue<Date>())}</span>
                </div>
            );
        },
        enableGlobalFilter: false,
        accessorFn: (data) => new Date(data.timeOn), // convert string Date to object Date
        filterFn: (row, id, value) => dateBetweenFilterFn(row, id, value, () => {}),
    },
];

function TableHistoryQuestClub({ data, colums }: { data: HistoryQuestAssociatedClub[]; colums: ColumnDef<HistoryQuestAssociatedClub>[] }) {
    return (
        <DataTable
            columns={colums}
            data={data}
            className=""
            aria-description="table container"
            tableOptios={{
                enablePagination: true,
                // debugMode: false,
                initialState: {
                    columnVisibility: {
                        idClub: false,
                    },
                },
            }}
        >
            <DataTable.SectionToolBar<HistoryQuestAssociatedClub, unknown>
                className=""
                aria-description="table toolbar"
                renderFn={({ columns, data, tableInstance }) => {
                    const historyQuestClubSelecteds = tableInstance
                        .getFilteredSelectedRowModel()
                        .flatRows.map((historyQuestClubRow) => historyQuestClubRow.original);
                    // console.log('check filter colum', tableInstance.getColumn('idClub')?.getFilterValue());
                    // console.log('TableHistoryQuestClub', tableInstance.getState());
                    return (
                        <>
                            <DataTableGlobalFilter table={tableInstance} />
                            <div className="flex gap-2">
                                {/* <ButtonTips content={{ title: 'About data', description: 'data dependencies in this table from package json' }} /> */}
                                <ActionHistoryQuestClub
                                    historyQuestClubs={historyQuestClubSelecteds}
                                    tableInstance={tableInstance}
                                />

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
            <DataTable.SectionContent<HistoryQuestAssociatedClub, unknown>
                className=""
                aria-description="table wrapper"
                renderFn={({ columns, tableInstance }) => (
                    <DataTableView
                        className=""
                        table={tableInstance}
                        columns={columns}
                        footer={true}
                    />
                )}
            />
            <DataTable.SectionPagination<HistoryQuestAssociatedClub, unknown>
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

type ActionHistoryQuestClubProps = {
    historyQuestClubs: HistoryQuestAssociatedClub[];
    tableInstance: DataTableInstance<HistoryQuestAssociatedClub>;
};

function ActionHistoryQuestClub({ historyQuestClubs, tableInstance }: ActionHistoryQuestClubProps) {
    const dispatch = useAppDispatch();
    const isEditable = historyQuestClubs.length === 1;
    const isDeletable = historyQuestClubs.length > 0;

    function handleDeleteHistoryQuestClub() {
        dispatch(deleteHistoryQuestClub(historyQuestClubs.map((history) => history.id)));
        tableInstance.resetRowSelection();
    }

    return (
        <div
            aria-description="ActionClub"
            className="flex gap-2"
        >
            {/* <DialogFormClub
                trigger={
                    <Button
                        title="add club"
                        className="text-xs h-6 p-1 flex gap-1"
                    >
                        <PlusIcon className="size-[14px]" />
                        Add
                    </Button>
                }
            /> */}
            <DialogFormHistoryQuestClub
                idHistoryQuest={isEditable ? historyQuestClubs[0].id : undefined}
                trigger={
                    <Button
                        variant="outline"
                        className="text-xs h-6 p-1 flex gap-1 bg-[#1d3c7f] hover:bg-[#17326b]"
                        title="edit history"
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
                onClick={() => handleDeleteHistoryQuestClub()}
            >
                <Trash2Icon className="size-4" />
                Delete
            </Button>
        </div>
    );
}

//* Form
const formHistoryQuestClubSchema = z.object({
    idClub: z.string(),
    timeOn: z.string(),
    isWin: z.boolean(),
});

export type FormHistoryQuestClubSchemaType = z.infer<typeof formHistoryQuestClubSchema>;

/**
 * Form hanya untuk edit
 * @param param0
 * @returns
 */
function DialogFormHistoryQuestClub({ trigger, idHistoryQuest }: { trigger: ReactNode; idHistoryQuest?: HistoryQuestAssociatedClub['id'] }) {
    const [dialogIsOpen, setDialogIsOpen] = useState<boolean>(false);

    const dispatch = useAppDispatch();
    const historyQuestClubSelected = useAppSelector((state) => selectHistoryQuestClub(state, idHistoryQuest));

    const isValidToUpdate = Boolean(idHistoryQuest) && Boolean(historyQuestClubSelected);

    const form = useForm<FormHistoryQuestClubSchemaType>({
        resolver: zodResolver(formHistoryQuestClubSchema),
        defaultValues: { idClub: '', timeOn: '', isWin: false },
        values: {
            idClub: historyQuestClubSelected?.idClub ?? '',
            timeOn: historyQuestClubSelected ? toInputDatetimeLocalValue(new Date(historyQuestClubSelected.timeOn)) : '',
            isWin: historyQuestClubSelected?.isWin ?? false,
        },
    });

    function handleOnSubmit(data: FormHistoryQuestClubSchemaType) {
        // console.log('FormHistoryQuestClub submit', { ...data, dateConvert: fromDatetimeLocalValue(data.timeOn) });

        if (!historyQuestClubSelected) {
            console.error('history not found');
            return;
        }

        const dataHistory: HistoryQuestClub = {
            ...historyQuestClubSelected,
            idClub: data.idClub,
            timeOn: fromInputDatetimeLocalValue(data.timeOn),
            isWin: data.isWin,
        };

        // edit
        dispatch(updateHistoryQuestClub(dataHistory));

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
                    <DialogTitle className="flex gap-2">Edit history quest club</DialogTitle>
                    <DialogDescription>Edit history quest club data</DialogDescription>
                </DialogHeader>
                <div className="gap-4 py-4">
                    <Form {...form}>
                        <form
                            // onSubmit={form.handleSubmit((a) => handleOnSubmit(a))}
                            className="space-y-2"
                        >
                            <FormField
                                name="idClub"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Id club</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="id club"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                name="timeOn"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Time on</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="datetime-local"
                                                placeholder="time on"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="isWin"
                                render={({ field }) => (
                                    <FormItem className="space-y-3">
                                        <FormLabel>Is win</FormLabel>
                                        <FormControl>
                                            <RadioGroup
                                                onValueChange={(value) => field.onChange(value === 'true')}
                                                defaultValue={String(field.value)}
                                                className="flex flex-col"
                                            >
                                                {[true, false].map((radioItemValue) => (
                                                    <FormItem
                                                        key={`radio-iswin-${radioItemValue}`}
                                                        className="flex items-center gap-3"
                                                    >
                                                        <FormControl>
                                                            <RadioGroupItem value={String(radioItemValue)} />
                                                        </FormControl>
                                                        <FormLabel className="font-normal">{radioItemValue === true ? 'win' : 'lose'}</FormLabel>
                                                    </FormItem>
                                                ))}
                                            </RadioGroup>
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
