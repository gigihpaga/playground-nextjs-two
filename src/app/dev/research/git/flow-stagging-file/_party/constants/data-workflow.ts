import { Node, Edge, Position } from '@xyflow/react';

const groupNode: Node[] = [
    {
        id: '1-group-file',
        type: 'CardGroup',
        data: { name: 'group file' },
        position: { x: 0, y: 0 },
        style: {
            width: 170,
            height: 140,
            // background: '#fff',
            // border: '1px solid black',
            // borderRadius: 15,
            // fontSize: 12,
        },
    },
    {
        id: '2-group-commited',
        type: 'CardGroup',
        data: { name: 'group commited' },
        position: { x: 500, y: 0 },
        style: {
            width: 170,
            height: 140,
            // background: '#fff',
            // border: '1px solid black',
            // borderRadius: 15,
            // fontSize: 12,
        },
    },
];

export const initialNodes: Node[] = [...groupNode];

export const initialEdges: Edge[] = [
    // { id: 'e1-2', source: '2', target: '1', animated: true }
];
