import React, { FC } from 'react';
import { EdgeProps, getBezierPath, EdgeLabelRenderer, BaseEdge, Edge } from '@xyflow/react';
import type { PartiallyRequired } from '@/types/utilities';

export type EdgeWithLabel1Data = { label: string };

export type EdgeWithLabel1Props = PartiallyRequired<Edge<EdgeWithLabel1Data, 'EdgeWithLabel1'>, 'type'>;

export const EdgeWithLabel1: FC<EdgeProps<EdgeWithLabel1Props>> = ({ ...props }) => {
    const { id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, data } = props;

    const [edgePath, labelX, labelY] = getBezierPath({
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
                <div
                    style={{
                        position: 'absolute',
                        transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
                        background: '#ffcc00',
                        padding: 10,
                        borderRadius: 5,
                        fontSize: 12,
                        fontWeight: 700,
                    }}
                    className="nodrag nopan"
                >
                    {data && data.label}
                </div>
            </EdgeLabelRenderer>
        </>
    );
};
