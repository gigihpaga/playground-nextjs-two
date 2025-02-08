'use client';

import React, { SVGProps, type JSX } from 'react';

import { Position, type Node } from '@xyflow/react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { addNode, onConnect, onEdgesChange, onNodesChange, setEdges, setNodes, getNodes, getEdges } from '../../state/draw-schema-flow-slice';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    ArrowUpIcon,
    ChevronUpIcon,
    ChevronsUpIcon,
    CircleIcon,
    CuboidIcon,
    DiamondIcon,
    HexagonIcon,
    OctagonIcon,
    PentagonIcon,
    SquareIcon,
    TriangleIcon,
    type LucideProps,
} from 'lucide-react';
import { DataShape, NodeShapeProps } from '../../components/flow/node-shape';

type Shape = {
    type: DataShape['shapeType'];
    // icon: (props: SVGProps<SVGSVGElement>) => JSX.Element;
    icon: React.ForwardRefExoticComponent<Omit<LucideProps, 'ref'> & React.RefAttributes<SVGSVGElement>>;
};

const shapes: Shape[] = [
    {
        type: 'circle',
        icon: CircleIcon,
    },
    {
        type: 'square',
        icon: SquareIcon,
    },
    {
        type: 'triangel',
        icon: TriangleIcon,
    },

    {
        type: 'octagon',
        icon: OctagonIcon,
    },
    {
        type: 'pentagon',
        icon: PentagonIcon,
    },
    {
        type: 'hexagon',
        icon: HexagonIcon,
    },
    {
        type: 'rombus',
        icon: DiamondIcon,
    },
    /*  {
        type: 'rectangel',
        icon: rectangelic,
    },
    {
        type: 'heptagon',
        icon: CircleIcon,
    }, */
];

export function DropdownMenuShape() {
    const dispatch = useAppDispatch();
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    size="icon"
                    variant="outline"
                    className="size-[40px] border-none"
                    title="shapes"
                >
                    <CuboidIcon className="" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="grid gridtem grid-cols-4 overflow-hidden grid-flow-row">
                {shapes.map((shape) => (
                    <DropdownMenuItem
                        title={shape.type}
                        key={shape.type}
                        onClick={() => {
                            const newNode = {
                                id: 'asasad',
                                type: 'NodeShape' as NodeShapeProps['type'],
                                data: {
                                    text: 'group file',
                                    theme: 'green',
                                    shapeType: shape.type,
                                    positionHandle: {
                                        source: Position.Right,
                                        target: Position.Left,
                                    },
                                } satisfies DataShape,
                                position: { x: 0, y: 0 },
                                style: {
                                    width: 150,
                                    height: 150,
                                    // background: '#fff',
                                    // border: '1px solid black',
                                    // borderRadius: 15,
                                    // fontSize: 12,
                                },
                                width: 150,
                                height: 150,
                                resizing: true,
                                measured: { height: 150, width: 150 },
                            } satisfies Node;
                            dispatch(addNode('NodeShape', newNode));
                        }}
                    >
                        <shape.icon />
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
