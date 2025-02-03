import { App } from './_party/app';
import 'vis-timeline/styles/vis-timeline-graph2d.css';
import 'vis-timeline/styles/vis-timeline-graph2d.min.css';
import 'vis-timeline/styles/vis-timeline-graph2d.min.css';

export default async function PageVisTimelineFirstTry() {
    return (
        <div className="w-full container py-2">
            <h1>Vis Timeline (First Try)</h1>
            <App />
        </div>
    );
}
