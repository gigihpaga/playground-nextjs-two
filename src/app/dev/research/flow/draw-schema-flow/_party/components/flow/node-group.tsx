import { useCallback, useEffect, useState } from 'react';
import { Handle, Position, NodeResizer, type Node, type NodeProps, NodeToolbar, useReactFlow, useStore } from '@xyflow/react';
import { ArrowLeftFromLineIcon, FilePenLineIcon, Maximize2, SaveIcon } from 'lucide-react';
import { z } from 'zod';

import { PartiallyRequired } from '@/types/utilities';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { selectorDraw, shallow, useDrawStore } from '../../state/draw-store';

export const NodeGroupDataSchema = z.object({
    title: z.string(),
});

export type NodeGroupData = z.infer<typeof NodeGroupDataSchema>;

export type NodeGroupProps = PartiallyRequired<Node<NodeGroupData, 'NodeGroup'>, 'type'>;

export function NodeGroup({ id, data, selected }: NodeProps<NodeGroupProps>) {
    const { setNodes, getNode, getNodes } = useReactFlow();
    const { updateNodeData } = useDrawStore(selectorDraw, shallow);
    const [isEditMode, setIsEditMode] = useState<boolean>(false);
    const [dataFieldEditable, setDataFieldEditable] = useState(data);

    function handleFitChild() {
        const selfNode = getNode(id);
        const childNodes = getNodes().filter((node) => node.parentId === id);
        const maxDimensions = getMaxDimension(childNodes);
        console.log(maxDimensions);
        setNodes((prevs) => {
            return prevs.map((data) => {
                if (data.id === id) {
                    const wh = {
                        width: maxDimensions.maxWidth + maxDimensions.maxX + 150,
                        height: maxDimensions.maxHeight + maxDimensions.maxY + 150,
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

    function handleOnSave() {
        updateNodeData<'NodeGroup'>(id, {
            title: dataFieldEditable.title,
        });
        setIsEditMode(false);
    }

    function handleOnCancel() {
        setDataFieldEditable(data);
        setIsEditMode(false);
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
                minWidth={150}
                minHeight={150}
            />
            <div className="min-h-[150px] min-w-[150px] h-full w-full relative bg-[#ff007136] rounded-lg border border-dashed border-[#ff0071]">
                <div
                    style={{ fontSize: '10px' }}
                    className="absolute px-[5px] py-[3px] text-white bg-[#ff0071] rounded-t-sm text-nowrap -top-5 left-0"
                >
                    {isEditMode ? (
                        <Input
                            value={dataFieldEditable.title}
                            className="nodrag text-xs h-fit py-[2px] px-1"
                            onChange={(event) => setDataFieldEditable((prev) => ({ ...prev, title: event.target.value }))}
                        />
                    ) : (
                        <p>{data.title}</p>
                    )}
                </div>
            </div>
            <NodeToolbar
                isVisible={selected}
                position={Position.Top}
            >
                <div className="space-x-2">
                    <Button
                        size="icon"
                        className="h-fit w-fit p-[5px] text-xs"
                        onClick={() => handleFitChild()}
                        title="Fit child"
                    >
                        <Maximize2 className="size-4" />
                    </Button>
                    {isEditMode === false ? (
                        <Button
                            size="icon"
                            className="h-fit w-fit p-[5px] text-xs"
                            title="edit"
                            onClick={() => setIsEditMode(true)}
                        >
                            <FilePenLineIcon className="size-4" />
                        </Button>
                    ) : (
                        <>
                            <Button
                                size="icon"
                                className="h-fit w-fit p-[5px] text-xs"
                                title="save"
                                onClick={() => handleOnSave()}
                            >
                                <SaveIcon className="size-4" />
                            </Button>
                            <Button
                                size="icon"
                                className="h-fit w-fit p-[5px] text-xs"
                                title="cancel"
                                onClick={() => handleOnCancel()}
                            >
                                <ArrowLeftFromLineIcon className="size-4" />
                            </Button>
                        </>
                    )}
                    {process.env.NODE_ENV === 'development' && (
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
                    )}
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
