'use client';
import { useState } from 'react';
import { BookOpenTextIcon, GroupIcon, HandIcon, MousePointer2Icon, TypeIcon } from 'lucide-react';

// import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
// import { addNode, onConnect, onEdgesChange, onNodesChange, setEdges, setNodes, getNodes, getEdges } from '../../state/draw-slice';
import { selectorDraw, shallow, useDrawStore } from '../../../state/draw-store';

import { Button, type ButtonProps } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/custom/radio-group';
import { DropdownMenuShape } from './dropdown-menu-shape';
import { DropdownMenuSchema } from './dropdown-menu-schema';

export function PanelBotom() {
    return (
        <div
            className="flex flex-row items-center border p-1 rounded-[11px] z-[300] relative bg-background [&>*:last-child]:mr-[4px]"
            style={{ pointerEvents: 'all' }}
        >
            <ButtonCheckState />
            <PanelRadio />
            <DropdownMenuShape />
            <DropdownMenuSchema />
            <ButtonAddGroup />
            <ButtonAddText />
        </div>
    );
}

/**********************************************************************
 *                              Features                              *
 **********************************************************************/
function PanelRadio() {
    const [panelActive, setPanelActive] = useState<string>('compact');
    return (
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
    );
}

function ButtonCheckState() {
    const { nodes, edges } = useDrawStore(selectorDraw, shallow);
    return (
        <ButtonPanel
            variant="ghost"
            title="check nodes and edges"
            onClick={() => {
                console.log({ nodes, edges });
            }}
        >
            <BookOpenTextIcon />
        </ButtonPanel>
    );
}

function ButtonAddGroup() {
    const { addNode } = useDrawStore(selectorDraw, shallow);
    return (
        <ButtonPanel
            variant="ghost"
            title="add group"
            onClick={() => {
                addNode('NodeGroup', {
                    type: 'NodeGroup',
                    data: { title: 'new group' },
                    position: { x: 0, y: 0 },
                    width: 150,
                    height: 150,
                    // style: { width: 150, height: 150, minWidth: 150, minHeight: 150 },
                    // measured: { height: 150, width: 150 },
                    // initialHeight: 150,
                    // initialWidth: 150,
                });
            }}
        >
            <GroupIcon />
        </ButtonPanel>
    );
}

function ButtonAddText() {
    const { addNode } = useDrawStore(selectorDraw, shallow);
    return (
        <ButtonPanel
            variant="ghost"
            title="add text"
            onClick={() => {
                addNode('NodeText', {
                    type: 'NodeText',
                    data: { text: 'new text\napa aja' },
                    position: { x: 0, y: 0 },
                    // width: 150,
                    // height: 150,
                });
            }}
        >
            <TypeIcon />
        </ButtonPanel>
    );
}

/**********************************************************************
 *                                 UI                                 *
 **********************************************************************/
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
