import React from 'react';
import { BaseEdge, Edge, EdgeProps, getStraightPath } from '@xyflow/react';
import type { PartiallyRequired } from '@/types/utilities';

export type EdgeMinMapData = Record<string, unknown>;

export type EdgeMinMapProps = PartiallyRequired<Edge<EdgeMinMapData, 'EdgeMinMap'>, 'type'>;

export function EdgeMinMap(props: EdgeProps) {
    const { sourceX, sourceY, targetX, targetY } = props;

    const [edgePath] = getStraightPath({
        sourceX,
        sourceY: sourceY + 20,
        targetX,
        targetY,
    });

    return (
        <BaseEdge
            path={edgePath}
            {...props}
        />
    );
}
