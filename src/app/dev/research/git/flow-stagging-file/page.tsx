import { getUntrackedAndModifiedFiles } from '@/server/git-command';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/classnames';
import { App } from './_party/app';

export default async function StaggingFilePage() {
    const files = await getUntrackedAndModifiedFiles();
    const untrackedFiles = files.filter((file) => file.status === 'untracked');
    const modifiedFiles = files.filter((file) => file.status === 'modified');

    return (
        <div className="w-full container py-2 space-y-3">
            <h1 className="text-2xl font-bold">List Stagging File Git</h1>
            <SectionToolBar
                filesCount={files.length}
                untrackedFilesCount={untrackedFiles.length}
                modifiedFilesCount={modifiedFiles.length}
            />
            {/* <div className="border py-3 space-y-2">
                {files.map((file, idx) => (
                    <div
                        className={cn(
                            'text-xs h-[50px] bg-zinc-800 text-green-500 py-2 px-4 flex items-center _justify-center gap-x-2',
                            file.status === 'modified' && 'text-orange-500'
                        )}
                        key={file.path}
                    >
                        <Checkbox id={`file-${idx}`} />
                        <Label
                            htmlFor={`file-${idx}`}
                            className="inline-block flex-1 cursor-pointer align-middle _text-center"
                        >
                            {file.path}
                        </Label>
                    </div>
                ))}
            </div> */}
            <App files={files} />
        </div>
    );
}

type SectionToolBarProps = { filesCount: number; untrackedFilesCount: number; modifiedFilesCount: number };

function SectionToolBar({ filesCount, untrackedFilesCount, modifiedFilesCount }: SectionToolBarProps) {
    return (
        <section className="space-y-1">
            <div className="flex gap-x-3">
                <p className="text-sm">
                    Untracked File:&nbsp;
                    <span className="text-green-500">{untrackedFilesCount}</span>
                </p>
                <p className="text-sm">
                    Modified File:&nbsp;
                    <span className="text-orange-500">{modifiedFilesCount}</span>
                </p>
                <p className="text-sm">
                    Total File:&nbsp;
                    <span className="text-blue-500">{filesCount}</span>
                </p>
            </div>
        </section>
    );
}
