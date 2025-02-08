'use client';

import { type DummyDependencyTopic } from '../data/types';
import { TableWithOutCompound } from './table-without-compound';
import { TableWithCompound } from './table-with-compound';

export function App({ data }: { data: DummyDependencyTopic[] }) {
    return (
        <div
            aria-description="app container"
            className="h-full overflow-hidden"
        >
            {/* <TableWithOutCompound
                data={data}
                columns={columnsDefTableDependencyTopic}
            /> */}

            <TableWithCompound data={data} />
        </div>
    );
}
