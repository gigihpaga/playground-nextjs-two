'use client';

import { ReactFlowProvider } from '@xyflow/react';

import { FlowXRedux } from './features/rf-redux/flow-x-redux';
import { FlowXSelf } from './features/rf-self/flow-x-self';
import { FlowXZustandMindmap } from './features/rf-zustand/minmap/flow-x-zustand-mindmap';
import { FlowXZustandDraw } from './features/rf-zustand/draw/flow-x-zustand-draw';
import { CustomMarker } from './components/icons';

export function App() {
    return (
        <div className="h-full flex flex-col">
            <section>a</section>
            <ReactFlowProvider>
                <CustomMarker id="custom-marker-svg" />
                <Flow />
            </ReactFlowProvider>
            <section>b</section>
        </div>
    );
}

function Flow() {
    return (
        <main className="flex-1 min-h-[50vh]">
            {/* <FlowXRedux /> */}
            {/* <FlowXSelf /> */}
            {/* <FlowXZustandMindmap /> */}
            <FlowXZustandDraw />
        </main>
    );
}
