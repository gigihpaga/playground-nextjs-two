'use client';

import { useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { SortableContext, arrayMove, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import {
    DndContext,
    DragOverlay,
    useSensors,
    useSensor,
    PointerSensor,
    type DragStartEvent,
    type DragEndEvent,
    type DragOverEvent,
} from '@dnd-kit/core';
import { PlusCircleIcon } from 'lucide-react';

import { cn } from '@/lib/classnames';

import { Column, Task } from '../types';
import { ColumnContainer } from './column-container';
import styles from './kb.module.scss';
import { TaskCard } from './task-card';
import { Card } from '../components/card';

/**
 * "mainBackgroundColor": '#0D1117',
 * "columnBackgroundColor": '#161C22'
 */

export function KanbanBoard() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [columns, setColumns] = useState<Column[]>([]);
    const columnIds = useMemo(() => columns.map((col) => col.id), [columns]);
    const [activeColumn, setActiveColumn] = useState<Column | null>(null);
    const [activeTask, setActiveTask] = useState<Task | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 10, // 10px
            },
        })
    );
    // console.log('column: ', columns);
    // console.log('activeColumn ', activeColumn);
    console.log('KanbanBoard RENDER');
    return (
        <div
            aria-description="kanban board"
            className={cn(styles['kb'], '_m-auto _min-h-screen _items-center flex h-full  w-full overflow-x-auto overflow-y-hidden px-[40px]')}
        >
            <DndContext
                sensors={sensors}
                onDragStart={(e) => handleOnDragStart(e)}
                onDragEnd={(e) => handleOnDragEnd(e)}
                onDragOver={(e) => handleOnDragOver(e)}
            >
                <div className="_m-auto flex gap-2 py-2">
                    <div className="flex gap-2">
                        <SortableContext
                            items={columnIds}
                            // strategy={horizontalListSortingStrategy}
                        >
                            {columns.map((col) => (
                                <ColumnContainer
                                    key={col.id}
                                    column={col}
                                    deleteColum={(d) => handleDeleteColum(d)}
                                    updateColumnName={(id, text) => handleUpdateColumName(id, text)}
                                    createTask={(colId) => handleCreateTask(colId)}
                                    tasks={tasks.filter((task) => task.columnId === col.id)}
                                    deleteTask={(id) => handleDeleteTask(id)}
                                    updateTask={(id, text) => handleUpdateTask(id, text)}
                                />
                            ))}
                        </SortableContext>
                    </div>
                    <button
                        onClick={() => handleCreateNewColumn()}
                        className="select-none h-[60px] w-[350px] min-w-[350px] cursor-pointer rounded-lg bg bg-[#0D1117] border border-[#161C22] p-4 ring-blue-500 hover:ring-2 flex items-center gap-2"
                    >
                        <PlusCircleIcon />
                        Add Column
                    </button>
                </div>
                <DragOverlay>
                    {activeColumn && <ColumnContainer column={activeColumn} />}
                    {activeTask && <TaskCard task={activeTask} />}
                </DragOverlay>
            </DndContext>
        </div>
    );

    function handleCreateNewColumn() {
        const columnToAdd: Column = {
            id: generateId(),
            title: `Column ${columns.length + 1}`,
        };

        setColumns([...columns, columnToAdd]);
    }

    function handleDeleteColum(id: Column['id']) {
        const filteredColumns = columns.filter((col) => col.id != id);
        setColumns(filteredColumns);

        const newTask = tasks.filter((task) => task.columnId != id);
        setTasks(newTask);
    }

    function handleUpdateColumName(id: Column['id'], text: string) {
        const newColumn = columns.map((col) => {
            if (col.id !== id) return col;
            return { ...col, title: text };
        });

        setColumns(newColumn);
    }

    function handleCreateTask(columnId: Task['columnId']) {
        const newTask: Task = {
            id: generateId(),
            columnId: columnId,
            content: `Task ${tasks.length + 1}`,
        };

        setTasks((prev) => [...prev, newTask]);
    }

    function handleDeleteTask(id: Task['id']) {
        const taskAfterDelete = tasks.filter((task) => task.id != id);
        setTasks(taskAfterDelete);
    }

    function handleUpdateTask(taskId: Task['id'], text: Task['content']) {
        const newTask = tasks.map((task) => {
            if (task.id !== taskId) return task;
            return { ...task, content: text };
        });

        setTasks(newTask);
    }

    function handleOnDragStart(event: DragStartEvent) {
        if (event.active.data.current?.type === 'Column') {
            const c = (event.active.data.current as unknown as Record<'column', Column>).column;
            setActiveColumn(c);
            return;
        }
        if (event.active.data.current?.type === 'Task') {
            const t = (event.active.data.current as unknown as Record<'task', Task>).task;
            setActiveTask(t);
            return;
        }
    }

    function handleOnDragEnd(event: DragEndEvent) {
        setActiveColumn(null);
        setActiveTask(null);
        const { active, over } = event;

        if (!over) return; // it mean not dragging

        const activeId = active.id;
        const overId = over.id;

        if (activeId === overId) return; // it mean dropping on same position

        const isActiveAColumn = active.data.current?.type === 'Column';
        if (!isActiveAColumn) return;

        console.log('DRAG END');

        setColumns((columns) => {
            const activeColumnIndex = columns.findIndex((col) => col.id === activeId);

            const overColumnIndex = columns.findIndex((col) => col.id === overId);

            return arrayMove(columns, activeColumnIndex, overColumnIndex);
        });
    }

    function _handleOnDragOver(event: DragOverEvent) {
        console.log('DRAG OVER');
        const { active, over } = event;

        if (!over) return; // it mean not dragging

        const activeId = active.id,
            overId = over.id;

        if (activeId === overId) return; // it mean dropping on same position

        const isActiveATask = active.data.current?.type === 'Task',
            isOverATask = over.data.current?.type === 'Task';

        if (!isActiveATask) return;

        // Im dropping a Task over another Task
        if (isActiveATask && isOverATask) {
            setTasks((tasks) => {
                const activeIndex = tasks.findIndex((t) => t.id === activeId);
                const overIndex = tasks.findIndex((t) => t.id === overId);

                if (tasks[activeIndex].columnId != tasks[overIndex].columnId) {
                    // Fix introduced after video recording
                    tasks[activeIndex].columnId = tasks[overIndex].columnId;
                    return arrayMove(tasks, activeIndex, overIndex - 1);
                }

                return arrayMove(tasks, activeIndex, overIndex);
            });
        }

        const isOverAColumn = over.data.current?.type === 'Column';
        // Im dropping a Task over a column
        if (isActiveATask && isOverAColumn) {
            setTasks((tasks) => {
                const activeIndex = tasks.findIndex((t) => t.id === activeId);

                tasks[activeIndex].columnId = overId as string as `${number}`;
                console.log('DROPPING TASK OVER COLUMN', { activeIndex });
                return arrayMove(tasks, activeIndex, activeIndex);
            });
        }
    }

    function handleOnDragOver(event: DragOverEvent) {
        const { active, over } = event;

        if (!over) return;
        const activeId = active.id;
        const overId = over.id;

        if (activeId === overId) return;

        const isActiveATask = active.data.current?.type === 'Task';
        const isOverATask = over.data.current?.type === 'Task';

        if (!isActiveATask) return;

        if (isActiveATask && isOverATask) {
            setTasks((tasks) => {
                const activeIndex = tasks.findIndex((t) => t.id === activeId);
                const overIndex = tasks.findIndex((t) => t.id === overId);

                // Check if indices are different AND columnIds are the same *before* moving
                if (activeIndex !== overIndex && tasks[activeIndex].columnId === tasks[overIndex].columnId) {
                    // Fix introduced after video recording
                    return arrayMove(tasks, activeIndex, overIndex); //- 1
                } else if (tasks[activeIndex].columnId !== tasks[overIndex].columnId) {
                    tasks[activeIndex].columnId = tasks[overIndex].columnId;
                    return arrayMove(tasks, activeIndex, overIndex - 1);
                }

                return tasks; // Return the original array if no move is needed
            });
        }

        const isOverAColumn = over.data.current?.type === 'Column';

        if (isActiveATask && isOverAColumn) {
            setTasks((tasks) => {
                const activeIndex = tasks.findIndex((t) => t.id === activeId);

                if (tasks[activeIndex].columnId !== overId) {
                    // Only update if columnId changes
                    tasks[activeIndex].columnId = overId as string as `${number}`;
                    return [...tasks]; // Create a new array to trigger re-render
                }
                return tasks; // Return original array if no changes
            });
        }
    }

    function _handleOnDragOver3(event: DragOverEvent) {
        const { active, over } = event;

        if (!over) return;
        const activeId = active.id;
        const overId = over.id;

        if (activeId === overId) return;

        const isActiveATask = active.data.current?.type === 'Task';
        const isOverATask = over.data.current?.type === 'Task';

        if (!isActiveATask) return;

        if (isActiveATask && isOverATask) {
            const activeIndex = tasks.findIndex((t) => t.id === activeId);
            const overIndex = tasks.findIndex((t) => t.id === overId);

            // Only update if a change is needed
            if (activeIndex !== overIndex && tasks[activeIndex].columnId === tasks[overIndex].columnId) {
                const newTasks = arrayMove(tasks, activeIndex, overIndex);
                setTasks(newTasks);
            } else if (tasks[activeIndex].columnId !== tasks[overIndex].columnId) {
                const newTasks = arrayMove(tasks, activeIndex, overIndex - 1);
                newTasks[activeIndex].columnId = tasks[overIndex].columnId;
                setTasks(newTasks);
            }
        }

        const isOverAColumn = over.data.current?.type === 'Column';

        if (isActiveATask && isOverAColumn) {
            const activeIndex = tasks.findIndex((t) => t.id === activeId);

            if (tasks[activeIndex].columnId !== overId) {
                const newTasks = [...tasks]; //create new array
                newTasks[activeIndex].columnId = overId as string as `${number}`;
                setTasks(newTasks);
            }
        }
    }
}

/**
 * generate a random number between 0 and 10_000
 */
function generateId() {
    return Math.floor(Math.random() * 10_001);
}
