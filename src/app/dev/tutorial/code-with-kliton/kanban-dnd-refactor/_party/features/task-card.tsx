'use client';

import { useState, type CSSProperties } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { TrashIcon } from 'lucide-react';

import { Task } from '../types';
import { Card } from '../components/card';

interface Props {
    task: Task;
    deleteTask?: (taskId: Task['id']) => void;
    updateTask?: (taskId: Task['id'], text: Task['content']) => void;
}

export function TaskCard({ task, deleteTask, updateTask }: Props) {
    const [isEditMode, setIsEditMode] = useState<boolean>(false);

    const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
        id: task.id,
        data: {
            type: 'Task',
            task: task,
        },
        disabled: isEditMode,
    });

    const style: CSSProperties = {
        transition: transition,
        transform: CSS.Transform.toString(transform),
    };

    if (isDragging) {
        return (
            <div
                data-uh="a"
                ref={setNodeRef}
                style={style}
                {...attributes}
                {...listeners}
                className="bg-[#0D1117] [&>:is(textarea,p)::-webkit-scrollbar-thumb]:bg-sky-500 overflow-hidden group/TaskCard p-2.5 h-[100px] min-h-[100px] items-center flex text-left rounded-xl cursor-grab relative hover:ring-2 hover:ring-inset hover:ring-blue-500 ring-2 ring-inset ring-green-500 opacity-40"
            >
                <p className="my-auto h-[90%] w-full overflow-y-auto overflow-x-hidden whitespace-pre-wrap">{task.content}</p>
            </div>
        );
    }

    if (!isEditMode) {
        return (
            // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
            <div
                data-uh="b"
                ref={setNodeRef}
                style={style}
                {...attributes}
                {...listeners}
                onClick={() => setIsEditMode(true)}
                className="bg-[#0D1117] [&>:is(textarea,p)::-webkit-scrollbar-thumb]:bg-sky-500 overflow-hidden group/TaskCard p-2.5 h-[100px] min-h-[100px] items-center flex text-left rounded-xl cursor-grab relative hover:ring-2 hover:ring-inset hover:ring-blue-500"
            >
                <p className="my-auto h-[90%] w-full overflow-y-auto overflow-x-hidden whitespace-pre-wrap">{task.content}</p>
                <button
                    onClick={() => {
                        if (deleteTask) deleteTask(task.id);
                    }}
                    className="group hidden group-hover/TaskCard:block absolute right-4 top-1/2 -translate-y-1/2 bg-[#161C22] p-2 rounded hover:bg-[#0D1117]"
                >
                    <TrashIcon className="size-4 stroke-white group-hover:stroke-blue-500" />
                </button>
            </div>
        );
    }

    return (
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
        <div
            data-uh="c"
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            onClick={() => setIsEditMode(true)}
            className="bg-[#0D1117] [&>:is(textarea,p)::-webkit-scrollbar-thumb]:bg-sky-500 overflow-hidden group/TaskCard p-2.5 h-[100px] min-h-[100px] items-center flex text-left rounded-xl cursor-grab relative hover:ring-2 hover:ring-inset hover:ring-blue-500 select-none"
        >
            <textarea
                // eslint-disable-next-line jsx-a11y/no-autofocus
                autoFocus
                className="h-[90%] w-full resize-none border-none rounded bg-background _bg-transparent _text-white focus:outline-none"
                onBlur={() => setIsEditMode(false)}
                placeholder="Task content here"
                value={task.content}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.shiftKey) setIsEditMode(false);
                }}
                onChange={(e) => {
                    if (updateTask) updateTask(task.id, e.target.value);
                }}
            />
        </div>
    );
}
