'use client';

import React, { forwardRef, useCallback, useState } from 'react';
import { number, TypeOf, z } from 'zod';
import { Position, useReactFlow } from '@xyflow/react';
import { type LucideProps, TangentIcon, TrendingUpIcon, MinusIcon } from 'lucide-react';

import { cn } from '@/lib/classnames';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';

import { getDependency, getTopic } from '../../state/commit-topic-collection-slice';

import { useToast } from '@/components/ui/use-toast';
import { ContextMenu, ContextMenuItem, DropDownItem, DropdownGroup } from '@/app/dev/research/flow/draw-schema-flow/_party/components/context-menu';
import { LineTypeEnum, LineTypes, EdgeCustomDataSchema } from './custom-edge';

export type StateEdgeContectMenu = {
    id?: string;
    top?: number;
    left?: number;
    right?: number;
    bottom?: number;
} | null;

type ContextMenuNodeProps = StateEdgeContectMenu & React.HtmlHTMLAttributes<HTMLDivElement>;

const IconDirection: Record<LineTypes, { icon: React.ForwardRefExoticComponent<Omit<LucideProps, 'ref'> & React.RefAttributes<SVGSVGElement>> }> = {
    'bezier': { icon: TangentIcon },
    'smoothstep': { icon: TrendingUpIcon },
    'straight': { icon: MinusIcon },
};

export const ContextMenuEdge = forwardRef<HTMLDivElement, ContextMenuNodeProps>(({ id, top, left, right, bottom, ...props }, ref) => {
    const { toast } = useToast();
    const topic = useAppSelector((state) => getTopic(state, id || null));
    const dependency = useAppSelector((state) => getDependency(state, id || null));

    const { setNodes, getNode, getNodes, updateNode, updateNodeData, setEdges, getEdge, getEdges, updateEdgeData } = useReactFlow();

    const handleChangeLineType = useCallback(
        (lineType: LineTypes) => {
            if (!id) return;

            const edge = getEdge(id);
            if (!edge) {
                console.error(`change line type not apply, edge with ${id} not found`);
                return;
            }

            const validEdge = EdgeCustomDataSchema.pick({ lineType: true }).passthrough().safeParse(edge.data);

            if (!validEdge.success) {
                console.error('change line type not apply, because current edge selected not have property line type');

                return;
            }

            updateEdgeData(id, { ...validEdge.data, lineType: lineType });
        },
        [getEdge, id, updateEdgeData]
    );

    return (
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
        <ContextMenu
            ref={ref}
            {...props}
            style={{ top, left, right, bottom }}
            className={cn(!id && 'z-[-1000]')}
        >
            <p
                className="py-1 px-2"
                style={{ fontSize: 10 }}
            >
                <small>Context menu edge</small>
            </p>

            <DropdownGroup
                label="line type"
                className="_[&>ul]:w-fit [&>ul]:p-0"
            >
                {LineTypeEnum.options.map((type) => (
                    <DropDownItem
                        className=""
                        key={type}
                    >
                        <ContextMenuItem
                            title={type}
                            onClick={() => handleChangeLineType(type)}
                        >
                            {React.createElement(IconDirection[type].icon, { className: 'size-3' })}
                        </ContextMenuItem>
                    </DropDownItem>
                ))}
            </DropdownGroup>
        </ContextMenu>
    );
});

ContextMenuEdge.displayName = 'ContextMenuEdge';
