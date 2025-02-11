'use client';

import React, { forwardRef, useCallback, useState } from 'react';
import { number, TypeOf, z } from 'zod';
import { Position, useReactFlow } from '@xyflow/react';
import { ChevronUpIcon, ChevronRightIcon, ChevronDownIcon, ChevronLeftIcon, type LucideProps } from 'lucide-react';

import { cn } from '@/lib/classnames';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';

import { getDependency, getTopic } from '../../state/commit-topic-collection-slice';

import { useToast } from '@/components/ui/use-toast';
import { ContextMenu, ContextMenuItem, DropDownItem, DropdownGroup } from '@/app/dev/research/flow/draw-schema-flow/_party/components/context-menu';

export type StateNodeContectMenu = {
    id?: string;
    top?: number;
    left?: number;
    right?: number;
    bottom?: number;
} | null;

type ContextMenuNodeProps = StateNodeContectMenu & Omit<React.HtmlHTMLAttributes<HTMLDivElement>, 'id'>;

const handleTypes = ['source', 'target'] as const;
// const handleTypes = ['source'] as const;
type HandleType = (typeof handleTypes)[number];
const handlesPositions = ['top', 'right', 'bottom', 'left'] as const;
type HandlePosition = (typeof handlesPositions)[number];
const IconDirection: Record<HandlePosition, { icon: React.ForwardRefExoticComponent<Omit<LucideProps, 'ref'> & React.RefAttributes<SVGSVGElement>> }> =
    {
        'top': { icon: ChevronUpIcon },
        'right': { icon: ChevronRightIcon },
        'bottom': { icon: ChevronDownIcon },
        'left': { icon: ChevronLeftIcon },
    };

const IconDirections: Array<{
    position: HandlePosition;
    icon: React.ForwardRefExoticComponent<Omit<LucideProps, 'ref'> & React.RefAttributes<SVGSVGElement>>;
}> = [
    {
        position: 'top',
        icon: ChevronUpIcon,
    },
    {
        position: 'bottom',
        icon: ChevronDownIcon,
    },
    {
        position: 'left',
        icon: ChevronLeftIcon,
    },
    {
        position: 'right',
        icon: ChevronRightIcon,
    },
];

export const ContextMenuNode = forwardRef<HTMLDivElement, ContextMenuNodeProps>(({ id, top, left, right, bottom, ...props }, ref) => {
    const { toast } = useToast();

    const topic = useAppSelector((state) => getTopic(state, id || null));
    const dependency = useAppSelector((state) => getDependency(state, id || null));

    const { setNodes, getNode, getNodes, updateNode, updateNodeData, setEdges, getEdges } = useReactFlow();

    const handleChangeHandlePositon = useCallback(
        (type: HandleType, position: HandlePosition) => {
            if (!topic && !dependency) throw new Error(`topic or dependency with id: ${id} not found`);
            if (!id) return;
            const node = getNode(id);
            if (!node) throw new Error(`node with id: ${id} not found`);
            console.log({ id, type, position, node });
            updateNode(node.id, (nodeUpdate) => {
                let positionUpdate: Position;
                switch (position) {
                    case 'top':
                        positionUpdate = Position.Top;
                        break;
                    case 'right':
                        positionUpdate = Position.Right;
                        break;
                    case 'bottom':
                        positionUpdate = Position.Bottom;
                        break;
                    case 'left':
                        positionUpdate = Position.Left;
                        break;
                    default:
                        positionUpdate = Position.Right;
                        break;
                }

                switch (type) {
                    case 'source':
                        return {
                            ...nodeUpdate,
                            sourcePosition: positionUpdate,
                        };

                    case 'target':
                        return {
                            ...nodeUpdate,
                            targetPosition: positionUpdate,
                        };

                    default:
                        return nodeUpdate;
                }
            });
        },
        [dependency, getNode, id, topic, updateNode]
    );

    return (
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
        <ContextMenu
            ref={ref}
            {...props}
            className={cn(!id && 'z-[-1000]')}
            style={{ top, left, right, bottom }}
        >
            <p
                className="py-1 px-2"
                style={{ fontSize: 10 }}
            >
                <small>Context menu node</small>
            </p>

            <DropdownGroup
                label="position"
                className="_[&>ul]:w-fit [&>ul]:p-0"
                aria-description="DropdownGroup 1"
            >
                {handleTypes.map((key) => (
                    <DropDownItem
                        key={key}
                        className=""
                        aria-description="DropDownItem source-target"
                    >
                        <DropdownGroup
                            className="[&>ul]:w-fit [&>ul]:gap-1 [&>ul]:grid [&>ul]:grid-rows-[1fr_1fr] [&>ul]:grid-cols-[1fr_1fr]"
                            aria-description="DropdownGroup 2"
                            label={key}
                        >
                            {IconDirections.map((direction) => (
                                <DropDownItem
                                    key={direction.position}
                                    className="w-fit h-fit p-0"
                                >
                                    <ContextMenuItem
                                        className="w-fit p-1"
                                        title={direction.position}
                                        onClick={() => handleChangeHandlePositon(key, direction.position)}
                                    >
                                        {/* <CircleIcon
                                            className="size-4"
                                            fill={theme.colorA}
                                            stroke={theme.colorB}
                                        /> */}
                                        {/* {IconDirection[position]?.icon({})} */}
                                        <direction.icon className="size-3" />
                                    </ContextMenuItem>
                                </DropDownItem>
                            ))}
                        </DropdownGroup>
                    </DropDownItem>
                ))}
            </DropdownGroup>
        </ContextMenu>
    );
});

ContextMenuNode.displayName = 'ContextMenuNode';
