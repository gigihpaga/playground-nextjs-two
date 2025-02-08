import React, { useCallback } from 'react';
import { useReactFlow } from '@xyflow/react';
import { type StateNodeContectMenu } from '../../app';
import { Button } from '@/components/ui/button';
import { CopyIcon, DeleteIcon } from 'lucide-react';

type ContextMenuNodeProps = StateNodeContectMenu & {
    onClick: (event: React.MouseEvent<Element, MouseEvent>) => void;
};

export function ContextMenuNode({ id, top, left, right, bottom, onClick }: ContextMenuNodeProps) {
    const { getNode, setNodes, addNodes, setEdges } = useReactFlow();

    const handleDuplicateNode = useCallback(() => {
        const node = getNode(id);
        if (!node) return;
        const position = {
            x: node.position.x + 50,
            y: node.position.y + 50,
        };

        addNodes({
            ...node,
            selected: false,
            dragging: false,
            id: `${node.id}-copy`,
            position,
        });
    }, [id, getNode, addNodes]);

    const handleDeleteNode = useCallback(() => {
        setNodes((nodes) => nodes.filter((node) => node.id !== id));
        setEdges((edges) => edges.filter((edge) => edge.source !== id));
    }, [id, setNodes, setEdges]);

    return (
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
        <div
            style={{ top, left, right, bottom }}
            className="context-menu bg-background border shadow-lg absolute z-50 flex flex-col min-w-[8rem] rounded-md p-1 gap-y-1 text-foreground"
            onClick={onClick}
            // aria-description="context menu node"
            role="menu"
            tabIndex={-1}
        >
            <p className="py-1 px-2">
                <small>node: {id}</small>
            </p>
            <Button
                size="sm"
                variant="ghost"
                className="h-fit py-1 justify-between"
                onClick={handleDuplicateNode}
            >
                duplicate
                <CopyIcon className="size-3" />
            </Button>
            <Button
                size="sm"
                className="h-fit py-1 justify-between"
                variant="ghost"
                onClick={handleDeleteNode}
            >
                delete
                <DeleteIcon className="size-3" />
            </Button>
        </div>
    );
}
