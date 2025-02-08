'use client';

import React, { useCallback, useMemo, useRef, useState } from 'react';
import { useTheme } from 'next-themes';
import {
    ReactFlowProvider,
    Background,
    Controls,
    MiniMap,
    ReactFlow,
    Panel,
    addEdge,
    MarkerType,
    Position,
    useEdgesState,
    useNodesState,
    useStore,
    useStoreApi,
    useReactFlow,
} from '@xyflow/react';
import type { ColorMode, Node, Edge, Connection, NodeTypes, EdgeTypes, ReactFlowInstance, ReactFlowJsonObject } from '@xyflow/react';

import type { UntrackedAndModifiedFile } from '@/server/git-command';
import { initialEdges, initialNodes } from './constants';

import { CreateCommitedDialog } from './features';
import { CardFile, CardGroup, CardCommited, CustomEdge, CustomHandle, ContextMenuNodeShadcn, ContextMenuNode } from './components/flow';
import { Button } from '@/components/ui/button';

export function App({ files }: { files: UntrackedAndModifiedFile[] }) {
    return (
        <section className="container py-2 border rounded-lg">
            <ReactFlowProvider>
                <Flow files={files} />
            </ReactFlowProvider>
        </section>
    );
}

const flowKey = 'git-stagging-flow';

const nodeTypes: NodeTypes = {
    'CardFile': CardFile,
    'CardGroup': CardGroup,
    'CardCommited': CardCommited,
};

const edgeTypes: EdgeTypes = {
    'CustomEdge': CustomEdge,
};

export type StateNodeContectMenu = {
    id: string;
    top: number | undefined;
    left: number | undefined;
    right: number | undefined;
    bottom: number | undefined;
} | null;

