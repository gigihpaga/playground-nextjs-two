import { ReactNode, useState } from 'react';
import { BookOpenTextIcon, FlameIcon, Settings2Icon, Trash2Icon } from 'lucide-react';

import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { DailyQuestIncome, HistoryQuestClub } from '../types';
import { currencyIndonesianformatter, dateTimeIndonesianformatter, formatRangeDate } from '../utils';
import dateBetweenFilterFn from '../utils/datatable';
import {
    selectAllClubs,
    selectAllHistoryQuestClub,
    addHistoryQuestClub,
    adjustNextQuestTime,
    CarxGrindingState,
    rollupDailyQuestIncome,
    selectAllDailyQuestIncome,
    deleteDailyQuestIncome,
} from '../state/carx-grinding-slice';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
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

export function ButtonProcessRollUpDailyQuest() {
    const dispatch = useAppDispatch();
    const countHistoryQuestClub = useAppSelector(selectAllHistoryQuestClub).length;
    const isRollupable = countHistoryQuestClub > 0;

    return (
        <Button
            className="text-xs h-fit w-fit py-1 px-2 gap-x-[2px] text-white bg-gradient-to-r from-indigo-400 to-cyan-400 hover:from-indigo-500/90 hover:to-cyan-500/90"
            title="process rollup daily quest"
            disabled={!isRollupable}
            onClick={() => {
                const result = dispatch(rollupDailyQuestIncome());
                // console.log('process rollup', result);
            }}
        >
            <FlameIcon className="size-3" />
            Roll-up daily quest
        </Button>
    );
}

export function DialogDailyQuestIncome({ trigger }: { trigger: ReactNode }) {
    const [dialogStateIsOpen, setDialogStateIsOpen] = useState<boolean>(false);

    return (
        <Dialog
            open={dialogStateIsOpen}
            onOpenChange={setDialogStateIsOpen}
        >
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className="flex flex-col _sm:max-w-[425px] h-[90vh] max-h-[90vh] max-w-[90vw] overflow-hidden gap-2">
                <DialogHeader>
                    <DialogTitle className="flex gap-2">Daily quest income summary</DialogTitle>
                    <DialogDescription>Rolled-Up quest earnings</DialogDescription>
                </DialogHeader>

                <DailyQuestIncomeView />
            </DialogContent>
        </Dialog>
    );
}

//*
/**
 * - Daily Quest Summary (title button)
 * - Daily Quest Income Summary (title table), Rolled-Up Quest Earnings (subtitle table)
 */

function DailyQuestIncomeView() {
    const allDailyQuestIncome = useAppSelector(selectAllDailyQuestIncome);

    return (
        <div className="flex-1 overflow-hidden">
            <TableDailyQuestIncome
                data={allDailyQuestIncome}
                colums={columnsDefDailyQuestIncome}
            />
        </div>
    );
}

//* Table

const columnsDefDailyQuestIncome: ColumnDef<DailyQuestIncome>[] = [
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
        accessorKey: 'countQuestCompleted',
        header: ({ column }) => (
            <DataTableColumnHeaderWithFilter
                column={column}
                title="Count quest"
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
                    <span className="max-w-[500px] truncate font-medium">{currencyIndonesianformatter(getValue<number>())}</span>
                </div>
            );
        },

        filterFn: (row, id, value: string[]) => {
            return value.includes(row.getValue(id));
        },
    },
    {
        accessorKey: 'timeRollup',
        header: ({ column, table }) => (
            <DataTableColumnHeaderWithFilter
                column={column}
                title="Time roll-up"
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
        accessorFn: (data) => new Date(data.timeRollup), // convert string Date to object Date
        filterFn: (row, id, value) => dateBetweenFilterFn(row, id, value, () => {}),
    },
    // rangetimeOnQuest (from-to) digabungkan
    {
        id: 'rangetimeOnQuest',
        header: ({ column, table }) => (
            <DataTableColumnHeaderWithFilter
                column={column}
                title="Range time quest"
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
                    {/* <span className="max-w-[500px] truncate font-medium">{questClubDateformatter.format(getValue() as unknown as Date)}</span> */}
                    <span className="max-w-[500px] truncate font-medium">
                        {formatRangeDate(row.original.rangetimeOnQuest.from, row.original.rangetimeOnQuest.to)}
                    </span>
                </div>
            );
        },
        enableGlobalFilter: false,
        accessorFn: (data) => new Date(data.rangetimeOnQuest.from), // convert string Date to object Date
        filterFn: (row, id, value) => dateBetweenFilterFn(row, id, value, () => {}),
    },
];

function TableDailyQuestIncome({ data, colums }: { data: DailyQuestIncome[]; colums: ColumnDef<DailyQuestIncome>[] }) {
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
            <DataTable.SectionToolBar<DailyQuestIncome, unknown>
                className=""
                aria-description="table toolbar"
                renderFn={({ columns, data, tableInstance }) => {
                    const dailyQuestIncomeSelecteds = tableInstance
                        .getFilteredSelectedRowModel()
                        .flatRows.map((dailyQuestIncomeRow) => dailyQuestIncomeRow.original);
                    return (
                        <>
                            <DataTableGlobalFilter table={tableInstance} />
                            <div className="flex gap-2">
                                {/* <ButtonTips content={{ title: 'About data', description: 'data dependencies in this table from package json' }} /> */}

                                <ActionDailyQuestIncome
                                    dailyQuestIncomes={dailyQuestIncomeSelecteds}
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
            <DataTable.SectionContent<DailyQuestIncome, unknown>
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
            <DataTable.SectionPagination<DailyQuestIncome, unknown>
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

type ActionDailyQuestIncomeProps = {
    dailyQuestIncomes: DailyQuestIncome[];
    tableInstance: DataTableInstance<DailyQuestIncome>;
};

function ActionDailyQuestIncome({ dailyQuestIncomes, tableInstance }: ActionDailyQuestIncomeProps) {
    const dispatch = useAppDispatch();
    const isEditable = dailyQuestIncomes.length === 1;
    const isDeletable = dailyQuestIncomes.length > 0;

    function handleDeleteDailyQuestIncome() {
        dispatch(deleteDailyQuestIncome(dailyQuestIncomes.map((questIncome) => questIncome.id)));
        tableInstance.resetRowSelection();
    }

    return (
        <div
            aria-description="ActionClub"
            className="flex gap-2"
        >
            <Button
                variant="destructive"
                className="text-xs h-6 p-1 flex gap-1"
                title="delete club"
                disabled={!isDeletable}
                onClick={() => handleDeleteDailyQuestIncome()}
            >
                <Trash2Icon className="size-4" />
                Delete
            </Button>
        </div>
    );
}
