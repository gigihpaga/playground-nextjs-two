'use client';

import { useState, useEffect } from 'react';
import { Handle, Position, useHandleConnections, useNodesData, useReactFlow } from '@xyflow/react';
import type { NodeProps, Node } from '@xyflow/react';
import type { CustomNodeType, CustomEdgeType } from './custom-types';
import { NodeComputingcolorColorpreviewProps } from './node-computingcolor-colorpreview';
import { PartiallyRequired } from '@/types/utilities';

type IsLight = { light: { r: number; g: number; b: number }; dark: null };

type IsBlack = { light: null; dark: { r: number; g: number; b: number } };

export type NodeComputingcolorLightnessData = IsLight | IsBlack;

export type NodeComputingcolorLightnessProps = PartiallyRequired<Node<NodeComputingcolorLightnessData, 'NodeComputingcolorLightness'>, 'type'>;

export function NodeComputingcolorLightness({ type, id }: NodeProps<NodeComputingcolorLightnessProps>) {
    const { updateNodeData } = useReactFlow<CustomNodeType, CustomEdgeType>();

    /**
     * ```ts
     * const connection = {
     * edgeId : "color-preview-to-lightness",
     * source : "color-preview-000", // id component NodeComputingcolorColorpreviewProps
     * sourceHandle : null,
     * target : "lightness-000", // id component NodeComputingcolorLightness
     * targetHandle : null,
     * }
     * ```
     */
    const connections = useHandleConnections({ type: 'target' }); // mencari semua edge yang terhubung ke handle (type=target) pada component NodeComputingcolorLightness

    const nodesData = useNodesData<NodeComputingcolorColorpreviewProps>(connections?.[0]?.source); // mencari data berdasarkan nodeId = connection.source

    const [lightness, setLightness] = useState('dark');

    useEffect(() => {
        // Todo: perbaiki validasi dengan zod, karena disini butuh input dari node connection, yang sebenarnya input ke node ini bisa berupa apa aja
        if (nodesData && nodesData.data?.value) {
            const color = nodesData.data.value;
            const isLight = 0.2126 * color.r + 0.7152 * color.g + 0.0722 * color.b >= 128;
            setLightness(isLight ? 'light' : 'dark');

            const newNodeData = isLight ? { light: color, dark: null } : { light: null, dark: color };
            //@ts-expect-error
            updateNodeData(id, newNodeData); // update NodeComputingcolorLightness dari data NodeComputingcolorColorpreviewProps
        } else {
            setLightness('dark');
            //@ts-expect-error
            updateNodeData(id, { light: null, dark: { r: 0, g: 0, b: 0 } }); // update NodeComputingcolorLightness dari data NodeComputingcolorColorpreviewProps
        }
    }, [id, nodesData, updateNodeData]);

    return (
        <div
            className="__lightness-node w-[100px] h-[100px] flex flex-col items-end justify-center text-center rounded-lg border"
            style={{
                background: lightness === 'light' ? 'white' : 'black',
                color: lightness === 'light' ? 'black' : 'white',
            }}
        >
            <Handle
                type="target"
                position={Position.Left}
                // id="woo"
            />
            <h2 className="absolute top-[calc(50%-10px)] left-2 text-xs font-bold">Lightness</h2>
            <p style={{ position: 'absolute', top: 'calc(25% - 12px)', marginRight: 10 }}>Light</p>
            <Handle
                type="source"
                id="light"
                position={Position.Right}
                style={{ top: '25%' }}
            />
            <p style={{ position: 'absolute', top: 'calc(75% - 12px)', marginRight: 10 }}>Dark</p>
            <Handle
                type="source"
                id="dark"
                position={Position.Right}
                style={{ top: '75%' }}
            />
        </div>
    );
}
