'use client';
import React, { useEffect, useRef, MouseEvent as ReactMouseEvent, useCallback } from 'react';
import { useKeyPress, type KeyCode } from '@xyflow/react';

import style from '../styles/zpp.module.scss';

import { cn } from '@/lib/classnames';
import cc from 'classcat';
import { useZppStore, shallow } from '../store/zpp-store';
import { containerStyle } from '../styles/utils';
import {
    type PanZoomInstance,
    XYPanZoom,
    PanOnScrollMode,
    ConnectionLineType,
    SelectionMode,
    isMacOs,
    NodeOrigin,
    Viewport as ViewportShape,
    CoordinateExtent,
    infiniteExtent,
    ColorMode,
    type Transform,
} from '../system';
import { defaultViewport as initViewport, defaultNodeOrigin } from './zoom-pan-pinch-init-values';

type ZoomPanPinchProps = {
    children?: React.ReactNode;
    /**
     * Enableing this prop allows users to pan the viewport by clicking and dragging.
     *
     * You can also set this prop to an array of numbers to limit which mouse buttons can activate panning.
     * @example [0, 2] // allows panning with the left and right mouse buttons
     * [0, 1, 2, 3, 4] // allows panning with all mouse buttons
     */
    panOnDrag?: boolean | number[];
    /**
     * If a key is set, you can pan the viewport while that key is held down even if panOnScroll is set to false.
     *
     * By setting this prop to null you can disable this functionality.
     * @default 'Space'
     */
    selectionKeyCode?: KeyCode | null;
    /**
     * If a key is set, you can pan the viewport while that key is held down even if panOnScroll is set to false.
     *
     * By setting this prop to null you can disable this functionality.
     * @default 'Space'
     */
    panActivationKeyCode?: KeyCode | null;
    /** This event handler gets called when user right clicks inside the pane */
    onPaneContextMenu?: (event: ReactMouseEvent | MouseEvent) => void;
    /** Controls if the viewport should zoom by scrolling inside the container */
    zoomOnScroll?: boolean;
    /** Controls if the viewport should zoom by pinching on a touch screen */
    zoomOnPinch?: boolean;
    /**
     * Controls if the viewport should pan by scrolling inside the container
     *
     * Can be limited to a specific direction with panOnScrollMode
     */
    panOnScroll?: boolean;
    /**
     * Controls how fast viewport should be panned on scroll.
     *
     * Use togther with panOnScroll prop.
     */
    panOnScrollSpeed?: number;
    /**
     * This prop is used to limit the direction of panning when panOnScroll is enabled.
     *
     * The "free" option allows panning in any direction.
     * @default "free"
     * @example "horizontal" | "vertical"
     */
    panOnScrollMode?: PanOnScrollMode;
    /** Controls if the viewport should zoom by double clicking somewhere on the flow */
    zoomOnDoubleClick?: boolean;
    /**
     * If a key is set, you can zoom the viewport while that key is held down even if panOnScroll is set to false.
     *
     * By setting this prop to null you can disable this functionality.
     * @default 'Meta' for macOS, "Ctrl" for other systems
     *
     */
    zoomActivationKeyCode?: KeyCode | null;
    /**
     * Disabling this prop will allow the user to scroll the page even when their pointer is over the flow.
     * @default true
     */
    preventScrolling?: boolean;
    noPanClassName?: string;
    /**
     * The type of edge path to use for connection lines.
     *
     * Although created edges can be of any type, React Flow needs to know what type of path to render for the connection line before the edge is created!
     */
    connectionLineType?: ConnectionLineType;

    /** Select multiple elements with a selection box, without pressing down selectionKey */
    selectionOnDrag?: boolean;
    /**
     * Pressing down this key deletes all selected nodes & edges.
     * @default 'Backspace'
     */
    deleteKeyCode?: KeyCode | null;
    /**
     * When set to "partial", when the user creates a selection box by click and dragging nodes that are only partially in the box are still selected.
     * @default 'full'
     */
    selectionMode?: SelectionMode;
    /**
     * Pressing down this key you can select multiple elements by clicking.
     * @default 'Meta' for macOS, "Ctrl" for other systems
     */
    multiSelectionKeyCode?: KeyCode | null;
    /**
     * You can enable this optimisation to instruct Svelte Flow to only render nodes and edges that would be visible in the viewport.
     *
     * This might improve performance when you have a large number of nodes and edges but also adds an overhead.
     * @default false
     */
    onlyRenderVisibleElements?: boolean;
    /**
     * Defines nodes relative position to its coordinates
     * @example
     * [0, 0] // default, top left
     * [0.5, 0.5] // center
     * [1, 1] // bottom right
     */
    nodeOrigin?: NodeOrigin;
    /**
     * Controls if all elements should (nodes & edges) be selectable
     * @default true
     */
    elementsSelectable?: boolean;
    /**
     * Sets the initial position and zoom of the viewport.
     *
     * If a default viewport is provided but fitView is enabled, the default viewport will be ignored.
     * @example
     * const initialViewport = {
     *  zoom: 0.5,
     *  position: { x: 0, y: 0 }
     * };
     */
    defaultViewport?: ViewportShape;
    /**
     * Minimum zoom level
     * @default 0.5
     */
    minZoom?: number;
    /**
     * Maximum zoom level
     * @default 2
     */
    maxZoom?: number;
    /**
     * By default the viewport extends infinitely. You can use this prop to set a boundary.
     *
     * The first pair of coordinates is the top left boundary and the second pair is the bottom right.
     * @example [[-1000, -10000], [1000, 1000]]
     */
    translateExtent?: CoordinateExtent;
    /**
     * Color of edge markers
     * @example "#b1b1b7"
     */
    defaultMarkerColor?: string;
    /**
     * Distance that the mouse can move between mousedown/up that will trigger a click
     * @default 0
     */
    paneClickDistance?: number;
    /**
     * Distance that the mouse can move between mousedown/up that will trigger a click
     * @default 0
     */
    nodeClickDistance?: number;
    reconnectRadius?: number;
    /** @default "nodrag"*/
    noDragClassName?: string;
    /** @default "nowheel"*/
    noWheelClassName?: string;
    /**
     * Can be set true if built-in keyboard controls should be disabled.
     * @default false
     */
    disableKeyboardA11y?: boolean;
    /**
     * Controls color scheme used for styling the flow
     * @default 'system'
     * @example 'system' | 'light' | 'dark'
     */
    colorMode?: ColorMode;
    id?: string | undefined;
    /** Controlled viewport to be used instead of internal one */
    viewport?: ViewportShape;
    /**
     * Gets called when the viewport changes.
     */
    onViewportChange?: (viewport: ViewportShape) => void;
};

