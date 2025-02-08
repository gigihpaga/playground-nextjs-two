import { useState } from 'react';
import { Handle, Position, NodeResizer, type Node, type NodeProps, NodeToolbar, useReactFlow, useStore } from '@xyflow/react';
import { z } from 'zod';

import { PartiallyRequired } from '@/types/utilities';
import { cn } from '@/lib/classnames';
import { selectorDraw, shallow, useDrawStore } from '../../state/draw-store';

/**********************************************************************
 *                           Schema & Types                           *
 **********************************************************************/
export const NodeTextDataSchema = z.object({
    text: z.string(),
});

export type NodeTextData = z.infer<typeof NodeTextDataSchema>;

export type NodeTextProps = PartiallyRequired<Node<NodeTextData, 'NodeText'>, 'type'>;

/**********************************************************************
 *                           Main Component                           *
 **********************************************************************/

export function NodeText(props: NodeProps<NodeTextProps>) {
    const {
        id,
        width,
        height,
        selected,
        type,
        data: { text },
    } = props;
    const { updateNodeData } = useDrawStore(selectorDraw, shallow);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [textEditable, setTextEditable] = useState(text);
    return (
        <>
            <NodeResizer
                color="#ff0071"
                isVisible={selected}
                keepAspectRatio
                // minWidth={150}
                // minHeight={150}
            />
            <div
                data-isediting={isEditing}
                onDoubleClick={() => setIsEditing(true)}
                className="bg-green-400 h-full p-2 w-full flex flex-col justify-center items-center bg-transparent"
            >
                <div className={cn('_h-full w-full text-center', isEditing === true && 'opacity-0')}>
                    {text.split('\n').map((t) => (
                        <p
                            key={t}
                            className="text-center text-white leading-tight"
                        >
                            {t}
                        </p>
                    ))}
                </div>
                <textarea
                    className={cn(
                        'bg-red-500  _h-full resize-none w-full leading-tight p-[3px] _inset-0 text-foreground absolute opacity-0 text-center bg-transparent focus:outline-0 focus:outline-transparent focus-visible::outline-0 focus-visible::outline-transparent',
                        isEditing === true && 'nodrag nopan opacity-100'
                    )}
                    readOnly={!isEditing}
                    // style={{ pointerEvents: 'all' }}
                    name="shape-text"
                    // defaultValue={text}
                    value={textEditable}
                    minLength={1}
                    // style={{ height: 17 }}
                    // onFocus={() => setIsEditing(true)}
                    onChange={(e) => {
                        setTextEditable(e.target.value);
                        console.log(e.target.value.split('\n'));
                    }}
                    onBlur={(e) => {
                        // updateNodeData<'NodeText'>(id, { text: e.target.value });
                        updateNodeData<'NodeText'>(id, { text: textEditable });
                        setIsEditing(false);
                    }}
                />
            </div>
        </>
    );
}
