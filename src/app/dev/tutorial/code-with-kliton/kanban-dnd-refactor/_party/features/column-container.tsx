'use client';

import { PlusIcon, TrashIcon } from 'lucide-react';
import { Column, Task } from '../types';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import React, { useMemo, useState, type CSSProperties } from 'react';
import { TaskCard } from './task-card';

type ColumnContainerProps = {
    column: Column;
    deleteColum?: (id: Column['id']) => void;
    updateColumnName?: (id: Column['id'], text: string) => void;
    createTask?: (columId: Task['columnId']) => void;
    tasks?: Task[];
    deleteTask?: (id: Task['id']) => void;
    updateTask?: (taskId: Task['id'], text: Task['content']) => void;
};

export function ColumnContainer({ column, deleteColum, updateColumnName, createTask, tasks, deleteTask, updateTask }: ColumnContainerProps) {
    const [isEditMode, setIsEditMode] = useState<boolean>(false);
    const taskIds = useMemo(() => {
        return tasks?.map((task) => task.id);
    }, [tasks]);

    const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
        id: column.id,
        data: {
            type: 'Column',
            column: column,
        },
        disabled: isEditMode,
    });

    const style: CSSProperties = {
        transition: transition,
        transform: CSS.Transform.toString(transform),
    };

    console.log(`ColumnContainer [${column.id}] RENDER`);

    if (isDragging) {
        return (
            <div
                ref={setNodeRef}
                style={style}
                className="bg-[#161C22] w-[350px] h-[500px] max-h-[500px] rounded-md flex flex-col border border-blue-500 opacity-40"
            />
        );
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="bg-[#161C22] w-[350px] h-[500px] max-h-[500px] rounded-md flex flex-col"
        >
            {/* Column title */}
            <div
                className="bg-[#0D1117] text-md h-[60px] cursor-grab rounded-md rounded-b-none p-3 font-bold border-[#161C22] border-4 flex items-center justify-between"
                {...attributes}
                {...listeners}
            >
                <div className="flex gap-2">
                    <div className="flex justify-center items-center bg-[#0D1117] px-2 py-1 text-sm rounded-full">0</div>

                    {isEditMode ? (
                        <input
                            className="bg-white text-black font-normal focus:border-blue-500 border rounded outline-none px-2"
                            // eslint-disable-next-line jsx-a11y/no-autofocus
                            autoFocus
                            value={column.title}
                            onChange={(e) => {
                                // if (updateColumnName === undefined) return;
                                // if (!(updateColumnName instanceof Function)) return;
                                // updateColumnName(column.id, e.target.value);
                                updateColumnName?.(column.id, e.target.value);
                            }}
                            onBlur={() => setIsEditMode(false)}
                            onKeyDown={(e) => {
                                if (e.key !== 'Enter') return;
                                setIsEditMode(false);
                            }}
                        />
                    ) : (
                        // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
                        <span
                            className="cursor-pointer"
                            onClick={() => setIsEditMode(true)}
                        >
                            {column.title}
                        </span>
                    )}
                </div>
                <button
                    onClick={() => {
                        console.log('delete clicked');
                        if (deleteColum === undefined) return;
                        deleteColum(column.id);
                    }}
                    className="px-1 py-2 rounded hover:bg-[#161C22] group"
                >
                    <TrashIcon className="size-4 stroke-gray-500 group-hover:stroke-white" />
                </button>
            </div>
            {/* Column task container */}
            <div className="flex flex-grow flex-col gap-4 p-2 overflow-x-hidden overflow-y-auto">
                {taskIds && (
                    <SortableContext
                        items={taskIds}
                        // strategy={verticalListSortingStrategy}
                    >
                        {tasks &&
                            tasks.map((task) => (
                                <TaskCard
                                    key={task.id}
                                    task={task}
                                    deleteTask={(taskId) => {
                                        if (deleteTask === undefined) return;
                                        deleteTask(task.id);
                                    }}
                                    updateTask={(taskId, text) => {
                                        if (updateTask === undefined) return;
                                        updateTask(task.id, text);
                                    }}
                                />
                            ))}
                    </SortableContext>
                )}
            </div>
            {/* Column footer */}
            <button
                onClick={() => {
                    if (createTask === undefined) return;
                    createTask(column.id);
                }}
                className="flex gap-2 items-center border-[#161C22] border-2 rounded-md p-4 border-x-[#161C22] hover:bg-[#0D1117] hover:text-blue-500 active:bg-black"
            >
                <PlusIcon />
                Add Task
            </button>
        </div>
    );
}
