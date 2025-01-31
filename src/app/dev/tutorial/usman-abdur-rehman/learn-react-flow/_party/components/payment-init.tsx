'use client';
import { Handle, Position, type Node, type NodeProps } from '@xyflow/react';
import type { NodeBase } from '@xyflow/system';

type PaymentInitProps = Node<{ amount: number }, 'number'>;

export function PaymentInit({ data }: NodeProps<PaymentInitProps>) {
    return (
        <div className="rounded text-xs border bg-muted-foreground text-background border-purple-700 ">
            <h2 className="bg-purple-600 px-1">Payment Initialized</h2>
            <div className="px-2 py-2">$ {data.amount}</div>
            <Handle
                className="!size-3"
                type="source"
                style={{ backgroundColor: 'green' }}
                position={Position.Right}
            />
        </div>
    );
}
