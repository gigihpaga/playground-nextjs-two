import { FileSymlinkIcon } from 'lucide-react';

import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { type FileGit } from '@/utils/transform-path';
import { type UntrackedAndModifiedFile } from '@/server/git-command';
import {
    addTopic,
    addFile,
    getWorkspaceTopicActive,
    getCommitTopicCollection,
    getTopics,
    getTopicInFile,
    updateTopic,
    type Topic,
} from '../state/commit-topic-collection-slice';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from '@/components/ui/use-toast';
import { ButtonCopy } from '@/components/ui/custom/button-copy';
import { Button } from '@/components/ui/button';
import { FileCard } from './file-card';
import { ReactNode } from 'react';

export function FilePathCard({ item, deleteButton }: { deleteButton?: ReactNode | undefined; item: FileGit<UntrackedAndModifiedFile> }) {
    return (
        <FileCard
            className="_flex-row-reverse _justify-end _items-start flex-col gap-1"
            item={item}
        >
            {/* <Button
                style={{ fontSize: '10px' }}
                className="h-full w-fit py-0 px-1 rounded-sm leading-tight _self-end _justify-end"
            >
                <MoreHorizontalIcon className="size-3" />
            </Button> */}
            <div className="space-x-1">
                {/* button dropdown add file */}
                <DropdownTopic item={item} />
                {/* button remove file */}
                {deleteButton ? deleteButton : null}
                {/* button copy pat */}
                <ButtonCopy
                    title="copy path"
                    className="text-2xs h-fit w-fit p-1 rounded-sm leading-tight [&_svg]:size-[10px] [&_.btn-copy-icon-wrapper]:size-[10px]"
                    data={item.path}
                />
                {/* kurang delete button */}
            </div>
        </FileCard>
    );
}

function DropdownTopic({ item }: { item: FileGit<UntrackedAndModifiedFile> }) {
    const dispath = useAppDispatch();
    const workspaceActive = useAppSelector(getWorkspaceTopicActive);
    const topics = useAppSelector((state) => getTopics(state, workspaceActive));
    const topicInFile = useAppSelector((state) => getTopicInFile(state));

    function handleAddFile(topicId: Topic['id']) {
        if (!workspaceActive) {
            toast({ title: 'Error', description: 'you mush select commit topic collection first to add topic', variant: 'destructive' });
            return;
        }
        dispath(addFile({ file: item, topicId: topicId }));
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    title="add to topic"
                    className="text-2xs h-fit w-fit p-1 rounded-sm leading-tight _self-end _justify-end"
                >
                    <FileSymlinkIcon className="size-[10px]" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Topics</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup className="max-h-[350px] overflow-y-auto">
                    {topics.length ? (
                        topics.map((topic) => (
                            <DropdownMenuItem
                                className="gap-1 text-xs"
                                key={topic.id}
                                disabled={topicInFile[item.pathWithRoot]?.some((tif) => tif.id === topic.id) ?? false}
                                onClick={() => handleAddFile(topic.id)}
                            >
                                <div
                                    style={{ backgroundColor: topic.color }}
                                    className="size-3"
                                    aria-description="circle color topic"
                                />
                                {topic.title}
                            </DropdownMenuItem>
                        ))
                    ) : (
                        <DropdownMenuLabel className="text-center font-normal text-muted-foreground">No topic</DropdownMenuLabel>
                    )}

                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger className="hidden">Invite users</DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                                <DropdownMenuItem>Email</DropdownMenuItem>
                                <DropdownMenuItem>Message</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>More...</DropdownMenuItem>
                            </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                    </DropdownMenuSub>
                </DropdownMenuGroup>

                {/* <DropdownMenuSeparator /> */}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
