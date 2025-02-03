import { VisTimelineEx1 } from './components/vis-timeline-ex';
import KanbanWithTimeline from './components/vis-timeline-gpt';

export function App() {
    return (
        <div
            aria-description="vis timeline first try"
            className=""
        >
            {/* <VisTimelineEx1 /> */}
            <KanbanWithTimeline />
        </div>
    );
}
