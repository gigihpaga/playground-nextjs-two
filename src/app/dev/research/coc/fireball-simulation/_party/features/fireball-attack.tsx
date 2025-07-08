'use client';

import React, { ComponentPropsWithoutRef, CSSProperties, MutableRefObject, ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { FootprintsIcon, RocketIcon, Trash2Icon } from 'lucide-react';
import { type DragEndEvent, type DragMoveEvent, type DragStartEvent, useDraggable } from '@dnd-kit/core';

import { cn } from '@/lib/classnames';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';

import { shallow, useFireballSimulationStore, type FCEntityOnBoard, type BuildingOnBoardLoacal } from '../store/fireball-simulation-store';

import { heroWarden as initialHeroWarden, spellEarthquake, spellInvisible } from '../constants';
import { EdgePropeperties, generateEdge, getEntitySize } from '../utils';
import { EntityOnBoard, Hero, Spell } from '../types';

import {
    addBuilding,
    addWall,
    deleteBuildingOnLayout,
    getLayoutSelected,
    selectAllLayout,
    getModeLayoutBuilder,
    selectBuildingOnBoard,
    selectWallOnBoard,
    updatePositonBuilding,
} from '@/app/dev/research/coc/queen-charge/_party/state/layout-collection-slice';
import { type BuildingOnBoard } from '@/app/dev/research/coc/queen-charge/_party/types';
import styles from '@/app/dev/research/coc/queen-charge/_party/features/app.module.scss';
import { indicatorLine, SIZE_SHAPE } from '@/app/dev/research/coc/queen-charge/_party/constants';
import { CustomBoardBuildingCSS, LayoutCollection } from '@/app/dev/research/coc/queen-charge/_party/types';
import { CoordinateGuide } from '@/app/dev/research/coc/queen-charge/_party/components/coordinate-guide';
import { BoardCanvasGuide } from '@/app/dev/research/coc/queen-charge/_party/components/board-canvas-guide';

import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

// import { ZoomPanPinch } from '../components/zoom-pan-pinch';
import {
    ZoomPanPinchProvider,
    ZoomPanPinchWrapper,
    ZoomPanPinchComponent,
    Background,
    Controls,
    ZoomPanPinchLiveComponent,
} from '../components/zoom-pan-pinch-new';
import { DraggableWrapper } from '../components/draggable-wrapper';
import { TwoColumnWrapper } from '../components/two-column-wrapper';
import { FireballAttackRightSidebar } from './fireball-attack-right-sidebar';
import { transformArrayToObject } from '@/utils/transform-array-or-object';
import { useTheme } from 'next-themes';
import { EquipmentImage } from '../components/equipment-image';

export function FireballAttack() {
    const store = useFireballSimulationStore((s) => ({ paneDragging: s.paneDragging, setPaneDragging: s.setPaneDragging }), shallow);
    const nextTheme = useTheme();
    return (
        <ZoomPanPinchProvider disabled={store.paneDragging}>
            <TwoColumnWrapper
                aria-description="fireball attack"
                className=""
                leftComponent={
                    <ZoomPanPinchWrapper>
                        <ZoomPanPinchComponent>
                            <Board />
                        </ZoomPanPinchComponent>
                        <Background theme={nextTheme.theme as 'light' | 'dark' | 'system'} />
                        <Controls />
                        <ZoomPanPinchLiveComponent
                            render={({ state, instance }) => (
                                <div
                                    className="absolute top-0 left-0 bg-purple-600 px-2 rounded-full"
                                    aria-description="debug position"
                                >
                                    x: {state.positionX} | y: {state.positionY}
                                </div>
                            )}
                        />
                    </ZoomPanPinchWrapper>
                }
                rightComponent={<FireballAttackRightSidebar />}
            />
        </ZoomPanPinchProvider>
    );
}

function World() {}

type BuildingDraggedPosition = {
    onBoardId: BuildingOnBoard['onBoardId'];
    x: number;
    y: number;
};

function Board() {
    const renderCount = useRef(1);
    renderCount.current += 1;
    const dispatch = useAppDispatch();
    const allLayouts = useAppSelector(selectAllLayout);
    const layoutActiveSelected = useAppSelector(getLayoutSelected);
    const buildingsOnBoard = useAppSelector((state) => selectBuildingOnBoard(state, layoutActiveSelected));
    const { syncBuildingFromRedux, getAttackState, ...store } = useFireballSimulationStore((state) => {
        return {
            paneDragging: state.paneDragging,
            setPaneDragging: state.setPaneDragging,
            wardenActionMode: state.wardenActionMode,
            setWardenActionMode: state.setWardenActionMode,
            resetWardenActionMode: state.resetWardenActionMode,
            getTargetFireBall: state.getTargetFireBall,
            attackState: state.attackState,
            getAttackState: state.getAttackState,
            addAttackState: state.addAttackState,
            getEntityOnBoard: state.getEntityOnBoard,
            setTargetFireBall: state.setTargetFireBall,
            updateEntityPosition: state.updateEntityPosition,
            refresh: state.refresh,

            setBuildingsOnBoardLocal: state.setBuildingsOnBoardLocal,
            getBuildingsOnBoardLocal: state.getBuildingsOnBoardLocal,
            getEdges: state.getEdges,
            updateEdgesOnDragging: state.updateEdgesOnDragging,
            syncBuildingFromRedux: state.syncBuildingFromRedux,
            getLayoutEdgesVisibility: state.getLayoutEdgesVisibility,
            setLayoutEdgesVisibility: state.setLayoutEdgesVisibility,
        };
    }, shallow);
    const isAllEgesVisible = store.getLayoutEdgesVisibility(layoutActiveSelected);
    const activeAttackState = layoutActiveSelected ? getAttackState(layoutActiveSelected) : undefined;

    /**
     * `entityOnBoard` berisi data warden dan spell,
     *
     * yang membedakan warden dan spell adalah `entityTypeName`: 'hero' | 'spell',
     * atau `slug`: 'grand_warden' | 'invisibility_spell',
     */
    const entityOnBoard = layoutActiveSelected ? store.getEntityOnBoard(layoutActiveSelected) : [];
    const targetFireball = store.getTargetFireBall(layoutActiveSelected);

    /**
     * useEffect #1: Melakukan inisialisasi awal untuk semua layout.
     * Hook ini berjalan ketika daftar semua layout (`allLayouts`) berubah.
     * Tujuannya adalah untuk memastikan setiap layout dari Redux memiliki state awal di Zustand,
     * terutama saat aplikasi pertama kali dimuat.
     */
    useEffect(() => {
        if (allLayouts.length > 0) {
            allLayouts.forEach((layout) => {
                syncBuildingFromRedux(layout.layoutId, layout.buildingOnBoard);
            });
        }
    }, [allLayouts, syncBuildingFromRedux]);

    const buildingsOnBoardLocal = layoutActiveSelected ? store.getBuildingsOnBoardLocal(layoutActiveSelected) : [];
    const [buildingDraggedPosition, setBuildingDraggedPosition] = useState<BuildingDraggedPosition | null>(null);
    const capturePosition = useRef<{ x: number; y: number } | null>(null);

    function handleOnDragStart(event: DragStartEvent) {
        // console.log('onDragStart', event);
        // zoomPanPinchcontext.isPanning = false;
        // console.log('onDragStart:zoomPanPinchcontext:isPanning', zoomPanPinchcontext.isPanning);
        store.setPaneDragging(true);
        const { active } = event;
        const building = entityOnBoard.find((b) => b.onBoardId === active.id);
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

        let newX = temp.x + delta.x;
        let newY = temp.y + delta.y;
        const BOARD_SIZE = SIZE_SHAPE * indicatorLine.length;

        // snap to grid (untuk hero warden dan spell tidak perlu menggunakan snap to grid)
        // newX = Math.min(Math.round(newX / SIZE_SHAPE) * SIZE_SHAPE, BOARD_SIZE);
        // newY = Math.min(Math.round(newY / SIZE_SHAPE) * SIZE_SHAPE, BOARD_SIZE);

        /**
         * posisi warden harus di perbaruin di ondragmove, karena jika tidak line yang terhubung dengan warden tidak sinkron
         */
        /** 
        setHeroWarden((prev) => {
            return {
                ...prev,
                onBoardId: building.onBoardId,
                position: {
                    x: newX,
                    y: newY,
                },
            } satisfies typeof heroWarden;
        });
        */

        setBuildingDraggedPosition((prev) => ({
            onBoardId: buildingDraggedPosition.onBoardId,
            // x: temp.x + delta.x,
            // y: temp.y + delta.y,
            x: newX,
            y: newY,
        }));

        // untu update collision building
        //
        /** menggunakan useState, sekarang menggunakan zustand 
        const entityActiveDragging = entityOnBoard.find((eob) => eob.onBoardId === buildingDraggedPosition.onBoardId);
        if (entityActiveDragging && 'radius' in entityActiveDragging) {
            // entityActiveDragging.entityTypeName === 'spell' &&
            // manipulasi posisi sementara
            const entityOnBoardWithNewPosition = entityOnBoard.map((eob) => {
                return eob.onBoardId === entityActiveDragging.onBoardId ? { ...eob, position: { x: newX, y: newY } } : { ...eob };
            });

            // entityActiveDragging.entityTypeName === 'spell' &&
            setBuildingsOnBoardLocal((prev) => {
                const entityOnBoardSpell = entityOnBoardWithNewPosition.filter((eob) => 'radius' in eob);
                const buildingCollisionsUpdated = checkCollisionsCircleVsSquareMiddle(entityOnBoardSpell, prev);
                return buildingCollisionsUpdated.squares;
            });
        }
        */
        // Update collision building when dragged is spell
        if (!layoutActiveSelected) return;
        const entityActiveDragging = entityOnBoard.find((eob) => eob.onBoardId === buildingDraggedPosition.onBoardId);
        if (entityActiveDragging && 'radius' in entityActiveDragging) {
            const entityOnBoardWithNewPosition = entityOnBoard.map((eob) => {
                return eob.onBoardId === entityActiveDragging.onBoardId ? { ...eob, position: { x: newX, y: newY } } : { ...eob };
            });

            const entityOnBoardSpell = entityOnBoardWithNewPosition.filter((eob) => 'radius' in eob);
            if (entityActiveDragging && entityActiveDragging.slug === 'invisibility_spell') {
                const buildingCollisionsUpdated = checkCollisionsCircleVsSquareMiddle(
                    entityOnBoardSpell.filter((e) => e.slug === 'invisibility_spell'),
                    buildingsOnBoardLocal.filter((bob) => bob.slug !== 'wall')
                );
                store.setBuildingsOnBoardLocal(
                    layoutActiveSelected,
                    buildingCollisionsUpdated.squares.concat(buildingsOnBoardLocal.filter((bob) => bob.slug === 'wall'))
                );
            }
            if (entityActiveDragging && entityActiveDragging.slug === 'earthquake_spell') {
                const buildingCollisionsUpdated = checkCollisionsCircleVsSquareEdge(
                    entityOnBoardSpell.filter((e) => e.slug === 'earthquake_spell'),
                    buildingsOnBoardLocal.filter((bob) => bob.slug !== 'wall')
                );
                store.setBuildingsOnBoardLocal(
                    layoutActiveSelected,
                    buildingCollisionsUpdated.squares.concat(buildingsOnBoardLocal.filter((bob) => bob.slug === 'wall'))
                );
            }
        }

        // Update edge when dragged is hero
        if (entityActiveDragging && entityActiveDragging.entityTypeName === 'hero') {
            store.updateEdgesOnDragging(layoutActiveSelected, {
                ...entityActiveDragging,
                position: { x: newX, y: newY },
            });
        }
    }

    function handleOnDragEnd(event: DragEndEvent) {
        store.setPaneDragging(false);
        // zoomPanPinchcontext.isPanning = true;
        const { active } = event;
        if (!active) return;
        if (!buildingDraggedPosition) return;
        if (active.id != buildingDraggedPosition.onBoardId) return;

        // memastikan data yang sedang di drag benar
        const building = entityOnBoard.find((b) => b.onBoardId === active.id);
        if (!building || !layoutActiveSelected) {
            // Reset posisi sementara
            capturePosition.current = null;
            setBuildingDraggedPosition(null);
            return;
        }

        // Update posisi sebenarnya di Redux hanya saat drag end
        store.updateEntityPosition({
            layoutId: layoutActiveSelected,
            onBoardId: building.onBoardId,
            position: {
                x: buildingDraggedPosition.x,
                y: buildingDraggedPosition.y,
            },
        });

        // Reset posisi sementara
        capturePosition.current = null;
        setBuildingDraggedPosition(null);
    }

    /**
    const edges = produceEdgesWithListenDragging({
        targetFireball, // ada distore
        entityOnBoard, // ada distore
        buildingsOnBoard: buildingsOnBoardLocal, // ada di store
        buildingDraggedPosition, // di useState
        layoutActiveSelected, // redux
    });
     */
    const edges = layoutActiveSelected ? store.getEdges(layoutActiveSelected) : [];
    const buildingsOnBoardLocalAdapter = transformArrayToObject(buildingsOnBoardLocal, 'onBoardId');
    const edgesTarget = edges.find((edge) => edge.onBoardId === targetFireball?.onBoardId);

    // console.log('Board:edges', edges);
    // console.log('Board:buildingsOnBoardLocal', buildingsOnBoardLocal);
    // console.log('FireballAttack:Board RENDER!!!');
    // console.log('Board:entityOnBoard', entityOnBoard);
    console.log(`render: ${renderCount.current}`);
    // console.log('Board:edges', edges);
    // console.log('Board:buildingsOnBoardLocalAdapter', buildingsOnBoardLocalAdapter);
    return (
        <div
            aria-description="Board"
            className="w-fit h-fit relative bg-yellow-300"
        >
            <div
                aria-description="edges"
                className="absolute top-0 left-0"
            >
                {edges.map((edge, index) => {
                    const edgesTargetDistance = edgesTarget?.property.distance || 0;
                    const currentEdgeIslongerFromTarget = (edgesTarget?.property.distance || 0) > edge.property.distance;
                    return (
                        <Edge
                            stroke={edge.onBoardId === targetFireball?.onBoardId ? '#07ad13' : currentEdgeIslongerFromTarget ? 'red' : 'white'}
                            // isHidden={isAllEgesVisible === true ? !isAllEgesVisible : buildingsOnBoardLocalAdapter[edge.onBoardId].isColliding}
                            isHidden={
                                edge.onBoardId === edgesTarget?.onBoardId
                                    ? false
                                    : isAllEgesVisible === true
                                      ? false
                                      : buildingsOnBoardLocalAdapter[edge.onBoardId].isColliding === true
                                        ? true
                                        : !currentEdgeIslongerFromTarget
                            }
                            key={index}
                            {...edge}
                        />
                    );
                })}
            </div>
            {buildingsOnBoardLocal.map((building) => (
                <BoardBuildingChild
                    key={building.onBoardId}
                    building={building}
                    layoutIdSelected={layoutActiveSelected}
                />
            ))}
            {targetFireball && <FireballDemageArea targetFireball={targetFireball} />}
            <DraggableWrapper
                distance={0}
                onDragStart={(event) => handleOnDragStart(event)}
                onDragMove={(event) => handleOnDragMove(event)}
                onDragEnd={(event) => handleOnDragEnd(event)}
            >
                {entityOnBoard.map((entity) => (
                    <BoardEntityChild
                        key={entity.onBoardId}
                        layoutIdSelected={layoutActiveSelected}
                        entity={entity}
                        draggedPosition={buildingDraggedPosition}
                    />
                ))}
            </DraggableWrapper>

            <CoordinateGuide />
            <BoardCanvasGuide />
        </div>
    );
}

type BoardBuildingChildProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'> & {
    // containerRef: MutableRefObject<HTMLDivElement | null>;
    building: BuildingOnBoardLoacal;
    layoutIdSelected: string | null;
    // isDragging: boolean;
    // draggedPosition?: BuildingDraggedPosition; // Tambahkan prop untuk posisi sementara
};

