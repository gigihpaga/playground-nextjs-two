import type { NodeLuffyProps } from './../components/flow/node-luffy';
import { type Node, type Edge, MarkerType, Position } from '@xyflow/react';
import type { NodeVariants, EdgeVariants } from '../components/flow';
import { type NodeComputingcolorNumberInputProps } from '../components/flow/node-computingcolor-numberinput';
import { NodeComputingcolorColorpreviewProps } from '../components/flow/node-computingcolor-colorpreview';
import { CustomNodeType, CustomEdgeType } from '../components/flow/custom-types';

//? Example computing color
/*
const initialExampleNodesComputingcolor: CustomNodeType[]  = [
    {
        id: 'input-color-red-000',
        type: 'NodeComputingcolorNumberInput',
        data: { label: 'Red', value: 255 },
        position: { x: 0, y: 0 },
    } satisfies NodeComputingcolorNumberInputProps,
    {
        id: 'input-color-green-000',
        type: 'NodeComputingcolorNumberInput',
        data: { label: 'Green', value: 0 },
        position: { x: 0, y: 215 },
    } satisfies NodeComputingcolorNumberInputProps,
    {
        id: 'input-color-blue-000',
        type: 'NodeComputingcolorNumberInput',
        data: { label: 'Blue', value: 115 },
        position: { x: 0, y: 430 },
    } satisfies NodeComputingcolorNumberInputProps,
    {
        id: 'color-preview-000',
        type: 'NodeComputingcolorColorpreview',
        position: { x: 330, y: 125 },
        data: {
            label: 'Color',
            value: { r: 0, g: 0, b: 0 },
        },
    } satisfies NodeComputingcolorColorpreviewProps,
    {
        id: 'lightness-000',
        type: 'NodeComputingcolorLightness',
        position: { x: 530, y: 125 },
        data: {
            dark: null,
            light: { r: 0, g: 0, b: 0 },
        },
    },
    {
        id: 'log-black-000',
        type: 'NodeComputingcolorLog',
        position: { x: 850, y: -9 },
        data: { label: 'Use black font', fontColor: 'black' },
    },
    {
        id: 'log-white-000',
        type: 'NodeComputingcolorLog',
        position: { x: 810, y: 150 },
        data: { label: 'Use white font', fontColor: 'white' },
    },
];
*/

const initialExampleEdgesComputingcolor: CustomEdgeType[] /* Edge */ = [
    {
        id: 'input-color-red-to-preview',
        source: 'input-color-red-000',
        target: 'color-preview-000',
        targetHandle: 'red',
        label: 'oke',
    },
    {
        id: 'input-color-green-to-preview',
        source: 'input-color-green-000',
        target: 'color-preview-000',
        type: 'EdgeWithDeleteButton1' /* as EdgeVariants */,
        targetHandle: 'green',
    },
    {
        id: 'input-color-blue-to-preview',
        source: 'input-color-blue-000',
        target: 'color-preview-000',
        targetHandle: 'blue',
    },
    {
        id: 'color-preview-to-lightness',
        source: 'color-preview-000',
        target: 'lightness-000',
        label: 'ini ya',
    },
    {
        id: 'lightness-to-log-black',
        source: 'lightness-000',
        sourceHandle: 'light',
        target: 'log-black-000',
    },
    {
        id: 'lightness-log-2',
        source: 'lightness-000',
        sourceHandle: 'dark',
        target: 'log-white-000',
    },
];

//? Example edge label render
const initialExampleNodeEdgelabelrenderer: CustomNodeType[] = [
    {
        id: '1',
        type: 'input',
        data: { label: 'Node 1' },
        position: { x: 0, y: 0 },
    },
    { id: '2', data: { label: 'Node 2' }, position: { x: 0, y: 300 } },
    { id: '3', data: { label: 'Node 3' }, position: { x: 200, y: 0 } },
    { id: '4', data: { label: 'Node 4' }, position: { x: 200, y: 300 } },
];

