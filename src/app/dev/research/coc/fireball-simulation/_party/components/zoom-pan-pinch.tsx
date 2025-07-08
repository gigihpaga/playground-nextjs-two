'use client';

import React, {
    ComponentProps,
    MouseEvent,
    useEffect,
    useState,
    useRef,
    useCallback,
    TouchEvent,
    PointerEvent,
    createContext,
    useContext,
    ReactNode,
} from 'react';
import { useTheme } from 'next-themes';
import { Fullscreen, FullscreenIcon, RotateCcwIcon, ZoomInIcon, ZoomOutIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    TransformComponent,
    TransformWrapper,
    useControls,
    type ReactZoomPanPinchProps,
    useTransformComponent,
    useTransformContext,
    // TransformWrapperProps,
    useTransformEffect,
    // ZoomPanPinch,
    ReactZoomPanPinchContext,
    useTransformInit,
    handleCalculateZoomPositions,
    ReactZoomPanPinchContextState,
} from 'react-zoom-pan-pinch';
import { cn } from '@/lib/classnames';

// Buat Context untuk menyimpan dan membagikan transform state
const ZoomPanPinchContext = React.createContext</* ReactZoomPanPinchContextState */ ReactZoomPanPinchContext | null>(null);

// Buat hook kustom untuk memudahkan penggunaan context
export function useZoomPanPinch() {
    const context = React.useContext(ZoomPanPinchContext);

    /*  if (!context) {
        throw new Error('useZoomPanPinch must be placed inside ZoomPanPinchProvider');
    } */
    return context;
}

export function ZoomPanPinchProvider({ children }: { children?: ReactNode }) {
    const context = useTransformContext();
    return (
        <ZoomPanPinchContext.Provider value={context}>
            <>{children}</>
        </ZoomPanPinchContext.Provider>
    );

    /*   return useTransformComponent(({ state, instance }) => {
        return <ZoomPanPinchContext.Provider value={{ state, instance }}>{children}</ZoomPanPinchContext.Provider>;
    }); */
}

type TransformComponentProps = ComponentProps<typeof TransformComponent>;
// children?: React.HtmlHTMLAttributes<HTMLDivElement>['children']&

type ZoomPanPinchProps = {
    /** @default 0 */
    activationPanDistance?: number;
    // className?: React.HtmlHTMLAttributes<HTMLDivElement>['className'];
    disabled?: ReactZoomPanPinchProps['disabled'];
} & TransformComponentProps;

export function ZoomPanPinch({ /* className, */ disabled, activationPanDistance = 5, children, ...props }: ZoomPanPinchProps) {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const startPosition = useRef<{ x: number; y: number } | null>(null);
    const isPanning = useRef<boolean>(false);
    const [isPanning2, setIsPanning2] = useState(false);
    const nextTheme = useTheme();
    const theme = nextTheme.theme as 'light' | 'dark' | 'system' | undefined;

    const handleMouseDown = useCallback(
        (event: MouseEvent | TouchEvent | PointerEvent) => {
            if (disabled) return;
            const { clientX, clientY } = 'touches' in event ? event.touches[0] : event;
            startPosition.current = { x: clientX, y: clientY };
            isPanning.current = false;
        },
        [disabled]
    );

    const handleMouseMove = useCallback(
        (event: MouseEvent | TouchEvent | PointerEvent) => {
            if (disabled || !startPosition.current) return;
            const { clientX, clientY } = 'touches' in event ? event.touches[0] : event;
            const deltaX = clientX - startPosition.current.x;
            const deltaY = clientY - startPosition.current.y;

            // Jika perpindahan melebihi threshold, aktifkan panning
            if (!isPanning.current && (Math.abs(deltaX) > activationPanDistance || Math.abs(deltaY) > activationPanDistance)) {
                isPanning.current = true;
            }
            // jika sedang panning, maka jalankan panTo
            if (isPanning.current) {
                // instance?.panTo({ x: deltaX, y: deltaY });

                event.preventDefault();
            }
        },
        [disabled, activationPanDistance]
    );

    const handleMouseUp = useCallback(() => {
        startPosition.current = null;
        isPanning.current = false;
    }, []);

    return (
        <TransformWrapper
            // initialScale={1}
            disabled={disabled}
            minScale={0.35}
            // maxScale={3}
            limitToBounds={false}
            // limitToBounds={true} // Enable threshold limit
            // limitToWrapperBounds={true} // Enable threshold limit
            // onPanning={updateXarrow}
            // onZoom={updateXarrow}
            pinch={{ step: 5 }}
            // panning={{ disabled: true }}
            onPanningStart={(a, event) => {
                const { isPanning, lastDistance, lastMousePosition } = a.instance;
            }}
            onPanning={(a, event) => {
                const { isPanning, lastDistance, lastMousePosition } = a.instance;
            }}
            onPanningStop={() => {}}
            onPinching={(a, b) => {}}
        >
            <div
                aria-description="zoom pan pinch"
                className={cn('h-full w-full relative overflow-hidden' /* ,className */)}
            >
                <ZoomPanPinchProvider>
                    <TransformComponent
                        // wrapperClass="halo"
                        // contentClass="ikeh"
                        wrapperStyle={{ height: '100%', width: '100%', overflow: 'hidden' }}
                        {...props}
                    >
                        {children}
                    </TransformComponent>
                    <Background theme={theme} />
                    <Controls />
                </ZoomPanPinchProvider>
            </div>

            {/* {({ instance, centerView, resetTransform, setTransform, zoomIn, zoomOut, zoomToElement }) => {
                return (<></>);
            }} */}
        </TransformWrapper>
    );
}

