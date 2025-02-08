'use client';

import React, { SVGProps, type JSX } from 'react';

import type { Node } from '@xyflow/react';
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
    FileCogIcon,
    HexagonIcon,
    LayersIcon,
    OctagonIcon,
    PentagonIcon,
    SquareIcon,
    TablePropertiesIcon,
    TriangleIcon,
    WaypointsIcon,
    type LucideProps,
} from 'lucide-react';
import { DataShape } from '../../../components/flow/node-shape';
import { CustomNodeType, SelectCustomNode } from '../../../components/flow/custom-types';
import { ShapeCondition } from '@/types/utilities';

type Schema = {
    type: string;
    // icon: (props: SVGProps<SVGSVGElement>) => JSX.Element;
    icon: React.ForwardRefExoticComponent<Omit<LucideProps, 'ref'> & React.RefAttributes<SVGSVGElement>>;
};

const schema: Schema[] = [
    {
        type: 'table',
        icon: CircleIcon,
    },
    {
        type: 'modifier',
        icon: SquareIcon,
    },
    {
        type: 'combine',
        icon: TriangleIcon,
    },
];

const defaultNewNode: Omit<Node, 'id' | 'data'> = {
    position: { x: 0, y: 0 },
};

export function DropdownMenuSchema() {
    const { addNode } = useDrawStore(selectorDraw, shallow);
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    title="schema"
                    size="icon"
                    variant="outline"
                    className="size-[40px] border-none"
                >
                    <WaypointsIcon className="" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="grid gridtem grid-cols-4 overflow-hidden grid-flow-row">
                <DropdownMenuItem
                    className="cursor-pointer"
                    title="table input"
                    onClick={() => {
                        const newNode: Omit<SelectCustomNode<'NodeSchemabuilderInputTable'>, 'id'> = {
                            ...defaultNewNode,
                            type: 'NodeSchemabuilderInputTable',
                            data: {
                                title: 'table name',
                                description: 'your table description',
                                isBase: true,
                                fields: [],
                                references: [],
                                theme: 'blue',
                            },
                        };
                        // dispatch(addNode(newNode));
                        addNode('NodeSchemabuilderInputTable', newNode);
                    }}
                >
                    <TablePropertiesIcon />
                </DropdownMenuItem>
                <DropdownMenuItem
                    title="modifier"
                    className="cursor-pointer"
                    onClick={() => {
                        const newNode: Omit<SelectCustomNode<'NodeSchemabuilderModifier'>, 'id'> = {
                            ...defaultNewNode,
                            type: 'NodeSchemabuilderModifier',
                            data: {
                                theme: 'purple',
                                fields: [],
                            },
                        };
                        addNode('NodeSchemabuilderModifier', newNode);
                    }}
                >
                    <FileCogIcon />
                </DropdownMenuItem>
                <DropdownMenuItem
                    title="combine"
                    className="cursor-pointer"
                    onClick={() => {
                        const newNode: Omit<SelectCustomNode<'NodeSchemabuilderCombine'>, 'id'> = {
                            ...defaultNewNode,
                            type: 'NodeSchemabuilderCombine',
                            data: {
                                theme: 'red',
                                fields: [],
                            },
                        };
                        addNode('NodeSchemabuilderCombine', newNode);
                    }}
                >
                    <LayersIcon />
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
