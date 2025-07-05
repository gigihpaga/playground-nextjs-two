import { createWithEqualityFn, type UseBoundStoreWithEqualityFn } from 'zustand/traditional';
import { type StoreApi } from 'zustand';
import { shallow } from 'zustand/shallow';
import { devtools, persist } from 'zustand/middleware';
import {} from 'zustand/vanilla';

import type { PanZoomInstance } from '../system/types/panzoom';
import { ViewportHelperFunctions, FitViewOptions } from '../types';
import { ViewportHelperFunctionOptions } from '../system';

export type Viewport = {
    x: number;
    y: number;
    zoom: number;
};
export type OnMove = (event: MouseEvent | TouchEvent | null, viewport: Viewport) => void;
export type OnMoveStart = OnMove;
export type OnMoveEnd = OnMove;
export type OnViewportChange = (viewport: Viewport) => void;
type ZppState = {
    /** @default "1" */
    rfId: string;
    /** @default
     * x: 0; y: 0; zoom: 1
     */
    transform: { x: number; y: number; zoom: number };
    /** @default false */
    paneDragging: boolean;
    /** @default false */
    userSelectionActive: boolean;
    /** @default true */
    elementsSelectable: boolean;
    /** @default null */
    panZoom: PanZoomInstance | null;
    /** @default null */
    domNode: HTMLDivElement | null;

    // event handlers
    onViewportChangeStart?: OnViewportChange;
    onViewportChange?: OnViewportChange;
    onViewportChangeEnd?: OnViewportChange;
    onMoveStart?: OnMoveStart;
    onMove?: OnMove;
    onMoveEnd?: OnMoveEnd;
    lib: string;

    // controls
    /** @default 0.5 */
    minZoom: number;
    /** @default 2 */
    maxZoom: number;
    /** @default true */
    nodesDraggable: boolean;
    /** @default true */
    nodesConnectable: boolean;
};

type ZppAction = ReturnType<typeof zppAction>;

// type ZppStore = ZppState & ZppAction;

//* State and Action

const zppInitialState: ZppState = {
    rfId: '1',
    transform: { x: 0, y: 0, zoom: 1 },
    paneDragging: false,
    userSelectionActive: false,
    elementsSelectable: true,
    panZoom: null,
    domNode: null,
    lib: 'react',

    // controls
    minZoom: 0.5,
    maxZoom: 2,
    nodesDraggable: true,
    nodesConnectable: true,
};

const zppAction = (
    set: (
        partial: ZppState | Partial<ZppState> | ((state: ZppState) => ZppState | Partial<ZppState>),
        replace?: boolean | undefined,
        action?: string | undefined
    ) => void,
    get: () => ZppState
) => {
    return {
        updateTransform: (stateTransform: ZppState['transform']) => {
            set({
                transform: stateTransform,
            });
        },
        /** update "paneDragging" */
        updatePaneDragging: (statePaneDragging: ZppState['paneDragging']) => {
            set({
                paneDragging: statePaneDragging,
            });
        },
        /** update "PanZoom" */
        updatePanZoom: (statePanZoom: ZppState['panZoom']) => {
            set({
                panZoom: statePanZoom,
            });
        },
        /** update "DomNode" */
        updateDomNode: (stateDomNode: ZppState['domNode']) => {
            set({
                domNode: stateDomNode,
            });
        },
        zoomIn: (options?: ViewportHelperFunctionOptions) => {
            const { panZoom } = get();

            return panZoom ? panZoom.scaleBy(1.2, { duration: options?.duration }) : Promise.resolve(false);
        },
        zoomOut: (options?: ViewportHelperFunctionOptions) => {
            const { panZoom } = get();

            return panZoom ? panZoom.scaleBy(1 / 1.2, { duration: options?.duration }) : Promise.resolve(false);
        },
        onControlToggleInteractivity: (payload: Pick<ZppState, 'nodesDraggable' | 'nodesConnectable' | 'elementsSelectable'>) => {
            set({
                nodesDraggable: payload.nodesDraggable,
                nodesConnectable: payload.nodesConnectable,
                elementsSelectable: payload.elementsSelectable,
            });
        },
    };
};

//* Create store

export const useZppStore = createWithEqualityFn<ZppState & ZppAction, [['zustand/devtools', never]]>(
    devtools((set, get) => {
        return {
            ...zppInitialState,
            ...zppAction(set, get),
        };
    })
);

export type ZppStore = ReturnType<typeof useZppStore>;

export { shallow };
