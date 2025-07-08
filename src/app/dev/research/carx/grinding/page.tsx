import { App } from './_party/features/app';
import './_party/styles/custom-vis-timeline.scss';
import 'vis-timeline/styles/vis-timeline-graph2d.min.css';

interface PageProps {
    params: { [key: string]: string | string[] | undefined } | Record<string, never>;
    searchParams: { [key: string]: string | string[] | undefined } | Record<string, never>;
}

export default async function PageCarxGrinding(req: PageProps) {
    return (
        <div className="w-full px-2 sm:container">
            <App />
        </div>
    );
}
