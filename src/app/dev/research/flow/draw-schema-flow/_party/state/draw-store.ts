import { applyNodeChanges, applyEdgeChanges, addEdge, MarkerType, useReactFlow /* userEvent */, reconnectEdge } from '@xyflow/react';

import type { Connection, XYPosition, OnEdgesChange, OnNodesChange, NodeChange, Edge, EdgeChange, Node, OnConnect, OnReconnect } from '@xyflow/react';
import type { EdgeBase } from '@xyflow/system';
import { create } from 'zustand';
import { createWithEqualityFn } from 'zustand/traditional';
import { nanoid } from 'nanoid/non-secure';
import { shallow } from 'zustand/shallow';
import { devtools, persist } from 'zustand/middleware';

import { ShapeCondition } from '@/types/utilities';
import { initNodes, initEdges } from '../constants/init-nodes-edges';
import { BaseShapeVariants, themeInlineStyle } from '../components/base-shape';
import { NodeLuffyProps } from '../components/flow/node-luffy';
import { CustomNodeType, CustomEdgeType, SelectCustomNode, SelectCustomEdge, NodeVariants } from '../components/flow/custom-types';
import { nodeShapeDataSchema } from '../components/flow/node-shape';
import { nodeSchemabuilderInputTableDataSchema } from '../components/flow/node-schemabuilder-input-table';
import { nodeSchemabuilderModifierSchema } from '../components/flow/node-schemabuilder-modifier';
import { nodeSchemabuilderCombineSchema } from '../components/flow/node-schemabuilder-combine';
import { NodeGroupDataSchema } from '../components/flow/node-group';
import { NodeTextDataSchema } from '../components/flow/node-text';

/**
 * [reference 1](https://codesandbox.io/p/sandbox/upbeat-zhukovsky-nrss6l?file=%2Fstore.ts%3A1%2C1-79%2C1&utm_medium=sandpack)
 */
export type DrawState = {
    nodes: CustomNodeType[];
    edges: CustomEdgeType[];
    onNodesChange: OnNodesChange<CustomNodeType>;
    onEdgesChange: OnEdgesChange<CustomEdgeType>;
    onConnect: OnConnect;
    onReconnect: OnReconnect<CustomEdgeType>;
    setNodes: (nodes: CustomNodeType[] | ((nodes: CustomNodeType[]) => CustomNodeType[])) => void;
    setEdges: (edges: CustomEdgeType[]) => void;
    addNode: <Type extends CustomNodeType['type'] /* W extends Record<string, unknown> = ShapeCondition<CustomNodeType, Type>*/>(
        type: Type,
        // node: Omit<CustomNodeType, 'id'>
        node: Omit<ShapeCondition<CustomNodeType, Type>, 'id'>
    ) => void;
    getNodesSeleteds: () => CustomNodeType[];
    updateNodeData: <Type extends CustomNodeType['type'] = CustomNodeType['type']>(
        id: string,
        data: Partial<ShapeCondition<CustomNodeType, Type>['data']>
    ) => void;
    getNodeData: /*  <Type extends CustomNodeType['type'] = CustomNodeType['type']> */
    (nodeId: string) => Pick<CustomNodeType, 'id' | 'type' | 'data'> | null;
    /*  Pick<CustomNodeType, 'id' | 'type' | 'data'> | null; */
    /* Pick<ShapeCondition<CustomNodeType, Type>, 'id' | 'type' | 'data'> | null; */
    /* Pick<ShapeCondition<CustomNodeType, Type>, 'id' | 'type' | 'data'> | null */
    /* ShapeCondition<CustomNodeType, Type> | null */ /* SelectCustomNode<Type> | null |undefined/ */ //Pick<ShapeCondition<CustomNodeType, Type>, 'type' | 'id' | 'data'> | null  *//* Pick<CustomNodeType, 'type' | 'id' | 'data'> | null; */;
    getNodes: () => CustomNodeType[];
    getNodeGroups: () => CustomNodeType[];

    // addChildNode: (parentNode: CustomNodeType, position: XYPosition) => void;
    // updateNodeLabel: (nodeId: string, label: string) => void;
    // updateText: (nodeId: string, text: string) => void;
    // updateLuffy: (nodeId: string, fields: Omit<NodeLuffyProps['data'], 'theme'>) => void;
    // updateNodesColor: ({ ids, theme }: { ids: Array<CustomNodeType['id']>; theme: BaseShapeVariants['theme'] }) => void;
};