/**
 * komponen own-zoom-pan-pinch (ZoomPanPinch) terinspirasi dari xyflow (react-flow) dimana package tersebut mempunyai feature
 * zoom, pan & pinch (infinity viewport). lalu saya ingin membuat component zoom-pan-pinch versi saya sendiri agar dapat full customize
 *
 * reference:
 * - [xyflow github dev](https://github.dev/xyflow/xyflow)
 * - [xyflow github repository](https://github.com/xyflow/xyflow)
 * @param props ZoomPanPinchProps
 * @returns React.JSX.Element
 */
export function ZoomPanPinch(props: ZoomPanPinchProps) {
    const {
        children,
        id,
        connectionLineType = ConnectionLineType.Bezier,
        deleteKeyCode = 'Backspace',
        selectionKeyCode = 'Shift',
        selectionOnDrag = false,
        selectionMode = SelectionMode.Full,
        panActivationKeyCode = 'Space',
        multiSelectionKeyCode = isMacOs() ? 'Meta' : 'Control',
        zoomActivationKeyCode = isMacOs() ? 'Meta' : 'Control',
        onlyRenderVisibleElements = false,
        nodeOrigin = defaultNodeOrigin,
        elementsSelectable = true,
        defaultViewport = initViewport,
        minZoom = 0.5,
        maxZoom = 2,
        translateExtent = infiniteExtent,
        preventScrolling = true,
        defaultMarkerColor = '#b1b1b7',
        zoomOnScroll = true,
        zoomOnPinch = true,
        panOnScroll = false,
        panOnScrollSpeed = 0.5,
        panOnScrollMode = PanOnScrollMode.Free,
        zoomOnDoubleClick = true,
        panOnDrag = true,
        paneClickDistance = 0,
        nodeClickDistance = 0,
        reconnectRadius = 10,
        noDragClassName = 'nodrag',
        noWheelClassName = 'nowheel',
        noPanClassName = 'nopan',
        disableKeyboardA11y = false,
        colorMode = 'light',
        viewport,
        onViewportChange,
    } = props;
    const rfId = id || '1';
    return (
        <div
            nama-component="ReactFlow"
            // data-comp-name="zoom-pan-pinch"
            className={cn(style['zoom-pan-pinch'])}
        >
            <GraphView
                rfId={rfId}
                panOnDrag={panOnDrag}
                panActivationKeyCode={panActivationKeyCode}
                // required
                selectionKeyCode={selectionKeyCode}
                deleteKeyCode={deleteKeyCode}
                multiSelectionKeyCode={multiSelectionKeyCode}
                connectionLineType={connectionLineType}
                onlyRenderVisibleElements={onlyRenderVisibleElements}
                translateExtent={translateExtent}
                minZoom={minZoom}
                maxZoom={maxZoom}
                defaultMarkerColor={defaultMarkerColor}
                noDragClassName={noDragClassName}
                noWheelClassName={noWheelClassName}
                noPanClassName={noPanClassName}
                defaultViewport={defaultViewport}
                disableKeyboardA11y={disableKeyboardA11y}
                paneClickDistance={paneClickDistance}
                nodeClickDistance={nodeClickDistance}
                viewport={viewport}
                onViewportChange={onViewportChange}
            />
            {children}
        </div>
    );
}

