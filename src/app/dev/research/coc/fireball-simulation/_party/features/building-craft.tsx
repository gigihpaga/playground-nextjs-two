'use client';

import React, { ComponentPropsWithoutRef, CSSProperties, MutableRefObject, useCallback, useEffect, useRef, useState } from 'react';
import { Trash2Icon } from 'lucide-react';
import { type DragEndEvent, type DragMoveEvent, type DragStartEvent, useDraggable } from '@dnd-kit/core';
import { useTheme } from 'next-themes';

import { cn } from '@/lib/classnames';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';

import { BoardType, shallow, useFireballSimulationStore } from '../store/fireball-simulation-store';

import {
    addBuilding,
    deleteBuildingOnLayout,
    getLayoutSelected,
    getModeLayoutBuilder,
    selectBuildingOnBoard,
    updatePositonBuilding,
} from '@/app/dev/research/coc/queen-charge/_party/state/layout-collection-slice';
import { type BuildingOnBoard } from '@/app/dev/research/coc/queen-charge/_party/types';
import { indicatorLine, SIZE_SHAPE } from '@/app/dev/research/coc/queen-charge/_party/constants';
import { CustomBoardBuildingCSS } from '@/app/dev/research/coc/queen-charge/_party/types';
import { CoordinateGuide } from '@/app/dev/research/coc/queen-charge/_party/components/coordinate-guide';
import { BoardCanvasGuide } from '@/app/dev/research/coc/queen-charge/_party/components/board-canvas-guide';
import { BoardWall, RightSideBar as RightSideBarBuildingCraft } from '@/app/dev/research/coc/queen-charge/_party/features/building-craft';
import styles from '@/app/dev/research/coc/queen-charge/_party/features/app.module.scss';

// import { ZoomPanPinch } from '../components/zoom-pan-pinch';
import { Button } from '@/components/ui/button';
import {
    ZoomPanPinchProvider,
    ZoomPanPinchWrapper,
    ZoomPanPinchComponent,
    Background,
    Controls,
    useZoomPanPinch,
} from '../components/zoom-pan-pinch-new';
import { DraggableWrapper } from '../components/draggable-wrapper';
import { TwoColumnWrapper } from '../components/two-column-wrapper';
import { calculateCoordinateRotation, calculateViewportCenterCoordinates, rotatePoint, snapToGrid, snapToGridIsometricDiamond } from '../utils';

export function BuildingCraft() {
    const store = useFireballSimulationStore((s) => ({ paneDragging: s.paneDragging, setPaneDragging: s.setPaneDragging }), shallow);
    const nextTheme = useTheme();
    return (
        <ZoomPanPinchProvider disabled={store.paneDragging}>
            <TwoColumnWrapper
                aria-description="building craft"
                className=""
                leftComponent={
                    <ZoomPanPinchWrapper>
                        <ZoomPanPinchComponent>
                            <Board />
                        </ZoomPanPinchComponent>
                        <Background theme={nextTheme.theme as 'light' | 'dark' | 'system'} />
                        <Controls />
                    </ZoomPanPinchWrapper>
                }
                rightComponent={<RightSideBar />}
            />
        </ZoomPanPinchProvider>
    );
}

function RightSideBar() {
    const dispatch = useAppDispatch();
    const layoutActiveSelected = useAppSelector(getLayoutSelected);
    const zoomPanPinchContext = useZoomPanPinch();
    const store = useFireballSimulationStore((state) => {
        return {
            boardType: state.boardType,
            setBoardType: state.setBoardType,
        };
    }, shallow);
    function handleToggleChangeBoardType() {
        if (store.boardType === BoardType.SQUARE) {
            store.setBoardType(BoardType.DIAMOND);
        } else {
            store.setBoardType(BoardType.SQUARE);
        }
    }
    return (
        <>
            {/* button untuk mengganti jenis boardType */}
            <Button
                title={`change board to ${store.boardType === BoardType.SQUARE ? BoardType.DIAMOND : BoardType.SQUARE}`}
                className="h-fit w-fit py-1 px-2 text-xs gap-x-[2px]"
                onClick={() => handleToggleChangeBoardType()}
            >
                {store.boardType}
            </Button>
            <RightSideBarBuildingCraft
                onAddBuilding={(building) => {
                    if (!layoutActiveSelected) {
                        alert('you mush select layout to edit buildings');
                        return;
                    }
                    const { wrapperComponent, transformState } = zoomPanPinchContext;
                    const { positionX, positionY, scale } = transformState;

                    const center = calculateViewportCenterCoordinates({
                        viewportWrapper: wrapperComponent,
                        elementSize: building.size.w,
                        tileSize: SIZE_SHAPE,
                        positionX: positionX,
                        positionY: positionY,
                        scale: scale,
                    });
                    const centerWidtSnap = {
                        x: snapToGrid(center.x, SIZE_SHAPE),
                        y: snapToGrid(center.y, SIZE_SHAPE),
                    };
                    dispatch(
                        addBuilding({ layoutId: layoutActiveSelected, building: building, position: { x: centerWidtSnap.x, y: centerWidtSnap.y } })
                    );
                }}
            />
        </>
    );
}

