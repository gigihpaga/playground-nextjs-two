import React, { FC, HTMLAttributes } from 'react';
import { EdgeProps, getBezierPath, EdgeLabelRenderer, BaseEdge, Edge } from '@xyflow/react';
import type { PartiallyRequired } from '@/types/utilities';

export type EdgeWithLabelStartend1Data = { startLabel: string; endLabel: string };

export type EdgeWithLabelStartend1Props = PartiallyRequired<Edge<EdgeWithLabelStartend1Data, 'EdgeWithLabelStartend1'>, 'type'>;

export const EdgeWithLabelStartend1: FC<EdgeProps<EdgeWithLabelStartend1Props>> = (props) => {
    const { id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, data } = props;

    const [edgePath] = getBezierPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
    });

    return (
        <>
            <BaseEdge
                id={id}
                path={edgePath}
            />
            <EdgeLabelRenderer>
                {data?.startLabel && (
                    <EdgeLabel
                        transform={`translate(-50%, 0%) translate(${sourceX}px,${sourceY}px)`}
                        label={data.startLabel}
                    />
                )}
                {data?.endLabel && (
                    <EdgeLabel
                        transform={`translate(-50%, -100%) translate(${targetX}px,${targetY}px)`}
                        label={data.endLabel}
                    />
                )}
            </EdgeLabelRenderer>
        </>
    );
};

// this is a little helper component to render the actual edge label
function EdgeLabel({ transform, label }: { transform: React.CSSProperties['transform']; label: string }) {
    return (
        <div
            style={{
                position: 'absolute',
                background: 'transparent',
                padding: 10,
                color: '#ff5050',
                fontSize: 12,
                fontWeight: 700,
                transform,
            }}
            className="nodrag nopan"
        >
            {label}
        </div>
    );
}