function Flow({ files }: { files: UntrackedAndModifiedFile[] }) {
    const nextTheme = useTheme();

    const filesMemo = useMemo(() => {
        const filesNode: Node[] = files.slice(1, 3).map((files, idx) => {
            return {
                id: `${initialNodes.length + (idx + 1)}-` + files.path.replaceAll('/', '*'),
                position: { x: 0, y: (25 + 10) * idx },
                data: { path: files.path, status: files.status },
                type: 'CardFile',
                draggable: false,
                parentId: '1-group-file',
                extent: 'parent',
                className: '[&>*:first-child]:!bg-blue-100',
            };
        });
        return filesNode;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const flowRef = useRef<HTMLDivElement | null>(null);

    const [nodes, setNodes, onNodesChange] = useNodesState([...initialNodes, ...filesMemo]);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null);
    // const { addNodes, setNodes, getNode, getNodes ,setEdges,} = useReactFlow();

    const [isNodeContectMenuOpen, setIsNodeContectMenuOpen] = useState<StateNodeContectMenu>(null);

    const onConnect = useCallback(
        (connection: Connection) => {
            const edge: Edge = {
                ...connection,
                animated: true,
                id: `${connection.source}__${connection.target}`,
                type: 'CustomEdge',
                markerEnd: {
                    type: MarkerType.ArrowClosed,
                    width: 12,
                    height: 12,
                    color: '#88ff00',
                },
            };
            setEdges((prev) => addEdge(edge, prev));
        },
        [setEdges]
    );

    const onNodeContextMenu = useCallback(
        (event: React.MouseEvent<Element, MouseEvent>, node: Node) => {
            // Prevent native context menu from showing
            event.preventDefault();

            // Calculate position of the context menu. We want to make sure it
            // doesn't get positioned off-screen.
            if (!flowRef.current) return;
            const pane = flowRef.current.getBoundingClientRect();
            const { clientX, clientY } = event.nativeEvent;
            // console.log({ pane, clientX, clientY });
            console.log({ event });
            setIsNodeContectMenuOpen({
                id: node.id,
                top: event.clientY < pane.height - 25 ? event.clientY - pane.top : undefined,
                left: event.clientX < pane.width - 25 ? event.clientX - pane.left : undefined,
                right: event.clientX >= pane.width - 25 ? pane.width - event.clientX : undefined,
                bottom: event.clientY >= pane.height - 25 ? pane.height - event.clientY : undefined,
                /*
                 */
                // top: event.clientY < pane.height && event.clientY,
                // top: clientY - pane.top,
                // left: event.clientX < pane.width && event.clientX,
                // left: clientX - pane.left,
                // right: event.clientX >= pane.width && pane.width - event.clientX,
                // bottom: event.clientY >= pane.height && pane.height - event.clientY,
            });
        },
        [setIsNodeContectMenuOpen]
    );

    // Close the context menu if it's open whenever the window is clicked.
    const onPaneClick = useCallback((event: React.MouseEvent<Element, MouseEvent>) => setIsNodeContectMenuOpen(null), [setIsNodeContectMenuOpen]);

    console.log('Flow RENDER');

    return (
        <div
            className="border text-foreground dark:text-background"
            style={{ height: '70vh' /* width: '50vw' */ }}
            aria-description="react flow wrapper"
        >
            <ReactFlow
                ref={flowRef}
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onInit={setRfInstance}
                onNodeContextMenu={onNodeContextMenu}
                onPaneClick={onPaneClick}
                colorMode={nextTheme.theme as ColorMode | undefined}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
                minZoom={0.001}
                maxZoom={4}
                fitView
            >
                <Panel>
                    <div className="bg-background flex gap-x-2">
                        <CreateCommitedDialog setNodes2={setNodes} />
                        {/* Add comitted 2 */}
                        <Button
                            size="sm"
                            className="h-7 hidden"
                            onClick={() => {
                                const GROUP_ID = '1-group-c';
                                setNodes((prevs) => {
                                    return [
                                        ...prevs,
                                        {
                                            id: `${nodes.length + 1}-new-data`,
                                            data: { message: 'yuhuuuuuuuuuuuuuuuuu' },
                                            type: 'CardCommited',
                                            // position: { x: nodeGroup.position.x + 10, y: nodeGroup.position.y + 10 },
                                            position: { x: 0, y: 0 },
                                            parentId: GROUP_ID,
                                            extent: 'parent',
                                        },
                                    ];
                                });
                            }}
                        >
                            Add comitted 2
                        </Button>
                        {/* Add comitted non group */}
                        <Button
                            size="sm"
                            className="h-7"
                            onClick={() => {
                                setNodes((prevs) => {
                                    return [
                                        ...prevs,
                                        {
                                            id: `${nodes.length + 1}-new-data`,
                                            data: { message: 'ayaya' },
                                            type: 'CardCommited',
                                            position: { x: 0, y: 0 },
                                        },
                                    ];
                                });
                            }}
                        >
                            Add comitted non group
                        </Button>
                        <Checking />
                        <SaveRestore
                            rfInstance={rfInstance}
                            setNodes={setNodes}
                        />
                    </div>
                </Panel>
                <Background />
                <Controls />
                {isNodeContectMenuOpen && (
                    <ContextMenuNode
                        onClick={onPaneClick}
                        {...isNodeContectMenuOpen}
                    />
                )}
            </ReactFlow>
        </div>
    );
}

function Checking() {
    const { addNodes, setNodes, getNode, getNodes, getEdges } = useReactFlow();
    return (
        <>
            <Button
                size="sm"
                className="h-7"
                onClick={() => {
                    const allNodes = getNodes();
                    const allEdges = getEdges();
                    console.log({ allNodes, allEdges });
                }}
            >
                check
            </Button>
            {/* add group */}
            <Button
                size="sm"
                className="h-7 hidden"
                onClick={() => {
                    const allNodes = getNodes();
                    addNodes({
                        id: `${allNodes.length + 1}-group-c`,
                        type: 'CardGroup',
                        data: { name: 'group file' },
                        position: { x: 0, y: 0 },
                        style: {
                            width: 170,
                            height: 140,
                            background: '#fff',
                            border: '1px solid black',
                            borderRadius: 15,
                            fontSize: 12,
                        },
                    });
                }}
            >
                add group
            </Button>
            {/* order node */}
            <Button
                size="sm"
                className="h-7 hidden"
                onClick={() => {
                    setNodes((prevs) => {
                        const sortedArr = prevs.reduce((acc, current) => {
                            const currentId = parseInt(current.id.split('-')[0]);

                            // Find the correct position to insert the current element
                            const index = acc.findIndex((item) => parseInt(item.id.split('-')[0]) > currentId);

                            if (index === -1) {
                                // If no larger element is found, push to the end
                                acc.push(current);
                            } else {
                                // Otherwise, insert at the found index
                                acc.splice(index, 0, current);
                            }

                            return acc;
                        }, [] as Node[]);

                        return sortedArr;
                    });
                }}
            >
                order node
            </Button>
        </>
    );
}

type SaveRestoreProps = {
    rfInstance: null | ReactFlowInstance;
    setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
};

function SaveRestore({ rfInstance, setNodes }: SaveRestoreProps) {
    /**
     * jika aplikasi flow ada nesting (Sub Flows),
     * harus menggunakan setNodes() dari useNodesState(),
     * kalo menggunakan setNodes() dari useReactFlow() akan ada error, "parrentId not found"
     *
     * itu terjadi karena instance yang berbeda, jadi nilai nodes akan berbeda juga
     * useReactFlow() digunakan untuk "uncontrolled" flow, digunakan bersama <ReactFlowProvider/>
     * useNodesState() digunakan untuk "controlled" flow, cukup digunakan bersama <ReactFlow/>
     */
    const { setViewport, setNodes: _setNodes, setEdges } = useReactFlow();

    const onSave = useCallback(() => {
        if (rfInstance) {
            const flow = rfInstance.toObject();
            localStorage.setItem(flowKey, JSON.stringify(flow));
        }
    }, [rfInstance]);

    const onRestore = useCallback(() => {
        const restoreFlow = async () => {
            const flowStorage = localStorage.getItem(flowKey);
            if (flowStorage) {
                const flow = JSON.parse(flowStorage) as ReactFlowJsonObject<Node, Edge>;
                const { x = 0, y = 0, zoom = 1 } = flow.viewport;
                setNodes(flow.nodes || []);
                setEdges(flow.edges || []);
                setViewport({ x, y, zoom });
            }
        };

        restoreFlow();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [setNodes, setViewport]);
    return (
        <>
            <Button
                size="sm"
                className="h-7"
                onClick={() => onSave()}
            >
                save
            </Button>
            <Button
                size="sm"
                className="h-7"
                onClick={() => onRestore()}
            >
                restore
            </Button>
        </>
    );
}
