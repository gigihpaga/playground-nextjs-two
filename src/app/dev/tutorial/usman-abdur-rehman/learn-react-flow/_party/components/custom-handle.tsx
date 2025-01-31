import { cn } from '@/lib/classnames';
import { Handle, type HandleProps } from '@xyflow/react';

export function CustomHandle(props: HandleProps) {
    return (
        <Handle
            className={cn('!size-3')}
            style={{
                background: 'cyan',
                border: '2px solid black',
            }}
            {...props}
        />
    );
}
