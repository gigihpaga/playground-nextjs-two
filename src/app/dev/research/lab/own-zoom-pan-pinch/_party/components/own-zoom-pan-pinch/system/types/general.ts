// ///* eslint-disable @typescript-eslint/no-explicit-any */
import type { Selection as D3Selection } from 'd3-selection';
import type { D3DragEvent, SubjectPosition } from 'd3-drag';
import type { ZoomBehavior } from 'd3-zoom';
// this is needed for the Selection type to include the transition function :/
// //eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { Transition } from 'd3-transition';

import type { XYPosition, Rect, Position } from './utils';
import type { InternalNodeBase, NodeBase, NodeDragItem } from './nodes';
import type { Handle, HandleType } from './handles';
import { PanZoomInstance } from './panzoom';
import { EdgeBase } from '..';

export type Project = (position: XYPosition) => XYPosition;

export type OnMove = (event: MouseEvent | TouchEvent | null, viewport: Viewport) => void;
export type OnMoveStart = OnMove;
export type OnMoveEnd = OnMove;

export type ZoomInOut = (options?: ViewportHelperFunctionOptions) => Promise<boolean>;
export type ZoomTo = (zoomLevel: number, options?: ViewportHelperFunctionOptions) => Promise<boolean>;
export type GetZoom = () => number;
export type GetViewport = () => Viewport;
export type SetViewport = (viewport: Viewport, options?: ViewportHelperFunctionOptions) => Promise<boolean>;
export type SetCenter = (x: number, y: number, options?: SetCenterOptions) => Promise<boolean>;
export type FitBounds = (bounds: Rect, options?: FitBoundsOptions) => Promise<boolean>;

/**
 * The `Connection` type is the basic minimal description of an [`Edge`](/api-reference/types/edge)
 * between two nodes. The [`addEdge`](/api-reference/utils/add-edge) util can be used to upgrade
 * a `Connection` to an [`Edge`](/api-reference/types/edge).
 *
 * @public
 */
export type Connection = {
    source: string;
    target: string;
    sourceHandle: string | null;
    targetHandle: string | null;
};

/**
 * The `HandleConnection` type is an extention of a basic [Connection](/api-reference/types/connection) that includes the `edgeId`.
 */
export type HandleConnection = Connection & {
    edgeId: string;
};

/**
 * The `NodeConnection` type is an extention of a basic [Connection](/api-reference/types/connection) that includes the `edgeId`.
 *
 */
export type NodeConnection = Connection & {
    edgeId: string;
};

/**
 * The `ConnectionMode` is used to set the mode of connection between nodes.
 * The `Strict` mode is the default one and only allows source to target edges.
 * `Loose` mode allows source to source and target to target edges as well.
 *
 * @public
 */
export enum ConnectionMode {
    Strict = 'strict',
    Loose = 'loose',
}

export type OnConnectStartParams = {
    nodeId: string | null;
    handleId: string | null;
    handleType: HandleType | null;
};

export type OnConnectStart = (event: MouseEvent | TouchEvent, params: OnConnectStartParams) => void;
export type OnConnect = (connection: Connection) => void;
export type OnConnectEnd = (event: MouseEvent | TouchEvent, connectionState: FinalConnectionState) => void;

export type IsValidConnection = (edge: EdgeBase | Connection) => boolean;

/**
 * @inline
 */
export type FitViewParamsBase<NodeType extends NodeBase> = {
    nodes: Map<string, InternalNodeBase<NodeType>>;
    width: number;
    height: number;
    panZoom: PanZoomInstance;
    minZoom: number;
    maxZoom: number;
};

/**
 * @inline
 */
export type FitViewOptionsBase<NodeType extends NodeBase = NodeBase> = {
    padding?: number;
    includeHiddenNodes?: boolean;
    minZoom?: number;
    maxZoom?: number;
    duration?: number;
    nodes?: (NodeType | { id: string })[];
};

/**
 * Internally, React Flow maintains a coordinate system that is independent of the
 * rest of the page. The `Viewport` type tells you where in that system your flow
 * is currently being display at and how zoomed in or out it is.
 *
 * @public
 * @remarks A `Transform` has the same properties as the viewport, but they represent
 * different things. Make sure you don't get them muddled up or things will start
 * to look weird!
 *
 */
