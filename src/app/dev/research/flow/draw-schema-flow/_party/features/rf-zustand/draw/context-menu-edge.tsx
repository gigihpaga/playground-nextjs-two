'use client';

import React, { forwardRef, useCallback, useState } from 'react';
import { ContextMenu, ContextMenuItem, DropDownItem, DropdownGroup } from '../../../components/context-menu';
import { CircleIcon, CopyIcon, ScanEyeIcon } from 'lucide-react';
import { useReactFlow } from '../../../hooks/react-flow';
import { LineTypeEnum, LabelPositionEnum, EdgeWithDeleteButton1DataSchema, type LineTypes } from '../../../components/flow/edge-with-delete-button-1';
import { themeInlineStyleList, themeInlineStyle } from '../../../components/base-shape';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogPortal,
    DialogOverlay,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { CustomEdgeType } from '../../../components/flow/custom-types';
import { z } from 'zod';

export type StateEdgeContectMenu = {
    id: string;
    top: number | undefined;
    left: number | undefined;
    right: number | undefined;
    bottom: number | undefined;
} | null;

type ContextMenuEdgeProps = StateEdgeContectMenu & React.HtmlHTMLAttributes<HTMLDivElement>;
/* { onClick: (event: React.MouseEvent<Element, MouseEvent>) => void;} */

export const ContextMenuEdge = forwardRef<HTMLDivElement, ContextMenuEdgeProps>(({ id, top, left, right, bottom, ...props }, ref) => {
    const { getEdge, updateEdgeData, updateEdge } = useReactFlow();
    const edge = getEdge(id);
    const handleChangeLineType = useCallback(
        (lineType: LineTypes) => {
            const edge = getEdge(id);
            const isHaveKeyLineType = EdgeWithDeleteButton1DataSchema.pick({ lineType: true }).passthrough().safeParse(edge?.data);
            if (!isHaveKeyLineType.success) {
                console.error('line type not apply, because current edge selected not have property line type');
                // console.warn(isHaveKeyLineType.error.errors);
                return;
            }

            updateEdgeData(id, { ...isHaveKeyLineType.data, lineType: lineType });
        },
        [getEdge, id, updateEdgeData]
    );

    const handleCheckEdge = useCallback(() => {
        // window.alert(JSON.stringify(edge, null, 2));
        console.log(edge);
    }, [edge]);

    const handleChangeColor = useCallback(
        (colorName: (typeof themeInlineStyleList)[number]['colorName']) => {
            if (!edge) {
                return;
            }
            const isHaveKeyTheme = EdgeWithDeleteButton1DataSchema.pick({ theme: true }).passthrough().safeParse(edge?.data);
            if (!isHaveKeyTheme.success) {
                console.error('color not apply, because current edge selected not have property theme');
                // console.warn(isHaveKeyTheme.error.errors);
                return;
            }

            // updateEdgeData(id, { ...isHaveKeyTheme.data, theme: colorName });

            const mrkrEnd =
                typeof edge.markerEnd === 'object'
                    ? {
                          ...edge.markerEnd,
                          color: themeInlineStyle[colorName].colorC,
                      }
                    : edge.markerEnd;

            updateEdge(id, {
                ...edge,
                markerEnd: mrkrEnd, // change markend color
                data: {
                    ...isHaveKeyTheme.data,

                    // @ts-ignore
                    theme: colorName, // change line color
                },
            });
        },
        [edge, id, updateEdge]
    );

    return (
        <ContextMenu
            ref={ref}
            {...props}
            style={{ top, left, right, bottom }}
        >
            <p
                className="py-1 px-2"
                style={{ fontSize: 10 }}
            >
                <small>Context menu edge</small>
            </p>
            <ContextMenuItem onClick={handleCheckEdge}>
                checkedge
                <ScanEyeIcon className="size-3" />
            </ContextMenuItem>

            <DropdownGroup label="line type">
                {LineTypeEnum.options.map((lt) => (
                    <DropDownItem
                        key={lt}
                        className="py-0"
                    >
                        <ContextMenuItem onClick={() => handleChangeLineType(lt)}>{lt}</ContextMenuItem>
                    </DropDownItem>
                ))}
            </DropdownGroup>
            <DropdownGroup label="color">
                <DropDownItem className="flex gap-x-2 w-fit">
                    {themeInlineStyleList.map((theme) => (
                        <button
                            key={theme.colorName}
                            onClick={() => handleChangeColor(theme.colorName)}
                        >
                            <CircleIcon
                                className="size-4"
                                fill={theme.colorC}
                                stroke={theme.colorB}
                            />
                        </button>
                    ))}
                </DropDownItem>
            </DropdownGroup>
            {edge ? <DialogEditLabel edge={edge} /> : null}
        </ContextMenu>
    );
});

