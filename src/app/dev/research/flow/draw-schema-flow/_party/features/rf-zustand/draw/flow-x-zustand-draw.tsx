'use client';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

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
    reconnectEdge,
    type ColorMode,
    type Node,
    type Edge,
    type Connection,
    type NodeTypes,
    type EdgeTypes,
    type ReactFlowInstance,
    type ReactFlowJsonObject,
    type ReactFlowProps,
    type NodeOrigin,
    type OnNodesChange,
    type OnEdgesChange,
    type OnConnectStartParams,
    type FinalConnectionState,
    type HandleType,
    type OnReconnect,
} from '@xyflow/react';

import { selectorDraw, shallow, useDrawStore } from '../../../state/draw-store';

import { PanelTopRight } from './panel-top-right';
import { PanelBotom } from './panel-botom';
import { ContextMenuNode, type StateNodeContectMenu } from './context-menu-node';
import { ContextMenuEdge, type StateEdgeContectMenu } from './context-menu-edge';
// import { useReactFlow } from '../../../hooks/react-flow';

import { Button } from '@/components/ui/button';
import { DevTools } from '../../../components/devtools';
import { BaseFlow, type RFProps } from '../../../components/flow/rf-base';
import { CustomEdgeType, CustomNodeType } from '../../../components/flow/custom-types';

const nodeOrigin: NodeOrigin = [0.5, 0.5];

