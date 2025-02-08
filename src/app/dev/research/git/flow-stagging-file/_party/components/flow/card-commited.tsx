import { Handle, NodeResizer, Position, type Node, type NodeProps } from '@xyflow/react';

import type { UntrackedAndModifiedFile } from '@/server/git-command';
import { cn } from '@/lib/classnames';
import { CustomHandle } from './custom-handle';
import { type createCommitedSchemaType } from '../../schemas/commited';
import { Box } from '../box';

type CardFileProps = Node<createCommitedSchemaType>;

export function CardCommited({ id, data, selected }: NodeProps<CardFileProps>) {
    return (
        <>
            <NodeResizer
                color="#ff0071"
                isVisible={selected}
                minWidth={100}
                minHeight={30}
            />
            <Box
                theme="blue"
                className="h-full w-full text-xs py-2 px-2 rounded-lg"
            >
                <p>{data.message}</p>
                <CustomHandle
                    type="target"
                    position={Position.Bottom}
                />
            </Box>
        </>
    );
}
