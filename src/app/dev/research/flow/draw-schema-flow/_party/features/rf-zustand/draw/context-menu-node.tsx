'use client';

import React, { forwardRef, useCallback } from 'react';
import { z } from 'zod';
import { CircleIcon, CopyIcon, DeleteIcon, RefreshCwIcon, ScanEyeIcon } from 'lucide-react';

import { useReactFlow } from '../../../hooks/react-flow';
import { selectorDraw, shallow, useDrawStore } from '../../../state/draw-store';

import { orderGroup, searchChilds } from '../../../utils/order-group';
import { BaseShape, BaseShapeProps, themeInlineStyleList, baseShapeVariantsSchema } from '../../../components/base-shape';
import { NodeGroupProps } from '../../../components/flow/node-group';
import { CustomNodeType, NodeVariants } from '../../../components/flow/custom-types';
import { ContextMenu, ContextMenuItem, DropDownItem, DropdownGroup } from '../../../components/context-menu';
import { positions, nodeShapeDataSchema } from '../../../components/flow/node-shape';
import { useToast } from '@/components/ui/use-toast';

export type StateNodeContectMenu = {
    id: string;
    top: number | undefined;
    left: number | undefined;
    right: number | undefined;
    bottom: number | undefined;
} | null;

type ContextMenuNodeProps = StateNodeContectMenu & React.HtmlHTMLAttributes<HTMLDivElement>;

const themeVariantSchema = baseShapeVariantsSchema.pick({ theme: true });

type ThemeVariant = z.infer<typeof themeVariantSchema>;

