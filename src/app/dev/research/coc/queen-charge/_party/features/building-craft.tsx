import React, { useEffect, useRef, useState, type ComponentPropsWithoutRef, type MutableRefObject, type CSSProperties, useMemo } from 'react';
import { Trash2Icon } from 'lucide-react';
import styles from './app.module.scss';

import dataBuildingJson from '../data/data-building.json';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import {
    addBuilding,
    addWall,
    deleteBuildingOnLayout,
    getLayoutSelected,
    getModeLayoutBuilder,
    selectBuildingOnBoard,
    selectWallOnBoard,
    updatePositonBuilding,
} from '../state/layout-collection-slice';

import { cn } from '@/lib/classnames';
import { indicatorLine, SIZE_SHAPE } from '../constants';
import type { BuildingOnBoard, CustomBoardBuildingCSS } from '../types';

import { CoordinateGuide } from '../components/coordinate-guide';
import { BoardCanvasGuide } from '../components/board-canvas-guide';
import { TableLayoutCollection } from './table-layout-collection';
import { type OnAddBuildingFn, TableBuilding } from './table-building';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export function BuildingCraft() {
    return (
        <div className="flex gap-2">
            <div className="w-fit h-fit relative">
                <CoordinateGuide />
                <BoardCanvasGuide />
                <Board />
            </div>
            <div className="dark:bg-[#121418] bg-[#e8e9ed] rounded-lg w-full px-2 py-4">
                <RightSideBar />
            </div>
        </div>
    );
}

function Board() {
    const modeLayoutBuilder = useAppSelector(getModeLayoutBuilder);
    return (
        <>
            <BoardBuilding
                className={modeLayoutBuilder === 'building' ? 'z-10' : ''}
                aria-description="board building"
            />
            <BoardWall
                className={modeLayoutBuilder === 'wall' ? 'z-10 block' : 'hidden'}
                aria-description="board wall"
            />
        </>
    );
}

type BoardBuildingProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'> & {};

function BoardBuilding({ className, style, ...props }: BoardBuildingProps) {
    const boardBuildingRef = useRef<HTMLDivElement>(null);
    const layoutActiveSelected = useAppSelector(getLayoutSelected);
    const buildingsOnBoard = useAppSelector((state) => selectBuildingOnBoard(state, layoutActiveSelected));

    return (
        <div
            ref={boardBuildingRef}
            aria-description="building wrapper board"
            className={cn('bg-transparent absolute top-0 right-0 bottom-0 left-0', className)}
            style={{
                width: indicatorLine.length * SIZE_SHAPE,
                height: indicatorLine.length * SIZE_SHAPE,
                ...style,
            }}
            {...props}
        >
            {buildingsOnBoard.map((building) => (
                <BoardBuildingChild
                    key={building.onBoardId}
                    containerRef={boardBuildingRef}
                    building={building}
                    layoutIdSelected={layoutActiveSelected}
                />
            ))}
        </div>
    );
}

type BoardBuildingChildProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'> & {
    containerRef: MutableRefObject<HTMLDivElement | null>;
    building: BuildingOnBoard;
    layoutIdSelected: string | null;
};