//* GraphView
type GraphViewProps = Omit<
    ZoomPanPinchProps,
    'onSelectionChange' | 'nodes' | 'edges' | 'onMove' | 'onMoveStart' | 'onMoveEnd' | 'elevateEdgesOnSelect'
> &
    Required<
        Pick<
            ZoomPanPinchProps,
            | 'selectionKeyCode'
            | 'deleteKeyCode'
            | 'multiSelectionKeyCode'
            | 'connectionLineType'
            | 'onlyRenderVisibleElements'
            | 'translateExtent'
            | 'minZoom'
            | 'maxZoom'
            | 'defaultMarkerColor'
            | 'noDragClassName'
            | 'noWheelClassName'
            | 'noPanClassName'
            | 'defaultViewport'
            | 'disableKeyboardA11y'
            | 'paneClickDistance'
            | 'nodeClickDistance'
        >
    > & {
        rfId: string;
    };
function GraphViewComponent(props: GraphViewProps) {
    const {
        panOnDrag,
        panActivationKeyCode,

        // required
        selectionKeyCode,
        deleteKeyCode,
        multiSelectionKeyCode,
        connectionLineType,
        onlyRenderVisibleElements,
        translateExtent,
        minZoom,
        maxZoom,
        defaultMarkerColor,
        noDragClassName,
        noWheelClassName,
        noPanClassName,
        defaultViewport,
        disableKeyboardA11y,
        paneClickDistance,
        nodeClickDistance,
        viewport,
        onViewportChange,
    } = props;
    return (
        <FlowRenderer
            // onPaneClick={onPaneClick}
            // onPaneMouseEnter={onPaneMouseEnter}
            // onPaneMouseMove={onPaneMouseMove}
            // onPaneMouseLeave={onPaneMouseLeave}
            // onPaneContextMenu={onPaneContextMenu}
            // onPaneScroll={onPaneScroll}
            paneClickDistance={paneClickDistance}
            deleteKeyCode={deleteKeyCode}
            selectionKeyCode={selectionKeyCode}
            // selectionOnDrag={selectionOnDrag}
            // selectionMode={selectionMode}
            // onSelectionStart={onSelectionStart}
            // onSelectionEnd={onSelectionEnd}
            multiSelectionKeyCode={multiSelectionKeyCode}
            panActivationKeyCode={panActivationKeyCode}
            // zoomActivationKeyCode={zoomActivationKeyCode}
            // elementsSelectable={elementsSelectable}
            // zoomOnScroll={zoomOnScroll}
            // zoomOnPinch={zoomOnPinch}
            // zoomOnDoubleClick={zoomOnDoubleClick}
            // panOnScroll={panOnScroll}
            // panOnScrollSpeed={panOnScrollSpeed}
            // panOnScrollMode={panOnScrollMode}
            panOnDrag={panOnDrag}
            defaultViewport={defaultViewport}
            translateExtent={translateExtent}
            minZoom={minZoom}
            maxZoom={maxZoom}
            // onSelectionContextMenu={onSelectionContextMenu}
            // preventScrolling={preventScrolling}
            noDragClassName={noDragClassName}
            noWheelClassName={noWheelClassName}
            noPanClassName={noPanClassName}
            disableKeyboardA11y={disableKeyboardA11y}
            onViewportChange={onViewportChange}
            isControlledViewport={!!viewport}
        >
            <Viewport>
                <div className="w-[200px] h-[200px] bg-red-500"></div>
            </Viewport>
        </FlowRenderer>
    );
}
GraphViewComponent.displayName = 'GraphView';
export const GraphView = React.memo(GraphViewComponent);