// type aaa<Obj extends Record<string,unknown> =Record<string,unknown> , K extends keyof Obj> = {
//     [P in keyof Obj]: Obj[K]
// }

export const selectorDraw = (state: DrawState): DrawState => ({
    nodes: state.nodes,
    edges: state.edges,
    onNodesChange: state.onNodesChange,
    onEdgesChange: state.onEdgesChange,
    onConnect: state.onConnect,
    onReconnect: state.onReconnect,
    setNodes: state.setNodes,
    setEdges: state.setEdges,
    addNode: state.addNode,
    getNodesSeleteds: state.getNodesSeleteds,
    updateNodeData: state.updateNodeData,
    getNodeData: state.getNodeData,
    getNodes: state.getNodes,
    getNodeGroups: state.getNodeGroups,
    // addChildNode: state.addChildNode,
    // updateNodeLabel: state.updateNodeLabel,
    // updateText: state.updateText,
    // updateLuffy: state.updateLuffy,
    // updateNodesColor: state.updateNodesColor,
});

/**
 * @example
 * use in component
 * ```ts
 * import { selectorDraw, shallow, useDrawStore } from '../../../state/draw-store';
 * const { nodes, edges, onNodesChange, onEdgesChange, addNode, addChildNode } = useDrawStore(selectorDraw, shallow);
 * ```
 */