export function FlowXZustandDraw() {
    // whenever you use multiple values, you should use shallow for making sure that the component only re-renders when one of the values change
    const {
        nodes,
        edges,
        setEdges,
        getNodesSeleteds,
        /* setNodes, */
        onNodesChange,
        onEdgesChange,
        setNodes: setNodesKu,
        addNode,
        onConnect /* addChildNode */,
    } = useDrawStore(selectorDraw, shallow);
    const { getIntersectingNodes, setNodes, screenToFlowPosition } = useReactFlow();
    // const { nodes } = useDrawStore(selectorDraw);

    const flowRef = useRef<HTMLDivElement | null>(null);
    const contextMenuNodeRef = useRef<HTMLDivElement | null>(null);
    const contextMenuEdgeRef = useRef<HTMLDivElement | null>(null);
    const [rfInstance, setRfInstance] = useState<ReactFlowInstance<CustomNodeType, CustomEdgeType> | null>(null);
    const edgeReconnectSuccessful = useRef(true);
    const [isNodeContextMenuOpen, setIsNodeContextMenuOpen] = useState<StateNodeContectMenu>(null);
    const [isEdgeContextMenuOpen, setIsEdgeContextMenuOpen] = useState<StateEdgeContectMenu>(null);
    // const onNodeContextMenu = useCallback((event: React.MouseEvent<Element, MouseEvent>, node: Node) => {}, []);
    // const onPaneClick = useCallback((event: React.MouseEvent<Element, MouseEvent>) => {}, []);
    console.log('Flow X Zustand Draw RENDER !!!');
    // console.log({ nodes });
    // console.log('isNodeContextMenuOpen', isNodeContextMenuOpen);

    const onReconnectStart = useCallback((evnt: React.MouseEvent<Element, MouseEvent>, edge: CustomEdgeType, handle: HandleType) => {
        edgeReconnectSuccessful.current = false;
    }, []);

    const OnReconnect = useCallback(
        (oldEdge: CustomEdgeType, newConnection: Connection) => {
            edgeReconnectSuccessful.current = true;
            setEdges(reconnectEdge(oldEdge, newConnection, edges));
        },
        [edges, setEdges]
    );

    const OnReconnectEnd = useCallback(
        (eevnt: MouseEvent | TouchEvent, edge: CustomEdgeType, handle: HandleType) => {
            if (!edgeReconnectSuccessful.current) {
                setEdges(edges.filter((e) => e.id !== edge.id));
            }
            edgeReconnectSuccessful.current = true;
        },
        [edges, setEdges]
    );

    const onNodeContextMenu = useCallback(
        (event: React.MouseEvent<Element, MouseEvent>, node: CustomNodeType) => {
            // Prevent native context menu from showing
            event.preventDefault();

            if (!flowRef.current) return;
            const { width: menuWidth, height: menuHeight } = contextMenuNodeRef.current?.getBoundingClientRect() || { width: 200, height: 200 };
            const pane = flowRef.current.getBoundingClientRect();
            const { clientX, clientY } = event.nativeEvent;

            // Calculate position of the context menu. We want to make sure it. doesn't get positioned off-screen.
            const { top, right, bottom, left } = getCalculatePositionContextMenu({ event, pane, menuHeight, menuWidth });

            setIsNodeContextMenuOpen({ id: node.id, top, right, bottom, left });
        },
        [setIsNodeContextMenuOpen]
    );

    const onEdgeContextMenu = useCallback(
        (event: React.MouseEvent<Element, MouseEvent>, edge: CustomEdgeType) => {
            event.preventDefault();

            if (!flowRef.current) return;
            const { width: menuWidth, height: menuHeight } = contextMenuEdgeRef.current?.getBoundingClientRect() || { width: 200, height: 200 };
            const pane = flowRef.current.getBoundingClientRect();

            const { top, right, bottom, left } = getCalculatePositionContextMenu({ event, pane, menuHeight, menuWidth });

            setIsEdgeContextMenuOpen({ id: edge.id, top, left, right, bottom });
        },
        [setIsEdgeContextMenuOpen]
    );

    // Close the context menu if it's open whenever the window is clicked.
    const onPaneClick = useCallback(
        (event: React.MouseEvent<Element, MouseEvent>) => {
            // eslint-disable-next-line quotes
            const isMenu = (event.target as HTMLElement).closest("div[role='menu']")?.role;
            // eslint-disable-next-line quotes
            const isFormEditLabel = (event.target as HTMLElement).closest("div[aria-description='form-edit-label']");

            if (isMenu || isFormEditLabel) return; // avoid close context menu when user clicked inside context menu

            setIsNodeContextMenuOpen(null);
            setIsEdgeContextMenuOpen(null);
        },
        [setIsNodeContextMenuOpen, setIsEdgeContextMenuOpen]
    );

    const onNodeDragStop = useCallback(
        (e: React.MouseEvent<Element, MouseEvent>, node: CustomNodeType) => {
            e.preventDefault();
            // grouppingNode();
            function grouppingNode() {
                const intersections = getIntersectingNodes(node); // target intersections
                const intersection = intersections?.[0] as Node | undefined;
                const isTargetGroup = intersection?.id.toLocaleLowerCase().includes('group');

                const nodeSelecteds = getNodesSeleteds(); // source intersections (node selected / node dragged)
                const nodeSelected = nodeSelecteds?.[0] as CustomNodeType | undefined;
                const isSourceGroup = nodeSelected?.id.toLowerCase().includes('group');

                console.log('draggedstop', { intersection, nodeSelected, intersections: intersections.map((n) => n.id) });

                function ungrouping() {
                    setNodesKu((ns) => {
                        return ns.map((n) => {
                            if (n.id === nodeSelected?.id) {
                                return {
                                    ...n,
                                    parentId: undefined,
                                };
                            }
                            return n;
                        });
                    });
                }

                function groupping() {
                    setNodesKu((ns) => {
                        return ns.map((n) => {
                            if (n.id === nodeSelected?.id) {
                                return {
                                    ...n,
                                    parentId: intersection?.id,
                                    // expandParent: true,
                                    position: { x: (n.measured?.width ?? 0) / 2 + 10, y: (n.measured?.height ?? 0) / 2 + 10 },
                                };
                            }
                            return n;
                        });
                    });
                }

                // eslint-disable-next-line no-unreachable
                if (nodeSelected?.parentId === intersection?.id) {
                    return;
                } else if (nodeSelected?.parentId && intersections.some((n) => n.id === nodeSelected.parentId)) {
                    return;
                } else if (nodeSelected?.parentId && intersection === undefined) {
                    // ungroup
                    console.log('ungroup 1 runing', {
                        parr: nodeSelected?.parentId,
                        intersection,
                    });
                    ungrouping();
                } else if (isSourceGroup && intersection === undefined) {
                    // ungroup group
                    console.log('ungroup 2 group runing');
                    ungrouping();
                } else if (isSourceGroup) {
                    console.log('groupping 1 runing');
                    // avoid group nested group, because
                    // const myChild = nodes.filter((n) => n.parentId === nodeSelected?.id);

                    const target = intersections
                        // .filter((b) => !myChild.some((ak) => ak.id === b.id)) // is non my child
                        .filter((s) => s.id.toLowerCase().includes('group')); // is group

                    const idFirstTarget = target?.[0]?.id as string | undefined;

                    if (idFirstTarget && nodeSelected) {
                        console.log('groupping 1a runing');
                        setNodesKu((ns) => {
                            const isChild = ns.filter((n) => n.parentId === nodeSelected.id).some((n) => n.id === idFirstTarget);

                            return ns.map((n) => {
                                if (n.id === nodeSelected?.id && !isChild) {
                                    return {
                                        ...n,
                                        parentId: idFirstTarget,
                                        // expandParent: true,
                                        position: { x: (n.measured?.width ?? 0) / 2 + 10, y: (n.measured?.height ?? 0) / 2 + 10 },
                                    };
                                }
                                return n;
                            });
                        });
                    } else {
                        console.log('ungroup 3 group runing');
                        ungrouping();
                    }
                } else if (isTargetGroup && nodeSelected && intersection) {
                    // grouping
                    console.log('groupping 2 runing');
                    groupping();
                }
            }

            /*
        setNodesKu((ns) =>
            ns.map((n) => ({
                ...n,
                className: intersections.map((n) => n.id).includes(n.id) ? 'highlight' : '',
            }))
        );
        */
        },
        [getIntersectingNodes, getNodesSeleteds, setNodesKu]
    );

    console.log('FlowXZustandDraw', { nodes, edges });

    return (
        <BaseFlow
            ref={flowRef}
            onInit={setRfInstance}
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onNodesDelete={(n) => {}}
            onEdgesChange={onEdgesChange}
            onEdgesDelete={(n) => {}}
            onNodeContextMenu={onNodeContextMenu}
            onEdgeContextMenu={onEdgeContextMenu}
            onPaneClick={onPaneClick}
            // onNodeDrag={onNodeDrag}
            onNodeDragStop={onNodeDragStop}
            onResize={(e) => {}}
            onResizeCapture={(e) => {}}
            onConnect={onConnect}
            onReconnect={OnReconnect}
            onReconnectStart={onReconnectStart}
            onReconnectEnd={OnReconnectEnd}
            nodeOrigin={nodeOrigin}
            // onConnectStart={}
            // onConnectEnd={}
            // connectionLineStyle={connectionLineStyle}
            // defaultEdgeOptions={defaultEdgeOptions}
            // connectionLineType={ConnectionLineType.Straight}
            fitView
        >
            <DevTools
                isChangeLoggerActive={false}
                isNodeInspectorActive={false}
            />

            <Panel position="top-right">
                {/* <PanelTopRight /> */}
                <div></div>
            </Panel>
            <Panel position="bottom-center">
                <PanelBotom />
                {/* <div></div> */}
            </Panel>
            <Background />
            <Controls />
            {isNodeContextMenuOpen && (
                <ContextMenuNode
                    ref={contextMenuNodeRef}
                    onClick={onPaneClick}
                    {...isNodeContextMenuOpen}
                />
            )}
            {isEdgeContextMenuOpen && (
                <ContextMenuEdge
                    ref={contextMenuEdgeRef}
                    onClick={onPaneClick}
                    {...isEdgeContextMenuOpen}
                />
            )}
        </BaseFlow>
    );
}