//* FlowRenderer
const win = typeof window !== 'undefined' ? window : undefined;
type FlowRendererProps = {
    children?: React.ReactNode;
    isControlledViewport: boolean;
} & Omit<
    GraphViewProps,
    | 'snapToGrid'
    | 'nodeTypes'
    | 'edgeTypes'
    | 'snapGrid'
    | 'connectionLineType'
    | 'connectionLineContainerStyle'
    | 'arrowHeadColor'
    | 'onlyRenderVisibleElements'
    | 'selectNodesOnDrag'
    | 'defaultMarkerColor'
    | 'rfId'
    | 'nodeClickDistance'
>;
export function FlowRendererComponent(props: FlowRendererProps) {
    const {
        children,
        selectionOnDrag,
        panOnDrag: _panOnDrag,
        selectionKeyCode,
        panActivationKeyCode,
        noPanClassName,

        defaultViewport,
        deleteKeyCode,
        disableKeyboardA11y,
        maxZoom,
        minZoom,
        multiSelectionKeyCode,
        noDragClassName,
        noWheelClassName,
        paneClickDistance,
        translateExtent,
        colorMode,
        elementsSelectable,
        id,
        nodeOrigin,
        onPaneContextMenu,
        panOnScroll,
        // ConnectionLineType,
        panOnScrollMode,
        panOnScrollSpeed,
        preventScrolling,
        reconnectRadius,
        selectionMode,
        zoomActivationKeyCode,
        zoomOnDoubleClick,
        zoomOnPinch,
        zoomOnScroll,
        isControlledViewport,
        onViewportChange,
    } = props;

    const store = useZppStore((s) => ({ userSelectionActive: s.userSelectionActive }), shallow);
    const selectionKeyPressed = useKeyPress(selectionKeyCode, { target: win });
    const panActivationKeyPressed = useKeyPress(panActivationKeyCode, { target: win });

    const panOnDrag = panActivationKeyPressed || _panOnDrag;
    const _selectionOnDrag = selectionOnDrag && panOnDrag !== true;
    const isSelecting = selectionKeyPressed || store.userSelectionActive || _selectionOnDrag;
    return (
        <ZoomPane
            onPaneContextMenu={onPaneContextMenu}
            elementsSelectable={elementsSelectable}
            zoomOnScroll={zoomOnScroll}
            zoomOnPinch={zoomOnPinch}
            panOnScroll={panOnScroll}
            panOnScrollSpeed={panOnScrollSpeed}
            panOnScrollMode={panOnScrollMode}
            zoomOnDoubleClick={zoomOnDoubleClick}
            panOnDrag={!selectionKeyPressed && panOnDrag}
            defaultViewport={defaultViewport}
            translateExtent={translateExtent}
            minZoom={minZoom}
            maxZoom={maxZoom}
            zoomActivationKeyCode={zoomActivationKeyCode}
            preventScrolling={preventScrolling}
            noWheelClassName={noWheelClassName}
            noPanClassName={noPanClassName}
            onViewportChange={onViewportChange}
            isControlledViewport={isControlledViewport}
            paneClickDistance={paneClickDistance}
        >
            <Pane
                isSelecting={!!isSelecting}
                panOnDrag={panOnDrag}
            >
                {children}
            </Pane>
        </ZoomPane>
    );
}
FlowRendererComponent.displayName = 'FlowRenderer';
export const FlowRenderer = React.memo(FlowRendererComponent);