// const useDrawStore = create<DrawState>((set, get) => ({
export const useDrawStore = createWithEqualityFn<DrawState, [['zustand/devtools', never]]>(
    devtools(
        (set, get) => {
            return {
                nodes: [...initNodes],
                edges: [...initEdges],
                onNodesChange: (changes) => {
                    set((state) => {
                        return {
                            ...state,
                            nodes: applyNodeChanges(changes, get().nodes),
                        };
                    });
                },
                onEdgesChange: (changes) => {
                    set({
                        edges: applyEdgeChanges(changes, get().edges),
                    });
                },
                onConnect: (connection) => {
                    const newEdge: SelectCustomEdge<'EdgeWithDeleteButton1'> /* Connection | EdgeBase */ = {
                        ...connection,
                        animated: true,
                        id: `${connection.source}__${connection.target}`,
                        type: 'EdgeWithDeleteButton1',
                        markerEnd: {
                            type: MarkerType.ArrowClosed,
                            color: themeInlineStyle['yellow'].colorC, // for default, make sure this color equal with data.theme
                        },
                        zIndex: 20,
                        interactionWidth: 25,
                        data: {
                            lineType: 'smoothstep',
                            // startLabel: undefined,
                            // endLabel: undefined,
                            theme: 'yellow', // for default, make sure this theme equal with markerEnd.color
                        },
                    };
                    set({
                        edges: addEdge(newEdge, get().edges),
                    });
                },
                onReconnect: (oldEdge, newConnection) => {
                    set({
                        edges: reconnectEdge(oldEdge, newConnection, get().edges),
                    });
                },
                setNodes: (nodes) => {
                    if (nodes instanceof Function) {
                        set({ nodes: [...nodes([...get().nodes])] } /* , true */);
                    }

                    if (nodes instanceof Array) {
                        set({ nodes: nodes } /* , true */);
                    }
                },
                setEdges: (edges /* : Edge[] */) => {
                    set({ edges });
                },
                addNode: (type, node) => {
                    const newNode = {
                        ...node,
                        // id: `${node.type ?? 'NODE'}_${nanoid()}`, // add propertie id
                        id: `${type}_${nanoid()}`, // add propertie id
                    };
                    switch (type) {
                        case 'NodeShape':
                            // eslint-disable-next-line no-case-declarations
                            const dataValidNodeShape = nodeShapeDataSchema.safeParse(node.data);
                            if (!dataValidNodeShape.success) {
                                console.error('addNode', dataValidNodeShape.error);
                                break;
                            }
                            set({ nodes: [...get().nodes, { ...newNode, type: type, data: dataValidNodeShape.data }] });
                            break;
                        case 'NodeSchemabuilderInputTable':
                            // eslint-disable-next-line no-case-declarations
                            const dataValidNodeSchemabuilderInputTable = nodeSchemabuilderInputTableDataSchema.safeParse(node.data);
                            if (!dataValidNodeSchemabuilderInputTable.success) {
                                console.error('addNode', dataValidNodeSchemabuilderInputTable.error);
                                break;
                            }
                            set({ nodes: [...get().nodes, { ...newNode, type: type, data: dataValidNodeSchemabuilderInputTable.data }] });
                            break;
                        case 'NodeSchemabuilderModifier':
                            // eslint-disable-next-line no-case-declarations
                            const dataValidNodeSchemabuilderModifier = nodeSchemabuilderModifierSchema.safeParse(node.data);
                            if (!dataValidNodeSchemabuilderModifier.success) {
                                console.error('addNode', dataValidNodeSchemabuilderModifier.error);
                                break;
                            }
                            set({ nodes: [...get().nodes, { ...newNode, type: type, data: dataValidNodeSchemabuilderModifier.data }] });
                            break;
                        case 'NodeSchemabuilderCombine':
                            // eslint-disable-next-line no-case-declarations
                            const dataValidNodeSchemabuilderCombineSchema = nodeSchemabuilderCombineSchema.safeParse(node.data);
                            if (!dataValidNodeSchemabuilderCombineSchema.success) {
                                console.error('addNode', dataValidNodeSchemabuilderCombineSchema.error);
                                break;
                            }
                            set({ nodes: [...get().nodes, { ...newNode, type: type, data: dataValidNodeSchemabuilderCombineSchema.data }] });
                            break;
                        case 'NodeGroup':
                            // eslint-disable-next-line no-case-declarations
                            const dataValidNodeGroupDataSchema = NodeGroupDataSchema.safeParse(node.data);
                            if (!dataValidNodeGroupDataSchema.success) {
                                console.error('addNode', dataValidNodeGroupDataSchema.error);
                                break;
                            }

                            set({ nodes: [...get().nodes, { ...newNode, type: type, data: dataValidNodeGroupDataSchema.data }] });
                            break;
                        case 'NodeText':
                            // eslint-disable-next-line no-case-declarations
                            const dataValidNodeTextDataSchema = NodeTextDataSchema.safeParse(node.data);
                            if (!dataValidNodeTextDataSchema.success) {
                                console.error('addNode', dataValidNodeTextDataSchema.error);
                                break;
                            }

                            set({ nodes: [...get().nodes, { ...newNode, type: type, data: dataValidNodeTextDataSchema.data }] });
                            break;
                        default:
                            break;
                    }
                },

                getNodesSeleteds: () => {
                    return [...get().nodes.filter((node) => node.selected === true)];
                },

                updateNodeData: (id, data) => {
                    /*
                    const newNode = get().nodes.map((node) => {
                        if (node.id === id) {
                            if (node.type === 'NodeSchemabuilderInputTable') {
                                const dataValid = nodeSchemabuilderInputTableDataSchema.partial().safeParse(data);
                                if (!dataValid.success) return node;
                                return {
                                    ...node,
                                    data: {
                                        ...node.data,
                                        ...dataValid.data,
                                    },
                                };
                            } else if (node.type === 'NodeSchemabuilderModifier' || node.type === 'NodeSchemabuilderCombine') {
                                return {
                                    ...node,
                                    data: {
                                        ...node.data,
                                        ...data,
                                    },
                                };
                            } else if (node.type === 'NodeShape') {
                                return {
                                    ...node,
                                    data: {
                                        ...node.data,
                                        ...data,
                                    },
                                };
                            } else if (node.type === 'NodeGroup') {
                                return {
                                    ...node,
                                    data: {
                                        ...node.data,
                                        ...data,
                                    },
                                };
                            } else if (node.type === 'NodeText') {
                                return {
                                    ...node,
                                    data: {
                                        ...node.data,
                                        ...data,
                                    },
                                };
                            } else {
                                return node;
                            }
                        }
                        return node;
                    });
                    */
                    const newNode = get().nodes;
                    const nodeIndex = newNode.findIndex((n) => n.id === id);

                    if (nodeIndex !== -1) {
                        newNode[nodeIndex].data = {
                            ...newNode[nodeIndex].data,
                            ...data,
                        };

                        set({ nodes: [...newNode] });
                    }
                },

                getNodeData: (nodeId) => {
                    const nodes = [...get().nodes];
                    const nodeIndex = nodes.findIndex((node) => node.id === nodeId);
                    if (nodeIndex !== -1) {
                        const foundNode = nodes[nodeIndex];

                        const returnNode: Pick<CustomNodeType, 'id' | 'type' | 'data'> =
                            /* : Pick<ShapeCondition<CustomNodeType, typeof foundNode.type>, 'id' | 'type' | 'data'> */ {
                                id: foundNode.id,
                                type: foundNode.type /* as ShapeCondition<CustomNodeType, typeof foundNode.type>['type'] */ /* as NodeVariants */,
                                data: foundNode.data /* as ShapeCondition<CustomNodeType, typeof foundNode.type>['data'] */,
                            };
                        return returnNode;
                    } else {
                        return null;
                    }
                },

                getNodes: () => {
                    return [...get().nodes];
                },

                getNodeGroups: () => {
                    return get().nodes.filter((node) => node.id.toLowerCase().includes('group'));
                },
            };
        },
        { enabled: process.env.NODE_ENV !== 'production' }
    )
);