function BoardBuildingChild({ containerRef, layoutIdSelected, building, className, style, ...props }: BoardBuildingChildProps) {
    const boxRef = useRef<HTMLDivElement | null>(null);
    const dispatch = useAppDispatch();

    const positionMove = useRef<{ x: number; y: number }>({
        x: building.position.x,
        y: building.position.y,
    });

    useEffect(() => {
        if (!containerRef.current || !boxRef.current) return;

        const container = containerRef.current;
        const box = boxRef.current;

        function onMouseDown(event: MouseEvent) {
            // if (event.target && (event.target as Element).tagName === 'IMG') return;
            console.log('onMouseDown event listener');
            box.style.cursor = 'grabbing';

            box.addEventListener('mousemove', onMouseMove);
            box.addEventListener('mouseup', onMouseUp);
        }

        function onMouseUp(event: MouseEvent) {
            const tagName = (event.target as Element).tagName,
                datasetDescription = (event.target as HTMLDivElement).dataset['descripton'];

            // dikasih if agar saat click tombol delete, mouseup pada box tidak ke fire
            if (event.target && tagName === 'DIV' && datasetDescription === 'box-building') {
                if (!positionMove.current || !layoutIdSelected) return;

                // calculate snapping position
                const movingSnapX = Math.floor(positionMove.current.x / SIZE_SHAPE) * SIZE_SHAPE,
                    movingSnapY = Math.floor(positionMove.current.y / SIZE_SHAPE) * SIZE_SHAPE;

                updateShareValueAndPostionBox(movingSnapX, movingSnapY);

                dispatch(
                    updatePositonBuilding({
                        layoutId: layoutIdSelected,
                        onBoardId: building.onBoardId,
                        x: positionMove.current.x,
                        y: positionMove.current.y,
                    })
                );
            }
        }

        function onMouseUpContainer(event: MouseEvent) {
            // console.trace(`onMouseUpContainer ${building.onBoardId}`);
            box.style.cursor = '';

            box.removeEventListener('mousemove', onMouseMove);
            box.removeEventListener('mouseup', onMouseUp);
        }

        function onMouseMove(event: MouseEvent) {
            //  position element box
            const style = window.getComputedStyle(box);
            const left = parseInt(style.left), // "50px" menjadi 50
                top = parseInt(style.top);

            // cursor moving
            const mouseX = event.movementX,
                mouseY = event.movementY;

            // final position element
            const movingX = left + mouseX,
                movingY = top + mouseY;

            updateShareValueAndPostionBox(movingX, movingY);
        }

        function updateShareValueAndPostionBox(x: number, y: number) {
            //  updated share value
            positionMove.current = {
                x: x,
                y: y,
            };

            // update actual element positon on DOM
            box.style.left = `${positionMove.current.x}px`;
            box.style.top = `${positionMove.current.y}px`;
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div
            ref={boxRef}
            data-descripton="box-building"
            className={cn(styles['BoardBuildingChild'], 'bg-green-500/40 text-xs', className)}
            style={
                {
                    height: building.size.h * SIZE_SHAPE,
                    width: building.size.w * SIZE_SHAPE,
                    '--url-image': `url(${building.imageUrl})`,
                    left: building.position.x,
                    top: building.position.y,
                    ...style,
                } as CustomBoardBuildingCSS
            }
            key={building.onBoardId}
            {...props}
        >
            <button
                style={{ padding: '3px', position: 'absolute', left: 0, top: 0, zIndex: 1 }}
                onClick={(e) => {
                    console.log('onClick button');
                    if (!layoutIdSelected) return;

                    dispatch(deleteBuildingOnLayout({ layoutId: layoutIdSelected, onBoardId: building.onBoardId }));
                }}
            >
                <Trash2Icon className={cn('size-[12px] text-red-600', building.size.h === 1 && 'size-[6px]')} />
            </button>
        </div>
    );
}

export function BoardWall({ className, style, ...props }: Omit<ComponentPropsWithoutRef<'div'>, 'children'>) {
    const boardRef = useRef<HTMLDivElement>(null);

    const dataBuildingWall = useMemo(() => dataBuildingJson.find((building) => building.slug === 'wall'), []);
    const layoutActiveSelected = useAppSelector(getLayoutSelected);
    const wallOnBoard = useAppSelector((state) => selectWallOnBoard(state, layoutActiveSelected));
    const dispatch = useAppDispatch();

    function handleBoardOnClick(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        if (!boardRef || !boardRef.current) return;
        const { top, left } = boardRef.current.getBoundingClientRect();
        const { clientX, clientY, offsetX, offsetY } = event.nativeEvent;
        const clickedX = Math.ceil(clientX - left) /* offsetX */, // nilai offsetX===(clientX-left). tidak menggunakan offsetX karena saat element yang diberi event listener mempunyai child element, offsetX berpindah ke child dan itu bukan sesuai yang diharapkan
            clickedY = Math.ceil(clientY - top); /* offsetY */

        const x1 = (Math.ceil(clickedX / SIZE_SHAPE) - 1) * SIZE_SHAPE,
            y1 = (Math.ceil(clickedY / SIZE_SHAPE) - 1) * SIZE_SHAPE;

        if (!dataBuildingWall) throw new Error('nothing building where slug "wall"');
        if (!layoutActiveSelected) {
            alert('you mush select layout to edit buildings');
            return;
        }

        console.log({ x1, y1 });

        const found = wallOnBoard.find((wall) => wall.position.x == x1 && wall.position.y == y1);
        if (found) {
            // remove
            dispatch(deleteBuildingOnLayout({ layoutId: layoutActiveSelected, onBoardId: found.onBoardId }));
        } else {
            // add
            dispatch(addWall({ layoutId: layoutActiveSelected, building: dataBuildingWall, position: { x: x1, y: y1 } }));
        }
    }

    return (
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
        <div
            ref={boardRef}
            className={cn('bg-transparent absolute top-0 right-0 bottom-0 left-0', className)}
            style={{
                width: indicatorLine.length * SIZE_SHAPE,
                height: indicatorLine.length * SIZE_SHAPE,
                ...style,
            }}
            onClick={(e) => {
                handleBoardOnClick(e);
            }}
            {...props}
        >
            {wallOnBoard.length
                ? wallOnBoard.map((wall) => (
                      <div
                          className="bg-yellow-600 absolute"
                          style={{ top: wall.position.y, left: wall.position.x, height: wall.size.h * SIZE_SHAPE, width: wall.size.w * SIZE_SHAPE }}
                          key={wall.onBoardId}
                      ></div>
                  ))
                : null}
        </div>
    );
}

export type RightSideBarProps = {
    onAddBuilding?: OnAddBuildingFn;
};

export function RightSideBar({ onAddBuilding }: RightSideBarProps) {
    return (
        <div className="space-y-2">
            <h1 className="font-bold text-xl mb-4">Building Craft</h1>
            <AccordionDemo onAddBuilding={onAddBuilding} />
        </div>
    );
}

type AccordionDemoProps = {
    onAddBuilding?: OnAddBuildingFn;
};

function AccordionDemo({ onAddBuilding }: AccordionDemoProps) {
    return (
        <Accordion
            type="multiple"
            className="w-full"
        >
            <AccordionItem value="item-1">
                <AccordionTrigger className="[&>svg]:text-foreground">Layout collection</AccordionTrigger>
                <AccordionContent className="dark:bg-[#21242b] bg-[#f4f5f7] px-2 py-4 rounded-lg">
                    <TableLayoutCollection />
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
                <AccordionTrigger className="[&>svg]:text-foreground">Building</AccordionTrigger>
                <AccordionContent className="dark:bg-[#21242b] bg-[#f4f5f7] px-2 py-4 rounded-lg">
                    <TableBuilding onAddBuilding={onAddBuilding} />
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
}
