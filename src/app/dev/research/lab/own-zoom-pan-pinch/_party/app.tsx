'use client';

import { ZoomPanPinch, ZoomPane, Pane, Viewport, Background, Controls } from './components/own-zoom-pan-pinch';

/**
 *
 * usage example for own-zoom-pan-pinch component
 */
export function App() {
    return (
        <ZoomPanPinch>
            <Controls />
            <Background />
        </ZoomPanPinch>
    );
}
