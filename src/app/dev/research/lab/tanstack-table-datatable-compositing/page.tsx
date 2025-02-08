import { promises as fs } from 'node:fs';
import path from 'node:path';

import { App } from './_party/features/app';
import { type DummyDependencyTopic } from './_party/data/types';

// Simulate a database read for tasks.
async function getData<T>(pathFile: string) {
    const data = await fs.readFile(path.join(process.cwd(), pathFile));
    const dataParse = JSON.parse(data.toString());
    return dataParse as T;
}

const PATH_FILE_DUMMY = 'src/app/dev/research/lab/tanstack-table-datatable-compositing/_party/data/dummy-dependency-topic.json';

export default async function PageTestDependencyTopic() {
    const data = await getData<DummyDependencyTopic[]>(PATH_FILE_DUMMY);

    return (
        <div
            aria-description="page"
            className="w-full flex flex-col container py-3 gap-y-3 h-[calc(100vh-60.6px)]"
        >
            <div>
                <h1 className="text-xl font-bold w-fit relative">
                    Table Dependency Topic
                    <span className="text-xs tracking-widest text-yellow-500 absolute right-[-24px] top-[10px] py-[2px] px-1.5 rounded-full _bg-white rotate-[-6deg]">
                        test
                    </span>
                </h1>
            </div>
            <div
                aria-description="app wrapper"
                className="flex-1 overflow-hidden p-4 rounded-2xl border border-border"
            >
                <App data={data} />
            </div>
        </div>
    );
}
