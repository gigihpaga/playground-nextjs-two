import { useState, type Dispatch, type SetStateAction, type ReactNode, HTMLAttributes } from 'react';
import { Panel } from '@xyflow/react';

import { NodeInspector } from './node-inspector';
import { ChangeLogger } from './change-logger';
import { ViewportLogger } from './viewport-logger';
import { Button } from '@/components/ui/button';

export function DevTools({ isNodeInspectorActive = true, isChangeLoggerActive = true, isViewportLoggerActive = true }) {
    const [nodeInspectorActive, setNodeInspectorActive] = useState(isNodeInspectorActive);
    const [changeLoggerActive, setChangeLoggerActive] = useState(isChangeLoggerActive);
    const [viewportLoggerActive, setViewportLoggerActive] = useState(isViewportLoggerActive);

    return (
        <div
            className="xxx-react-flow__devtools rounded-md text-xs"
            aria-description="react flow devtools"
        >
            <Panel
                position="top-left"
                className="[&>button:not(:first-child,:last-child)]:rounded-none [&>button:not(:first-child,:last-child)]:border-r [&>button:not(:first-child,:last-child)]:border-l [&>button:first-child]:rounded-r-none [&>button:last-child]:rounded-l-none"
            >
                <DevToolButton
                    setActive={setNodeInspectorActive}
                    active={nodeInspectorActive}
                    title="Toggle Node Inspector"
                >
                    Node Inspector
                </DevToolButton>
                <DevToolButton
                    setActive={setChangeLoggerActive}
                    active={changeLoggerActive}
                    title="Toggle Change Logger"
                >
                    Change Logger
                </DevToolButton>
                <DevToolButton
                    setActive={setViewportLoggerActive}
                    active={viewportLoggerActive}
                    title="Toggle Viewport Logger"
                >
                    Viewport Logger
                </DevToolButton>
            </Panel>
            {changeLoggerActive && <ChangeLogger />}
            {nodeInspectorActive && <NodeInspector />}
            {viewportLoggerActive && <ViewportLogger />}
        </div>
    );
}

function DevToolButton({
    active,
    setActive,
    children,
    ...rest
}: {
    active: boolean;
    setActive: Dispatch<SetStateAction<boolean>>;
    children: ReactNode;
} & HTMLAttributes<HTMLButtonElement>) {
    return (
        <Button
            size="sm"
            onClick={() => setActive((a) => !a)}
            className={active ? 'active' : 'text-muted-foreground'}
            {...rest}
        >
            {children}
        </Button>
    );
}
