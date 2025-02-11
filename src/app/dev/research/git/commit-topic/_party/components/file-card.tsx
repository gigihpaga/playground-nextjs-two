import { HTMLAttributes, type ReactNode } from 'react';

import { type UntrackedAndModifiedFile } from '@/server/git-command';
import { type FileGit } from '@/utils/transform-path';
import { cn } from '@/lib/classnames';
import { useAppSelector } from '@/lib/redux/hooks';

import { getTopicInFile } from '../state/commit-topic-collection-slice';

import { Button } from '@/components/ui/button';

type FileCardProps = HTMLAttributes<HTMLDivElement> & {
    item: FileGit<UntrackedAndModifiedFile>;
};

export function FileCard({ item, className, children, style, ...props }: FileCardProps) {
    const topicInFile = useAppSelector((state) => getTopicInFile(state));
    return (
        <div
            key={item.pathWithRoot}
            className={cn('text-2xs flex font-manrope border rounded px-1 w-full gap-x-1', className)}
            style={{ ...style }}
            {...props}
        >
            {/* <div className="flex flex-col">
                <span className="mr-1">{item.counterFile}</span>
                <Button
                    className="h-fit w-fit py-0 px-1"
                    style={{ fontSize: '10px' }}
                    onClick={() => {
                        window.alert(item.key);
                    }}
                >
                    check
                </Button>
            </div> */}
            <div className="flex">
                {/* <span className="mr-1 text-xs bg-red-500 text-center leading-none  align-middle block">{item.counterFile}</span> */}
                <div className="mr-1 text-xs flex justify-center items-start">
                    <span className="leading-tight text-center align-middle">{item.counterFile}</span>
                </div>
                <div>
                    <p className={cn('text-green-400 leading-tight', item.status === 'modified' && 'text-orange-400')}>
                        {item.pathWithRoot.split('/').slice(-1)}
                    </p>
                    <p className="text-3xs text-muted-foreground text-nowrap">{item.pathWithRoot}</p>
                </div>
            </div>
            {/* circle topic in file */}
            <div className="flex flex-row gap-x-1 min-h-3">
                {topicInFile[item.pathWithRoot]?.map((topic) => (
                    <div
                        key={topic.id}
                        className="size-3 rounded-full"
                        style={{ backgroundColor: topic.color }}
                        title={topic.title}
                    />
                ))}
            </div>
            {children}
        </div>
    );
}