const initialExampleEdgeEdgelabelrenderer: CustomEdgeType[] = [
    {
        id: 'e1-2',
        source: '1',
        target: '2',
        data: {
            label: 'edge label',
        },
        type: 'EdgeWithLabel1',
    },
    {
        id: 'e3-4',
        source: '3',
        target: '4',
        data: {
            startLabel: 'start edge label',
            endLabel: 'end edge label',
        },
        type: 'EdgeWithLabelStartend1',
    },
];

//? Example delete edge on drop
const initialExampleNodeDEOD: CustomNodeType[] = [
    {
        id: '1',
        type: 'input',
        data: { label: 'Node A' },
        position: { x: 250, y: 0 },
    },
    {
        id: '2',
        data: { label: 'Node B' },
        position: { x: 100, y: 200 },
    },
    {
        id: '3',
        data: { label: 'Node C' },
        position: { x: 350, y: 200 },
    },
];
const initialExampleEdgeDEOD: CustomEdgeType[] = [{ id: 'e1-2', source: '1', target: '2', label: 'reconnectable edge' }];

//? Paga
const initialNodesPaga: CustomNodeType[] = [
    /*    {
        id: '1-group-file',
        type: 'CardGroup',
        data: { label: 'group file', fontColor: '' },
        position: { x: 0, y: 0 },
        style: {
            width: 170,
            height: 140,
            background: '#fff',
            border: '1px solid black',
            borderRadius: 15,
            fontSize: 12,
        },
    }, */
    {
        id: 'shape-init-1',
        type: 'NodeShape',
        data: {
            text: 'shape init',
            theme: 'green',
            shapeType: 'square',
            positionHandle: {
                source: Position.Right,
                target: Position.Left,
            },
        },
        position: { x: 200, y: 0 },
        resizing: true,
        width: 150,
        height: 150,
        style: {
            width: 150,
            height: 150,
        },
        // measured: { height: 150, width: 150 }, 🚫 JANGAN DIBERI PROPERTI INI, bisa error
    },
    {
        id: 'shape-init-2',
        type: 'NodeShape' /* as NodeVariants */,
        data: {
            /* message: 'buku' ,*/ text: 'upay',
            theme: 'yellow',
            shapeType: 'hexagon',
            positionHandle: {
                source: Position.Right,
                target: Position.Left,
            },
        },
        position: { x: 400, y: 100 },
        style: {
            width: 100,
            height: 100,
        },
    },
    /*
    {
        id: 'shape-init-3',
        type: 'NodeLuffy',  //as NodeVariants,
        data: {
            title: 'luffy',
            description: 'one piece is a good cartoon dsfsf f fs ffdsfsdg fds gsgsdgs sd gdg dgdg gdgd',
            theme: 'red',
            icon: 'RefreshCwIcon',
        },
        position: { x: 0, y: 150 },
    } satisfies NodeLuffyProps,
    */
];

const initialEdgesPaga: CustomEdgeType[] = [
    {
        id: 'shape-init-1___shape-init-2',
        source: 'shape-init-1',
        target: 'shape-init-2',
        animated: true,
        label: 'uh',
        markerEnd: {
            type: MarkerType.Arrow,
            width: 20,
            height: 20,
            color: '#FFab03',
        },
        // markerStart: {
        // type: MarkerType.ArrowClosed,
        // orient: 'auto-start-reverse',
        // },
        markerStart: 'custom-marker-svg', // ini mengarah ke id svg yang ada di html
        style: {
            strokeWidth: 2,
            stroke: '#cF6072',
        },
    },
];