export function getCalculatePositionContextMenu({
    event,
    pane,
    menuHeight,
    menuWidth,
}: {
    /** This event handler is called when a user right clicks on a node */
    event: React.MouseEvent<Element, MouseEvent>;
    /** Allows getting a ref for the react flow instance */
    pane: DOMRect;
    /** width element context menu */
    menuWidth: number;
    /** height element context menu */
    menuHeight: number;
}) {
    return {
        /** punya paga
        top: event.clientY < pane.height - 25 ? event.clientY - pane.top : undefined,
        left: event.clientX < pane.width - 25 ? event.clientX - pane.left : undefined,
        right: event.clientX >= pane.width - 25 ? pane.width - event.clientX : undefined,
        bottom: event.clientY >= pane.height - 25 ? pane.height - event.clientY : undefined,
        */

        /** punya official */
        top: event.clientY < pane.height - menuHeight ? event.clientY - pane.top : undefined,
        left: event.clientX < pane.width - menuWidth ? event.clientX - pane.left : undefined,
        right: event.clientX >= pane.width - menuWidth ? pane.width - event.clientX : undefined,
        bottom: event.clientY >= pane.height - menuHeight ? (pane.height - event.clientY < 0 ? 0 : pane.height - event.clientY) : undefined,
    };
}

function PanelTopLeft() {
    return (
        <Panel position="top-left">
            <div className="bg-green-500">
                <Button
                    size="sm"
                    className="h-7"
                    onClick={() => {
                        const newNode = {
                            // id: `${nodes.length + 1}-new-data`,
                            // type: 'CardCommited',
                            type: 'Shape',
                            data: { message: 'ayaya', text: 'group file', theme: 'red', shapeType: 'circle' },
                            position: { x: 0, y: 0 },
                        };
                        /*  setNodes((prevs) => {
                                    return [...prevs, newNode];
                                }); */
                        // addNode(newNode);
                    }}
                >
                    Add comitted non group
                </Button>
            </div>
        </Panel>
    );
}
