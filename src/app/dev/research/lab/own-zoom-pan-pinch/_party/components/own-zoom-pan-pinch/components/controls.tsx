'use client';
import React, { ButtonHTMLAttributes, memo, ReactNode } from 'react';
import cc from 'classcat';
import { shallow } from 'zustand/shallow';
import { MinusIcon, PlusIcon, ScanIcon as FitViewIcon, LockKeyholeIcon as LockIcon, LockKeyholeOpenIcon as UnlockIcon } from 'lucide-react';

import styles from '../styles/zpp.module.scss';

import type { FitViewOptions } from '../types';
import type { PanelPosition } from '../system/types';
import { useZppStore } from '../store/zpp-store';
import { Panel } from './panel';
import { cn } from '@/lib/classnames';

/**
 * @expand
 */
export type ControlProps = {
    /** Show button for zoom in/out @default true */
    showZoom?: boolean;
    /** Show button for fit view */
    showFitView?: boolean;
    /** Show button for toggling interactivity */
    showInteractive?: boolean;
    /** Options being used when fit view button is clicked */
    fitViewOptions?: FitViewOptions;
    /** Callback when zoom in button is clicked */
    onZoomIn?: () => void;
    /** Callback when zoom out button is clicked */
    onZoomOut?: () => void;
    /** Callback when fit view button is clicked */
    onFitView?: () => void;
    /** Callback when interactivity is toggled */
    onInteractiveChange?: (interactiveStatus: boolean) => void;
    /**
     * Position of the controls on the pane
     * @example PanelPosition.TopLeft, PanelPosition.TopRight,
     * PanelPosition.BottomLeft, PanelPosition.BottomRight
     */
    position?: PanelPosition;
    children?: ReactNode;
    /** Style applied to container */
    style?: React.CSSProperties;
    /** ClassName applied to container */
    className?: string;
    'aria-label'?: string;
    orientation?: 'horizontal' | 'vertical';
};
function ControlsComponent(props: ControlProps) {
    const {
        style,
        showZoom = true,
        showFitView = true,
        showInteractive = true,
        fitViewOptions,
        onZoomIn,
        onZoomOut,
        onFitView,
        onInteractiveChange,
        className,
        children,
        position = 'bottom-left',
        orientation = 'vertical',
        'aria-label': ariaLabel = 'React Flow controls',
    } = props;
    // const store = useStoreApi();
    const store = useZppStore((s) => {
        return {
            isInteractive: s.nodesDraggable || s.nodesConnectable || s.elementsSelectable,
            minZoomReached: s.transform.zoom <= s.minZoom,
            maxZoomReached: s.transform.zoom >= s.maxZoom,
            zoomIn: s.zoomIn,
            zoomOut: s.zoomOut,
            onControlToggleInteractivity: s.onControlToggleInteractivity,
        };
    }, shallow);
    // const { zoomIn, zoomOut, fitView } = useReactFlow();

    const onZoomInHandler = () => {
        store.zoomIn();
        onZoomIn?.();
    };

    const onZoomOutHandler = () => {
        store.zoomOut();
        onZoomOut?.();
    };

    const onFitViewHandler = () => {
        // fitView(fitViewOptions);
        onFitView?.();
    };

    const onToggleInteractivity = () => {
        /** 
        store.setState({
            nodesDraggable: !isInteractive,
            nodesConnectable: !isInteractive,
            elementsSelectable: !isInteractive,
        });
        */
        store.onControlToggleInteractivity({
            nodesDraggable: !store.isInteractive,
            nodesConnectable: !store.isInteractive,
            elementsSelectable: !store.isInteractive,
        });

        onInteractiveChange?.(!store.isInteractive);
    };

    const orientationClass = orientation === 'horizontal' ? 'horizontal' : 'vertical';

    return (
        <Panel
            // className={cc(['react-flow__controls', orientationClass, className])}
            className={cn(styles['__controls'], orientationClass === 'horizontal' ? styles['horizontal'] : '', className)}
            position={position}
            style={style}
            data-testid="rf__controls"
            aria-label={ariaLabel}
        >
            {showZoom && (
                <>
                    <ControlButton
                        onClick={onZoomInHandler}
                        className="react-flow__controls-zoomin"
                        title="zoom in"
                        aria-label="zoom in"
                        disabled={store.maxZoomReached}
                    >
                        <PlusIcon />
                    </ControlButton>
                    <ControlButton
                        onClick={onZoomOutHandler}
                        className="react-flow__controls-zoomout"
                        title="zoom out"
                        aria-label="zoom out"
                        disabled={store.minZoomReached}
                    >
                        <MinusIcon />
                    </ControlButton>
                </>
            )}
            {showFitView && (
                <ControlButton
                    className="react-flow__controls-fitview"
                    onClick={onFitViewHandler}
                    title="fit view"
                    aria-label="fit view"
                >
                    <FitViewIcon />
                </ControlButton>
            )}
            {showInteractive && (
                <ControlButton
                    className="react-flow__controls-interactive"
                    onClick={onToggleInteractivity}
                    title="toggle interactivity"
                    aria-label="toggle interactivity"
                >
                    {store.isInteractive ? <UnlockIcon /> : <LockIcon />}
                </ControlButton>
            )}
            {children}
        </Panel>
    );
}

ControlsComponent.displayName = 'Controls';

/**
 * The `<Controls />` component renders a small panel that contains convenient
 * buttons to zoom in, zoom out, fit the view, and lock the viewport.
 *
 * @public
 * @example
 *```tsx
 *import { ReactFlow, Controls } from '@xyflow/react'
 *
 *export default function Flow() {
 *  return (
 *    <ReactFlow nodes={[...]} edges={[...]}>
 *      <Controls />
 *    </ReactFlow>
 *  )
 *}
 *```
 *
 * @remarks To extend or customise the controls, you can use the [`<ControlButton />`](/api-reference/components/control-button) component
 *
 */
export const Controls = memo(ControlsComponent);

//*

export type ControlButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

/**
 * You can add buttons to the control panel by using the `<ControlButton />` component
 * and pass it as a child to the [`<Controls />`](/api-reference/components/controls) component.
 *
 * @public
 * @example
 *```jsx
 *import { MagicWand } from '@radix-ui/react-icons'
 *import { ReactFlow, Controls, ControlButton } from '@xyflow/react'
 *
 *export default function Flow() {
 *  return (
 *    <ReactFlow nodes={[...]} edges={[...]}>
 *      <Controls>
 *        <ControlButton onClick={() => alert('Something magical just happened. ✨')}>
 *          <MagicWand />
 *        </ControlButton>
 *      </Controls>
 *    </ReactFlow>
 *  )
 *}
 *```
 */
export function ControlButton({ children, className, ...rest }: ControlButtonProps) {
    return (
        <button
            type="button"
            // className={cc(['react-flow__controls-button', className])}
            className={cn(styles['__controls-button'], className)}
            {...rest}
        >
            {children}
        </button>
    );
}
