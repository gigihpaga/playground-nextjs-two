import {
    type FitViewOptionsBase,
    type FitViewParamsBase,
    ZoomInOut,
    ZoomTo,
    GetZoom,
    SetViewport,
    GetViewport,
    SetCenter,
    FitBounds,
    XYPosition,
} from '../system';
import { type Node } from '@xyflow/react';

export type FitViewOptions<NodeType extends Node = Node> = FitViewOptionsBase<NodeType>;
export type FitView = (fitViewOptions?: FitViewOptions) => Promise<boolean>;

/**
 * @inline
 */
export type ViewportHelperFunctions = {
    /**
     * Zooms viewport in by 1.2.
     *
     * @param options.duration - optional duration. If set, a transition will be applied
     */
    zoomIn: ZoomInOut;
    /**
     * Zooms viewport out by 1 / 1.2.
     *
     * @param options.duration - optional duration. If set, a transition will be applied
     */
    zoomOut: ZoomInOut;
    /**
     * Sets the current zoom level.
     *
     * @param zoomLevel - the zoom level to set
     * @param options.duration - optional duration. If set, a transition will be applied
     */
    zoomTo: ZoomTo;
    /**
     * Returns the current zoom level.
     *
     * @returns current zoom as a number
     */
    getZoom: GetZoom;
    /**
     * Sets the current viewport.
     *
     * @param viewport - the viewport to set
     * @param options.duration - optional duration. If set, a transition will be applied
     */
    setViewport: SetViewport;
    /**
     * Returns the current viewport.
     *
     * @returns Viewport
     */
    getViewport: GetViewport;
    /**
     * Fits the view.
     *
     * @param options.padding - optional padding
     * @param options.includeHiddenNodes - optional includeHiddenNodes
     * @param options.minZoom - optional minZoom
     * @param options.maxZoom - optional maxZoom
     * @param options.duration - optional duration. If set, a transition will be applied
     * @param options.nodes - optional nodes to fit the view to
     */
    fitView: FitView;
    /**
     * Sets the center of the view to the given position.
     *
     * @param x - x position
     * @param y - y position
     * @param options.zoom - optional zoom
     */
    setCenter: SetCenter;
    /**
     * Fits the view to the given bounds .
     *
     * @param bounds - the bounds ({ x: number, y: number, width: number, height: number }) to fit the view to
     * @param options.padding - optional padding
     */
    fitBounds: FitBounds;
    /**
     * Converts a screen / client position to a flow position.
     *
     * @param clientPosition - the screen / client position. When you are working with events you can use event.clientX and event.clientY
     * @param options.snapToGrid - if true, the converted position will be snapped to the grid
     * @returns position as { x: number, y: number }
     *
     * @example
     * const flowPosition = screenToFlowPosition({ x: event.clientX, y: event.clientY })
     */
    screenToFlowPosition: (clientPosition: XYPosition, options?: { snapToGrid: boolean }) => XYPosition;
    /**
     * Converts a flow position to a screen / client position.
     *
     * @param flowPosition - the screen / client position. When you are working with events you can use event.clientX and event.clientY
     * @returns position as { x: number, y: number }
     *
     * @example
     * const clientPosition = flowToScreenPosition({ x: node.position.x, y: node.position.y })
     */
    flowToScreenPosition: (flowPosition: XYPosition) => XYPosition;
};
