import type { RootState } from '@/lib/redux/store';
import { createSlice, createSelector, current, nanoid, type PayloadAction } from '@reduxjs/toolkit';

import { addEdge, applyNodeChanges, applyEdgeChanges } from '@xyflow/react';
import type {
    ColorMode,
    Node,
    Edge,
    Connection,
    NodeTypes,
    EdgeTypes,
    ReactFlowInstance,
    ReactFlowJsonObject,
    NodeChange,
    EdgeChange,
} from '@xyflow/react';
import { EdgeBase } from '@xyflow/system';
import { BaseShapeVariants } from '../components/base-shape';
import { initNodes } from '../constants/init-nodes-edges';
import { CustomEdgeType, CustomNodeType } from '../components/flow/custom-types';
import { ShapeCondition } from '@/types/utilities';

const initialNodes: /* Node[] */ CustomNodeType[] = [...initNodes];
const initialEdges: /* Edge[] */ CustomEdgeType[] = [];

const initialState = {
    nodes: initialNodes,
    edges: initialEdges,
};

function myApplyNodeChanges(yourChanges: NodeChange<CustomNodeType>[], oldNodes: CustomNodeType[]) {
    const newNodes = applyNodeChanges(yourChanges, oldNodes);
    return newNodes;
}

function myApplyEdgeChanges(yourChanges: EdgeChange<CustomEdgeType>[], oldNodes: CustomEdgeType[]) {
    const newEdges = applyEdgeChanges(yourChanges, oldNodes);
    return newEdges;
}

type a = Omit<ShapeCondition<CustomNodeType, 'NodeSchemabuilderCombine'>, 'id'>;
type b = Omit<ShapeCondition<CustomNodeType, 'NodeSchemabuilderCombine'>, 'data'>;
type c = ShapeCondition<CustomNodeType, 'NodeSchemabuilderCombine'>;
type d = Omit<ShapeCondition<CustomNodeType, 'NodeSchemabuilderCombine'>, 'id' | 'type'>;

const A: a = {
    type: 'NodeSchemabuilderCombine',
    position: { x: 10, y: 10 },
    data: { theme: 'blue', fields: [] },
};

const B: b = {
    id: 'bb',
    type: 'NodeSchemabuilderCombine',
    position: { x: 10, y: 10 },
};

const C: c = {
    ...A,
    id: 'ss',
};

const D: d = {
    data: { fields: [], theme: 'blue' },
    position: { x: 10, y: 10 },
};

const drawSchemaFlowSlice = createSlice({
    name: 'draw:flow',
    initialState,
    reducers: {
        onNodesChange: (state, action: PayloadAction<NodeChange<CustomNodeType>[]>) => {
            const typeChange = action.payload[0].type;
            const a = [...state.nodes];
            let nodeCurrent = current(state);
            let nodeCurrent2 = state;
            // const a = current(state);
            // let newNodes = applyNodeChanges(action.payload, [...v.nodes]);
            if (typeChange === 'dimensions') {
                void console.log({ updateDimension: action.payload });
            } else {
                let newNodes = myApplyNodeChanges(action.payload, [...nodeCurrent.nodes]);
                console.log(nodeCurrent);
                state.nodes = [...newNodes];
            }
            // return {
            //     ...state,
            //     nodes: [...newNodes],
            // };
            // if (b === 'dimensions') {
            //     void console.log({ p: action.payload });
            // } else {

            // }
        },
        onEdgesChange: (state, action: PayloadAction<EdgeChange<CustomEdgeType>[]>) => {
            /*   const newEdges = applyEdgeChanges(action.payload, state.edges);
            return { ...state, edges: newEdges }; */
            let stateCurrent = current(state);
            const newEdges = myApplyEdgeChanges(action.payload, stateCurrent.edges);
            state.edges = [...newEdges];
        },
        onConnect: (state, action: PayloadAction<CustomEdgeType | Connection>) => {
            const newEdges = addEdge<CustomEdgeType>(action.payload, state.edges);
            return {
                ...state,
                edges: newEdges,
            };
        },
        setNodes: (state, action: PayloadAction<CustomNodeType[]>) => {
            return {
                ...state,
                nodes: action.payload,
            };
        },
        setEdges: (state, action: PayloadAction<CustomEdgeType[]>) => {
            return {
                ...state,
                edges: action.payload,
            };
        },
        addNode: {
            prepare: <Type extends CustomNodeType['type']>(type: Type, p: Omit<ShapeCondition<CustomNodeType, Type>, 'id' | 'type'>) => {
                let newNode = {
                    ...p,
                    id: 'Node_' + nanoid(),
                    type: type,
                } as ShapeCondition<CustomNodeType, Type>;
                return { payload: newNode };
            },
            reducer: (state, action: PayloadAction<CustomNodeType>) => {
                state.nodes.push(action.payload);
            },
        },
        updateNodesColor: (state, action: PayloadAction<{ ids: Array<Node['id']>; theme: BaseShapeVariants['theme'] }>) => {
            action.payload.ids.forEach((id) => {
                const nodeIndex = state.nodes.findIndex((node) => node.id === id);
                const nodeUpdated = state.nodes[nodeIndex];
                if (nodeUpdated.selected === true) {
                    if ('theme' in nodeUpdated.data && typeof nodeUpdated.data.theme === 'string') {
                        state.nodes[nodeIndex].data = {
                            ...nodeUpdated.data,
                            theme: action.payload.theme,
                        };
                    }
                }
            });
        },
    },
});

export const { addNode, onConnect, onEdgesChange, onNodesChange, setEdges, setNodes, updateNodesColor } = drawSchemaFlowSlice.actions;

export function getNodes(state: RootState) {
    return state.drawSchemaFlow.nodes;
}

export const getNodesSelecteds = createSelector([getNodes], (nodes) => {
    return nodes.filter((node) => node.selected === true);
});

export function getEdges(state: RootState) {
    return state.drawSchemaFlow.edges;
}

export const drawSchemaFlowReducer = drawSchemaFlowSlice.reducer;
