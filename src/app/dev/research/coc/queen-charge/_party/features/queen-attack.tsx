'use client';
import React, { useEffect, useRef, useState, type ComponentPropsWithoutRef, type MutableRefObject } from 'react';
import { FlameIcon, FootprintsIcon } from 'lucide-react';
import styles from './app.module.scss';

import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { indicatorLine, SIZE_SHAPE, SIZE_QUEEN } from '../constants';
import type { BuildingOnBoard, CustomBoardBuildingCSS } from '../types';

import { BoardCanvasGuide } from '../components/board-canvas-guide';
import { CoordinateGuide } from '../components/coordinate-guide';
import { TableAttackCollection } from './table-attack-collection';
import { TableLayoutCollection } from './table-layout-collection';
import { getLayoutSelected, selectBuildingOnBoard, updatePositonBuilding } from '../state/layout-collection-slice';
import {
    getAttackIdActive,
    nextStepAttack,
    selectAttackStep,
    getAttackStepIndexActive,
    toggleBuildingDestructive,
    getDebugSpell,
} from '../state/attack-collection-slice';
import { cn } from '@/lib/classnames';
import { TableAttackHistory } from './table-attack-history';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export function QueenAttack() {
    return (
        <div
            className="flex gap-2"
            aria-description="component queen attack"
        >
            <div
                className="w-fit h-fit relative"
                aria-description="component left"
            >
                <CoordinateGuide />
                <BoardCanvasGuide />
                <BoardBuilding aria-description="board building queen attack" />
            </div>
            <div
                className="dark:bg-[#121418] bg-[#e8e9ed] rounded-lg w-full px-2 py-4"
                aria-description="component right"
            >
                <RightSideBar />
            </div>
        </div>
    );
}

type BoardBuildingProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'> & {};

function BoardBuilding({ className, style, ...props }: BoardBuildingProps) {
    const boardBuildingRef = useRef<HTMLDivElement>(null);
    // const layoutActiveSelected = useAppSelector(getLayoutSelected);
    const attackIdActive = useAppSelector(getAttackIdActive);
    // const attackStepIndexActive = useAppSelector((states) => getAttackStepIndexActive(states, attackIdActive)); // stepIndex
    // const currentAttack = useAppSelector((state) => selectAttackStep(state, attackIdActive, attackStepIndexActive));
    const currentAttack = useAppSelector((state) => selectAttackStep(state, attackIdActive));
    const queen = {
        x: currentAttack?.currentQueen.x,
        y: currentAttack?.currentQueen.y,
    };

    /* 
    if (currentAttack) {
        currentAttack.currentQueen.x;
        currentAttack.currentQueen.y;
    } 
    */

    return (
        <div
            ref={boardBuildingRef}
            className={cn('bg-transparent absolute top-0 right-0 bottom-0 left-0', className)}
            style={{
                width: indicatorLine.length * SIZE_SHAPE,
                height: indicatorLine.length * SIZE_SHAPE,
                ...style,
            }}
            {...props}
        >
            {currentAttack && (
                <>
                    {currentAttack.currentBuildings.map((building) => (
                        <BoardBuildingChild
                            key={building.onBoardId}
                            building={building}
                            attackIdSelected={attackIdActive}
                        />
                    ))}

                    <BoardQueenChild
                        containerRef={boardBuildingRef}
                        queenPosition={{ x: currentAttack.currentQueen.x, y: currentAttack.currentQueen.y }}
                        attackIdSelected={attackIdActive}
                    />
                </>
            )}
            <BoardSpellChild />
        </div>
    );
}

type BoardQueenChildProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'> & {
    containerRef: MutableRefObject<HTMLDivElement | null>;
    queenPosition: {
        x: number;
        y: number;
    };
    attackIdSelected: string | null;
};

