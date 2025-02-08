'use client';

import { CSSProperties } from 'react';
import { XIcon } from 'lucide-react';
import {
    BaseEdge,
    BezierEdge,
    EdgeLabelRenderer,
    getBezierPath,
    getStraightPath,
    getSmoothStepPath,
    useReactFlow,
    type EdgeProps,
    type Edge,
    MarkerType,
} from '@xyflow/react';
import { TypeOf, z } from 'zod';

import { PartiallyRequired } from '@/types/utilities';
import { Button } from '@/components/ui/button';

import { baseShapeVariantsSchema, themeInlineStyle } from '../base-shape';

export const LineTypeEnum = z.enum(['bezier', 'smoothstep', 'straight']);

export const LabelPositionEnum = z.enum([
    'top', // ⬆️
    'topRight', // ↗️
    'right', // ➡️
    'bottomRight', // ↘️
    'bottom', // ⬇️
    'bottomLeft', // ↙️
    'left', // ⬅️
    'topLeft', // ↖️
]);

const labPos: Record<z.infer<typeof LabelPositionEnum>, [`${number}%`, `${number}%`]> = {
    top: ['-50%', '-100%'], // ⬆️
    topRight: ['0%', '-100%'], // ↗️
    right: ['0%', '-50%'], // ➡️
    bottomRight: ['0%', '0%'], // ↘️
    bottom: ['-50%', '0%'], // ⬇️
    bottomLeft: ['-100%', '0%'], // ↙️
    left: ['-100%', '-50%'], // ⬅️
    topLeft: ['-100%', '-100%'], // ↖️
};

export type LineTypes = z.infer<typeof LineTypeEnum>;
const lineTypeArr = LineTypeEnum.options;

export const EdgeWithDeleteButton1DataSchema = z.object({
    lineType: LineTypeEnum.optional(),
    startLabel: z.string().optional(),
    startLabelPosition: LabelPositionEnum.optional(),
    endLabel: z.string().optional(),
    endLabelPosition: LabelPositionEnum.optional(),
    isShowDeleteButton: z.boolean().optional(),
    // theme: baseShapeVariantsSchema.pick({ theme: true }).shape.theme
    theme: baseShapeVariantsSchema.shape.theme,
});
// .merge(baseShapeVariantsSchema.pick({ theme: true }));

export type EdgeWithDeleteButton1Data = z.infer<typeof EdgeWithDeleteButton1DataSchema>;

export type EdgeWithDeleteButton1Props = PartiallyRequired<Edge<EdgeWithDeleteButton1Data, 'EdgeWithDeleteButton1'>, 'type'>;

export function EdgeWithDeleteButton1(props: EdgeProps<EdgeWithDeleteButton1Props>) {
    const { id, data, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition } = props;
    // const [edgePath, labelX, labelY, offsetX, offsetY] = getBezierPath({ sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition });
    // const [edgePath, labelX, labelY] = getStraightPath({ sourceX, sourceY, targetX, targetY });
    const [pathSmoothStep, labelXSmoothStep, labelYSmoothStep] = getSmoothStepPath({
        sourceX,
        sourceY,
        targetX,
        targetY,
        sourcePosition,
        targetPosition,
    });

    const [pathStraight, labelXStraight, labelYStraight] = getStraightPath({
        sourceX,
        sourceY,
        targetX,
        targetY,
    });

    const [pathBezier, labelXBezier, labelYBezier] = getBezierPath({
        sourceX,
        sourceY,
        targetX,
        targetY,
        sourcePosition,
        targetPosition,
    });

    const line = {
        path: data?.lineType === 'smoothstep' ? pathSmoothStep : data?.lineType === 'straight' ? pathStraight : pathBezier,
        labelX: data?.lineType === 'smoothstep' ? labelXSmoothStep : data?.lineType === 'straight' ? labelXStraight : labelXBezier,
        labelY: data?.lineType === 'smoothstep' ? labelYSmoothStep : data?.lineType === 'straight' ? labelYStraight : labelYBezier,
    };

    const { setEdges } = useReactFlow();

    return (
        <>
            <BaseEdge
                {...props}
                id={id}
                path={line.path}
                style={{
                    strokeWidth: 2,
                    stroke: props.selected ? '#7CD9FF' /* '#4227d8'  */ : themeInlineStyle[data?.theme ?? 'red'].colorC /* '#d82776' */,
                }}
            />

            {/* <BezierEdge {...props} /> */}

            {data?.isShowDeleteButton ? (
                <EdgeLabelRenderer>
                    <Button
                        size="icon"
                        variant="ghost"
                        className="nopan size-4 bg-background"
                        style={{
                            position: 'absolute',
                            pointerEvents: 'all',
                            zIndex: 21,
                            transform: `translate(-50%, -50%) translate(${line.labelX}px, ${line.labelY}px)`,
                        }}
                        onClick={() => {
                            setEdges((prevEdges) => prevEdges.filter((edge) => edge.id !== id));
                        }}
                    >
                        <XIcon className="size-3 text-destructive dark:text-red-600" />
                    </Button>
                </EdgeLabelRenderer>
            ) : null}

            <EdgeLabelRenderer>
                {data?.startLabel && (
                    <EdgeLabel
                        // transform={`translate(0%, -100%) translate(${sourceX}px,${sourceY}px)`}
                        transform={`translate(${labPos[data.startLabelPosition ?? 'topRight'].join(',')}) translate(${sourceX}px,${sourceY}px)`}
                        label={data.startLabel}
                    />
                )}
                {data?.endLabel && (
                    <EdgeLabel
                        // transform={`translate(-100%, 0%) translate(${targetX}px,${targetY}px)`}
                        transform={`translate(${labPos[data.endLabelPosition ?? 'bottomLeft'].join(',')}) translate(${targetX}px,${targetY}px)`}
                        label={data.endLabel}
                    />
                )}
            </EdgeLabelRenderer>
        </>
    );
}

// this is a little helper component to render the actual edge label
function EdgeLabel({ transform, label }: { transform: CSSProperties['transform']; label: string }) {
    return (
        <div
            style={{
                position: 'absolute',
                background: 'transparent',
                padding: 10,
                // color: '#ff5050',
                fontSize: 12,
                fontWeight: 700,
                transform,
                zIndex: 22,
            }}
            className="nodrag nopan text-foreground"
        >
            {label}
        </div>
    );
}