export const ContextMenuNode = forwardRef<HTMLDivElement, ContextMenuNodeProps>(({ id, top, left, right, bottom, ...props }, ref) => {
    const { toast } = useToast();
    const { updateNodeData, getNodes, setNodes, getNodeGroups, addNode } = useDrawStore(selectorDraw, shallow);
    const { /*  updateNodeData, */ getNode, /* setNodes, */ addNodes, setEdges } = useReactFlow();

    const handleDuplicateNode = useCallback(() => {
        const node = getNode(id);
        if (!node) return;
        const position = {
            x: node.position.x + 50,
            y: node.position.y + 50,
        };

        addNode(node.type, {
            ...node,
            // @ts-expect-error
            type: node.type,
            selected: false,
            dragging: false,
            position,
        });
    }, [id, getNode, addNode]);

    const handleDeleteNode = useCallback(() => {
        setNodes((nodes) => nodes.filter((node) => node.id !== id));
        setEdges((edges) => edges.filter((edge) => edge.source !== id));
    }, [id, setNodes, setEdges]);

    const handleCheckNode = useCallback(() => {
        const node = getNode(id);
        // window.alert(JSON.stringify(node, null, 2));
        console.log(node);
    }, [getNode, id]);

    const handleChangeColor = useCallback(
        (colorName: (typeof themeInlineStyleList)[number]['colorName']) => {
            const node = getNode(id);
            const isHaveKeyTheme = themeVariantSchema.passthrough().safeParse(node?.data);
            if (!isHaveKeyTheme.success) {
                console.error('color not apply, because current node selected not have property theme');
                // console.warn(isHaveKeyTheme.error.errors);
                return;
            }

            updateNodeData(id, { ...isHaveKeyTheme.data, theme: colorName });
        },
        [getNode, id, updateNodeData]
    );

    const handleChangeHandlePositon = useCallback(
        (key: keyof typeof nodeShapeDataSchema.shape.positionHandle.shape, position: (typeof positions)[number]) => {
            const node = getNode(id);
            const nodeShape = nodeShapeDataSchema.passthrough().safeParse(node?.data);
            if (!nodeShape.success) {
                console.error('color not apply, because current node selected not have property theme');
                // console.warn(isHaveKeyTheme.error.errors);
                return;
            }

            updateNodeData(id, { ...nodeShape.data, positionHandle: { ...nodeShape.data.positionHandle, [key]: position } });
        },
        [getNode, id, updateNodeData]
    );

    const handleUngrouppingNode = useCallback(() => {
        setNodes((nodes) =>
            nodes.map((node) => {
                if (node.id === id) {
                    return {
                        ...node,
                        parentId: undefined,
                    };
                }
                return node;
            })
        );
    }, [id, setNodes]);

    const handleReset = useCallback(() => {
        setNodes([
            {
                id: 'ha',
                position: { x: 100, y: 100 },
                type: 'default',
                data: { label: '' },
            },
        ]);
    }, [setNodes]);

    const handleGrouppingNode = useCallback(
        (targetNodeId: string) => {
            const isMyChild = searchChilds(getNodeGroups(), id).some((n) => n.id === targetNodeId);
            if (isMyChild) {
                toast({
                    title: 'Warning',
                    description: (
                        <p className="[&>span]:italic [&>span]:underline [&>span]:underline-offset-2">
                            Node&nbsp;
                            <span>{id}</span> cannot grouped to node&nbsp;
                            <span>{targetNodeId}</span>, because node&nbsp;
                            <span>{targetNodeId}</span> is child of node&nbsp;
                            <span>{id}</span>
                        </p>
                    ),
                    // variant: 'destructive',
                });
                console.warn(`Node: ${id} cannot group to Node ${targetNodeId}, because Node ${targetNodeId} is child of Node ${id}`);
            } else {
                const nodeUpdated = getNodes().map((node) => {
                    if (node.id === id) {
                        return {
                            ...node,
                            parentId: targetNodeId,
                            expandParent: true,
                            position: { x: (node.measured?.width ?? 0) / 2 + 10, y: (node.measured?.height ?? 0) / 2 + 10 },
                        };
                    }
                    return node;
                });

                const nodeOrdered = orderGroup(nodeUpdated);
                setNodes(nodeOrdered);
            }
        },
        [getNodeGroups, getNodes, id, setNodes, toast]
    );

    return (
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
        <ContextMenu
            ref={ref}
            {...props}
            style={{ top, left, right, bottom }}
        >
            <p
                className="py-1 px-2"
                style={{ fontSize: 10 }}
            >
                <small>Context menu node</small>
            </p>
            <ContextMenuItem onClick={handleCheckNode}>
                checknode
                <ScanEyeIcon className="size-3" />
            </ContextMenuItem>
            <ContextMenuItem onClick={handleDuplicateNode}>
                duplicate
                <CopyIcon className="size-3" />
            </ContextMenuItem>
            <ContextMenuItem onClick={handleDeleteNode}>
                delete
                <DeleteIcon className="size-3" />
            </ContextMenuItem>
            <ContextMenuItem onClick={() => handleReset}>
                reset
                <RefreshCwIcon className="size-3" />
            </ContextMenuItem>

            <DropdownGroup label="group">
                {getNodeGroups().filter((n) => n.id !== id).length ? (
                    getNodeGroups()
                        .filter((node) => node.id !== id)
                        .map((node) => (
                            <DropDownItem
                                key={node.id}
                                className="py-0"
                            >
                                <ContextMenuItem onClick={() => handleGrouppingNode(node.id)}>{(node as NodeGroupProps)?.data.title}</ContextMenuItem>
                            </DropDownItem>
                        ))
                ) : (
                    <DropDownItem>No group</DropDownItem>
                )}
            </DropdownGroup>
            <ContextMenuItem onClick={handleUngrouppingNode}>ungroup</ContextMenuItem>
            <DropdownGroup label="color">
                <DropDownItem className="flex gap-x-2 w-fit">
                    {themeInlineStyleList.map((theme) => (
                        <button
                            key={theme.colorName}
                            onClick={() => handleChangeColor(theme.colorName)}
                        >
                            <CircleIcon
                                className="size-4"
                                fill={theme.colorA}
                                stroke={theme.colorB}
                            />
                        </button>
                    ))}
                </DropDownItem>
            </DropdownGroup>
            <DropdownGroup
                label="position"
                className="_[&>ul]:w-fit [&>ul]:p-0"
            >
                <DropDownItem className="">
                    {(['source', 'target'] as (keyof typeof nodeShapeDataSchema.shape.positionHandle.shape)[]).map((key) => (
                        <DropdownGroup
                            key={key}
                            label={key}
                        >
                            <DropDownItem className="">
                                {positions.map((position) => (
                                    <ContextMenuItem
                                        key={position}
                                        onClick={() => handleChangeHandlePositon(key, position)}
                                    >
                                        {/* <CircleIcon
                                            className="size-4"
                                            fill={theme.colorA}
                                            stroke={theme.colorB}
                                        /> */}
                                        {position}
                                    </ContextMenuItem>
                                ))}
                            </DropDownItem>
                        </DropdownGroup>
                    ))}
                </DropDownItem>
            </DropdownGroup>
        </ContextMenu>
    );
});

ContextMenuNode.displayName = 'ContextMenuNode';
