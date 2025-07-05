import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import cc from 'classcat';
import type { PanelPosition } from '@xyflow/system';

import { useZppStore, shallow } from '../store/zpp-store';
import styles from '../styles/zpp.module.scss';
import { cn } from '@/lib/classnames';

/**
 * @expand
 */
export type PanelProps = HTMLAttributes<HTMLDivElement> & {
    /**
     * The position of the panel
     */
    position?: PanelPosition;
    children: ReactNode;
};

// const selector = (s: ReactFlowState) => (s.userSelectionActive ? 'none' : 'all');

/**
 * The `<Panel />` component helps you position content above the viewport.
 * It is used internally by the [`<MiniMap />`](/api-reference/components/minimap)
 * and [`<Controls />`](/api-reference/components/controls) components.
 *
 * @public
 *
 * @example
 * ```jsx
 *import { ReactFlow, Background, Panel } from '@xyflow/react';
 *
 *export default function Flow() {
 *  return (
 *    <ReactFlow nodes={[]} fitView>
 *      <Panel position="top-left">top-left</Panel>
 *      <Panel position="top-center">top-center</Panel>
 *      <Panel position="top-right">top-right</Panel>
 *      <Panel position="bottom-left">bottom-left</Panel>
 *      <Panel position="bottom-center">bottom-center</Panel>
 *      <Panel position="bottom-right">bottom-right</Panel>
 *    </ReactFlow>
 *  );
 *}
 *```
 */

const positionClass = {
    top: styles['top'],
    left: styles['left'],
    center: styles['center'],
    right: styles['right'],
    bottom: styles['bottom'],
};
export const Panel = forwardRef<HTMLDivElement, PanelProps>(({ position = 'top-left', children, className, style, ...rest }, ref) => {
    const pointerEvents = useZppStore((s) => (s.userSelectionActive ? 'none' : 'all'), shallow);
    const positionClasses = `${position}`.split('-').map((postKey) => {
        return positionClass[postKey as keyof typeof positionClass];
    });

    return (
        <div
            // className={cc(['react-flow__panel', className, ...positionClasses])}
            className={cn(styles['__panel'], ...positionClasses, className)}
            style={{ ...style, pointerEvents }}
            ref={ref}
            {...rest}
        >
            {children}
        </div>
    );
});

Panel.displayName = 'Panel';
