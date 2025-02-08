import React, { useEffect } from 'react';
import {
    Handle,
    Position,
    useHandleConnections,
    useNodesData,
    useReactFlow,
    type Node,
    type NodeProps,
    type HandleProps,
    type NodeTypes,
} from '@xyflow/react';
import { cn } from '@/lib/classnames';
import { nodeTypes, edgeTypes, type CustomEdgeType, SelectCustomNode } from './custom-types';
import type { PartiallyRequired } from '@/types/utilities';
// import { useReactFlow } from '../hooks/react-flow';

export type NodeComputingcolorColorpreviewData = {
    label: string; // Color
    value: {
        r: number;
        g: number;
        b: number;
    };
};

export type NodeComputingcolorColorpreviewProps = PartiallyRequired<
    Node<NodeComputingcolorColorpreviewData, 'NodeComputingcolorColorpreview'>,
    'type'
>;

export function NodeComputingcolorColorpreview({ id, data }: NodeProps<NodeComputingcolorColorpreviewProps>) {
    const { updateNodeData } = useReactFlow<NodeComputingcolorColorpreviewProps>();

    // console.log('NodeComputingcolorColorpreview data', data);

    return (
        <div
            className="_node h-[150px]  w-[150px] flex flex-col justify-around rounded-lg border"
            style={{
                background: data.value ? `rgb(${data.value.r}, ${data.value.g}, ${data.value.b})` : 'rgb(0, 0, 0)',
            }}
        >
            <h2 className="text-xs absolute top-[50%] -translate-x-1/2 -translate-y-1/2 left-[50%] font-bold">{data.label}</h2>
            <CustomHandle
                id="red"
                label="R"
                className=""
                onChangeAHAH={(value) => {
                    // console.log('NodeComputingcolorColorpreview value', value);
                    updateNodeData(id, (node) => {
                        return { value: { ...node.data.value, r: value } };
                    });
                }}
            />
            <CustomHandle
                id="green"
                label="G"
                onChangeAHAH={(value) => {
                    updateNodeData(id, (node) => {
                        return { value: { ...node.data.value, g: value } };
                    });
                }}
            />
            <CustomHandle
                id="blue"
                label="B"
                onChangeAHAH={(value) => {
                    updateNodeData(id, (node) => {
                        return { value: { ...node.data.value, b: value } };
                    });
                }}
            />
            <Handle
                type="source"
                position={Position.Right}
                id="output"
            />
        </div>
    );
}

type CustomHandleProps = Omit<React.ComponentPropsWithoutRef<typeof Handle>, 'type' | 'position'> & {
    label: React.LabelHTMLAttributes<HTMLLabelElement>['children'];
    onChangeAHAH: (value: number) => void;
};

function CustomHandle({ id, label, className, onChangeAHAH, ...props }: Omit<CustomHandleProps, 'style'>) {
    const connections = useHandleConnections({ type: 'target', id });

    const nodeData = useNodesData(connections?.[0]?.source);

    function onChangeWOO(emboh: number | React.FormEvent<HTMLDivElement>) {
        console.log('emboh', emboh);
        if (typeof emboh === 'number') {
            onChangeAHAH(emboh);
        }
    }

    useEffect(() => {
        const badala = nodeData?.data?.value ? (nodeData.data.value as number) : 0;
        onChangeWOO(badala);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [nodeData]);

    return (
        <div className="relative">
            <Handle
                type="target"
                position={Position.Left}
                id={id}
                className={cn('__handle relative ', className)}
                onChange={(ev) => {
                    console.log('ev', typeof ev); // console log ini tidak pernah di panggil
                    onChangeWOO(ev);
                }}
                {...props}
            />
            <label
                htmlFor="red"
                className="label ml-1"
            >
                {label}
            </label>
        </div>
    );
}
