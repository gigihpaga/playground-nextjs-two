import { cookies } from 'next/headers';
import dynamic from 'next/dynamic';
import { Loader2Icon, LoaderIcon } from 'lucide-react';

import { generatePathTree } from '@/utils/transform-path';

import { App } from './_party/features/app';

import '@xyflow/react/dist/style.css';
import { getUntrackedAndModifiedFiles, type UntrackedAndModifiedFile } from './_party/action/untracked-modified-files';

const FileTreesDynamic = dynamic(() => import('./_party/features/section-file-tree'), {
    ssr: false,
    loading: () => (
        <div className="relative pr-2 _h-full space-y-2 overflow-auto min-w-[300px] h-[calc(100vh-79px)] max-w-[45vw] bg-gray-900 flex justify-center items-center">
            <div className="flex flex-col gap-y-2 items-center">
                <LoaderIcon className="size-8 _animate-spin animate-[spin_2.25s_linear_infinite]" />
                <p className="text-xs">loading file tree</p>
            </div>
        </div>
    ),
});

export default async function PageCommitTopic() {
    const layoutCookie = cookies().get('react-resizable-panels:layout');
    const collapsedCookie = cookies().get('react-resizable-panels:collapsed');

    const defaultLayout = layoutCookie && layoutCookie.value ? (JSON.parse(layoutCookie.value) as number[]) : undefined;
    const defaultCollapsed = collapsedCookie && collapsedCookie.value ? (JSON.parse(collapsedCookie.value) as boolean) : undefined;

    const filePaths = await getUntrackedAndModifiedFiles();
    const filePathTrees = generatePathTree(filePaths /* .slice(100, 140) */);

    return (
        <div className="w-full _container py-2 flex gap-x-4 ">
            <App
                itemsTree={filePathTrees}
                defaultLayout={defaultLayout}
                defaultCollapsed={defaultCollapsed}
            />
        </div>
    );
}

function List({ filePaths }: { filePaths: UntrackedAndModifiedFile[] }) {
    return (
        <div className="space-y-1">
            {filePaths.map((file, idx) => (
                <div
                    key={file.path}
                    className="text-2xs flex font-manrope border rounded"
                >
                    <span className="mr-1">{idx + 1}</span>
                    <div>
                        <p>{file.path.split('/').slice(-1)}</p>
                        <p className="text-2xs text-muted-foreground">{file.path}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}