function BoardBuildingChild({ layoutIdSelected, building, className, ...props }: BoardBuildingChildProps) {
    // const boxRef = useRef<HTMLDivElement | null>(null);
    const dispatch = useAppDispatch();
    // const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: building.onBoardId });
    const store = useFireballSimulationStore((state) => {
        return {
            paneDragging: state.paneDragging,
            wardenActionMode: state.wardenActionMode,
            setWardenActionMode: state.setWardenActionMode,
            resetWardenActionMode: state.resetWardenActionMode,
            getTargetFireBall: state.getTargetFireBall,
            setTargetFireBall: state.setTargetFireBall,
            createEdges: state.createEdges,
            clearEdges: state.clearEdges,
            setting: state.setting,
            setBuildingsOnBoardLocal: state.setBuildingsOnBoardLocal,
            getBuildingsOnBoardLocal: state.getBuildingsOnBoardLocal,
        };
    }, shallow);
    const targetFireBall = store.getTargetFireBall(layoutIdSelected);

    // const isDragging = !!draggedPosition && draggedPosition.onBoardId === building.onBoardId;

    // Tentukan posisi yang akan digunakan, baik dari state sementara atau dari state sebenarnya
    // const currentX = isDragging ? draggedPosition.x : building.position.x;
    // const currentY = isDragging ? draggedPosition.y : building.position.y;

    function handleSetTargetFireBall() {
        if (!layoutIdSelected) return;
        store.setTargetFireBall(layoutIdSelected, building);
        store.createEdges(layoutIdSelected);
        store.resetWardenActionMode();
    }
    function handleResetTargetFireBall() {
        if (!layoutIdSelected) return;
        store.setTargetFireBall(layoutIdSelected, null);
        store.clearEdges(layoutIdSelected);
        const buildingsOnBoard = store.getBuildingsOnBoardLocal(layoutIdSelected);
        store.setBuildingsOnBoardLocal(
            layoutIdSelected,
            buildingsOnBoard.map((building) => ({ ...building, isAffectedFireball: false }))
        );
    }

    const buildingStyle = {
        height: building.size.h * SIZE_SHAPE,
        width: building.size.w * SIZE_SHAPE,
        '--url-image': `url(${building.imageUrl})`,
        // left: currentX, // Gunakan currentX
        // top: currentY, // Gunakan currentY
        left: building.position.x,
        top: building.position.y,
        // zIndex: isDragging ? 2 : 1,
        position: 'absolute',
        // pointerEvents: isDragging ? 'none' : 'auto', // Add pointerEvents here
    } as CustomBoardBuildingCSS;
    return (
        <div
            // ref={setNodeRef}
            data-descripton="box-building"
            className={cn(styles['BoardBuildingChild'], 'bg-green-500/40 text-xs', building.isColliding && 'bg-[#1782d06e]', className)}
            // style={isDragging ? { ...buildingStyle, ...style } : buildingStyle}
            style={buildingStyle}
            key={building.onBoardId}
            // {...listeners}
            // {...attributes}
        >
            <button
                style={{
                    display: 'none',
                    padding: '3px',
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    zIndex: 1,
                    // pointerEvents: isDragging ? 'none' : 'auto', // Add pointerEvents here
                }}
                onClick={(e) => {
                    console.log('onClick button');
                    // e.stopPropagation(); // Stop event propagation
                    if (!layoutIdSelected) return;

                    // dispatch(deleteBuildingOnLayout({ layoutId: layoutIdSelected, onBoardId: building.onBoardId }));
                }}
            >
                <Trash2Icon className={cn('size-[12px] text-red-600', building.size.h === 1 && 'size-[6px]')} />
            </button>

            <div className="absolute flex gap-x-[2px] p-1 left-0 bottom-0">
                {building.isColliding && (
                    <Image
                        className="aspect-square object-center object-cover opacity-90"
                        width={12}
                        height={12}
                        priority
                        quality={40}
                        src={spellInvisible.imageUrl}
                        alt={spellInvisible.name}
                    />
                )}
                {building.isShaked && (
                    <Image
                        className="aspect-square object-center object-cover opacity-90"
                        width={12}
                        height={12}
                        priority
                        quality={40}
                        src={spellEarthquake.imageUrl}
                        alt={spellEarthquake.name}
                    />
                )}
            </div>

            {building.entityTypeName === 'wall' ? null : (
                <>
                    <div
                        aria-description="top right"
                        className="absolute top-0 right-0 p-1 max-h-5 overflow-hidden"
                    >
                        {building.isAffectedFireball === true ? (
                            <Image
                                className="aspect-square object-center object-cover opacity-90"
                                width={15}
                                height={15}
                                loading="lazy"
                                quality={40}
                                src={'/images/coc-equipment/176_24.png'}
                                alt={'Fireball'}
                            />
                        ) : null}
                    </div>
                    <p className="text-2xs font-bold absolute top-1/2 left-1/2 transform -translate-x-1/2 translate-y-[5px]">
                        {building.size.w}x{building.size.h}
                    </p>
                </>
            )}
            {store.wardenActionMode === 'search-target' || building.onBoardId === targetFireBall?.onBoardId ? (
                <div className="flex items-center space-x-2 z-[1]">
                    <Checkbox
                        checked={building.onBoardId === targetFireBall?.onBoardId}
                        onCheckedChange={(checked) => {
                            if (checked) {
                                handleSetTargetFireBall();
                            } else {
                                handleResetTargetFireBall();
                            }
                        }}
                    />
                    <p className="sr-only">select your target</p>
                </div>
            ) : null}
            {/*   {targetFireBall?.onBoardId === building.onBoardId ? (
                <div
                    aria-description="fireball radius"
                    className="bg-[#fc4c4c80] z-[-1] rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                    style={{
                        width: store.setting.user.fireBallRadius * 2 * SIZE_SHAPE,
                        height: store.setting.user.fireBallRadius * 2 * SIZE_SHAPE,
                    }}
                />
            ) : null} */}
        </div>
    );
}

type BoardWardebChildProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'> & {
    // containerRef: MutableRefObject<HTMLDivElement | null>;
    entity: FCEntityOnBoard;
    layoutIdSelected: LayoutCollection['layoutId'] | null;
    // isDragging: boolean;
    draggedPosition?: BuildingDraggedPosition | null; // Tambahkan prop untuk posisi sementara
};

function BoardEntityChild({
    /* containerRef, */
    layoutIdSelected,
    entity,
    className,
    // isDragging,
    draggedPosition,
    // style,
    ...props
}: BoardWardebChildProps) {
    const boxRef = useRef<HTMLDivElement | null>(null);
    const dispatch = useAppDispatch();
    const { attributes, listeners, setNodeRef, transform, isDragging: _isDragging } = useDraggable({ id: entity.onBoardId });

    const isDragging = !!draggedPosition && draggedPosition.onBoardId === entity.onBoardId;

    // Tentukan posisi yang akan digunakan, baik dari state sementara atau dari state sebenarnya
    const currentX = isDragging ? draggedPosition.x : entity.position.x;
    const currentY = isDragging ? draggedPosition.y : entity.position.y;

    return entity.entityTypeName === 'hero' ? (
        <HeroWarden
            layoutIdSelected={layoutIdSelected}
            entity={entity}
            x={currentX}
            y={currentY}
            isDragging={isDragging}
            setNodeRef={setNodeRef}
            listeners={listeners}
            attributes={attributes}
        />
    ) : entity.entityTypeName === 'spell' ? (
        <SpellOnBoard
            layoutIdSelected={layoutIdSelected}
            entity={entity}
            x={currentX}
            y={currentY}
            isDragging={isDragging}
            setNodeRef={setNodeRef}
            listeners={listeners}
            attributes={attributes}
        />
    ) : (
        <p className="sr-only hidden">sorry cannot display drag component because category is invalid :p</p>
    );
}