//* ZoomPane
type ZoomPaneProps = Omit<
    FlowRendererProps,
    'deleteKeyCode' | 'selectionKeyCode' | 'multiSelectionKeyCode' | 'noDragClassName' | 'disableKeyboardA11y' | 'selectionOnDrag'
> & {
    isControlledViewport: boolean;
};

export function ZoomPane(props: ZoomPaneProps) {
    const {
        panOnDrag = true,
        onPaneContextMenu,
        zoomOnScroll = true,
        zoomOnPinch = true,
        panOnScroll = false,
        panOnScrollSpeed = 0.5,
        panOnScrollMode = PanOnScrollMode.Free,
        zoomOnDoubleClick = true,
        zoomActivationKeyCode,
        preventScrolling = true,
        children,
        noPanClassName,
        minZoom,
        maxZoom,
        translateExtent,
        viewport,
        defaultViewport,
        paneClickDistance,
        noWheelClassName,
        onViewportChange,
        isControlledViewport,
    } = props;
    const zoomPane = useRef<HTMLDivElement>(null);
    const store = useZppStore((s) => {
        return {
            userSelectionActive: s.userSelectionActive,
            updatePaneDragging: s.updatePaneDragging,
            onViewportChangeStart: s.onViewportChangeStart,
            onMoveStart: s.onMoveStart,
            onViewportChange: s.onViewportChange,
            onMove: s.onMove,
            onViewportChangeEnd: s.onViewportChangeEnd,
            onMoveEnd: s.onMoveEnd,
            updatePanZoom: s.updatePanZoom,
            updateTransform: s.updateTransform,
            updateDomNode: s.updateDomNode,
            lib: s.lib,
        };
    }, shallow);
    const zoomActivationKeyPressed = useKeyPress(zoomActivationKeyCode);
    const panZoom = useRef<PanZoomInstance>();

    const onTransformChange = useCallback(
        (transform: Transform) => {
            onViewportChange?.({ x: transform[0], y: transform[1], zoom: transform[2] });

            if (!isControlledViewport) {
                // store.setState({ transform });
                store.updateTransform({ x: transform[0], y: transform[1], zoom: transform[2] });
            }
        },
        // TODO: sementara menggunakan exhaustive-deps (abakan saran eslint). jika nanti ada waktu tolong periksa code ini lagi, seharusnya tetap mengabakan saran eslint atau mengikuti saran eslint
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [onViewportChange, isControlledViewport, store.updateTransform]
    );

    useEffect(() => {
        if (zoomPane.current) {
            panZoom.current = XYPanZoom({
                domNode: zoomPane.current,
                minZoom,
                maxZoom,
                translateExtent,
                viewport: defaultViewport,
                paneClickDistance,
                onDraggingChange: (paneDragging: boolean) => {
                    // store.setState({ paneDragging })
                    store.updatePaneDragging(paneDragging);
                },
                onPanZoomStart: (event, vp) => {
                    // const { onViewportChangeStart, onMoveStart } = store.getState();
                    const { onViewportChangeStart, onMoveStart } = store;
                    onMoveStart?.(event, vp);
                    onViewportChangeStart?.(vp);
                },
                onPanZoom: (event, vp) => {
                    // const { onViewportChange, onMove } = store.getState();
                    const { onViewportChange, onMove } = store;
                    onMove?.(event, vp);
                    onViewportChange?.(vp);
                },
                onPanZoomEnd: (event, vp) => {
                    // const { onViewportChangeEnd, onMoveEnd } = store.getState();
                    const { onViewportChangeEnd, onMoveEnd } = store;
                    onMoveEnd?.(event, vp);
                    onViewportChangeEnd?.(vp);
                },
            });

            const { x, y, zoom } = panZoom.current!.getViewport();

            store.updatePanZoom(panZoom.current);
            store.updateTransform({ x, y, zoom });
            store.updateDomNode(zoomPane.current.closest('.react-flow') as HTMLDivElement);
            /**
            store.setState({
                panZoom: panZoom.current,
                transform: [x, y, zoom],
                domNode: zoomPane.current.closest('.react-flow') as HTMLDivElement,
            });
            */

            return () => {
                panZoom.current?.destroy();
            };
        }
        // TODO: sementara menggunakan exhaustive-deps (abakan saran eslint). jika nanti ada waktu tolong periksa code ini lagi, seharusnya tetap mengabakan saran eslint atau mengikuti saran eslint
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        panZoom.current?.update({
            onPaneContextMenu,
            zoomOnScroll,
            zoomOnPinch,
            panOnScroll,
            panOnScrollSpeed,
            panOnScrollMode,
            zoomOnDoubleClick,
            panOnDrag,
            zoomActivationKeyPressed,
            preventScrolling,
            noPanClassName,
            userSelectionActive: store.userSelectionActive,
            noWheelClassName,
            // lib,
            lib: store.lib,
            onTransformChange,
        });
    }, [
        onPaneContextMenu,
        zoomOnScroll,
        zoomOnPinch,
        panOnScroll,
        panOnScrollSpeed,
        panOnScrollMode,
        zoomOnDoubleClick,
        panOnDrag,
        zoomActivationKeyPressed,
        preventScrolling,
        noPanClassName,
        // userSelectionActive,
        store.userSelectionActive,
        noWheelClassName,
        // lib,
        store.lib,
        onTransformChange,
    ]);

    return (
        // eslint-disable-next-line react/no-unknown-property
        <div
            nama-component="ZoomPane"
            className={cn(style['__renderer'])}
            ref={zoomPane}
            style={containerStyle}
        >
            {children}
        </div>
    );
}

