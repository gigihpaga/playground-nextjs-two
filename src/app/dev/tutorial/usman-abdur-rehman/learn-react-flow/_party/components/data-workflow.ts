import { Node, Edge, Position } from '@xyflow/react';

export const initialNodes: Node[] = [
    {
        id: '1',
        position: { x: 100, y: 100 },
        data: { amount: 25 },
        type: 'paymentInit',
        // hidden: true
        // draggable: true
    },
    {
        id: '2',
        position: { x: 300, y: 20 },
        data: { currency: '$', country: 'United State', countryCode: 'US' },
        type: 'paymentCountry',
    },
    {
        id: '3',
        position: { x: 300, y: 200 },
        data: { currency: '£', country: 'England', countryCode: 'GB' },
        type: 'paymentCountry',
    },
    {
        id: '4',
        data: { name: 'Google Pay', code: 'Gp' },
        position: { x: 550, y: 0 /* -50 */ },
        type: 'paymentProvider',
    },
    {
        id: '5',
        data: { name: 'Stripe', code: 'St' },
        position: { x: 550, y: 125 },
        type: 'paymentProvider',
    },
    {
        id: '6',
        data: { name: 'Apple Pay', code: 'Ap' },
        position: { x: 550, y: 325 },
        type: 'paymentProvider',
        // handles: [
        //     {
        //         width: 100,
        //         height: 100,
        //         id: 'oye',
        //         x: 0,
        //         y: 0,
        //         position: Position.Bottom,
        //         type: 'source',
        //     },
        // ],
    },
    {
        id: '7',
        data: {},
        position: { x: 275, y: -100 },
        type: 'paymentProviderSelect',
        draggable: false,
    },
    // { id: '2', position: { x: 0, y: 100 }, data: { label: '2' } },
    // { id: '3', position: { x: 0, y: 400 }, data: { label: '3' } },
];

export const initialEdges: Edge[] = [
    // { id: 'e1-2', source: '2', target: '1', animated: true }
];
