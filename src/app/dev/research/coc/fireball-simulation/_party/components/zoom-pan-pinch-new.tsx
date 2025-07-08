'use client';

import React, { ComponentProps } from 'react';
import { Fullscreen, FullscreenIcon, RotateCcwIcon, ZoomInIcon, ZoomOutIcon } from 'lucide-react';

import {
    type ReactZoomPanPinchProps,
    type ReactZoomPanPinchContext,
    TransformWrapper,
    TransformComponent,
    useControls,
    useTransformComponent,
    useTransformContext,
    useTransformEffect,
    useTransformInit,
    handleCalculateZoomPositions,
    ReactZoomPanPinchContextState,
    AnimationType,

    // TransformWrapperProps,
    // ZoomPanPinch,
} from 'react-zoom-pan-pinch';

import { cn } from '@/lib/classnames';
import { Button } from '@/components/ui/button';

export function useZoomPanPinch() {
    const context = useTransformContext();

    if (!context) {
        throw new Error('useZoomPanPinch must be placed inside ZoomPanPinchProvider');
    }
    return context;
}

type ZoomPanPinchProviderProps = ReactZoomPanPinchProps;

export function ZoomPanPinchProvider({ disabled, children, ...props }: ZoomPanPinchProviderProps) {
    return (
        <TransformWrapper
            disabled={disabled}
            minScale={0.35}
            limitToBounds={false}
            pinch={{ step: 5 }}
            onPanningStart={(rzppRef, event) => {
                const { isPanning, lastDistance, lastMousePosition } = rzppRef.instance;
            }}
            onPanning={(rzppRef, event) => {
                const { isPanning, lastDistance, lastMousePosition } = rzppRef.instance;
            }}
            onPanningStop={() => {}}
            onPinching={(rzppRef, event) => {}}
            {...props}
        >
            {children}
        </TransformWrapper>
    );
}

export function ZoomPanPinchWrapper({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            data-component="ZoomPanPinchWrapper"
            className={cn('h-full w-full relative overflow-hidden', className)}
            {...props}
        >
            {children}
        </div>
    );
}

type ZoomPanPinchComponentProps = ComponentProps<typeof TransformComponent>;

export function ZoomPanPinchComponent({ children, ...props }: ZoomPanPinchComponentProps) {
    return (
        <TransformComponent
            wrapperStyle={{ height: '100%', width: '100%', overflow: 'hidden' }}
            {...props}
        >
            {children}
        </TransformComponent>
    );
}

type BackgroundProps = { theme?: 'light' | 'dark' | 'system' } & Omit<React.SVGAttributes<SVGElement>, 'children'>;

export function Background({ theme = 'system', ...props }: BackgroundProps) {
    return useTransformComponent(({ state, instance }) => {
        return (
            <svg
                data-component="ZoomPanPinchBackground"
                className="react-flow__background"
                data-testid="rf__background"
                style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    top: '0px',
                    left: '0px',
                    zIndex: -1,
                    backgroundColor: theme == 'dark' ? '#141414' : 'transparent',
                }}
                {...props}
            >
                <pattern
                    id="pattern-1"
                    x={state.positionX}
                    y={state.positionY}
                    width="20"
                    height="20"
                    patternUnits="userSpaceOnUse"
                    patternTransform="translate(-1,-1)"
                >
                    <circle
                        cx="0.5"
                        cy="0.5"
                        r="0.5"
                        fill={theme == 'dark' ? '#777' : '#91919a'}
                        className="react-flow__background-pattern dots"
                    ></circle>
                </pattern>
                <rect
                    x="0"
                    y="0"
                    width="100%"
                    height="100%"
                    fill="url(#pattern-1)"
                ></rect>
            </svg>
        );
    });
}

