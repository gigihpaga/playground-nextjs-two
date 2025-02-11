'use client';

import React from 'react';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { cn } from '@/lib/classnames';

import { type UntrackedAndModifiedFile } from '@/server/git-command';
import { type FileGit } from '@/utils/transform-path';

import { SectionKanbanTopic } from './section-kanban-topic';
import SectionFileTrees from './section-file-tree';
import { SectionFlowTopic } from './section-flow-topic';

interface AppProps {
    defaultCollapsed?: boolean;
    defaultLayout?: number[];
    itemsTree: FileGit<UntrackedAndModifiedFile>[];
}

export function App({ defaultLayout = [30, 35, 35], defaultCollapsed = false, itemsTree }: AppProps) {
    const [isCollapsed, setIsCollapsed] = React.useState<boolean>(defaultCollapsed);
    return (
        <ResizablePanelGroup
            direction="horizontal"
            onLayout={(sizes: number[]) => {
                document.cookie = `react-resizable-panels:layout=${JSON.stringify(sizes)}`;
            }}
            className="h-full max-h-[800px] items-stretch"
        >
            <ResizablePanel
                // collapsedSize={navCollapsedSize}
                // className={cn(isCollapsed && 'min-w-[50px] transition-all duration-300 ease-in-out')}
                defaultSize={isCollapsed === false ? 0 : defaultLayout[0]}
                collapsible={true}
                maxSize={30}
                onCollapse={() => {
                    // setIsCollapsed(false);
                    document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(false)}`;
                }}
                onExpand={() => {
                    // setIsCollapsed(true);
                    document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(true)}`;
                }}
                className="px-1"
            >
                <SectionFileTrees itemsTree={itemsTree} />
            </ResizablePanel>
            <ResizableHandle
                withHandle
                title="resize tree"
            />
            <ResizablePanel
                defaultSize={defaultLayout[1]}
                collapsible={true}
                minSize={30}
                className="px-1"
            >
                <SectionKanbanTopic />
            </ResizablePanel>
            <ResizableHandle
                withHandle
                title="resize flow topic"
            />
            <ResizablePanel
                defaultSize={defaultLayout[2]}
                className="px-1"
                collapsible={true}
            >
                <SectionFlowTopic />
            </ResizablePanel>
        </ResizablePanelGroup>
    );
}