function Background({ theme = 'system' }: { theme?: 'light' | 'dark' | 'system' }) {
    return useTransformComponent(({ state, instance }) => {
        // console.log('Background:useTransformComponent inside', state);
        return (
            <svg
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

function Controls({ className, ...props }: React.HtmlHTMLAttributes<HTMLDivElement>) {
    const { zoomIn, zoomOut, resetTransform, centerView, instance, setTransform, zoomToElement } = useControls();
    const context = useTransformContext();
    const zoomPanPinchState = useZoomPanPinch();
    // instance.transformState
    // const { scale, positionX, positionY } = useTransformState();
    // console.log('Controls:scale', scale);
    // const [scale, setScale] = useState<number>(context.transformState.scale);
    // const a = useTransformEffect();
    // const b = useTransformInit();
    /**
    useEffect(() => {
        setScale(context.transformState.scale);
    }, [context.transformState.scale]);
     */

    const ButtonZoomState = useTransformComponent(({ state, instance }) => {
        return (
            <Button
                title="reset scale"
                className="text-2xs p-2"
                size="sm"
                onClick={() => {
                    /**
                     * [function handleCalculateZoomPositions](https://github.com/BetterTyped/react-zoom-pan-pinch/blob/master/src/core/zoom/zoom.utils.ts)
                     * export function "handleCalculateZoomPositions" yang ada di "react-zoom-pan-pinch/dist/index.esm.js"
                     * tambahkan type "handleCalculateZoomPositions" di "react-zoom-pan-pinch/dist/index.d.ts"
                     * clean .next
                     * restart dev server
                     */
                    // const { scale, positionX, positionY } = context.transformState;
                    // const { wrapperComponent } = context;
                    // const wrapperWidth = wrapperComponent!.offsetWidth;
                    // const wrapperHeight = wrapperComponent!.offsetHeight;
                    // context.setTransformState(1, positionX, positionY);
                    // setScale(() => context.transformState.scale);
                    // const wrapperWidth = wrapperComponent!.offsetWidth;
                    // const wrapperHeight = wrapperComponent!.offsetHeight;
                    // const mouseX = (wrapperWidth / 2 - positionX) / scale;
                    // const mouseY = (wrapperHeight / 2 - positionY) / scale;
                    console.log(instance);
                    instance.setTransformState(1, instance.transformState.positionX, instance.transformState.positionY);
                }}
            >
                {/* {roundDecimal(instance.transformState.scale)} */}
                {state.scale.toFixed(1)}
            </Button>
        );
    });

    function fsfsfsd() {
        console.log('test click:zoomPanPinchState', zoomPanPinchState);
    }

    return (
        <div
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

                    // setScale(() => context.transformState.scale);
                }}
            >
                <ZoomInIcon className="size-4" />
            </Button>

            {ButtonZoomState}
            <Button
                title="zoom out"
                className="text-2xs p-2"
                size="sm"
                onClick={() => {
                    zoomOut();

                    // setScale(() => instance.transformState.scale);
                }}
            >
                <ZoomOutIcon className="size-4" />
            </Button>
            <Button onClick={() => fsfsfsd()}>test</Button>
            <Button
                title="reset"
                className="text-2xs p-2"
                size="sm"
                onClick={() => {
                    resetTransform();
                    // setScale(1);
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

function roundDecimal(number: number, fragtion: number | undefined = 1) {
    return parseFloat(number.toFixed(fragtion));
}