type UseDraggableReturn = ReturnType<typeof useDraggable>;

type HeroWardenProps = {
    layoutIdSelected: LayoutCollection['layoutId'] | null;
    entity: FCEntityOnBoard;
    x: number;
    y: number;
    isDragging: boolean;
    setNodeRef: UseDraggableReturn['setNodeRef'];
    listeners: UseDraggableReturn['listeners'];
    attributes: UseDraggableReturn['attributes'];
};

function HeroWarden({ layoutIdSelected, entity, x, y, isDragging, setNodeRef, listeners, attributes }: HeroWardenProps) {
    const size = getEntitySize(entity);
    const entityStyle = {
        height: size.height,
        width: size.width,
        '--url-image': `url(${entity.imageUrl})`,
        left: x, // Gunakan currentX
        top: y, // Gunakan currentY
        // zIndex: isDragging ? 2 : 1,
        position: 'absolute',
        // pointerEvents: isDragging ? 'none' : 'auto', // Add pointerEvents here
    } as CustomBoardBuildingCSS;
    return (
        <div
            id="my-warden"
            ref={setNodeRef}
            data-descripton="box-building"
            className={cn(
                styles['BoardBuildingChild'],
                styles['MyQueen'],
                '[&:before]:!bg-transparent [&:after]:!top-[3px] transform [&:after]:!-translate-x-1/2 [&:after]:!translate-y-0 [&:after]:!size-[15px] [&:after]:!bg-transparent [&:after]:!bg-[size:15px] !bg-[#e100ff33] rounded-full text-xs',
                isDragging && '!bg-purple-500/60'
            )}
            // style={isDragging ? { ...buildingStyle, ...style } : buildingStyle}
            style={{ ...entityStyle }}
            key={'my-warden'}
            {...listeners}
            {...attributes}
        >
            <button
                style={{
                    display: 'none',
                    padding: '2px',
                    borderRadius: '5px',
                    position: 'absolute',
                    left: '50%',
                    top: '50%',

                    transform: 'translate(calc(-50% - 19px), calc(-50% - 1px))',
                    // pointerEvents: isDragging ? 'none' : 'auto', // Add pointerEvents here
                }}
                data-tooltip="save current step queen"
                onClick={(e) => {
                    console.log('onClick button');
                    // e.stopPropagation(); // Stop event propagation
                    if (!layoutIdSelected) return;

                    // dispatch(deleteBuildingOnLayout({ layoutId: layoutIdSelected, onBoardId: building.onBoardId }));
                }}
            >
                <FootprintsIcon className={cn('size-[12px] text-yellow-400')} />
            </button>
            <Cross />
            <PopoverWardenAction
                trigger={
                    <Button
                        size="sm"
                        title="warden action"
                        className="h-fit w-fit p-[2px] rounded-sm z-[1] absolute left-[50%] top-[50%]"
                        style={{
                            transform: 'translate(calc(-50% - 19px), calc(-50% - 1px))',
                        }}
                    >
                        <RocketIcon className="size-[10px]" />
                    </Button>
                }
            />
        </div>
    );
}

