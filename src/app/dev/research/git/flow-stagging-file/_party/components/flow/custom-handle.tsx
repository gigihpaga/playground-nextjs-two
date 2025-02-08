import { cn } from '@/lib/classnames';
import { Handle, type HandleProps } from '@xyflow/react';

export function CustomHandle(props: HandleProps) {
    return (
        <Handle
            className={cn('!size-3 !bg-yellow-500', props.type === 'target' && '!bg-green-500', props.className)}
            style={{
                // background: 'cyan',
                border: '1px solid black',
            }}
            {...props}
        />
    );
}
