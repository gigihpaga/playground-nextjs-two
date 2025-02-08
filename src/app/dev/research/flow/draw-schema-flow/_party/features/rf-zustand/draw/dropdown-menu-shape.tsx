'use client';

import React, { SVGProps, type JSX } from 'react';

import { Position, type Node } from '@xyflow/react';
// import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
// import { addNode, onConnect, onEdgesChange, onNodesChange, setEdges, setNodes, getNodes, getEdges } from '../../state/draw-slice';
import { selectorDraw, shallow, useDrawStore } from '../../../state/draw-store';

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
import { DataShape } from '../../../components/flow/node-shape';
import { CustomNodeType, SelectCustomNode } from '../../../components/flow/custom-types';
import { ShapeCondition } from '@/types/utilities';
import { useReactFlow } from '../../../hooks/react-flow';

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

const defaultNewNodeShape: Omit<SelectCustomNode<'NodeShape'>, 'id' | 'data'> = {
    type: 'NodeShape',
    position: { x: 0, y: 0 },
    style: {
        width: 150,
        height: 150,
    },
    width: 150,
    height: 150,
    measured: { height: 150, width: 150 },
};

export function DropdownMenuShape() {
    // const dispatch = useAppDispatch();
    const { addNode } = useDrawStore(selectorDraw, shallow);
    const { screenToFlowPosition } = useReactFlow();
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
                            const newNode: Omit<SelectCustomNode<'NodeShape'>, 'id'> = {
                                ...defaultNewNodeShape,
                                data: {
                                    text: 'shape',
                                    theme: 'revolver',
                                    shapeType: shape.type,
                                    positionHandle: {
                                        source: Position.Right,
                                        target: Position.Left,
                                    },
                                } /* satisfies DataShape */,
                                // id: '',

                                // type: 'NodeShape',
                            }; /* satisfies Omit<CustomNodeType, 'id'> */
                            // dispatch(addNode(newNode));
                            addNode('NodeShape', newNode);
                        }}
                    >
                        <shape.icon />
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