ContextMenuEdge.displayName = 'ContextMenuEdge';

const ShapeLabelingSchema = EdgeWithDeleteButton1DataSchema.pick({
    startLabel: true,
    endLabel: true,
    startLabelPosition: true,
    endLabelPosition: true,
});
const ShapeLabelingSchemaKey = ShapeLabelingSchema.keyof();

function DialogEditLabel({ edge }: { edge: CustomEdgeType }) {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    let isShape = ShapeLabelingSchema.passthrough().safeParse(edge?.data);

    const [dataEditable, setDataEditable] = useState(isShape.data);
    const { updateEdgeData } = useReactFlow();

    function handleOnChangeText(field: z.infer<typeof ShapeLabelingSchemaKey>, value: string) {
        if (!isShape.success) return;

        setDataEditable((prev) => ({
            ...prev,
            [field]: value,
        }));
    }

    function handleOnSave() {
        updateEdgeData(edge.id, { ...dataEditable });
        setIsOpen(false);
    }

    return (
        <Dialog
            open={isOpen}
            onOpenChange={setIsOpen}
        >
            <DialogTrigger asChild>
                <Button
                    size="sm"
                    variant="ghost"
                    className="justify-start h-fit px-3 py-1"
                >
                    edit label
                </Button>
            </DialogTrigger>

            <DialogContent
                className="sm:max-w-[425px]"
                aria-description="form-edit-label"
            >
                <DialogHeader>
                    <DialogTitle>Edit label</DialogTitle>
                    {/* eslint-disable-next-line react/no-unescaped-entities */}
                    <DialogDescription>Make changes to your profile here. Click save when you're done.</DialogDescription>
                </DialogHeader>
                {isShape.success ? (
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label
                                htmlFor="startLabel"
                                className="text-left"
                            >
                                startLabel
                            </Label>
                            <Input
                                id="startLabel"
                                // value={isShape.data.startLabel}
                                value={dataEditable?.startLabel ?? ''}
                                onChange={(event) => handleOnChangeText('startLabel', event.target.value)}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label
                                htmlFor="startLabelPosition"
                                className="text-left"
                            >
                                Start label position
                            </Label>
                            <Select
                                value={dataEditable?.startLabelPosition}
                                onValueChange={(value) => handleOnChangeText('startLabelPosition', value)}
                            >
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Select Position" />
                                </SelectTrigger>
                                <SelectContent>
                                    {LabelPositionEnum.options.map((position) => (
                                        <SelectItem
                                            key={position}
                                            value={position}
                                        >
                                            {position}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label
                                htmlFor="endLabel"
                                className="text-left"
                            >
                                endLabel
                            </Label>
                            <Input
                                id="endLabel"
                                value={dataEditable?.endLabel ?? ''}
                                onChange={(event) => handleOnChangeText('endLabel', event.target.value)}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label
                                htmlFor="endLabelPosition"
                                className="text-left"
                            >
                                Start label position
                            </Label>
                            <Select
                                value={dataEditable?.endLabelPosition}
                                onValueChange={(value) => handleOnChangeText('endLabelPosition', value)}
                            >
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Select Position" />
                                </SelectTrigger>
                                <SelectContent>
                                    {LabelPositionEnum.options.map((position) => (
                                        <SelectItem
                                            key={position}
                                            value={position}
                                        >
                                            {position}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                ) : (
                    <p>edge not not have properties startLabel & endLabel</p>
                )}
                <DialogFooter>
                    <Button onClick={() => handleOnSave()}>Save changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
