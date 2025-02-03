'use client';
import { useEffect, useRef } from 'react';
import { Timeline as Vis } from 'vis-timeline/standalone';
import { TimelineOptions as InternalTimelineOptions, DataItem, DataGroup } from 'vis-timeline/types/index';
import { DataSet } from 'vis-data';

const TODAY = new Date();

const defaultTimelineOptions: InternalTimelineOptions = {
    // width: '100%',
    // height: "calc(100vh - 100px)",
    // height: '150px',
    showMajorLabels: true,
    zoomable: true,

    // timeAxis: { scale: 'minute', step: 5 },

    // min: new Date('October 13, 2018 10:56:00'),
    // max: new Date('October 16, 2018 12:00:00'),
    //type: "background",
    selectable: true,
    // editable: true,
    editable: {
        add: false,
        remove: false,
        updateGroup: true,
        updateTime: true,
    },
    orientation: 'top',
    // orientation: { axis: 'top' },
    align: 'center',
    // zoomKey: 'ctrlKey',
    // zoomMin: timeIntervals.ONE_HOUR,
    // zoomMin: 1000 * 60 * 60,
    // zoomMax: timeIntervals[p.options.range ?? 'ONE_WEEK'],
    // zoomMax: 1000 * 60 * 60 * 2,
    verticalScroll: true,
    horizontalScroll: true,
    snap: null,
    stack: false,
    showCurrentTime: true,
    // margin: {
    //   item: {
    //     horizontal: -1,
    //   },
    // },
    margin: {
        item: 10, // minimal margin between items
        axis: 5, // minimal margin between items and the axis
    },
    groupHeightMode: 'fitItems',
    // start: defaultStart,
    start: new Date(),
    // start: new Date('October 14, 2018 10:00:00'),
    // end: defaultEnd,
    // end: new Date(1000 * 60 * 60 * 24 + new Date().valueOf()),
    end: new Date(new Date().setMonth(new Date().getMonth() + 1)),
    // end: new Date('October 15, 2018 15:00:00'),
    // initialDate: new Date(),
    // range: 'ONE_WEEK',
    // groupTemplate: (item?: TimelineGroup, element?: TimelineElement) => {
    //     return renderItemTemplate({ item, element, itemType: 'group', Component: p.options.groupComponent });
    // },
    // template: (item?: TimelineItem, element?: TimelineElement) => {
    //   return renderItemTemplate({ item, element, itemType: 'item', Component: p.options.itemComponent })
    // },
    // skipAmount: 'ONE_DAY',
    // largeSkipAmount: 'ONE_WEEK',
};

var options = {
    stack: false,
    start: new Date(),
    end: new Date(1000 * 60 * 60 * 24 + new Date().valueOf()),
    editable: true,
    margin: {
        item: 10, // minimal margin between items
        axis: 5, // minimal margin between items and the axis
    },
    orientation: 'top',
};

/**
 * reference:
 * - [official example vis-timeline](https://visjs.github.io/vis-timeline/examples/timeline/)
 * - [official github vis-timeline](https://github.com/visjs/vis-timeline)
 * - [official docs vis-timeline](https://visjs.github.io/vis-timeline/docs/timeline/#Templates)
 * - [issues React 18 support with vis-timeline](https://github.com/visjs/vis-timeline/issues/1779)
 * @returns
 */
export function VisTimelineEx1() {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const timelineRef = useRef<Vis | null>(null);

    useEffect(() => {
        if (!timelineRef.current) initTimeline();
        return () => {
            timelineRef?.current?.destroy();
        };
    }, [containerRef]);

    const initTimeline = () => {
        if (!containerRef.current) return;

        var visgroups = new DataSet<DataGroup>([
            //
            { id: 1, content: 'testgroup' },
        ]);

        var items2 = new DataSet<DataItem>([
            {
                id: 1,
                title: 'Title item 1',
                content: 'Content item 1',
                start: new Date(),
                end: new Date(new Date().setHours(new Date().getHours() + 2)),
                group: 1,
            },
            // {id: 2, content: 'item 2', start: '2024-04-24'},
            // {id: 3, content: 'item 3', start: '2024-04-18'},
            // {id: 4, content: 'item 4', start: '2024-04-16 10:00', end: '2024-04-16 16:00', group: 1},
            // {id: 5, content: 'item 5', start: '2024-04-25'},
            // {id: 6, content: 'item 6', start: '2024-04-27', type: 'point'}
        ]);

        // timelineRef.current = new Vis(containerRef.current, items2, visgroups, defaultTimelineOptions);
        timelineRef.current = new Vis(containerRef.current, items2, visgroups, defaultTimelineOptions);
    };

    return <div ref={containerRef} />;
}
