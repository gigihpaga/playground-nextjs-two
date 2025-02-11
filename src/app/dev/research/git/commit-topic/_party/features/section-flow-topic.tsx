'use client';
import React, { use, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTheme } from 'next-themes';
import {
    BarChartBigIcon,
    CheckIcon,
    ChevronsUpDownIcon,
    ClipboardListIcon,
    DownloadIcon,
    FilePlus2Icon,
    FocusIcon,
    PlusCircleIcon,
    RefreshCcwIcon,
    SaveIcon,
    ScanIcon,
    SearchIcon,
    XCircleIcon,
    XIcon,
} from 'lucide-react';

import {
    Background,
    Controls,
    MiniMap,
    ReactFlow,
    Panel,
    addEdge,
    useEdgesState,
    useNodesState,
    MarkerType,
    useReactFlow,
    reconnectEdge,
} from '@xyflow/react';
import type { ColorMode, Node, Edge, Connection, NodeTypes, EdgeTypes, HandleType } from '@xyflow/react';

import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { cn } from '@/lib/classnames';

import {
    getAllTopics,
    addDependency,
    getAllDependencys,
    getWorkspaceTopicActive,
    deleteDependency,
    getWorkspaceTopic,
    getAllWorkspaceTopic,
    WorkspaceTopic,
} from '../state/commit-topic-collection-slice';

import {
    getWorkspace as getWorkspaceIdb,
    getAllWorkspace as getAllWorkspaceIdb,
    getAllWorkspaceSync as getAllWorkspaceSyncIdb,
    updateWorkspace as updateWorkspaceIdb,
    addOrUpdateWorkspace as addOrUpdateWorkspaceIdb,
} from '../state/commit-topic-flow-transaction';

// import { initialEdges, initialNodes } from './components/data-workflow';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from '@/components/ui/command';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { TopicNode } from './../components/flow/topic-node';
import { DependencyNode, DependencyNodeProps } from '../components/flow/dependency-node';
import { CustomEdge, EdgeCustomData, EdgeCustomProps } from '../components/flow/custom-edge';
import { getSyncReduxXIndexedDB, getSyncReduxXReactFlow } from '../utils/computed-flow';
import { DialogCreateDepedencyTopic } from './dialog-create-depedency-topic';
import { DialogListDepedencyTopic } from './dialog-list-depedency-topic';
import { DialogListDepedencyTopicGrouping } from './dialog-list-depedency-topic-grouping';
import { DialogListDepedencyMapper } from './dialog-list-depedency-mapper';
import { getCalculatePositionContextMenu } from '@/app/dev/research/flow/draw-schema-flow/_party/features/rf-zustand/draw/flow-x-zustand-draw';
import { ContextMenuNode, StateNodeContectMenu } from '../components/flow/context-menu-node';
import { ContextMenuEdge, StateEdgeContectMenu } from '../components/flow/context-menu-edge';

export type CustomeNodeTypes = keyof typeof nodeTypes;

export type DataDownload = {
    [workspaceId: WorkspaceTopic['id']]: {
        workspace: WorkspaceTopic;
        flow: { node: Node[]; edge: Edge[] };
    };
};

const nodeTypes = {
    'topic-node': TopicNode,
    'dependency-node': DependencyNode,
} satisfies NodeTypes;

export const edgeTypes = {
    'custom-edge': CustomEdge,
} satisfies EdgeTypes;

