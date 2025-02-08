import React, { useRef, useState } from 'react';
import { ArrowLeftFromLineIcon, BellIcon, FilePenLineIcon, LucideProps, RefreshCwIcon, SaveIcon } from 'lucide-react';
import { Handle, NodeToolbar, Position, type Node, type NodeProps } from '@xyflow/react';

import { selectorDraw, shallow, useDrawStore } from '../../state/draw-store';
import { BaseShape, type BaseShapeVariants } from '../base-shape';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PartiallyRequired, Prettyfy } from '@/types/utilities';

export type NodeLuffyData = {
    title: string;
    description: string;
    icon: keyof typeof Icons;
    theme: BaseShapeVariants['theme'];
};

export type NodeLuffyProps = PartiallyRequired<Node<NodeLuffyData, 'NodeLuffy'>, 'type'>;

type Icons_0 = {
    name: string;
    icon: React.ForwardRefExoticComponent<Omit<LucideProps, 'ref'> & React.RefAttributes<SVGSVGElement>>;
};

const Icons = {
    BellIcon: <BellIcon />,
    RefreshCwIcon: <RefreshCwIcon />,
};

const iconsNames = Object.keys(Icons) as Array<keyof typeof Icons>;

export function NodeLuffy({ type, ...props }: NodeProps<NodeLuffyProps>) {
    const { id, selected } = props;
    const { title, description, icon, theme } = props.data;
    const [isEditMode, setIsEditMode] = useState<boolean>(false);
    const { /* updateLuffy, */ updateNodeData } = useDrawStore(selectorDraw, shallow);

    const fields = useRef<Omit<NodeLuffyProps['data'], 'theme'>>({
        title: title,
        icon: icon,
        description: description,
    });

    console.log(`shape id:${id} color:${theme}`);
    return (
        <>
            <BaseShape
                key={id}
                theme={theme}
                shapeType="square"
                data-node-name="node luffy"
                data-theme={theme}
                className="text-xs border-none  flex items-start gap-2 p-2 bg-[#e2e8f0] min-w-[155px] max-w-[300px] overflow-hidden"
            >
                {isEditMode ? (
                    <div className="space-y-[4px]">
                        <Select
                            defaultValue={icon}
                            onValueChange={(value) => {
                                if (!fields.current) return;
                                fields.current.icon = value as NodeLuffyProps['data']['icon'];
                            }}
                        >
                            <SelectTrigger className="w-full h-fit [&_svg]:size-[14px] py-1 px-1 text-xs">
                                <SelectValue placeholder="Select a icon" />
                            </SelectTrigger>
                            <SelectContent className="[&_svg]:size-[14px] text-xs">
                                <SelectGroup>
                                    <SelectLabel className="py-1 px-1 text-xs">Colors</SelectLabel>
                                    {iconsNames.map((iconName) => (
                                        <SelectItem
                                            className="py-1 pl-1"
                                            key={iconName}
                                            value={iconName}
                                        >
                                            {Icons[iconName]}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <Input
                            defaultValue={title}
                            className="text-xs h-fit p-1"
                            onChange={(e) => {
                                if (!fields.current) return;
                                fields.current.title = e.target.value;
                            }}
                        />
                        <Textarea
                            defaultValue={description}
                            className="text-xs h-fit p-1"
                            onChange={(e) => {
                                if (!fields.current) return;
                                fields.current.description = e.target.value;
                            }}
                        />
                    </div>
                ) : (
                    <>
                        <div className="h-fit w-fit [&>svg]:size-4">{Icons[icon]}</div>
                        <div className="flex-grow space-y-1">
                            <h2 className="font-bold text-base leading-none">{title}</h2>
                            <p className="text-xs leading-none text-gray-300">{description}</p>
                        </div>
                    </>
                )}
            </BaseShape>
            <NodeToolbar
                isVisible={selected}
                position={Position.Top}
            >
                <div className="space-x-1">
                    {isEditMode === false ? (
                        <Button
                            size="icon"
                            className="h-fit w-fit p-[5px] text-xs"
                            title="edit"
                            onClick={() => setIsEditMode((prev) => !prev)}
                        >
                            <FilePenLineIcon className="size-4" />
                        </Button>
                    ) : (
                        <>
                            <Button
                                size="icon"
                                className="h-fit w-fit p-[5px] text-xs"
                                title="save"
                                onClick={() => {
                                    if (!fields.current) return;
                                    // updateLuffy(id, fields.current);
                                    updateNodeData<'NodeLuffy'>(id, fields.current);
                                    setIsEditMode(false);
                                }}
                            >
                                <SaveIcon className="size-4" />
                            </Button>
                            <Button
                                size="icon"
                                className="h-fit w-fit p-[5px] text-xs"
                                title="cancel"
                                onClick={() => setIsEditMode(false)}
                            >
                                <ArrowLeftFromLineIcon className="size-4" />
                            </Button>
                        </>
                    )}
                </div>
            </NodeToolbar>
            <Handle
                className="!size-3"
                type="source"
                style={{ backgroundColor: 'green', zIndex: 1 }}
                position={Position.Right}
            />
            <Handle
                className="!size-3"
                type="target"
                style={{ backgroundColor: 'yellow', zIndex: 1 }}
                position={Position.Left}
            />
        </>
    );
}
