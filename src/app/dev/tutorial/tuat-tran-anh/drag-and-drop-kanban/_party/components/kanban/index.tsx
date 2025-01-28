'use client';

import { useState } from 'react';

import { DragDropContext, Draggable, Droppable, type DropResult } from 'react-beautiful-dnd';

import styles from './kanban.module.scss';
import { todoData } from '../../data/mock-kanban';
import { Card } from '../card';

export function Kanban() {
    const [data, setData] = useState(todoData);

    function onDragEnd(result: DropResult) {
        if (!result.destination) return;
        const { source, destination } = result;

        if (source.droppableId !== destination.droppableId) {
            const sourceColIndex = data.findIndex((e) => e.id === source.droppableId);
            const destinationColIndex = data.findIndex((e) => e.id === destination.droppableId);

            const sourceCol = data[sourceColIndex];
            const destinationCol = data[destinationColIndex];

            const sourceTask = [...sourceCol.tasks];
            const destinationTask = [...destinationCol.tasks];

            const [removed] = sourceTask.splice(source.index, 1);
            destinationTask.splice(destination.index, 0, removed);

            data[sourceColIndex].tasks = sourceTask;
            data[destinationColIndex].tasks = destinationTask;

            setData(data);
        }
    }

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className={styles['kanban']}>
                {data.map((section) => (
                    <Droppable
                        key={section.id}
                        droppableId={section.id}
                    >
                        {(provided) => (
                            <div
                                {...provided.droppableProps}
                                className={styles['kanban__section']}
                                ref={provided.innerRef}
                            >
                                <div className={styles['kanban__section__title']}>{section.title}</div>
                                <div className={styles['kanban__section__content']}>
                                    {section.tasks.map((task, index) => (
                                        <Draggable
                                            key={task.id}
                                            draggableId={task.id}
                                            index={index}
                                        >
                                            {(provided, snapshot) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    style={{
                                                        ...provided.draggableProps.style,
                                                        opacity: snapshot.isDragging ? '0.5' : '1',
                                                    }}
                                                >
                                                    <Card>{task.title}</Card>
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            </div>
                        )}
                    </Droppable>
                ))}
            </div>
        </DragDropContext>
    );
}