type BuildingDraggedPosition = {
    onBoardId: BuildingOnBoard['onBoardId'];
    x: number;
    y: number;
} | null;

function Board() {
    const dispatch = useAppDispatch();
    const layoutActiveSelected = useAppSelector(getLayoutSelected);
    const modeLayoutBuilder = useAppSelector(getModeLayoutBuilder);
    const buildingsOnBoard = useAppSelector((state) => selectBuildingOnBoard(state, layoutActiveSelected));
    const store = useFireballSimulationStore((state) => {
        return {
            paneDragging: state.paneDragging,
            setPaneDragging: state.setPaneDragging,
            boardType: state.boardType,
            setBoardType: state.setBoardType,
        };
    }, shallow);
    // Dapatkan context dan skala zoom saat ini
    const zoomPanPinchContext = useZoomPanPinch(); // Dapatkan context zoomPanPinch
    const currentScale = zoomPanPinchContext.transformState.scale; // Dapatkan skala zoom saat ini
    // State untuk posisi sementara saat drag
    const [buildingDraggedPosition, setBuildingDraggedPosition] = useState<BuildingDraggedPosition>(null);
    const capturePosition = useRef<{ x: number; y: number } | null>(null);
    const rotateTo = store.boardType === BoardType.DIAMOND ? 45 : 0;
    function handleOnDragStart(event: DragStartEvent) {
        // console.log('onDragStart', event);
        // zoomPanPinchcontext.isPanning = false;
        // console.log('onDragStart:zoomPanPinchcontext:isPanning', zoomPanPinchcontext.isPanning);
        store.setPaneDragging(true);
        const { active } = event;
        const building = buildingsOnBoard.find((b) => b.onBoardId === active.id);
        if (!building) return;

        const temp = {
            x: building.position.x,
            y: building.position.y,
        };
        // Update posisi sementara di state lokal
        capturePosition.current = {
            x: temp.x,
            y: temp.y,
        };
        setBuildingDraggedPosition({
            onBoardId: building.onBoardId,
            x: temp.x,
            y: temp.y,
        });
    }

    function handleOnDragMove(event: DragMoveEvent) {
        const { active, delta } = event;
        if (!active) return;

        const { current: temp } = capturePosition;
        if (!buildingDraggedPosition || !temp) return;
        if (active.id != buildingDraggedPosition.onBoardId) return;

        // Sesuaikan delta dengan skala zoom
        const adjustedDeltaX = delta.x / currentScale;
        const adjustedDeltaY = delta.y / currentScale;

        let newX = temp.x + adjustedDeltaX; // Gunakan adjustedDeltaX, jika tidak memerluka skala zoom cukup (temp.x+delta.x)
        let newY = temp.y + adjustedDeltaY;
        const BOARD_SIZE = SIZE_SHAPE * indicatorLine.length;

        // snap to grid (sesuai board type)
        if (store.boardType === BoardType.DIAMOND) {
            // Transformasi koordinat untuk diamond
            // Hitung rotasi untuk koordinat
            const coordinateRotation = calculateCoordinateRotation(rotateTo);
            // Hitung delta pada koordinat diamond
            const diamondDelta = rotatePoint({ x: adjustedDeltaX, y: adjustedDeltaY }, coordinateRotation);

            newX = temp.x + diamondDelta.x;
            newY = temp.y + diamondDelta.y;

            // hitung x,y saat diamond
            const snapPoint = snapToGridIsometricDiamond(newX, newY, SIZE_SHAPE);
            newX = snapPoint.x;
            newY = snapPoint.y;
        } else {
            newX = Math.min(Math.round(newX / SIZE_SHAPE) * SIZE_SHAPE, BOARD_SIZE);
            newY = Math.min(Math.round(newY / SIZE_SHAPE) * SIZE_SHAPE, BOARD_SIZE);
        }

        setBuildingDraggedPosition((prev) => ({
            onBoardId: buildingDraggedPosition.onBoardId,
            // x: temp.x + delta.x,
            // y: temp.y + delta.y,
            x: newX,
            y: newY,
        }));
    }

    function handleOnDragEnd(event: DragEndEvent) {
        store.setPaneDragging(false);
        // zoomPanPinchcontext.isPanning = true;
        const { active } = event;
        if (!active) return;
        if (!buildingDraggedPosition) return;
        if (active.id != buildingDraggedPosition.onBoardId) return;

        // memastikan data yang sedang di drag benar
        const building = buildingsOnBoard.find((b) => b.onBoardId === active.id);
        if (!building) return;

        // Update posisi sebenarnya di Redux hanya saat drag end
        dispatch(
            updatePositonBuilding({
                layoutId: layoutActiveSelected!,
                onBoardId: building.onBoardId,
                x: buildingDraggedPosition.x, // gunakan posisi building.position yang sudah di update di onDragMove
                y: buildingDraggedPosition.y, // gunakan posisi building.position yang sudah di update di onDragMove
            })
        );

        // Reset posisi sementara
        capturePosition.current = null;
        setBuildingDraggedPosition(null);
    }

    return (
        <div
            aria-description="Board"
            className="w-fit h-fit relative bg-yellow-300"
            style={{
                transform: store.boardType === BoardType.SQUARE ? undefined : `rotate(${rotateTo}deg)`,
            }}
        >
            <DraggableWrapper
                onDragStart={(event) => handleOnDragStart(event)}
                onDragMove={(event) => handleOnDragMove(event)}
                onDragEnd={(event) => handleOnDragEnd(event)}
            >
                {buildingsOnBoard.map((building) => {
                    return (
                        <BoardBuildingChild
                            key={building.onBoardId}
                            layoutIdSelected={layoutActiveSelected}
                            building={building}
                            draggedPosition={buildingDraggedPosition} // Kirimkan posisi sementara ke child component
                        />
                    );
                })}

                <CoordinateGuide />
                <BoardCanvasGuide />
                {/*   <div
                    aria-description="wall wrapper"
                    className="absolute top-0 left-0"
                    style={{ height: indicatorLine.length * SIZE_SHAPE, width: indicatorLine.length * SIZE_SHAPE }}
                    onClick={() => console.log('wall wrapper click')}
                ></div> */}
                <BoardWall className={modeLayoutBuilder === 'wall' ? 'z-10 block' : 'hidden'} />
            </DraggableWrapper>
        </div>
    );
}

type BoardBuildingChildProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'> & {
    // containerRef: MutableRefObject<HTMLDivElement | null>;
    building: BuildingOnBoard;
    layoutIdSelected: string | null;
    // isDragging: boolean;
    style?: CSSProperties;
    draggedPosition?: BuildingDraggedPosition; // Tambahkan prop untuk posisi sementara
};

function BoardBuildingChild({
    /* containerRef, */ layoutIdSelected,
    building,
    className,
    // isDragging,
    draggedPosition,
    style,
    ...props
}: BoardBuildingChildProps) {
    const boxRef = useRef<HTMLDivElement | null>(null);
    const dispatch = useAppDispatch();
    const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: building.onBoardId });

    const isDragging = !!draggedPosition && draggedPosition.onBoardId === building.onBoardId;

    // Tentukan posisi yang akan digunakan, baik dari state sementara atau dari state sebenarnya
    const currentX = isDragging ? draggedPosition.x : building.position.x;
    const currentY = isDragging ? draggedPosition.y : building.position.y;

    const buildingStyle = {
        height: building.size.h * SIZE_SHAPE,
        width: building.size.w * SIZE_SHAPE,
        '--url-image': `url(${building.imageUrl})`,
        left: currentX, // Gunakan currentX
        top: currentY, // Gunakan currentY
        // zIndex: isDragging ? 2 : 1,
        position: 'absolute',
        // pointerEvents: isDragging ? 'none' : 'auto', // Add pointerEvents here
        ...style,
    } as CustomBoardBuildingCSS;
    return (
        <div
            ref={setNodeRef}
            data-descripton="box-building"
            className={cn(styles['BoardBuildingChild'], 'bg-green-500/40 text-xs', isDragging && 'bg-green-500/60', className)}
            // style={isDragging ? { ...buildingStyle, ...style } : buildingStyle}
            style={buildingStyle}
            key={building.onBoardId}
            {...listeners}
            {...attributes}
        >
            <button
                style={{
                    padding: '3px',
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    zIndex: 2,
                    // pointerEvents: isDragging ? 'none' : 'auto', // Add pointerEvents here
                }}
                onClick={(e) => {
                    console.log('onClick button');
                    // e.stopPropagation(); // Stop event propagation
                    if (!layoutIdSelected) return;

                    dispatch(deleteBuildingOnLayout({ layoutId: layoutIdSelected, onBoardId: building.onBoardId }));
                }}
            >
                <Trash2Icon className={cn('size-[12px] text-red-600', building.size.h === 1 && 'size-[6px]')} />
            </button>
        </div>
    );
}
