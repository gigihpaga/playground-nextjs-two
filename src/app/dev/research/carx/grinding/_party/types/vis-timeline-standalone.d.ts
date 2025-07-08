// c:\Backup drive E\my code\playground-nextjs-two\src\app\dev\research\carx\grinding\_party\types\vis-timeline-standalone.d.ts
import { IdType, Timeline as TimelineOri, TimelineOptions as InternalTimelineOptions } from 'vis-timeline';

// declare module 'vis-timeline/standalone' {}

// declare module 'vis-timeline/types' {}

declare module 'vis-timeline' {
    interface Timeline extends TimelineOri {
        getVisibleGroups(): IdType[];
    }
    interface TimelineOptions extends InternalTimelineOptions {
        loadingScreenTemplate?: (element: HTMLDivElement) => string | HTMLElement;
    }
}