//* Pane
type PaneProps = {
    children?: React.ReactNode;
    isSelecting: boolean;
} & Pick<ZoomPanPinchProps, 'panOnDrag'>;
export function Pane({ children, panOnDrag, isSelecting }: PaneProps) {
    const store = useZppStore(
        (s) => ({ paneDragging: s.paneDragging, elementsSelectable: s.elementsSelectable, userSelectionActive: s.userSelectionActive }),
        shallow
    );

    const draggable = panOnDrag === true || (Array.isArray(panOnDrag) && panOnDrag.includes(0));
    console.log('Pane:draggable', { draggable });
    return (
        <div
            // eslint-disable-next-line react/no-unknown-property
            nama-component="Pane"
            // className={cc(['react-flow__pane', { draggable, dragging, selection: isSelecting }])}
            className={cn(
                style['__pane'],
                // style['draggable'],
                draggable && style['draggable'],
                store.paneDragging && style['dragging'],
                isSelecting && style['selection']
            )}
            style={containerStyle}
        >
            {children}
        </div>
    );
}

//* Viewport
type ViewportProps = {
    children: React.ReactNode;
};
export function Viewport({ children }: ViewportProps) {
    const store = useZppStore((s) => ({ transform: s.transform }), shallow);

    return (
        <div
            // eslint-disable-next-line react/no-unknown-property
            nama-component="Viewport"
            // className="react-flow__viewport xyflow__viewport react-flow__container"
            className={cn(style['__viewport'], style['__container'])}
            style={{ transform: `translate(${store.transform.x}px,${store.transform.y}px) scale(${store.transform.zoom})` }}
        >
            {children}
        </div>
    );
}
