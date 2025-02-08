import { type DummyDependencyTopic } from '../data/types';
import { columnsDefTableDependencyTopic } from '../components/data-table/columns-def-table-dependency-topic';
import { DataTable, DataTableViewOptions, DataTableView, DataTableGlobalFilter, DataTablePagination } from '@/components/ui/custom/data-table';

export function TableWithCompound({ data }: { data: DummyDependencyTopic[] }) {
    return (
        <DataTable
            columns={columnsDefTableDependencyTopic}
            data={data}
            className=""
            aria-description="table container"
            tableOptios={{ enablePagination: true, debugMode: false }}
        >
            <DataTable.SectionToolBar<DummyDependencyTopic, unknown>
                className=""
                aria-description="table toolbar"
                renderFn={({ columns, data, tableInstance }) => (
                    <>
                        {/* <DataTableToolbar table={tableInstance} /> */}
                        {/* <p className="text-xs text-muted-foreground">Result count: {tableInstance.getFilteredRowModel().rows.length}</p> */}
                        <DataTableGlobalFilter table={tableInstance} />
                        <DataTableViewOptions table={tableInstance} />
                    </>
                )}
            />
            <DataTable.SectionContent<DummyDependencyTopic, unknown>
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
            <DataTable.SectionPagination<DummyDependencyTopic, unknown>
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
