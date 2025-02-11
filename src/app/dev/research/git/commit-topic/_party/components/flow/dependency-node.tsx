import { Handle, Position, useHandleConnections, useReactFlow, type Node, type NodeProps } from '@xyflow/react';
import { XIcon } from 'lucide-react';

import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { cn } from '@/lib/classnames';

import { deleteDependency, updateDependency, type Dependency } from '../../state/commit-topic-collection-slice';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ButtonCopy } from '@/components/ui/custom/button-copy';

export type DependencyNodeProps = Node<Dependency, 'dependency-node'>;

export function DependencyNode({ id, data, sourcePosition }: NodeProps<DependencyNodeProps>) {
    const { setEdges, setNodes, updateNodeData } = useReactFlow();
    const connections = useHandleConnections({ type: 'source', nodeId: id });
    const dispatch = useAppDispatch();

    function handleDeleteDependency() {
        const idsEdge = connections.map((conn) => conn.edgeId);
        // delete node and edge on state react flow to update UI
        setEdges((edges) => edges.filter((e) => !idsEdge.some((e1) => e.id === e1)));
        setNodes((nodes) => nodes.filter((n) => n.id !== id));

        // delete data dependency on redux, but not deleted on store indexeddb (until resync button will pressed)
        dispatch(deleteDependency({ depedencyId: id }));
    }

    function handleUpdateDependency(state: boolean) {
        updateNodeData(id, {
            ...data,
            isNew: state,
        });
        dispatch(
            updateDependency({
                depedencyId: id,
                data: {
                    ...data,
                    isNew: state,
                },
            })
        );
    }

    return (
        <div
            title={data.title}
            className="text-xs border rounded-full flex items-center gap-2 p-2 bg-[#c2d5f0] dark:bg-[#416690]  min-w-[300px] w-[300px] max-w-[400px] overflow-hidden "
        >
            <div className="flex justify-center items-center p-1 border border-purple-500 rounded">
                <p className="leading-[0.75]">{connections.length}</p>
            </div>
            <div className="flex-1 overflow-hidden">
                <h2 className={cn('line-clamp-1 font-bold text-lg', data.isNew && 'text-green-500')}>{data.title}</h2>
            </div>
            <div className="flex gap-1">
                <Checkbox
                    checked={data.isNew}
                    title={`mark to ${data.isNew ? 'old' : 'new'}`}
                    className="nodrag"
                    onCheckedChange={(state) => handleUpdateDependency(Boolean(state))}
                />
                <ButtonCopy
                    title="copy name"
                    className="nodrag size-4 rounded-sm [&_svg]:size-3 [&_.btn-copy-icon-wrapper]:size-3"
                    data={data.title}
                />

                <Button
                    size="icon"
                    variant="destructive"
                    className="nodrag size-4 p-1 rounded-sm"
                    title="remove"
                    onClick={() => handleDeleteDependency()}
                >
                    <XIcon className="size-3" />
                </Button>
            </div>
            <Handle
                className="!size-[20px] !rounded-lg"
                type="source"
                style={{ backgroundColor: 'yellow' }}
                position={sourcePosition || Position.Left}
            />
            {/* <Handle
                className="!size-3"
                type="target"
                style={{ backgroundColor: 'green' }}
                position={Position.Right}
            /> */}
        </div>
    );
}
