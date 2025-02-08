'use client';

import { Handle, Position, NodeResizer, type Node, type NodeProps, useUpdateNodeInternals } from '@xyflow/react';

import { cn } from '@/lib/classnames';
// import { CustomHandle } from './custom-handle';

import { selectorDraw, shallow, useDrawStore } from '../../state/draw-store';
import { BaseShape, baseShapeVariantsSchema, type BaseShapeVariants } from '../base-shape';
import { NodeVariants } from './custom-types';
import { PartiallyRequired } from '@/types/utilities';
import { z } from 'zod';
import { useEffect, useState } from 'react';
import a from '~/cli';

type OOOO = keyof typeof Position;
type Direction = (typeof Position)[keyof typeof Position];
export const positions = ['top', 'right', 'bottom', 'left'] as const;
const positionEnum = z.nativeEnum(Position);
const posEnum = z.enum(positions);
export type PostEnum = z.infer<typeof posEnum>;
type FruitEnum = z.infer<typeof positionEnum>; // Fruits

/**********************************************************************
 *                           Schema & Types                           *
 **********************************************************************/
export const nodeShapeDataSchema = z.object({
    text: z.string(),
    theme: baseShapeVariantsSchema.shape.theme,
    shapeType: baseShapeVariantsSchema.shape.shapeType,
    positionHandle: z.object({
        source: posEnum,
        target: posEnum,
    }),
});
// .merge(baseShapeVariantsSchema);
type OOP = keyof typeof nodeShapeDataSchema.shape.positionHandle.shape;

// export const nodeShapeDataSchema = baseShapeVariantsSchema.extend({ text: z.string() });

export type NodeShapeData = z.infer<typeof nodeShapeDataSchema>;

export type _NodeShapeData = BaseShapeVariants & { text: string };

export type NodeShapeProps = PartiallyRequired<Node<NodeShapeData, 'NodeShape'>, 'type'>;

export type DataShape = NodeShapeProps['data'];

/**********************************************************************
 *                           Main Component                           *
 **********************************************************************/

export function NodeShape({ ...props }: NodeProps<NodeShapeProps>) {
    const { updateNodeData } = useDrawStore(selectorDraw, shallow);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const updateNodeInternals = useUpdateNodeInternals();
    useEffect(() => {
        updateNodeInternals(props.id);
    }, [props.data.positionHandle.source, props.data.positionHandle.target, props.id, updateNodeInternals]);

    const {
        id,
        width,
        height,
        selected,
        type,
        data: { theme, shapeType, text, positionHandle },
    } = props;

    return (
        <>
            <NodeResizer
                color="#ff0071"
                isVisible={selected}
                minWidth={30}
                minHeight={30}
                onResize={(e, p) => {
                    console.log('NodeResizer onResize', { e, p });
                }}
            />
            <BaseShape
                theme={theme}
                shapeType={shapeType}
                className={cn(
                    'text-xs _py-2 _px-2 _rounded-lg min-h-[30px] min-w-[30px]  h-full w-full border-0 shadow-sm flex justify-center items-center',
                    selected && '_border-red-600'
                )}
                style={{
                    opacity: selected ? 1 : 0.95,
                }}
            >
                <div className="min-h-[20px] min-w-0 w-full _max-w-fit max-h-fit relative">
                    <div className={cn('h-full w-full text-center', isEditing === true && 'opacity-0')}>
                        {text.split('\n').map((t) => (
                            <p
                                key={t}
                                className="text-center text-white leading-tight"
                            >
                                {t}
                            </p>
                        ))}
                    </div>
                    <textarea
                        className={cn(
                            'nodrag nopan h-full resize-none w-full inset-0 text-foreground absolute opacity-0  nodrag text-center bg-transparent focus:outline-0 focus:outline-transparent focus-visible::outline-0 focus-visible::outline-transparent',
                            isEditing === true && 'opacity-100'
                        )}
                        style={{ pointerEvents: 'all' }}
                        name="shape-text"
                        defaultValue={text}
                        minLength={1}
                        // style={{ height: 17 }}
                        onFocus={() => setIsEditing(true)}
                        onChange={(e) => {
                            console.log(e.target.value.split('\n'));
                        }}
                        onBlur={(e) => {
                            setIsEditing(false);
                            updateNodeData<'NodeShape'>(id, { text: e.target.value });
                        }}
                    />
                </div>

                {/* <CustomHandle
                type="target"
                position={Position.Bottom}
            /> */}
            </BaseShape>
            <HandleSource position={positionHandle.source} />
            <Handle
                className="!size-3"
                type="target"
                style={{ backgroundColor: 'yellow', zIndex: 1 }}
                position={positionHandle.target as Position /* Position.Left */}
            />
        </>
    );
}

function HandleSource({ position }: { position: PostEnum }) {
    return (
        <Handle
            className="!size-3"
            type="source"
            style={{ backgroundColor: 'green', zIndex: 1 }}
            position={position as Position /* Position.Right */}
        />
    );
}