function BoardQueenChild({ containerRef, attackIdSelected, queenPosition, className, style, ...props }: BoardQueenChildProps) {
    const boxRef = useRef<HTMLDivElement | null>(null);
    const dispatch = useAppDispatch();

    const _positionMove = useRef<{ x: number; y: number }>({
        x: queenPosition.x,
        y: queenPosition.y,
    });

    let positionMove = {
        x: queenPosition.x,
        y: queenPosition.y,
    };

    const isDragging = useRef(false);

    // useEffect(initialListener1, []);
    function initialListener1() {
        if (!containerRef.current || !boxRef.current) return;

        const container = containerRef.current;
        const box = boxRef.current;

        function onMouseDown(event: MouseEvent) {
            // if (event.target && (event.target as Element).tagName === 'IMG') return;
            box.style.cursor = 'grabbing';
            box.addEventListener('mousemove', onMouseMove);
            box.addEventListener('mouseup', onMouseUp);
        }

        function onMouseUp(event: MouseEvent) {
            if (!_positionMove.current || !attackIdSelected) return;

            /* 
            dispatch(
                updatePositonBuilding({
                    layoutId: attackIdSelected,
                    onBoardId: building.onBoardId,

                    x: positionMove.current.x,
                    y: positionMove.current.y,
                })
            ); 
            */
        }
        function onMouseUpContainer(event: MouseEvent) {
            // console.trace(`onMouseUpContainer ${building.onBoardId}`);
            box.style.cursor = '';
            box.removeEventListener('mousemove', onMouseMove);
            box.removeEventListener('mouseup', onMouseUp);
        }

        function onMouseMove(event: MouseEvent) {
            if (!_positionMove.current) return;
            const style = window.getComputedStyle(box);
            const left = parseInt(style.left), // "50px" menjadi 50
                top = parseInt(style.top);

            const mouseX = event.movementX,
                mouseY = event.movementY;

            _positionMove.current = {
                x: left + mouseX,
                y: top + mouseY,
            };

            box.style.left = `${_positionMove.current.x}px`;
            box.style.top = `${_positionMove.current.y}px`;
        }

        box.addEventListener('mousedown', onMouseDown);
        container.addEventListener('mouseup', onMouseUpContainer);
        container.addEventListener('mouseleave', onMouseUpContainer);

        const cleanup = () => {
            box.removeEventListener('mousedown', onMouseDown);
            box.removeEventListener('mouseup', onMouseUp);
            box.removeEventListener('mousemove', onMouseMove);
            container.removeEventListener('mouseup', onMouseUpContainer);
            container.removeEventListener('mouseleave', onMouseUpContainer);
        };

        return cleanup;
    }

    // useEffect(initialListener2, []);
    function initialListener2() {
        if (!containerRef.current || !boxRef.current) return;

        const container = containerRef.current;
        const box = boxRef.current;

        box.addEventListener('mousedown', onMouseDown);
        box.addEventListener('mouseup', onMouseUp);
        box.addEventListener('mouseleave', onMouseUp);

        const cleanup = () => {
            box.removeEventListener('mousedown', onMouseDown);
            box.removeEventListener('mouseup', onMouseUp);
            box.removeEventListener('mouseleave', onMouseUp);
        };

        function onMouseDown(event: MouseEvent) {
            box.style.cursor = 'grabbing';
            box.addEventListener('mousemove', onMouseMove);
        }

        function onMouseMove(event: MouseEvent) {
            if (!_positionMove.current) return;
            const style = window.getComputedStyle(box);
            const left = parseInt(style.left), // "50px" menjadi 50
                top = parseInt(style.top);

            const mouseX = event.movementX,
                mouseY = event.movementY;

            _positionMove.current = {
                x: left + mouseX,
                y: top + mouseY,
            };

            box.style.left = `${_positionMove.current.x}px`;
            box.style.top = `${_positionMove.current.y}px`;
        }

        function onMouseUp(event: MouseEvent) {
            box.style.cursor = 'grab';
            box.removeEventListener('mousemove', onMouseMove);
        }

        return cleanup;
    }

    function handleMouseDown(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        const elm = e.target as HTMLDivElement;
        if (!elm.id || elm.id !== 'my-queen') return;
        isDragging.current = true;
        elm.style.cursor = 'grabbing';
    }

    function handleMouseMove(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        if (isDragging.current === false) return;

        const elm = checkElmQueen(e);
        if (!elm) return;

        //  position element box
        const style = window.getComputedStyle(elm);
        const left = parseInt(style.left), // "50px" menjadi 50
            top = parseInt(style.top);

        // cursor moving
        const mouseX = e.movementX,
            mouseY = e.movementY;

        // final position element
        const movingX = left + mouseX,
            movingY = top + mouseY;

        updateShareValueAndPostionBox(elm, movingX, movingY);
    }

    function handleMouseUp(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        resetDragging(e);

        const elm = checkElmQueen(e);
        if (!elm) return;
        // calculate snapping position
        const movingSnapX = Math.floor(positionMove.x / SIZE_SHAPE) * SIZE_SHAPE,
            movingSnapY = Math.floor(positionMove.y / SIZE_SHAPE) * SIZE_SHAPE;
        updateShareValueAndPostionBox(elm, movingSnapX, movingSnapY);
    }

    function handleMouseLeave(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        resetDragging(e);
    }

    function updateShareValueAndPostionBox(elmBox: HTMLDivElement, x: number, y: number) {
        //  updated share value
        positionMove = {
            x: x,
            y: y,
        };

        // update actual element positon on DOM
        elmBox.style.left = `${positionMove.x}px`;
        elmBox.style.top = `${positionMove.y}px`;
    }

    function resetDragging(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        if (isDragging.current === false) return;
        isDragging.current = false;
        const elm = checkElmQueen(event);
        if (!elm) return;
        elm.style.cursor = 'grab';
    }

    function checkElmQueen(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        const elm = event.target as HTMLDivElement | null;
        if (!elm || !elm.id || elm.id !== 'my-queen') {
            return null;
        } else {
            return elm;
        }
    }

    return (
        // eslint-disable-next-line jsx-a11y/no-static-element-interactions
        <div
            ref={boxRef}
            id="my-queen"
            tabIndex={0}
            role="button"
            className={cn(styles['BoardBuildingChild'], styles['MyQueen'], 'bg-green-500/40 text-xs', className)}
            style={
                {
                    height: SIZE_QUEEN * SIZE_SHAPE,
                    width: SIZE_QUEEN * SIZE_SHAPE,
                    '--url-image': 'url(/images/coc-building/62.png)',
                    left: positionMove.x,
                    top: positionMove.y,

                    ...style,
                } as CustomBoardBuildingCSS
            }
            {...props}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            onKeyDown={(e) => {
                if (!boxRef.current) return;
                if (e.key === 'ArrowLeft' || e.key === 'a') {
                    boxRef.current.style.left = `${(positionMove.x -= SIZE_SHAPE)}px`;
                } else if (e.key === 'ArrowRight' || e.key === 'd') {
                    boxRef.current.style.left = `${(positionMove.x += SIZE_SHAPE)}px`;
                } else if (e.key === 'ArrowUp' || e.key === 'w') {
                    boxRef.current.style.top = `${(positionMove.y -= SIZE_SHAPE)}px`;
                } else if (e.key === 'ArrowDown' || e.key === 's') {
                    boxRef.current.style.top = `${(positionMove.y += SIZE_SHAPE)}px`;
                }
            }}
        >
            <button
                style={{
                    padding: '2px',
                    borderRadius: '5px',
                    position: 'absolute',
                    left: '50%',
                    top: '50%',

                    transform: 'translate(calc(-50% - 19px), calc(-50% - 1px))',
                }}
                data-tooltip="save current step queen"
                className="hover:bg-[rgba(255,0,255,0.5)] bg-[rgba(255,0,255,0.3)]"
                onClick={(e) => {
                    e.stopPropagation(); // dikasih ini karena container akan di diberi event listener mouse up dan mouse down
                    if (!attackIdSelected) {
                        alert('you must select attack id to save step queen');
                        return;
                    }
                    dispatch(
                        nextStepAttack({
                            attackId: attackIdSelected,
                            dataAttack: { type: 'queen-move', position: { x: positionMove.x, y: positionMove.y } },
                        })
                    );
                }}
            >
                <FootprintsIcon className={cn('h-[12px] w-[12px] text-yellow-400')} />
            </button>
        </div>
    );
}

type BoardBuildingChildProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'> & {
    building: BuildingOnBoard;
    attackIdSelected: string | null;
};

function BoardBuildingChild({ attackIdSelected, building, className, style, ...props }: BoardBuildingChildProps) {
    const dispatch = useAppDispatch();

    return (
        <div
            className={cn(styles['BoardBuildingChild'], building.isDestructive && styles['destructive'], 'bg-green-500/40 text-xs', className)}
            style={
                {
                    height: building.size.h * SIZE_SHAPE,
                    width: building.size.w * SIZE_SHAPE,
                    '--url-image': `url(${building.imageUrl})`,
                    left: building.position.x,
                    top: building.position.y,
                    cursor: 'default',
                    ...style,
                } as CustomBoardBuildingCSS
            }
            data-isdestructive={building.isDestructive}
            key={building.onBoardId}
            {...props}
        >
            <button
                style={{ padding: '0px', position: 'absolute', left: 0, top: 0 }}
                disabled={building.isDestructive}
                data-tooltip="destroy this building"
                onClick={(e) => {
                    e.stopPropagation(); // dikasih ini karena container akan di diberi event listener mouse up dan mouse down
                    if (!attackIdSelected) {
                        alert('you must select attack id to destructive the building');
                        return;
                    }

                    dispatch(nextStepAttack({ attackId: attackIdSelected, dataAttack: { type: 'building-destroy', onBoardId: building.onBoardId } }));
                }}
            >
                <FlameIcon className={cn('h-[12px] w-[12px] text-red-600', building.isDestructive && 'text-white')} />
            </button>
        </div>
    );
}

type BoardSpellChildProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'>;

function BoardSpellChild({ className, style, ...props }: BoardSpellChildProps) {
    const dispatch = useAppDispatch();
    const debugSpell = useAppSelector(getDebugSpell);

    const positionMove = useRef<{ x: number; y: number }>({
        x: 0,
        y: 0,
    });

    const isDragging = useRef(false);

    function handleMouseDown(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        const elm = checkElmSpell(e);
        if (!elm) return;

        isDragging.current = true;
        elm.style.cursor = 'grabbing';
    }

    function handleMouseMove(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        if (isDragging.current === false) return;

        const elm = checkElmSpell(e);
        if (!elm) return;

        //  position element box
        const style = window.getComputedStyle(elm);
        const left = parseInt(style.left), // "50px" menjadi 50
            top = parseInt(style.top);

        // cursor moving
        const mouseX = e.movementX,
            mouseY = e.movementY;

        // final position element
        const movingX = left + mouseX,
            movingY = top + mouseY;

        updateShareValueAndPostionBox(elm, movingX, movingY);
    }

    function handleMouseUp(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        resetDragging(e);
    }

    function handleMouseLeave(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        resetDragging(e);
    }

    function updateShareValueAndPostionBox(elmBox: HTMLDivElement, x: number, y: number) {
        // update actual element positon on DOM
        elmBox.style.left = `${x}px`;
        elmBox.style.top = `${y}px`;
    }

    function checkElmSpell(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        const elm = event.target as HTMLDivElement | null;
        if (!elm || !elm.id || elm.id !== 'debug-spell') {
            return null;
        } else {
            return elm;
        }
    }

    function resetDragging(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        if (isDragging.current === false) return;
        isDragging.current = false;
        const elm = checkElmSpell(event);
        if (!elm) return;
        elm.style.cursor = 'grab';
    }

    if (debugSpell === null) return null;

    return (
        <div
            id="debug-spell"
            tabIndex={0}
            role="button"
            style={
                {
                    height: debugSpell.size * SIZE_SHAPE,
                    width: debugSpell.size * SIZE_SHAPE,
                    left: 0,
                    top: 0,
                    ...style,
                } as CustomBoardBuildingCSS
            }
            className={cn(styles['BoardBuildingChild'], styles['Spell'], 'bg-purple-500/40 text-xs', className)}
            {...props}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
        ></div>
    );
}

function RightSideBar() {
    return (
        <div className="space-y-2">
            <h1 className="font-bold text-xl mb-4">Queen Attack</h1>
            <AccordionDemo />
        </div>
    );
}

function AccordionDemo() {
    return (
        <Accordion
            type="multiple"
            className="w-full"
        >
            <AccordionItem value="item-1">
                <AccordionTrigger className="[&>svg]:text-foreground">Layout collection</AccordionTrigger>
                <AccordionContent className="dark:bg-[#21242b] bg-[#f4f5f7] px-2 py-4 rounded-lg">
                    <TableLayoutCollection withSheet={false} />
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
                <AccordionTrigger className="[&>svg]:text-foreground">Attack collection</AccordionTrigger>
                <AccordionContent className="dark:bg-[#21242b] bg-[#f4f5f7] px-2 py-4 rounded-lg">
                    <TableAttackCollection />
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
                <AccordionTrigger className="[&>svg]:text-foreground">Attack history</AccordionTrigger>
                <AccordionContent className="dark:bg-[#21242b] bg-[#f4f5f7] px-2 py-4 rounded-lg">
                    <TableAttackHistory />
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
}
