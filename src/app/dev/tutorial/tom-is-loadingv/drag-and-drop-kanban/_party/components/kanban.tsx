'use client';

import React, { useState } from 'react';
import { FiPlus, FiTrash } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { FaFire } from 'react-icons/fa';

export const Kanban = () => {
    return (
        <div className="_h-screen h-[calc(100vh-65px)] overflow-auto w-full bg-neutral-900 text-neutral-50">
            <Board />
        </div>
    );
};

const Board = () => {
    const [cards, setCards] = useState(DATA_CARDS);

    return (
        <div className="flex h-full w-full gap-3 _overflow-scroll p-12">
            <Column
                title="Backlog"
                column="backlog"
                headingColor="text-neutral-500"
                cards={cards}
                setCards={setCards}
            />
            <Column
                title="TODO"
                column="todo"
                headingColor="text-yellow-200"
                cards={cards}
                setCards={setCards}
            />
            <Column
                title="In progress"
                column="doing"
                headingColor="text-blue-200"
                cards={cards}
                setCards={setCards}
            />
            <Column
                title="Complete"
                column="done"
                headingColor="text-emerald-200"
                cards={cards}
                setCards={setCards}
            />
            <BurnBarrel setCards={setCards} />
        </div>
    );
};

type ColumnProps = {
    title: string;
    headingColor: string;
    cards: CardData[];
    column: ColumnType;
    // setCards: (cards: CardData[]) => void;
    setCards: React.Dispatch<React.SetStateAction<CardData[]>>;
};

const Column = ({ title, headingColor, cards, column, setCards }: ColumnProps) => {
    const [active, setActive] = useState(false);

    const handleDragStart = (event: MouseEvent | TouchEvent | PointerEvent, card: CardData) => {
        (event as unknown as React.DragEvent<HTMLDivElement>).dataTransfer.setData('cardId', card.id);
    };

    const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
        const cardId = e.dataTransfer.getData('cardId');

        setActive(false);
        clearHighlights();

        const indicators = getIndicators();
        const { element } = getNearestIndicator(e, indicators);

        const before = element.dataset.before || '-1';

        if (before !== cardId) {
            let copy = [...cards];

            let cardToTransfer = copy.find((c) => c.id === cardId);
            if (!cardToTransfer) return;
            cardToTransfer = { ...cardToTransfer, column };

            copy = copy.filter((c) => c.id !== cardId);

            const moveToBack = before === '-1';

            if (moveToBack) {
                copy.push(cardToTransfer);
            } else {
                const insertAtIndex = copy.findIndex((el) => el.id === before);
                if (insertAtIndex === undefined) return;

                copy.splice(insertAtIndex, 0, cardToTransfer);
            }

            setCards(copy);
        }
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        highlightIndicator(event);

        setActive(true);
    };

    const clearHighlights = (els?: HTMLElement[]) => {
        const indicators = els || getIndicators();

        indicators.forEach((i) => {
            i.style.opacity = '0';
        });
    };

    const highlightIndicator = (event: React.DragEvent<HTMLDivElement>) => {
        const indicators = getIndicators();

        clearHighlights(indicators);

        const el = getNearestIndicator(event, indicators);

        el.element.style.opacity = '1';
    };

    const getNearestIndicator = (event: React.DragEvent<HTMLDivElement>, indicators: HTMLElement[]) => {
        const DISTANCE_OFFSET = 50;

        const el = indicators.reduce(
            (closest, child) => {
                const box = child.getBoundingClientRect();

                const offset = event.clientY - (box.top + DISTANCE_OFFSET);

                if (offset < 0 && offset > closest.offset) {
                    return { offset: offset, element: child };
                } else {
                    return closest;
                }
            },
            {
                offset: Number.NEGATIVE_INFINITY,
                element: indicators[indicators.length - 1],
            }
        );

        return el;
    };

    const getIndicators = () => {
        return Array.from(document.querySelectorAll(`[data-column="${column}"]`)) as Array<HTMLElement>;
    };

    const handleDragLeave = () => {
        clearHighlights();
        setActive(false);
    };

    const filteredCards = cards.filter((c) => c.column === column);

    return (
        <div className="w-56 shrink-0">
            <div className="mb-3 flex items-center justify-between">
                <h3 className={`font-medium ${headingColor}`}>{title}</h3>
                <span className="rounded text-sm text-neutral-400">{filteredCards.length}</span>
            </div>
            <div
                onDrop={(e) => handleDragEnd(e)}
                onDragOver={(e) => handleDragOver(e)}
                onDragLeave={handleDragLeave}
                className={`h-full w-full transition-colors ${active ? 'bg-neutral-800/50' : 'bg-neutral-800/0'}`}
            >
                {filteredCards.map((c) => {
                    return (
                        <Card
                            key={c.id}
                            // {...c}
                            title={c.title}
                            id={c.id}
                            column={c.column}
                            handleDragStart={(e) => {
                                handleDragStart(e, { ...c });
                            }}
                        />
                    );
                })}
                <DropIndicator
                    beforeId={null}
                    column={column}
                />
                <AddCard
                    column={column}
                    setCards={setCards}
                />
            </div>
        </div>
    );
};