export function SectionFlowTopic() {
    // initStore();
    const nextTheme = useTheme();
    const topics = useAppSelector(getAllTopics);
    const dependencys = useAppSelector(getAllDependencys);
    const workspaceTopicActive = useAppSelector(getWorkspaceTopicActive);

    const [isLoading, setIsLoading] = useState(true);

    const flowRef = useRef<HTMLDivElement | null>(null);
    const contextMenuNodeRef = useRef<HTMLDivElement | null>(null);
    const contextMenuEdgeRef = useRef<HTMLDivElement | null>(null);
    const [isNodeContextMenuOpen, setIsNodeContextMenuOpen] = useState<StateNodeContectMenu>(null);
    const [isEdgeContextMenuOpen, setIsEdgeContextMenuOpen] = useState<StateEdgeContectMenu>(null);
    const [nodes, setNodes, onNodesChange] = useNodesState([] as Node[]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([] as Edge[]);
    const edgeReconnectSuccessful = useRef<boolean>(true);

    //* Connect
    const onConnect = useCallback(
        (connection: Connection) => {
            const edge: EdgeCustomProps = {
                ...connection,
                animated: true,
                id: `${connection.source}-${connection.target}`,
                type: 'custom-edge',
                data: { lineType: 'bezier' },
                markerEnd: {
                    type: MarkerType.ArrowClosed,
                },
            }; /* satisfies Connection & Edge */
            setEdges((prev) => addEdge(edge, prev));
        },
        [setEdges]
    );

    const onReconnectStart = useCallback((event: React.MouseEvent<Element, MouseEvent>, edge: Edge, handle: HandleType) => {
        edgeReconnectSuccessful.current = false;
    }, []);

    const onReconnect = useCallback(
        (oldEdge: Edge, newConnection: Connection) => {
            edgeReconnectSuccessful.current = true;
            setEdges((els) => reconnectEdge(oldEdge, newConnection, els));
        },
        [setEdges]
    );

    const onReconnectEnd = useCallback(
        (event: MouseEvent | TouchEvent, edge: Edge, handle: HandleType) => {
            if (!edgeReconnectSuccessful.current) {
                setEdges((eds) => eds.filter((e) => e.id !== edge.id));
            }
            edgeReconnectSuccessful.current = true;
        },
        [setEdges]
    );

    //*
    const onNodeContextMenu = useCallback(
        (event: React.MouseEvent<Element, MouseEvent>, node: Node) => {
            // Prevent native context menu from showing
            event.preventDefault();
            // console.log('onNodeContextMenu', 'flow', flowRef.current, 'menu node', contextMenuNodeRef.current);

            if (!flowRef.current) return;
            const { width: menuWidth, height: menuHeight } = contextMenuNodeRef.current?.getBoundingClientRect() || { width: 200, height: 200 };
            const pane = flowRef.current.getBoundingClientRect();
            const { clientX, clientY } = event.nativeEvent;

            // Calculate position of the context menu. We want to make sure it. doesn't get positioned off-screen.
            const { top, right, bottom, left } = getCalculatePositionContextMenu({ event, pane, menuHeight, menuWidth });
            console.log({ menuWidth, menuHeight });
            setIsNodeContextMenuOpen({ id: node.id, top, right, bottom, left });
        },
        [setIsNodeContextMenuOpen]
    );

    const onEdgeContextMenu = useCallback(
        (event: React.MouseEvent<Element, MouseEvent>, edge: Edge) => {
            // Prevent native context menu from showing
            event.preventDefault();

            if (!flowRef.current) return;
            const { width: menuWidth, height: menuHeight } = contextMenuEdgeRef.current?.getBoundingClientRect() || { width: 200, height: 200 };
            const pane = flowRef.current.getBoundingClientRect();
            const { clientX, clientY } = event.nativeEvent;

            // Calculate position of the context menu. We want to make sure it. doesn't get positioned off-screen.
            const { top, right, bottom, left } = getCalculatePositionContextMenu({ event, pane, menuHeight, menuWidth });

            setIsEdgeContextMenuOpen({ id: edge.id, top, right, bottom, left });
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
        [setIsNodeContextMenuOpen /*  setIsEdgeContextMenuOpen */]
    );

    useEffect(() => {
        console.log('useEffect start');
        if (!workspaceTopicActive) {
            console.error('reading node from redux and indexed db canceled because workspace topic id not selected');
            return;
        }
        setIsLoading(true);
        getAllWorkspaceSyncIdb((workspaces) => {
            const initState = getSyncReduxXIndexedDB({ workspaceActive: workspaceTopicActive, depedency: dependencys, topic: topics }, workspaces);

            setNodes(initState.node);
            setEdges(initState.edge);
            setIsLoading(false);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [workspaceTopicActive]);

    // console.log('FlowTopic RENDER', { reactFlow: { nodes, edges } });
    console.log('FlowTopic RENDER');

    return (
        <section
            className="_bg-red-600 border _text-black _dark:text-background _h-[calc(100vh-79px)]"
            style={{ height: 'calc(100vh - 79px)' }}
        >
            {!isLoading ? (
                <ReactFlow
                    ref={flowRef}
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    onReconnect={onReconnect}
                    onReconnectStart={onReconnectStart}
                    onReconnectEnd={onReconnectEnd}
                    onPaneClick={onPaneClick}
                    onNodeContextMenu={onNodeContextMenu}
                    onEdgeContextMenu={onEdgeContextMenu}
                    colorMode={nextTheme.theme as ColorMode}
                    nodeTypes={nodeTypes}
                    edgeTypes={edgeTypes}
                    minZoom={0.1}
                    fitView
                >
                    <Panel position="top-left">
                        <div className="flex gap-x-2">
                            {/* <PaymentProviderSelect /> */}
                            <PanelTopLeftFlowTopic />
                        </div>
                    </Panel>
                    <Background />
                    <Controls />
                    {/* <MiniMap /> */}
                    {/* {isNodeContextMenuOpen && ()} */}
                    <ContextMenuNode
                        ref={contextMenuNodeRef}
                        onClick={onPaneClick}
                        {...isNodeContextMenuOpen}
                    />
                    {/* {isEdgeContextMenuOpen && ()} */}
                    <ContextMenuEdge
                        ref={contextMenuEdgeRef}
                        onClick={onPaneClick}
                        {...isEdgeContextMenuOpen}
                    />
                </ReactFlow>
            ) : (
                <div className="h-full w-full flex justify-center items-center">
                    <p>loading flow...</p>
                </div>
            )}
        </section>
    );
}

function Checking() {
    const { addNodes, setNodes, getNode, getNodes } = useReactFlow();
    return (
        <Button
            onClick={() => {
                const allNodes = getNodes();
                console.log({ allNodes });
            }}
        >
            check
        </Button>
    );
}

function PanelTopLeftFlowTopic() {
    const { toast } = useToast();
    const { setNodes, setEdges, getNode, getNodes, updateNode, updateNodeData, getEdges } = useReactFlow();
    const workspaceTopicActive = useAppSelector(getWorkspaceTopicActive);
    const workspaces = useAppSelector(getAllWorkspaceTopic);
    const topics = useAppSelector(getAllTopics);
    const dependencys = useAppSelector(getAllDependencys);
    const dispatch = useAppDispatch();

    const elementAnchorDonwloadRef = useRef<HTMLAnchorElement | null>(null);

    async function handleResync() {
        if (!workspaceTopicActive) {
            toast({
                title: 'Error',
                variant: 'destructive',
                description: 'Cannot save state flow to store indexeddb: because Workspace Topic Active is null, you must first choose workspaceid',
            });
            return;
        }

        // node and edge in live app
        const nodeFlow = getNodes(),
            edgeFlow = getEdges();

        // node and edge in indexedDB
        const { node: nodeFlowIdb, edge: edgeFlowIdb } = await getWorkspaceIdb(workspaceTopicActive);

        const newState = getSyncReduxXReactFlow(
            { topic: topics, depedency: dependencys },
            { node: nodeFlow.length > 0 ? nodeFlow : nodeFlowIdb, edge: edgeFlow.length > 0 ? edgeFlow : edgeFlowIdb }
        );

        // update state react flow
        setNodes(newState.node);
        setEdges(newState.edge);

        // add or update store indexeddb
        const isUpdateSuccess = await addOrUpdateWorkspaceIdb({ id: workspaceTopicActive, node: newState.node, edge: newState.edge });

        if (!isUpdateSuccess) {
            toast({
                title: 'Error',
                variant: 'destructive',
                description: 'Cannot updated state flow to store indexeddb: because something went wrong',
            });
            return;
        }

        toast({
            title: 'Success',
            description: 'data indexeddb and react-flow is updated, data from redux',
        });
    }

    async function handleSave() {
        if (!workspaceTopicActive) {
            toast({
                title: 'Error',
                variant: 'destructive',
                description: 'Cannot save state flow to store indexeddb: because Workspace Topic Active is null, you must first choose workspaceid',
            });
            return;
        }

        // update store indexeddb
        const isUpdateSuccess = await updateWorkspaceIdb({
            id: workspaceTopicActive,
            node: getNodes().map((node) => ({ ...node, hidden: false }) satisfies Node),
            edge: getEdges().map((edge) => ({ ...edge, hidden: false }) satisfies Edge),
        });

        if (!isUpdateSuccess) {
            toast({
                title: 'Error',
                variant: 'destructive',
                description: 'Cannot save state flow to store indexeddb: because store is undefined, you must first run initStore() function',
            });
            return;
        }

        toast({
            title: 'Success',
            description: 'data indexeddb is updated, data from react-flow',
        });
    }

    async function handleDownload(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        const { current: anchor } = elementAnchorDonwloadRef;
        if (!anchor || !workspaceTopicActive) return;

        const dataFlowInIndexedDB = await getAllWorkspaceIdb();

        //* combine dataFlowInIndexedDB with WorspaceTopic Redux
        const dataDownload: DataDownload = workspaces
            .map((workspace) => workspace.id)
            .reduce((acc, workspaceId) => {
                return {
                    ...acc,
                    [workspaceId]: {
                        workspace: workspaces.find((work) => work.id === workspaceId)!,
                        flow: dataFlowInIndexedDB[workspaceId],
                    },
                };
            }, {} as DataDownload);

        let urlBlob = '';
        const fileName = `${workspaceTopicActive} - ${new Date().toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'medium', hour12: false })}.json`;

        anchor.onclick = (ev) => {
            e.preventDefault();
            const blob = new Blob([JSON.stringify(dataDownload, null, 2)], { type: 'application/json' });
            urlBlob = window.URL.createObjectURL(blob);

            anchor.href = urlBlob;
            anchor.download = fileName;
        };

        anchor.click();
        window.URL.revokeObjectURL(urlBlob);
        anchor.href = 'yourblob';
        anchor.download = 'filename.json';
    }

    return (
        <>
            <div className="flex gap-x-2 p-1 dark:bg-slate-800 bg-slate-200 rounded">
                <Button
                    size="icon"
                    className="size-6"
                    title="resync & save"
                    onClick={() => handleResync()}
                >
                    <RefreshCcwIcon className="size-4" />
                </Button>
                <Button
                    size="icon"
                    className="size-6"
                    title="save"
                    onClick={() => handleSave()}
                >
                    <SaveIcon className="size-4" />
                </Button>
                <Button
                    size="icon"
                    className="size-6"
                    title="download data flow"
                    onClick={(e) => handleDownload(e)}
                >
                    <DownloadIcon className="size-4" />
                </Button>
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid, jsx-a11y/anchor-has-content */}
                <a
                    ref={elementAnchorDonwloadRef}
                    href=""
                    download=""
                    target="_blank"
                    className="sr-only"
                    rel="noopener noreferrer"
                />
            </div>
            <div className="flex gap-x-2 p-1 rounded">
                <DialogCreateDepedencyTopic
                    trigger={
                        <Button
                            size="icon"
                            className="size-6"
                            title="add dependency"
                        >
                            <FilePlus2Icon className="size-4" />
                        </Button>
                    }
                />
                <DialogListDepedencyTopic
                    trigger={
                        <Button
                            size="icon"
                            className="size-6 text-red-500"
                            title="show list dependencys"
                        >
                            <ClipboardListIcon className="size-4" />
                        </Button>
                    }
                />
                <DialogListDepedencyTopicGrouping
                    trigger={
                        <Button
                            size="icon"
                            className="size-6 text-red-500"
                            title="show list dependencys group by commit"
                        >
                            <ClipboardListIcon className="size-4" />
                        </Button>
                    }
                />
                <DialogListDepedencyMapper
                    trigger={
                        <Button
                            size="icon"
                            className="size-6"
                            title="show list dependencys mapper"
                        >
                            <BarChartBigIcon className="size-4" />
                        </Button>
                    }
                />
                <FocusToNode />
                <SelectByDependency />
            </div>
            {/* <Checking /> */}
        </>
    );
}

function SelectByDependency() {
    const [isOpen, setIsOpen] = useState(false);
    const isFirstRender = useRef(true);
    const { setNodes, setEdges, getNode, getNodes, updateNode, updateNodeData, getEdges } = useReactFlow<DependencyNodeProps, Edge>();
    // const facets = column.getFacetedUniqueValues();
    const title = 'Filter by dependency';

    /** Map<"@reduxjs/toolkit","DPC_KHuh1qSAPcZYbPSefgv99'"> */
    const facets = useMemo(() => {
        return new Map(
            getNodes()
                .filter((node) => node.type === 'dependency-node')
                .map((node) => [
                    node.data.title,
                    {
                        id: node.id,
                        title: node.data.title,
                        jumlah: getEdges().filter((edge) => edge.source === node.id).length,
                    },
                ])
        );
    }, [getEdges, getNodes]);

    /** ["react-beautiful-dnd", "@reduxjs/toolkit"] */
    const options = Array.from(facets.keys());

    /** Set<"@reduxjs/toolkit"> */
    const [selectedValues, setSelectedValues] = useState<Set<string>>(new Set());

    useEffect(() => {
        if (isFirstRender.current === true) {
            isFirstRender.current = false;
        } else {
            const selectedValuesArr = [...selectedValues.values()];

            if (selectedValuesArr.length === 0) {
                setNodes((nodes) => {
                    return nodes.map((node) => ({ ...node, hidden: false }));
                });
            } else {
                const idNodeDepSelecteds = selectedValuesArr.filter((depName) => facets.has(depName)).map((depName) => facets.get(depName)!.id);
                const edgeForConnections = [...getEdges()].filter((edge) => idNodeDepSelecteds.some((idNode) => idNode === edge.source));
                const idNodeTopics = [...getNodes()]
                    .filter((node) => edgeForConnections.some((edge) => edge.target === node.id))
                    .map((node) => node.id);

                const idNodesIsViews = [...idNodeDepSelecteds, ...idNodeTopics];
                const idEdgeIsViews = edgeForConnections.filter((edge) => edge.id);

                setNodes((prevNode) => {
                    return prevNode.map((nodeOri) => {
                        const isView = idNodesIsViews.some((id) => nodeOri.id === id);
                        if (isView) {
                            return { ...nodeOri, hidden: false };
                        } else {
                            return { ...nodeOri, hidden: true };
                        }
                    });
                });
            }
        }
    }, [facets, selectedValues, getEdges, getNodes, setNodes]);

    return (
        <Popover
            open={isOpen}
            onOpenChange={setIsOpen}
        >
            <PopoverTrigger asChild>
                <Button
                    // variant="ghost"
                    size="sm"
                    // className="text-left justify-start h-8 border-dashed [&_svg]:size-4 [&_svg]:shrink-0 space-x-2 gap-2 w-full"
                    className="px-1 w-fit justify-start h-6 rounded border-t [&_svg]:size-4 [&_svg]:shrink-0 space-x-1 gap-1"
                >
                    <PlusCircleIcon />
                    {title}

                    {selectedValues?.size > 0 && (
                        <>
                            <Separator
                                orientation="vertical"
                                className="mx-2 h-4"
                            />

                            <div className="space-x-[2px] flex">
                                {selectedValues.size > 5 ? (
                                    <Badge
                                        variant="secondary"
                                        className="rounded-sm px-1 font-normal text-2xs"
                                    >
                                        {selectedValues.size} selected
                                    </Badge>
                                ) : (
                                    options
                                        .filter((option) => selectedValues.has(option))
                                        .map((option) => (
                                            <Badge
                                                variant="secondary"
                                                key={option}
                                                className="rounded-sm px-1 font-normal text-2xs gap-x-1"
                                            >
                                                {option.toString()}
                                                <Button
                                                    variant="ghost"
                                                    title="remove"
                                                    className="size-[8px] p-[1px] bg-transparent hover:bg-transparent [&_svg]:hover:text-red-600"
                                                    asChild
                                                >
                                                    {/* eslint-disable-next-line jsx-a11y/anchor-is-valid, jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
                                                    <a
                                                        role="button"
                                                        tabIndex={-1}
                                                        key={option}
                                                        onClick={(event) => {
                                                            event.preventDefault();
                                                            setSelectedValues((prev) => new Set([...prev].filter((x) => x !== option)));
                                                        }}
                                                    >
                                                        <XIcon className="!size-3" />
                                                    </a>
                                                </Button>
                                            </Badge>
                                        ))
                                )}
                            </div>
                        </>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent
                className="w-fit p-0"
                align="start"
            >
                <Command>
                    <CommandInput placeholder={title} />
                    <CommandList>
                        <CommandEmpty>No results found.</CommandEmpty>
                        {selectedValues.size > 0 && (
                            <>
                                <CommandGroup>
                                    <CommandItem
                                        onSelect={(val) => {
                                            setSelectedValues(() => new Set([]));
                                        }}
                                        className="justify-center text-center"
                                    >
                                        Clear filters
                                    </CommandItem>
                                </CommandGroup>
                            </>
                        )}
                        <CommandSeparator />
                        <CommandGroup>
                            <CommandItem
                                key="select-all"
                                onSelect={() => {
                                    if (selectedValues.size === options.length) {
                                        setSelectedValues((prev) => new Set([]));
                                    } else {
                                        setSelectedValues((prev) => new Set(options));
                                    }
                                }}
                            >
                                <div
                                    className={cn(
                                        'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                                        selectedValues.size === options.length ? 'bg-primary text-primary-foreground' : 'opacity-50 [&_svg]:invisible'
                                    )}
                                >
                                    <CheckIcon />
                                </div>
                                <span>select all</span>
                            </CommandItem>
                            <Separator />
                            {options.map((option) => {
                                const isSelected = selectedValues.has(option);
                                return (
                                    <CommandItem
                                        key={String(option)}
                                        onSelect={(val) => {
                                            if (isSelected) {
                                                setSelectedValues((prev) => new Set([...prev].filter((x) => x !== option)));
                                            } else {
                                                setSelectedValues((prev) => new Set([...prev, option]));
                                            }
                                        }}
                                    >
                                        <div
                                            className={cn(
                                                'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                                                isSelected ? 'bg-primary text-primary-foreground' : 'opacity-50 [&_svg]:invisible'
                                            )}
                                        >
                                            <CheckIcon />
                                        </div>
                                        {/* {option.icon && <option.icon className="mr-2 h-4 w-4 text-muted-foreground" />} */}
                                        <span>{/* option.toString() */ String(option)}</span>
                                        {/* {facets?.get(option) && (
                                            <span className="ml-auto flex h-4 w-4 items-center justify-center font-mono text-xs">
                                                {facets.get(option)?.id}
                                            </span>
                                        )} */}
                                        {facets?.get(option) && (
                                            <span className="ml-auto flex h-4 w-4 items-center justify-center font-mono text-xs">
                                                {facets.get(option)?.jumlah}
                                            </span>
                                        )}
                                    </CommandItem>
                                );
                            })}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}

function FocusToNode() {
    const { getNodes, fitView } = useReactFlow();
    const [open, setOpen] = React.useState(false);
    const [focusNodeId, setFocusNodeId] = React.useState<null | string>(null);

    const nodes = getNodes().map((node) => {
        return {
            id: node.id,
            title: (node.data?.title as undefined | string) || 'title not found',
        };
    });

    useEffect(() => {
        if (focusNodeId) {
            fitView({ nodes: [{ id: focusNodeId }], maxZoom: 0.8, duration: 500 });
            // window.requestAnimationFrame(() => {});
        }
    }, [fitView, focusNodeId]);

    return (
        <Popover
            open={open}
            onOpenChange={setOpen}
        >
            <PopoverTrigger asChild>
                <Button
                    title="focus to node"
                    size="sm"
                    role="combobox"
                    aria-expanded={open}
                    className="_w-[200px] px-1 h-6 w-fit rounded justify-between gap-x-1"
                >
                    {/* <SearchIcon className="opacity-50 size-4" /> */}
                    {/* {focusNodeId ? nodes.find((node) => node.id === focusNodeId)?.title : 'Focus'} */}
                    {/* <ChevronsUpDownIcon className="opacity-50 size-4" /> */}
                    {focusNodeId ? <FocusIcon className="size-4" /> : <ScanIcon className="size-4" />}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="_w-[200px] p-0">
                <Command>
                    <CommandInput
                        placeholder="Search nodes..."
                        className="h-8 text-xs"
                    />
                    <CommandList>
                        <CommandEmpty>No node found.</CommandEmpty>
                        <CommandGroup>
                            {nodes.map((node) => (
                                <CommandItem
                                    className="text-xs"
                                    key={node.title}
                                    value={node.title}
                                    onSelect={(currentValue) => {
                                        setFocusNodeId((prev) => (prev === node.id ? null : node.id));
                                        setOpen(false);
                                    }}
                                >
                                    {node.title}
                                    <CheckIcon className={cn('ml-auto size-3', focusNodeId === node.id ? 'opacity-100' : 'opacity-0')} />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