//? Schema Builder
const initialNodesPagaSchemaBuilder: CustomNodeType[] = [
    {
        type: 'NodeSchemabuilderInputTable',
        id: 'schema-builder-input-1',
        position: { x: 0, y: 0 },
        data: {
            title: 'user',
            theme: 'blue',
            isBase: false,
            fields: [
                {
                    id: 'p5nFz',
                    name: 'name',
                    isRequired: true,
                    types: ['string'],
                },
                {
                    id: '8abc9',
                    name: 'isMarried',
                    isRequired: true,
                    types: ['boolean'],
                },
                {
                    id: '549uX',
                    name: 'income',
                    isRequired: false,
                    types: ['number'],
                },
            ],
            references: [],
        },
    },
    {
        type: 'NodeSchemabuilderInputTable',
        id: 'schema-builder-input-2',
        position: { x: -400, y: 0 },
        data: {
            title: 'user credential',
            theme: 'green',
            isBase: true,
            fields: [
                {
                    id: 'p5nFz',
                    name: 'isAdmin',
                    isRequired: true,
                    types: ['boolean'],
                },
                {
                    id: '8abc9',
                    name: 'isLoggin',
                    isRequired: true,
                    types: ['boolean'],
                },
            ],
            references: [],
        },
    },
    {
        type: 'NodeSchemabuilderInputTable',
        id: 'schema-builder-input-3',
        position: { x: 1050, y: 0 },
        data: {
            title: 'job',
            theme: 'blue',
            isBase: false,
            fields: [
                {
                    id: 'aDdreAs-123',
                    name: 'addreas',
                    isRequired: true,
                    types: ['string', 'boolean'],
                },
                {
                    id: 'aDdreAs-456',
                    name: 'position',
                    isRequired: false,
                    types: ['number', 'boolean'],
                },
            ],
            references: [],
        },
    },
    {
        type: 'NodeSchemabuilderModifier',
        id: 'schema-builder-modifier-1',
        position: { x: 480, y: 105 },
        data: {
            theme: 'purple',
            fields: [],
        },
    },
    {
        type: 'NodeSchemabuilderCombine',
        id: 'schema-builder-combine-1',
        position: { x: 820, y: 320 },
        data: {
            theme: 'red',
            fields: [],
        },
    },
];

const initialEdgesPagaSchemaBuilder: CustomEdgeType[] = [
    {
        id: 'schema-builder-input-1__schema-builder-modifier-1-000',
        source: 'schema-builder-input-1',
        target: 'schema-builder-modifier-1',
        type: 'EdgeWithDeleteButton1',
        animated: true,
    },
];

//? group
const initialNodesPagaGroup: CustomNodeType[] = [
    {
        type: 'NodeGroup',
        id: 'group-99',
        data: { title: 'group 99' },
        position: { x: 0, y: 0 },
        style: {
            minWidth: 200,
            minHeight: 200,
        },
        origin: [0, 0],
    },
    {
        type: 'NodeGroup',
        id: 'group-1',
        data: { title: 'group 1' },
        position: { x: 0, y: 0 },
        style: {
            minWidth: 200,
            minHeight: 200,
        },
        origin: [0, 0],
    },
    {
        type: 'NodeGroup',
        id: 'group-2',
        data: { title: 'group 2' },
        position: { x: 200, y: 50 },
        style: {
            minWidth: 200,
            minHeight: 200,
        },
        parentId: 'group-1',
        origin: [0, 0],
    },
    {
        type: 'NodeGroup',
        id: 'group-3',
        data: { title: 'group 3' },
        position: { x: 410, y: 50 },
        style: {
            minWidth: 200,
            minHeight: 200,
        },
        parentId: 'group-1',
        origin: [0, 0],
    },
    {
        type: 'NodeShape',
        id: 'nodeshape-1',
        data: {
            text: 'halo',
            shapeType: 'hexagon',
            theme: 'blue',
            positionHandle: {
                source: 'right',
                target: Position.Left,
            },
        },
        position: { x: 20, y: 20 },
        width: 150,
        height: 150,
        // parentId: 'group-2',
        origin: [0, 0],
    },
];

//* Main initial
export const initNodes: CustomNodeType[] = [
    //
    // ...initialNodesPagaGroup,
    // ...initialExampleNodesComputingcolor,
    // ...initialExampleNodeEdgelabelrenderer,
    // ...initialExampleNodeDEOD,
    // ...initialNodesPaga,
    // ...initialNodesPagaSchemaBuilder,
];

export const initEdges: CustomEdgeType[] = [
    //
    // ...initialExampleEdgesComputingcolor,
    // ...initialExampleEdgeEdgelabelrenderer,
    // ...initialExampleEdgeDEOD,
    // ...initialEdgesPaga,
    // ...initialEdgesPagaSchemaBuilder,
];