export type Viewport = {
    x: number;
    y: number;
    zoom: number;
};

export type KeyCode = string | Array<string>;

export type SnapGrid = [number, number];

/**
 * This enum is used to set the different modes of panning the viewport when the
 * user scrolls. The `Free` mode allows the user to pan in any direction by scrolling
 * with a device like a trackpad. The `Vertical` and `Horizontal` modes restrict
 * scroll panning to only the vertical or horizontal axis, respectively.
 *
 * @public
 */
export enum PanOnScrollMode {
    Free = 'free',
    Vertical = 'vertical',
    Horizontal = 'horizontal',
}

/**
 * @inline
 */
export type ViewportHelperFunctionOptions = {
    duration?: number;
};

export type SetCenterOptions = ViewportHelperFunctionOptions & {
    zoom?: number;
};

export type FitBoundsOptions = ViewportHelperFunctionOptions & {
    padding?: number;
};

export type OnViewportChange = (viewport: Viewport) => void;

export type D3ZoomInstance = ZoomBehavior<Element, unknown>;
export type D3SelectionInstance = D3Selection<Element, unknown, null, undefined>;
export type D3ZoomHandler = (this: Element, event: any, d: unknown) => void;

export type UpdateNodeInternals = (nodeId: string | string[]) => void;

/**
 * This type is mostly used to help position things on top of the flow viewport. For
 * example both the [`<MiniMap />`](/api-reference/components/minimap) and
 * [`<Controls />`](/api-reference/components/controls) components take a `position`
 * prop of this type.
 *
 * @public
 */
export type PanelPosition = 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';

export type ProOptions = {
    account?: string;
    hideAttribution: boolean;
};

export type UseDragEvent = D3DragEvent<HTMLDivElement, null, SubjectPosition>;

export enum SelectionMode {
    Partial = 'partial',
    Full = 'full',
}

export type SelectionRect = Rect & {
    startX: number;
    startY: number;
};

export type OnError = (id: string, message: string) => void;

export type UpdateNodePositions = (dragItems: Map<string, NodeDragItem | InternalNodeBase>, dragging?: boolean) => void;
export type PanBy = (delta: XYPosition) => Promise<boolean>;

export const initialConnection: NoConnection = {
    inProgress: false,
    isValid: null,
    from: null,
    fromHandle: null,
    fromPosition: null,
    fromNode: null,
    to: null,
    toHandle: null,
    toPosition: null,
    toNode: null,
};

export type NoConnection = {
    inProgress: false;
    isValid: null;
    from: null;
    fromHandle: null;
    fromPosition: null;
    fromNode: null;
    to: null;
    toHandle: null;
    toPosition: null;
    toNode: null;
};
export type ConnectionInProgress<NodeType extends InternalNodeBase = InternalNodeBase> = {
    inProgress: true;
    isValid: boolean | null;
    from: XYPosition;
    fromHandle: Handle;
    fromPosition: Position;
    fromNode: NodeType;
    to: XYPosition;
    toHandle: Handle | null;
    toPosition: Position;
    toNode: NodeType | null;
};

/**
 * The `ConnectionState` type bundles all information about an ongoing connection.
 * It is returned by the [`useConnection`](/api-reference/hooks/use-connection) hook.
 *
 * @public
 */
export type ConnectionState<NodeType extends InternalNodeBase = InternalNodeBase> = ConnectionInProgress<NodeType> | NoConnection;

export type FinalConnectionState<NodeType extends InternalNodeBase = InternalNodeBase> = Omit<ConnectionState<NodeType>, 'inProgress'>;

export type UpdateConnection<NodeType extends InternalNodeBase = InternalNodeBase> = (params: ConnectionState<NodeType>) => void;

export type ColorModeClass = 'light' | 'dark';
export type ColorMode = ColorModeClass | 'system';

export type ConnectionLookup = Map<string, Map<string, HandleConnection>>;

export type OnBeforeDeleteBase<NodeType extends NodeBase = NodeBase, EdgeType extends EdgeBase = EdgeBase> = ({
    nodes,
    edges,
}: {
    nodes: NodeType[];
    edges: EdgeType[];
}) => Promise<boolean | { nodes: NodeType[]; edges: EdgeType[] }>;