export function Controls({ className, ...props }: React.HtmlHTMLAttributes<HTMLDivElement>) {
    const { zoomIn, zoomOut, resetTransform, centerView, instance, setTransform, zoomToElement } = useControls();

    const context = useTransformContext();

    // const zoomPanPinchState = useZoomPanPinch();

    const ButtonResetScale = useTransformComponent(({ state, instance: instance2 }) => {
        return (
            <Button
                title="reset scale"
                className="text-2xs p-2"
                size="sm"
                onClick={() => {
                    // instance2.zoomTo(); // error Property 'zoomTo' does not exist on type 'ZoomPanPinch'
                    // instance.setTransformState(1, instance.transformState.positionX, instance.transformState.positionY);
                    // instance.setTransformState({ ...instance.transformState, scale: 1 });
                    // instance.setTransformState(1, instance.transformState.positionX, instance.transformState.positionY);
                    // centerView(instance.props.initialScale || 1);
                    // zoomIn(instance.props.initialScale || 1);
                    const { wrapperComponent, contentComponent } = instance;
                    // instance.applyTransformation()
                    // instance.setTransformState();
                    const { scale, positionX, positionY } = instance.transformState;
                    if (!wrapperComponent) return console.error('No WrapperComponent found');
                    const wrapperWidth = wrapperComponent.offsetWidth;
                    const wrapperHeight = wrapperComponent.offsetHeight;

                    /** setTrasform bekerja dengan baik, hanya ada masalah tentang position xy */
                    // setTransform(mouseX, mouseY, 1, 300, 'easeOut');
                    // const mouseX = wrapperWidth / 2;
                    // const mouseY = wrapperHeight / 2;
                    // console.log(instance.bounds);
                    // setTransform(instance.transformState.positionX, instance.transformState.positionY, 1, 300, 'easeOut');
                    // console.log({ scale, positionX, positionY });
                    const rect = wrapperComponent.getBoundingClientRect();

                    // Hitung center dari elemen wrapper (BUKAN window)
                    const wrapperCenterX = rect.left + rect.width / 2;
                    const wrapperCenterY = rect.top + rect.height / 2;

                    // Hitung perbedaan posisi agar tetap center
                    // Hitung perubahan posisi agar tetap di tengah setelah reset
                    const newPositionX = wrapperCenterX - (wrapperCenterX - positionX) / scale;
                    const newPositionY = wrapperCenterY - (wrapperCenterY - positionY) / scale;

                    // const _newPositionX = wrapperWidth / 2 - (wrapperWidth / 2 - positionX) * scale;
                    // const _newPositionY = wrapperHeight / 2 - (wrapperHeight / 2 - positionY) * scale;

                    // Terapkan transformasi dengan animasi smooth
                    setTransform(newPositionX, newPositionY, 1, 300, 'easeOut');
                    // setTransform(newPosition.x, newPosition.y, 1, 300, 'easeOut');
                }}
            >
                {/* {roundDecimal(instance.transformState.scale)} */}
                {state.scale.toFixed(1)}
            </Button>
        );
    });

    return (
        <div
            data-component="ZoomPanPinchControls"
            className={cn('absolute left-[10px] bottom-[10px] flex flex-col gap-1 z-[1]', className)}
            aria-description="controls zoom pan pinch"
            {...props}
        >
            <Button
                title="zoom in"
                className="text-2xs p-2"
                size="sm"
                onClick={() => {
                    zoomIn();
                }}
            >
                <ZoomInIcon className="size-4" />
            </Button>

            {ButtonResetScale}
            <Button
                title="zoom out"
                className="text-2xs p-2"
                size="sm"
                onClick={() => {
                    zoomOut();
                }}
            >
                <ZoomOutIcon className="size-4" />
            </Button>
            <Button
                title="reset"
                className="text-2xs p-2"
                size="sm"
                onClick={() => {
                    resetTransform();
                }}
            >
                <RotateCcwIcon className="size-4" />
            </Button>
            <Button
                title="center view"
                className="text-2xs p-2"
                size="sm"
                onClick={() => centerView()}
            >
                <FullscreenIcon className="size-4" />
            </Button>
        </div>
    );
}

export function roundDecimal(number: number, fragtion: number | undefined = 1) {
    return parseFloat(number.toFixed(fragtion));
}

export function ZoomPanPinchLiveComponent({ render }: { render: (state: ReactZoomPanPinchContextState) => React.ReactNode }) {
    return useTransformComponent(({ state, instance }) => render({ state, instance }));
}
