'use client';

import React, { useEffect, useRef, useState } from 'react';
import { DndContext, DragEndEvent, DragOverlay, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { arrayMove } from '@dnd-kit/sortable';

import { Timeline } from 'vis-timeline/standalone';
import { TimelineOptions as InternalTimelineOptions, DataItem, DataGroup, TimelineItem } from 'vis-timeline/types';
import { template, templateOptimaze } from './mytimeline';

// import 'vis-timeline/styles/vis-timeline-graph2d.min.css';
// import 'vis-timeline/styles/vis-timeline-graph2d.min.css';

// Types
type Task = {
    id: string;
    title: string;
    start: string;
    end?: string;
    group: string;
};

type Group = {
    id: string;
    name: string;
};

const groups: Group[] = [
    { id: '1', name: 'Backlog' },
    { id: '2', name: 'In Progress' },
    { id: '3', name: 'Completed' },
];

const initialTasks: Task[] = [
    { id: '1', title: 'Task 1', start: '2023-01-01', end: '2023-03-01', group: '1' },
    { id: '2', title: 'Task 2', start: '2023-01-02', group: '2' },
    { id: '3', title: 'Task 3', start: '2023-01-01', end: '2023-01-03', group: '1' },
    { id: '4', title: 'Task 4', start: '2023-01-04', group: '2' },
];

const CardTimeline: React.FC<{ item: any; data: any }> = ({ data, item }) => (
    <div className="bg-red-600">
        <strong>{item.content}</strong>
        <p>{data?.description}</p>
    </div>
);

const timelineOptions: InternalTimelineOptions = {
    // width: '100%',
    // height: '300px',
    stack: true,
    editable: true,
    start: '2023-01-01',
    end: '2023-01-07',
    template: (itemX?: any, elementX?: any, dataX?: any) => {
        return templateOptimaze(itemX, elementX, dataX, (itemX, dataX) => (
            <CardTimeline
                data={dataX}
                item={itemX}
            />
        ));
    },
};

const KanbanWithTimeline: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>(initialTasks);
    const [activeTask, setActiveTask] = useState<Task | null>(null);
    const timelineRef = useRef<HTMLDivElement | null>(null);
    const timelineInstance = useRef<Timeline | null>(null);

    // Initialize the timeline
    useEffect(() => {
        const container = timelineRef.current;
        if (container) {
            // Sync timeline changes to Kanban
            const handleTimelineChange = (changes: any) => {
                const updatedTasks = tasks.map((task) => {
                    const updatedItem = changes.itemsData.find((item: any) => item.id === task.id);
                    return updatedItem ? { ...task, start: updatedItem.start } : task;
                });

                setTasks(updatedTasks);
            };

            const timelineItems: DataItem[] = tasks.map((task) => ({
                id: task.id,
                content: task.title,
                start: task.start,
                end: task.end,
                group: task.group,
            }));

            const timelineGroups: DataGroup[] = groups.map((group) => ({
                id: group.id,
                content: group.name,
            }));

            timelineInstance.current = new Timeline(container, timelineItems, timelineGroups, timelineOptions);

            timelineInstance.current.on('change', handleTimelineChange);
        }

        return () => {
            timelineInstance.current?.destroy();
        };
    }, [tasks]);

    // Handle drag and drop
    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const activeTask = tasks.find((task) => task.id === active.id);
            const overGroup = groups.find((group) => group.id === over.id);

            if (activeTask && overGroup) {
                const updatedTasks = tasks.map((task) => (task.id === active.id ? { ...task, group: overGroup.id } : task));

                setTasks(updatedTasks);

                // Sync with the timeline
                timelineInstance?.current?.setItems(updatedTasks.map((task) => ({ ...task, content: task.title })));
            }
        }

        setActiveTask(null);
    };

    return (
        <div className="p-4 bg-gray-100 min-h-screen">
            <h1 className="text-2xl font-bold mb-4 text-gray-800">Kanban Board with Timeline</h1>
            <div className="flex _flex-wrap _gap-4 flex-col gap-y-2">
                {/* Kanban Board */}
                <DndContext
                    collisionDetection={closestCenter}
                    onDragStart={({ active }) => {
                        const task = tasks.find((task) => task.id === active.id);
                        setActiveTask(task || null);
                    }}
                    onDragEnd={handleDragEnd}
                >
                    <div className="flex space-x-4">
                        {groups.map((group) => (
                            <GroupColumn
                                key={group.id}
                                group={group}
                                tasks={tasks.filter((task) => task.group === group.id)}
                            />
                        ))}
                    </div>

                    <DragOverlay>
                        {activeTask ? <div className="p-4 bg-blue-300 rounded-md shadow text-gray-800">{activeTask.title}</div> : null}
                    </DragOverlay>
                </DndContext>

                {/* Timeline */}
                <div
                    ref={timelineRef}
                    className="flex-1 bg-white shadow rounded-lg border p-4"
                />
            </div>
        </div>
    );
};

interface GroupColumnProps {
    group: Group;
    tasks: Task[];
}

const GroupColumn: React.FC<GroupColumnProps> = ({ group, tasks }) => {
    return (
        <div className="flex-1 bg-white shadow rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-4 text-gray-700">{group.name}</h2>
            <SortableContext
                items={tasks.map((task) => task.id)}
                strategy={verticalListSortingStrategy}
            >
                {tasks.map((task) => (
                    <SortableTask
                        key={task.id}
                        task={task}
                    />
                ))}
            </SortableContext>
        </div>
    );
};

interface SortableTaskProps {
    task: Task;
}

const SortableTask: React.FC<SortableTaskProps> = ({ task }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
        id: task.id,
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="p-4 mb-2 bg-blue-100 rounded-md shadow text-gray-800"
        >
            {task.title}
        </div>
    );
};

export default KanbanWithTimeline;
