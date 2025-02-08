'use client';
import { useState } from 'react';
import { BookOpenTextIcon, HandIcon, MousePointer2Icon, TypeIcon } from 'lucide-react';

import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { addNode, onConnect, onEdgesChange, onNodesChange, setEdges, setNodes, getNodes, getEdges } from '../../state/draw-schema-flow-slice';

import { Button, type ButtonProps } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/custom/radio-group';
import { DropdownMenuShape } from './dropdown-menu-shape';

export function PanelBotom() {
    const [panelActive, setPanelActive] = useState<string>('compact');
    return (
        <div
            className="flex flex-row items-center border rounded-[11px] z-[300] relative bg-background [&>*:last-child]:mr-[4px]"
            style={{ pointerEvents: 'all' }}
        >
            <RadioGroup
                value={panelActive}
                onValueChange={(e) => {
                    console.log(panelActive);
                    setPanelActive(e);
                }}
                className=""
            >
                <RadioGroupItem
                    value="default"
                    id="r1"
                >
                    <MousePointer2Icon />
                </RadioGroupItem>

                <RadioGroupItem
                    value="comfortable"
                    id="r2"
                >
                    <HandIcon />
                </RadioGroupItem>

                <RadioGroupItem
                    value="compact"
                    id="r3"
                >
                    <TypeIcon />
                </RadioGroupItem>
            </RadioGroup>

            {/* <ButtonPanel className="mr-[4px]">halo</ButtonPanel> */}
            <DropdownMenuShape />
            <ButtonCheckState />
        </div>
    );
}

function ButtonPanel({ children, className, ...props }: ButtonProps) {
    return (
        <Button
            size="icon"
            className={className}
            {...props}
        >
            {children}
        </Button>
    );
}

function ButtonCheckState() {
    const nodes = useAppSelector(getNodes);
    const edges = useAppSelector(getEdges);
    return (
        <ButtonPanel
            variant="ghost"
            onClick={() => {
                console.log({ nodes, edges });
            }}
        >
            <BookOpenTextIcon />
        </ButtonPanel>
    );
}