type SpellOnBoardProps = HeroWardenProps;

function SpellOnBoard({ layoutIdSelected, entity, x, y, isDragging, setNodeRef, listeners, attributes }: SpellOnBoardProps) {
    const size = getEntitySize(entity);
    const entityStyle = {
        position: 'absolute',
        '--url-image': `url(${entity.imageUrl})`,
        height: size.height,
        width: size.width,
        left: x,
        top: y,
        zIndex: 2,
        // zIndex: isDragging ? 2 : 1,
        // pointerEvents: isDragging ? 'none' : 'auto', // Add pointerEvents here
    } as CustomBoardBuildingCSS;

    const isInvisSpell = entity.slug === 'invisibility_spell';

    return (
        <div
            ref={setNodeRef}
            data-descripton="spell"
            className={cn(
                'rounded-full bg-stone-900/40',
                isDragging && 'bg-stone-900/50',
                isInvisSpell && 'bg-cyan-400/40',
                isInvisSpell && isDragging && 'bg-cyan-400/50'
            )}
            style={entityStyle}
            {...listeners}
            {...attributes}
        >
            <Image
                className="absolute top-[35%] left-[35%] transform -translate-x-1/2 -translate-y-1/2 aspect-square object-center object-cover opacity-50"
                width={20}
                height={20}
                priority
                quality={50}
                src={entity.imageUrl}
                alt={entity.name}
            />
            <p className="absolute top-[50%] left-[30%] transform -translate-x-1/2 -translate-y-1/2 text-3xs">
                radius: {(entity as EntityOnBoard<Spell>).radius / 2}
            </p>
            <Cross />
            <button
                style={{
                    display: 'none',
                    padding: '2px',
                    borderRadius: '5px',
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    transform: 'translate(calc(-50% - 19px), calc(-50% - 1px))',
                    // pointerEvents: isDragging ? 'none' : 'auto', // Add pointerEvents here
                }}
                data-tooltip="save current step queen"
                onClick={() => {}}
            >
                <FootprintsIcon className={cn('size-[12px] text-yellow-400')} />
            </button>
        </div>
    );
}