export { shallow };

const tidakBeguna = {
    /*
    updateNodeLabel: (nodeId: string, label: string) => {
        set({
            nodes: get().nodes.map((node) => {
                if (node.id === nodeId) {
                    // it's important to create a new object here, to inform React Flow about the changes
                    node.data = { ...node.data, label };
                }

                return node;
            }),
        });
    },
    updateText: (nodeId: string, text: string) => {
        console.log('draw-store/updateText');
        const newNodes = [...get().nodes];

        const nodeIndex = newNodes.findIndex((node) => node.id === nodeId);
        if (nodeIndex !== -1) {
            if ('text' in newNodes[nodeIndex].data) {
                newNodes[nodeIndex].data = {
                    ...newNodes[nodeIndex].data,
                    text: text,
                };
                set({ nodes: newNodes });
            }
        }
    },
    addChildNode: (parentNode, position) => {
            const newNode: CustomNodeType = {
                id: nanoid(),
                type: 'NodeMindMap',
                data: {
                    label: 'New Node',
                },
                position,
                parentId: parentNode.id,
            };

                    const newEdge = {
                        id: nanoid(),
                        source: parentNode.id,
                        target: newNode.id,
                    };

                    set({
                        nodes: [...get().nodes, newNode],
                        edges: [...get().edges, newEdge],
                    });
    },
    }
    updateNodesColor: ({ ids, theme }: { ids: Array<CustomNodeType['id']>; theme: BaseShapeVariants['theme'] }) => {
    const newNodes = [...get().nodes];
    console.log('draw-store/updateNodesColor', { ids, theme });
    ids.forEach((id) => {
        // const nodeIndex = newNodes.findIndex((node) => node.id === id);
        // const nodeUpdated = newNodes[nodeIndex];
        // if (nodeUpdated.selected === true) {
        //     if ('theme' in nodeUpdated.data && typeof nodeUpdated.data.theme === 'string') {
        //         newNodes[nodeIndex].data = {
        //             ...nodeUpdated.data,
        //             theme: theme,
        //         };
        //         set({ nodes: [...newNodes] });
        //     }
        // }
        
        // harus pakai cara yang dibawah ini,
        // kalo pakai cara yang diatas, nodes dapat di perbarui, react flow sudah re-render.
        // TAPI node di UI telat re-render, jadi user harus un-select dulu baru ke trigger re-render
         
        set({
            nodes: get().nodes.map((node) => {
                if (node.id === id && node.type === 'NodeShape') {
                    return {
                        ...node,
                        data: {
                            ...node.data,
                            theme: theme,
                        },
                    };
                }
                return node;
            }),
        });
    });
},

updateLuffy: (nodeId: string, fields: Omit<NodeLuffyProps['data'], 'theme'>) => {
                    // console.log('draw-store/updateText');
                    // const newNodes = [...get().nodes];
                    // const nodeIndex = newNodes.findIndex((node) => node.id === nodeId);
                    // if (nodeIndex !== -1) {
                    //     newNodes[nodeIndex].data = {
                    //         ...newNodes[nodeIndex].data,
                    //         ...fields,
                    //     };
                    //     set({ nodes: newNodes });
                    // } 

                    set({
                        nodes: get().nodes.map((node) => {
                            if (node.id === nodeId && node.type === 'NodeLuffy') {
                                return {
                                    ...node,
                                    data: {
                                        ...node.data,
                                        ...fields,
                                    },
                                };
                            }
                            return node;
                        }),
                    });
                },
    
                */
};
