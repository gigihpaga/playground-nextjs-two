'use client';

import React, { useState, type ReactNode } from 'react';
import { CableIcon, EllipsisIcon, PencilIcon, TrashIcon } from 'lucide-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent, type UniqueIdentifier } from '@dnd-kit/core';
import { useSortable, arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { CSS } from '@dnd-kit/utilities';

import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';

import { updateTopic, reorderTopic, getAllTopics, type Topic, type WorkspaceTopic } from '../state/commit-topic-collection-slice';

import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Checkbox } from '@/components/ui/checkbox';
import { ButtonCopy } from '@/components/ui/custom/button-copy';

export function SheetTopicCollection({ trigger }: { trigger: ReactNode }) {
    return (
        <Sheet>
            <SheetTrigger asChild>{trigger}</SheetTrigger>

            <SheetContent className="_z-[1000] flex flex-col w-1/3 sm:max-w-[50%]">
                <SheetHeader>
                    <SheetTitle>Topic collection</SheetTitle>
                    <SheetDescription>You can drag and drop to order topic.</SheetDescription>
                </SheetHeader>

                <div className="_flex-1 h-[76%] overflow-y-auto pl-1 pr-3">
                    <ListTopic />
                </div>
            </SheetContent>
        </Sheet>
    );
}

function ListTopic() {
    const topics = useAppSelector(getAllTopics);
    const dispatch = useAppDispatch();

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8, // 8px
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    return (
        <DndContext
            modifiers={[restrictToVerticalAxis]}
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <SortableContext
                items={topics}
                strategy={verticalListSortingStrategy}
            >
                <ul className="_space-y-2 grid grid-rows-1 auto-rows-fr gap-y-2">
                    {topics.map((topic, idx) => (
                        <CardTopic
                            key={topic.id}
                            topic={topic}
                            index={idx + 1}
                        />
                    ))}
                </ul>
            </SortableContext>
        </DndContext>
    );

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;

        if (!over) return;

        if (active.id !== over.id) {
            const oldIndex = topics.findIndex((item) => item.id === active.id);
            const newIndex = topics.findIndex((item) => item.id === over.id);
            if (oldIndex === -1 || newIndex === -1) {
                return;
            } else {
                const newTopics = arrayMove(topics, oldIndex, newIndex);
                if (newTopics.length === 0) {
                    throw new Error('reorder Topic canceled, because newTopics is 0');
                }
                dispatch(reorderTopic({ dataTopics: newTopics }));
            }
        }
    }
}

function CardTopic({ topic, index }: { topic: Topic; index?: number }) {
    const dispath = useAppDispatch();
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: topic.id });
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    function handleChangeStateCommited(state: boolean) {
        dispath(
            updateTopic({
                topicId: topic.id,
                data: { ...topic, isCommited: state },
            })
        );
    }

    return (
        <li
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="border border-border cursor-grab py-1 px-2 rounded-md flex gap-[2px] flex-col relative"
        >
            <div
                style={{ color: topic.color }}
                className="absolute bottom-0 left-0 text-xs leading-none p-1 rounded"
            >
                {index}
            </div>
            <div className="flex items-center gap-x-1">
                <ButtonCopy
                    style={{ backgroundColor: topic.color }}
                    className="size-3 rounded-full [&_svg:first-child]:hidden [&_svg]:size-2 [&_.btn-copy-icon-wrapper]:size-2"
                    data={topic.title}
                    title="copy title"
                />
                <p className="text-xs _truncate line-clamp-2">{topic.title}</p>
            </div>
            <div className="flex gap-1">
                <Checkbox
                    checked={topic.isCommited}
                    title={`mark to ${topic.isCommited ? 'uncommited' : 'commited'}`}
                    className="data-[state=checked]:text-green-800 size-3 [&_svg]:size-3"
                    onCheckedChange={(state) => {
                        console.log('cliked');
                        handleChangeStateCommited(Boolean(state));
                    }}
                />
                <p className="text-3xs ">
                    files:
                    <span className="ml-1 leading-tight border border-purple-300 text-center inline-block rounded h-3 min-w-3">
                        {topic.files.length}
                    </span>
                </p>
            </div>
            <p className="text-2xs min-h-3 text-muted-foreground line-clamp-3">{topic.description}</p>
        </li>
    );
}
