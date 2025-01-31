'use client';

import { BaseEdge, BezierEdge, EdgeLabelRenderer, getBezierPath, getStraightPath, useReactFlow, type EdgeProps } from '@xyflow/react';
import { Button } from '@/components/ui/button';
import { XIcon } from 'lucide-react';

export function CustomEdge(props: EdgeProps) {
    const { id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition } = props;
    const [edgePath, labelX, labelY, offsetX, offsetY] = getBezierPath({ sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition });
    // const [edgePath, labelX, labelY] = getStraightPath({ sourceX, sourceY, targetX, targetY });
    const { setEdges } = useReactFlow();

    return (
        <>
            <BezierEdge {...props} />
            {/* <BaseEdge
                {...props}
                path={edgePath}
                id={id}
            /> */}
            <EdgeLabelRenderer>
                {/* eslint-disable-next-line jsx-a11y/role-supports-aria-props */}
                <Button
                    size="icon"
                    className="size-6 bg-background"
                    style={{
                        position: 'absolute',
                        pointerEvents: 'all',
                        transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
                    }}
                    onClick={() => {
                        setEdges((prevEdges) => prevEdges.filter((edge) => edge.id !== id));
                    }}
                >
                    <XIcon className="size-4 text-destructive dark:text-red-600" />
                </Button>
            </EdgeLabelRenderer>
        </>
    );
}
