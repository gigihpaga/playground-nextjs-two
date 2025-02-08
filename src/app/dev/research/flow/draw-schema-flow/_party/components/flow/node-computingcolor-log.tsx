import { PartiallyRequired } from '@/types/utilities';
import { Handle, useHandleConnections, useNodesData, Position, type Node, type NodeProps } from '@xyflow/react';

export type NodeComputingcolorLogData = {
    fontColor: string; // "black" || "white"
    label: string; // "Use black font" || Use white font
};

export type NodeComputingcolorLogProps = PartiallyRequired<Node<NodeComputingcolorLogData, 'NodeComputingcolorLog'>, 'type'>;

export function NodeComputingcolorLog({ data }: NodeProps<NodeComputingcolorLogProps>) {
    /**
     * connections
     * {
        edgeId: 'lightness-log-2',
        source: 'lightness',
        target: 'log-2',
        sourceHandle: 'dark',
        targetHandle: null,
    };
     */
    const connections = useHandleConnections({ type: 'target' });

    const nodeData = useNodesData(connections?.[0]?.source);

    const color = connections?.[0]?.sourceHandle && nodeData?.data ? nodeData.data[connections[0].sourceHandle] : null;

    const isValidColor = color instanceof Object && 'r' in color && 'g' in color && 'b' in color;

    // console.log('NodeComputingcolorLog data', data);
    // console.log('NodeComputingcolorLog color', color);
    // console.log('NodeComputingcolorLog nodeData', nodeData);
    // console.log('NodeComputingcolorLog connections', JSON.stringify(connections[0]));
    return (
        <div
            className="__log-node size-[80px] break-words p-[5px] font-bold flex items-center justify-center rounded-md border"
            style={{
                background: isValidColor ? `rgb(${color.r}, ${color.g}, ${color.b})` : 'white',
                color: color ? data.fontColor : 'black',
            }}
        >
            {color ? data.label : 'Do nothing'}
            <Handle
                type="target"
                position={Position.Left}
            />
        </div>
    );
}
