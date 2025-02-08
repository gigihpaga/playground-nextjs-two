import { Button } from '@/components/ui/button';
import { Handle, Position, NodeResizer, type Node, type NodeProps, NodeToolbar, useReactFlow, useStore } from '@xyflow/react';
import { useCallback, useEffect } from 'react';

// type CardFileGroupProps = Node<Record<string, never>>;
type CardFileGroupProps = Node<{
    name: string;
}>;

export function CardGroup({ id, data, selected }: NodeProps<CardFileGroupProps>) {
    const { setNodes, getNode, getNodes } = useReactFlow();

    function handleFitChild() {
        const selfNode = getNode(id);
        const childNodes = getNodes().filter((node) => node.parentId === id);
        const maxDimensions = getMaxDimension(childNodes);
        setNodes((prevs) => {
            return prevs.map((data) => {
                if (data.id === id) {
                    const wh = {
                        width: maxDimensions.maxWidth + maxDimensions.maxX + 50,
                        height: maxDimensions.maxHeight + maxDimensions.maxY + 50,
                    } satisfies Node['measured'];
                    return {
                        ...data,
                        style: {
                            ...data.style,
                            ...wh,
                        },
                        measured: {
                            ...wh,
                        },
                        ...wh,
                    };
                }
                return data;
            });
        });
    }

    useEffect(() => {
        handleFitChild();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <NodeResizer
                color="#ff0071"
                isVisible={selected}
                minWidth={100}
                minHeight={30}
            />
            <div className="h-full w-full relative bg-[#ff007136] rounded-lg border border-dashed border-[#ff0071]">
                <div
                    style={{ fontSize: '10px' }}
                    className="absolute  px-[5px] py-[3px] text-white bg-[#ff0071]  text-nowrap -top-5 left-0"
                >
                    {data.name}
                </div>
            </div>
            <NodeToolbar
                isVisible={selected}
                position={Position.Top}
            >
                <div>
                    <Button
                        size="sm"
                        className="h-fit py-1 text-xs"
                        onClick={() => handleFitChild()}
                    >
                        Fit child
                    </Button>
                    <Button
                        size="sm"
                        className="h-fit py-1 text-xs"
                        onClick={() => {
                            const selfNode = getNode(id);
                            const childNodes = getNodes().filter((node) => node.parentId === id);
                            const maxDimensions = getMaxDimension(childNodes);
                            const allNodes = getNodes();
                            console.log({ selfNode, childNodes, maxDimensions, allNodes });
                        }}
                    >
                        check
                    </Button>
                </div>
            </NodeToolbar>
        </>
    );
}

function getMaxDimension(Nodes: Node[]) {
    const maxDimensions = Nodes.reduce(
        (max, current) => {
            return {
                // maxWidth: current.measured ? (current.measured.width ? Math.max(max.maxWidth, current.measured.width) : 0) : 0,
                maxWidth: isNaN(Number(current.measured?.width)) ? 0 : Math.max(max.maxWidth, Number(current.measured?.width)),
                maxHeight: isNaN(Number(current.measured?.height)) ? 0 : Math.max(max.maxHeight, Number(current.measured?.height)),
                maxX: Math.max(max.maxX, current.position.x),
                maxY: Math.max(max.maxY, current.position.y),
            };
        },
        { maxWidth: 0, maxHeight: 0, maxX: 0, maxY: 0 }
    );
    return maxDimensions;
}