type CardProps = {
    title: string;
    id: string;
    column: ColumnType;
    handleDragStart: (event: MouseEvent | TouchEvent | PointerEvent, props: CardData) => void;
};

const Card = ({ title, id, column, handleDragStart }: CardProps) => {
    return (
        <>
            <DropIndicator
                beforeId={id}
                column={column}
            />
            <motion.div
                layout
                layoutId={id}
                draggable="true"
                onDragStart={(e, info) => {
                    handleDragStart(e, { title, id, column });
                }}
                className="cursor-grab rounded border border-neutral-700 bg-neutral-800 p-3 active:cursor-grabbing"
            >
                <p className="text-sm text-neutral-100">{title}</p>
            </motion.div>
        </>
    );
};

const DropIndicator = ({ beforeId, column }: { beforeId: string | null; column: string }) => {
    return (
        <div
            data-before={beforeId || '-1'}
            data-column={column}
            className="my-0.5 h-0.5 w-full bg-violet-400 opacity-0"
        />
    );
};

const BurnBarrel = ({ setCards }: { setCards: React.Dispatch<React.SetStateAction<CardData[]>> }) => {
    const [active, setActive] = useState(false);

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setActive(true);
    };

    const handleDragLeave = () => {
        setActive(false);
    };

    const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
        const cardId = e.dataTransfer.getData('cardId');

        setCards((pv) => pv.filter((c) => c.id !== cardId));

        setActive(false);
    };

    return (
        <div
            onDrop={(e) => handleDragEnd(e)}
            onDragOver={(e) => handleDragOver(e)}
            onDragLeave={handleDragLeave}
            className={`mt-10 grid h-56 w-56 shrink-0 place-content-center rounded border text-3xl ${
                active ? 'border-red-800 bg-red-800/20 text-red-500' : 'border-neutral-500 bg-neutral-500/20 text-neutral-500'
            }`}
        >
            {active ? <FaFire className="animate-bounce" /> : <FiTrash />}
        </div>
    );
};

const AddCard = ({ column, setCards }: { column: CardData['column']; setCards: React.Dispatch<React.SetStateAction<CardData[]>> }) => {
    const [text, setText] = useState('');
    const [adding, setAdding] = useState(false);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!text.trim().length) return;

        const newCard = {
            column,
            title: text.trim(),
            id: Math.random().toString(),
        };

        setCards((pv) => [...pv, newCard]);

        setAdding(false);
    };

    return (
        <>
            {adding ? (
                <motion.form
                    layout
                    onSubmit={(e) => handleSubmit(e)}
                >
                    <textarea
                        onChange={(e) => setText(e.target.value)}
                        // eslint-disable-next-line jsx-a11y/no-autofocus
                        autoFocus
                        placeholder="Add new task..."
                        className="w-full rounded border border-violet-400 bg-violet-400/20 p-3 text-sm text-neutral-50 placeholder-violet-300 focus:outline-0"
                    />
                    <div className="mt-1.5 flex items-center justify-end gap-1.5">
                        <button
                            onClick={() => setAdding(false)}
                            className="px-3 py-1.5 text-xs text-neutral-400 transition-colors hover:text-neutral-50"
                        >
                            Close
                        </button>
                        <button
                            type="submit"
                            className="flex items-center gap-1.5 rounded bg-neutral-50 px-3 py-1.5 text-xs text-neutral-950 transition-colors hover:bg-neutral-300"
                        >
                            <span>Add</span>
                            <FiPlus />
                        </button>
                    </div>
                </motion.form>
            ) : (
                <motion.button
                    layout
                    onClick={() => setAdding(true)}
                    className="flex w-full items-center gap-1.5 px-3 py-1.5 text-xs text-neutral-400 transition-colors hover:text-neutral-50"
                >
                    <span>Add card</span>
                    <FiPlus />
                </motion.button>
            )}
        </>
    );
};

const DATA_CARDS: Array<CardData> = [
    // BACKLOG
    { title: 'Look into render bug in dashboard', id: '1', column: 'backlog' },
    { title: 'SOX compliance checklist', id: '2', column: 'backlog' },
    { title: '[SPIKE] Migrate to Azure', id: '3', column: 'backlog' },
    { title: 'Document Notifications service', id: '4', column: 'backlog' },

    // TODO
    {
        title: 'Research DB options for new microservice',
        id: '5',
        column: 'todo',
    },
    { title: 'Postmortem for outage', id: '6', column: 'todo' },
    { title: 'Sync with product on Q3 roadmap', id: '7', column: 'todo' },

    // DOING
    {
        title: 'Refactor context providers to use Zustand',
        id: '8',
        column: 'doing',
    },
    { title: 'Add logging to daily CRON', id: '9', column: 'doing' },

    // DONE
    {
        title: 'Set up DD dashboards for Lambda listener',
        id: '10',
        column: 'done',
    },
];

type ColumnType = 'backlog' | 'todo' | 'doing' | 'done';

type CardData = { title: string; id: string; column: ColumnType };
