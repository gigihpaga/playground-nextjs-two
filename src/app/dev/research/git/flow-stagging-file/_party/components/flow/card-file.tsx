import { Handle, Position, type Node, type NodeProps } from '@xyflow/react';

import type { UntrackedAndModifiedFile } from '@/server/git-command';
import { cn } from '@/lib/classnames';
import { CustomHandle } from './custom-handle';

type CardFileProps = Node<UntrackedAndModifiedFile>;

export function CardFile({ id, data }: NodeProps<CardFileProps>) {
    return (
        <div className="text-xs text-foreground bg-[#e7e7e7] dark:bg-[#404244] border border-purple-500 dark:border-purple-600 py-1 px-3 rounded-lg">
            {/* <p>{id}</p> */}
            <p className={cn('text-green-600 dark:text-green-500', data.status === 'modified' && 'text-orange-600 dark:text-orange-500')}>
                {data.path}
            </p>
            {/* <p>{data.status}</p> */}
            <CustomHandle
                type="source"
                position={Position.Right}
            />
        </div>
    );
}