function PopoverWardenAction({ trigger }: { trigger: ReactNode }) {
    const [isPopoverOpen, setIsPopoverOpen] = useState<boolean>(false);
    const store = useFireballSimulationStore((s) => {
        return {
            wardenActionMode: s.wardenActionMode,
            setWardenActionMode: s.setWardenActionMode,
            resetWardenActionMode: s.resetWardenActionMode,
        };
    }, shallow);

    function handleSearchTargetMode() {
        store.setWardenActionMode('search-target');
        setIsPopoverOpen(false);
    }

    return (
        <Popover
            open={isPopoverOpen}
            onOpenChange={(state) => setIsPopoverOpen(state)}
        >
            <PopoverTrigger asChild>{trigger}</PopoverTrigger>
            <PopoverContent className="min-w-80 p-2">
                <div className="grid gap-4">
                    <div className="space-y-1">
                        <h4 className="text-sm md:text-base font-medium leading-none">Warden Action</h4>
                        <p className="text-xs md:text-sm text-muted-foreground">Controler & action warden.</p>
                    </div>
                    <div className="grid gap-2">
                        <Button
                            title="set target fireball"
                            size="sm"
                            className="h-fit w-fit py-1 px-1.5 text-xs gap-x-[2px]"
                            onClick={() => handleSearchTargetMode()}
                        >
                            <RocketIcon className="size-3" />
                            set target fireball
                        </Button>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}

function FireballDemageArea({ targetFireball }: { targetFireball: BuildingOnBoard }) {
    const layoutActiveSelected = useAppSelector(getLayoutSelected);
    const { getBuildingsOnBoardLocal, setBuildingsOnBoardLocal, ...store } = useFireballSimulationStore((state) => {
        return {
            paneDragging: state.paneDragging,
            wardenActionMode: state.wardenActionMode,
            setWardenActionMode: state.setWardenActionMode,
            resetWardenActionMode: state.resetWardenActionMode,
            getTargetFireBall: state.getTargetFireBall,
            setTargetFireBall: state.setTargetFireBall,
            createEdges: state.createEdges,
            clearEdges: state.clearEdges,
            setting: state.setting,
            setPaneDragging: state.setPaneDragging,
            attackState: state.attackState,
            getAttackState: state.getAttackState,
            addAttackState: state.addAttackState,
            getEntityOnBoard: state.getEntityOnBoard,
            updateEntityPosition: state.updateEntityPosition,
            refresh: state.refresh,
            setBuildingsOnBoardLocal: state.setBuildingsOnBoardLocal,
            getBuildingsOnBoardLocal: state.getBuildingsOnBoardLocal,
            getEdges: state.getEdges,
            updateEdgesOnDragging: state.updateEdgesOnDragging,
            syncBuildingFromRedux: state.syncBuildingFromRedux,
            getLayoutEdgesVisibility: state.getLayoutEdgesVisibility,
            setLayoutEdgesVisibility: state.setLayoutEdgesVisibility,
        };
    }, shallow);

    const fireball = calculateCoordinateCircle({
        circle: { radius: store.setting.user.fireBallRadius },
        square: { x: targetFireball.position.x, y: targetFireball.position.y, h: targetFireball.size.h, w: targetFireball.size.w },
        tileSize: SIZE_SHAPE,
    });

    useEffect(() => {
        console.log('FireballDemageArea:useEffect');
        if (!layoutActiveSelected) return;
        const buildingsOnBoard = getBuildingsOnBoardLocal(layoutActiveSelected);
        const buildingsUpdate: BuildingOnBoardLoacal[] = buildingsOnBoard.map((building) => {
            if (building.slug !== 'wall' && building.entityId !== targetFireball.entityId) {
                const isAffectedFireball = checkCollisionFireballAreaVsBuilding({
                    building: building,
                    fireball: { x: fireball.x, y: fireball.y, radius: fireball.radius },
                    tileSize: SIZE_SHAPE,
                });

                return {
                    ...building,
                    isAffectedFireball: isAffectedFireball,
                };
            }

            return {
                ...building,
                isAffectedFireball: false,
            };
        });
        if (buildingsUpdate.length === 0) return;
        setBuildingsOnBoardLocal(layoutActiveSelected, buildingsUpdate);
    }, [targetFireball.entityId, fireball.radius, fireball.x, fireball.y, layoutActiveSelected, getBuildingsOnBoardLocal, setBuildingsOnBoardLocal]);

    return (
        <div
            aria-description="fireball radius"
            className="bg-[#fc4c4c80] z-[1] rounded-full absolute"
            style={{
                width: fireball.radius * SIZE_SHAPE * 2,
                height: fireball.radius * SIZE_SHAPE * 2,
                top: fireball.y,
                left: fireball.x,
            }}
        >
            {/* <p className="text-2xs">{JSON.stringify(targetFireball, null, 2)}</p> */}
        </div>
    );
}

type EdgeProps = {
    onBoardId: BuildingOnBoard['onBoardId'];
    id?: string;
    stroke?: React.SVGAttributes<SVGLineElement>['stroke'];
    isHidden?: boolean;

    textColor?: React.SVGAttributes<SVGTextElement>['fill'];
    property: Pick<EdgePropeperties, 'x1' | 'y1' | 'x2' | 'y2' | 'textX' | 'textY' | 'distance'>;
};

function Edge({ id, onBoardId, stroke, textColor, property, isHidden }: EdgeProps) {
    return (
        <svg className={cn('absolute z-[20] overflow-visible pointer-events-none', isHidden === true && 'hidden')}>
            <g
            // key={enemy.id}
            // data-name={`${enemy.id}-${enemy.type}`}
            >
                <line
                    x1={property.x1}
                    y1={property.y1}
                    x2={property.x2}
                    y2={property.y2}
                    stroke={stroke || 'white'}
                    strokeWidth="1"
                />
                <text
                    x={property.textX}
                    y={property.textY}
                    fill={textColor || '#eb4562'}
                    fontSize="10"
                    fontWeight="bold"
                    // font-size="0.8em"
                    textAnchor="middle"
                >
                    {property.distance.toFixed(1)}
                </text>
            </g>
        </svg>
    );
}

function Cross({ className, color = 'bg-[#ed7541eb]' }: React.HTMLAttributes<HTMLDivElement> & { color?: string }) {
    return (
        <div
            aria-description="cros"
            className={cn('absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2', className)}
            style={{ height: SIZE_SHAPE, width: SIZE_SHAPE }}
        >
            <div
                className={cn('absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2', color)}
                style={{ height: SIZE_SHAPE, width: 0.5 }}
            />
            <div
                className={cn('absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2', color)}
                style={{ height: 0.5, width: SIZE_SHAPE }}
            />
        </div>
    );
}

//* Helper
/**
 * fungsi ini untuk memantau entity dan building lalu akan menhasilkan list lines (menghubungkan entityOnBoard.entityTypeName="hero" dengan semua building)
 * id line adalah kombinasi dari entityOnBoard.onBoardId-buildingsOnBoard.onBoardId
 * semua building akan terpusat ke 1 entity yaitu entityOnBoard.entityTypeName="hero"
 * data entity berada di varibale entityOnBoard
 * data building berada di variable buildingsOnBoard
 *
 * line akan selalu update saat meskipun entity hero sedang didrag
 * line akan dirender berupa svg
 *
 * untuk men-generate line menggunakan function generateEdge
 * @returns
 */
function produceEdgesWithListenDragging(props: {
    targetFireball: BuildingOnBoard | null;
    entityOnBoard: FCEntityOnBoard[];
    buildingsOnBoard: BuildingOnBoard[];
    buildingDraggedPosition: BuildingDraggedPosition | null;
    layoutActiveSelected: LayoutCollection['layoutId'] | null;
}) {
    const { targetFireball, entityOnBoard, buildingsOnBoard, buildingDraggedPosition, layoutActiveSelected } = props;
    if (!targetFireball || !layoutActiveSelected) return null;

    //cari data hero
    const heroWarden = entityOnBoard.find((e) => e.entityTypeName === 'hero');
    if (!heroWarden) return null;

    const heroWardenSize = getEntitySize(heroWarden);

    const heroWardenIsDragging = buildingDraggedPosition !== null && buildingDraggedPosition.onBoardId === heroWarden.onBoardId;

    const edges = buildingsOnBoard.map((building) => {
        const buildingSize = getEntitySize(building);
        const edgeProperties = generateEdge(
            {
                x: heroWardenIsDragging ? buildingDraggedPosition.x : heroWarden.position.x,
                y: heroWardenIsDragging ? buildingDraggedPosition.y : heroWarden.position.y,
                size: heroWardenSize.width,
            },
            { x: building.position.x, y: building.position.y, size: buildingSize.width }
        );

        return {
            onBoardId: building.onBoardId,
            ...edgeProperties,
            stroke: building.onBoardId === targetFireball.onBoardId ? '#07ad13' : 'white',
        };
    });

    return edges;
}

/**
 * deteksi tabrakan shape circle vs square dengan rumus jarak `Euclidean`
 * lingkaran dan kotak akan dianggap bertabrakan jika tepi lingkaran melewati titik pusat (center) kotak.
 * Tabrakan terjadi saat tepi lingkaran melewati pusat kotak. Ini berarti jarak antara pusat lingkaran dan pusat kotak harus lebih kecil dari radius lingkaran.
 * @param circles - Array yang berisi lingkaran, yaitu entityOnBoard (spell)
 * @param squares - Array yang berisi kotak yaitu buildingsOnBoardLocal (building)
 * @returns - Object yang berisi circle dan square. dengan informasi `isColliding` yang diperbarui
 */
function checkCollisionsCircleVsSquareMiddle(
    circles: EntityOnBoard<Spell>[],
    squares: BuildingOnBoardLoacal[]
): { circles: EntityOnBoard<Spell>[]; squares: BuildingOnBoardLoacal[] } {
    // 1. Membuat salinan array `squares` dan me-reset isColliding menjadi `false`.
    //    Ini menghindari modifikasi langsung pada array asli dan memastikan status awal yang konsisten.
    const updatedSquares: BuildingOnBoardLoacal[] = squares.map((square) => ({
        ...square,
        isColliding: false, // Reset isColliding to false for all squares
    }));

    // 2. Inisialisasi objek untuk menyimpan status tabrakan untuk setiap lingkaran dan kotak.
    //    Kita perlu melacak ini secara terpisah untuk memastikan semua tabrakan terdeteksi.
    const circleCollisions: { [circleId: string]: boolean } = {};
    circles.forEach((circle) => (circleCollisions[circle.onBoardId] = false)); // inisialisasi false semua (tidak tabrakan)
    const squareCollisions: { [squareId: string]: boolean } = {};
    updatedSquares.forEach((square) => (squareCollisions[square.onBoardId] = false)); // inisialisasi false semua (tidak tabrakan)

    // 3. Loop melalui setiap lingkaran.
    for (const circle of circles) {
        // 4. Menghitung radius lingkaran dan titik pusat lingkaran
        const circleRadius = (circle.radius * SIZE_SHAPE) / 2;
        // Cx: Center X - koordinat X dari pusat lingkaran (Spell)
        const Cx = circle.position.x + circleRadius;
        // Cy: Center Y - koordinat Y dari pusat lingkaran
        const Cy = circle.position.y + circleRadius;

        // 5. Loop melalui setiap kotak (untuk setiap lingkaran, kita periksa semua kotak).
        for (const square of updatedSquares) {
            // 6. Hitung ukuran dan pusat kotak.
            const buildingSize = square.size.w * SIZE_SHAPE;
            // Sx: Square Center X - koordinat X dari pusat kotak
            const Sx = square.position.x + buildingSize / 2;
            // Sy: Square Center Y - koordinat Y dari pusat kotak
            const Sy = square.position.y + buildingSize / 2;

            // 7. Hitung jarak antara pusat lingkaran dan pusat kotak.
            //    dx: delta X - selisih koordinat X antara pusat lingkaran dan pusat kotak
            const dx = Cx - Sx;
            //    dy: delta Y - selisih koordinat Y antara pusat lingkaran dan pusat kotak
            const dy = Cy - Sy;
            //    distance: Jarak Euclidean antara pusat lingkaran dan pusat kotak
            const distance = Math.sqrt(dx * dx + dy * dy);

            // 8. Periksa apakah ada tabrakan (jarak lebih kecil dari radius lingkaran).
            //    Tabrakan terjadi jika jarak antara pusat lingkaran dan pusat kotak lebih kecil dari radius lingkaran.
            const isColliding = distance < circleRadius;

            // 9. Jika ada tabrakan, update status tabrakan pada kotak dan lingkaran.
            if (isColliding) {
                // Update status tabrakan pada kotak.
                squareCollisions[square.onBoardId] = true;
                // Update status tabrakan pada lingkaran.
                circleCollisions[circle.onBoardId] = true;
            }
        }

        // 10. Setelah memeriksa semua kotak untuk lingkaran ini, update status `isColliding` pada lingkaran tersebut.
        // set state isColliding pada circle terakhir, dari data circleCollisions
        circleCollisions[circle.onBoardId];
    }
    // 11. Setelah memeriksa semua lingkaran, update status `isColliding` pada semua kotak.
    // set status isColliding semua square, dari data squareCollisions
    const finalSquare = updatedSquares.map((square) => {
        return {
            ...square,
            isColliding: squareCollisions[square.onBoardId],
        };
    });

    // 12. Kembalikan array yang sudah diupdate
    return { circles, squares: finalSquare };
}

/**
 * @description Mendeteksi tabrakan antara lingkaran dan kotak, di mana tabrakan terjadi jika tepi lingkaran
 * bersentuhan dengan tepi kotak (sudut dan sisi).
 * @param circles - Array yang berisi lingkaran (entityOnBoard dengan tipe spell). diasumsikan semua entity spell memiliki slug = earthquake_spell
 * @param squares - Array yang berisi kotak (buildingsOnBoardLocal).
 * @returns - Object yang berisi circle dan square. dengan informasi `isShaked` yang diperbarui
 */
function checkCollisionsCircleVsSquareEdge(
    circles: EntityOnBoard<Spell>[],
    squares: BuildingOnBoardLoacal[]
): { circles: EntityOnBoard<Spell>[]; squares: BuildingOnBoardLoacal[] } {
    // 1. Membuat salinan array `squares` dan me-reset isShaked menjadi `false`.
    //    Ini menghindari modifikasi langsung pada array asli dan memastikan status awal yang konsisten.
    const updatedSquares: BuildingOnBoardLoacal[] = squares.map((square) => ({
        ...square,
        isShaked: false, // Reset isShaked to false for all squares
    }));

    // 2. Inisialisasi objek untuk menyimpan status tabrakan untuk setiap lingkaran dan kotak.
    //    Kita perlu melacak ini secara terpisah untuk memastikan semua tabrakan terdeteksi.
    const squareShakeCollisions: { [squareId: string]: boolean } = {};
    updatedSquares.forEach((square) => (squareShakeCollisions[square.onBoardId] = false));

    // 3. Loop melalui setiap lingkaran.
    for (const circle of circles) {
        // 4. Menghitung radius lingkaran dan titik pusat lingkaran
        const circleRadius = (circle.radius * SIZE_SHAPE) / 2;
        // Cx: Center X - koordinat X dari pusat lingkaran (Spell)
        const Cx = circle.position.x + circleRadius;
        // Cy: Center Y - koordinat Y dari pusat lingkaran
        const Cy = circle.position.y + circleRadius;

        // 5. Loop melalui setiap kotak (untuk setiap lingkaran, kita periksa semua kotak).
        for (const square of updatedSquares) {
            // 6. Hitung ukuran dan posisi tepi kotak.
            const squareWidth = square.size.w * SIZE_SHAPE;
            const squareHeight = square.size.h * SIZE_SHAPE;

            const squareLeft = square.position.x;
            const squareTop = square.position.y;
            const squareRight = squareLeft + squareWidth;
            const squareBottom = squareTop + squareHeight;

            // 7. Periksa tabrakan dengan cara mencari jarak antara titik pusat lingkaran dan tepi kotak terdekat.
            // Cari titik terdekat pada persegi terhadap pusat lingkaran
            const closestX = Math.max(squareLeft, Math.min(Cx, squareRight));
            const closestY = Math.max(squareTop, Math.min(Cy, squareBottom));

            // Hitung jarak antara pusat lingkaran dan titik terdekat pada persegi
            const distance = Math.sqrt((Cx - closestX) ** 2 + (Cy - closestY) ** 2);

            // Jika jarak kurang dari radius, maka terjadi tabrakan
            const isColliding = distance < circleRadius;

            // 8. Periksa apakah ada tabrakan (jarak lebih kecil dari radius lingkaran).
            //    Tabrakan terjadi jika jarak antara pusat lingkaran dan titik terdekat pada persegi kurang dari radius lingkaran.
            // Tabrakan terjadi pada kondisi berikut:
            // - Jarak antara pusat lingkaran dan titik terdekat pada persegi kurang dari radius lingkaran.

            // 9. Jika ada tabrakan, update status tabrakan pada kotak dan lingkaran.
            if (isColliding) {
                // Update status gempa pada kotak.
                squareShakeCollisions[square.onBoardId] = true;
            }
        }
    }
    // 10. Setelah memeriksa semua lingkaran, update status `isShaked` pada semua kotak.
    // set status isShaked semua square, dari data squareShakeCollisions
    const finalSquare = updatedSquares.map((square) => {
        return {
            ...square,
            isShaked: squareShakeCollisions[square.onBoardId],
        };
    });

    // 11. Kembalikan array yang sudah diupdate
    return { circles, squares: finalSquare };
}

/**
 * fungsi untuk mencari posisi lingkaran (x dan y) agar posisi tepat berada di tengah-tengah dari element lain (pusat lingkaran === pusat element lain)
 * @param props
 * @returns
 */
function calculateCoordinateCircle(props: { square: { w: number; h: number; x: number; y: number }; circle: { radius: number }; tileSize: number }) {
    // square (building) width
    const SWidth = props.square.w * props.tileSize;
    // square (building) height
    const SHeight = props.square.h * props.tileSize;
    // square (building) x
    const SCoordinateX = props.square.x;
    // square (building) y
    const SCoordinateY = props.square.y;
    // square (building) x center
    const SCenterX = SCoordinateX + SWidth / 2;
    // square (building) y center
    const SCenterY = SCoordinateY + SHeight / 2;

    // circle (fireball demage area)
    const CRadius = props.circle.radius * props.tileSize;
    // circle (fireball demage area) x
    const CCoordinateX = SCenterX - CRadius;
    // circle (fireball demage area) y
    const CCoordinateY = SCenterY - CRadius;

    return { x: CCoordinateX, y: CCoordinateY, radius: props.circle.radius };
}

/**
 * @description Mendeteksi tabrakan antara lingkaran dan kotak, di mana tabrakan terjadi jika tepi lingkaran bersentuhan dengan tepi kotak (sudut dan sisi).
 * @param fireball
 * @param building - buildingsOnBoardLocal
 * @returns {boolean}
 */
function checkCollisionFireballAreaVsBuilding(props: {
    fireball: { x: number; y: number; radius: number };
    building: BuildingOnBoardLoacal;
    tileSize: number;
}) {
    // 4. Menghitung radius lingkaran dan titik pusat lingkaran
    const circleRadius = props.fireball.radius * props.tileSize;
    // Cx: Center X - koordinat X dari pusat lingkaran (Spell)
    const Cx = props.fireball.x + circleRadius;
    // Cy: Center Y - koordinat Y dari pusat lingkaran
    const Cy = props.fireball.y + circleRadius;

    // 6. Hitung ukuran dan posisi tepi kotak.
    const squareWidth = props.building.size.w * SIZE_SHAPE;
    const squareHeight = props.building.size.h * SIZE_SHAPE;

    const squareLeft = props.building.position.x;
    const squareTop = props.building.position.y;
    const squareRight = squareLeft + squareWidth;
    const squareBottom = squareTop + squareHeight;

    // 7. Periksa tabrakan dengan cara mencari jarak antara titik pusat lingkaran dan tepi kotak terdekat.
    // Cari titik terdekat pada persegi terhadap pusat lingkaran
    const closestX = Math.max(squareLeft, Math.min(Cx, squareRight));
    const closestY = Math.max(squareTop, Math.min(Cy, squareBottom));

    // Hitung jarak antara pusat lingkaran dan titik terdekat pada persegi
    const distance = Math.sqrt((Cx - closestX) ** 2 + (Cy - closestY) ** 2);

    // Jika jarak kurang dari radius, maka terjadi tabrakan
    const isColliding = distance < circleRadius;

    // console.log({ buiding: props.building, distance, isColliding, circleRadius });

    return isColliding;
}
