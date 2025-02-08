import React, { useCallback, useState } from 'react';
import { Handle, Position, /* useReactFlow, */ type Node, type NodeProps } from '@xyflow/react';
import { Input } from '@/components/ui/input';
import { PartiallyRequired } from '@/types/utilities';
import { useReactFlow } from '../../hooks/react-flow';

export type NodeComputingcolorNumberInputData = { label: string; value: number };

export type NodeComputingcolorNumberInputProps = PartiallyRequired<Node<NodeComputingcolorNumberInputData, 'NodeComputingcolorNumberInput'>, 'type'>;

export function NodeComputingcolorNumberInput({ id, data }: NodeProps<NodeComputingcolorNumberInputProps>) {
    const { updateNodeData } = useReactFlow();
    const [number, setNumber] = useState(data.value);

    const handleInputOnChange = useCallback(
        (evt: React.ChangeEvent<HTMLInputElement>) => {
            const cappedNumber = Math.min(255, Math.max(0, Number(evt.target.value)));
            setNumber(cappedNumber);
            //@ts-expect-error
            updateNodeData(id, { value: cappedNumber });
        },
        [id, updateNodeData]
    );

    return (
        <div className="__number-input p-[10px] border rounded-md bg-foreground text-background">
            <h3>{data.label}</h3>
            <div className="flex gap-x-2">
                <input
                    id={`number-${id}`}
                    name="number"
                    type="range"
                    step={10}
                    min="0"
                    max="255"
                    onChange={handleInputOnChange}
                    className="nodrag block"
                    value={number}
                />
                <span
                    className="block"
                    style={{ fontSize: '10px', width: '20px' }}
                >
                    {number}
                </span>
            </div>
            <Handle
                type="source"
                position={Position.Right}
            />
        </div>
    );
}
