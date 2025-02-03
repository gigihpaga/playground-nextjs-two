'use client';

import React, { useEffect, useRef } from 'react';
import { animateBounce, CircleAnimation, Rumah, RumahLaba, ShapeColor, Snowman, Uh } from './builder';

export function App() {
    const canvasAnimateBounceRef = useRef<HTMLCanvasElement>(null);
    const canvasCircleAnimationRef = useRef<HTMLCanvasElement>(null);
    const canvasRumahRef = useRef<HTMLCanvasElement>(null);
    const canvasRumahLabaRef = useRef<HTMLCanvasElement>(null);
    const canvasShapeColorRef = useRef<HTMLCanvasElement>(null);
    const canvasSnowmanRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const { current: canvas } = canvasAnimateBounceRef;
        const { current: canvasCircleAnimation } = canvasCircleAnimationRef;
        const { current: canvasRumah } = canvasRumahRef;
        const { current: canvasRumahLaba } = canvasRumahLabaRef;
        const { current: canvasShapeColor } = canvasShapeColorRef;
        const { current: canvasSnowman } = canvasSnowmanRef;

        if (!canvas) return;
        if (!canvasCircleAnimation) return;
        if (!canvasRumah) return;
        if (!canvasRumahLaba) return;
        if (!canvasShapeColor) return;
        if (!canvasSnowman) return;

        const ctxCircleAnimation = canvasCircleAnimation.getContext('2d');
        const ctxRumah = canvasRumah.getContext('2d');
        const ctxRumahLaba = canvasRumahLaba.getContext('2d');
        const ctxShapeColor = canvasShapeColor.getContext('2d');
        const ctxSnowman = canvasSnowman.getContext('2d');

        if (!ctxCircleAnimation) return;
        if (!ctxRumah) return;
        if (!ctxRumahLaba) return;
        if (!ctxShapeColor) return;
        if (!ctxSnowman) return;

        // ctx.fillStyle = 'grey';
        // ctx.fillRect(10, 10, 100, 100);
        animateBounce(canvas);
        Rumah(ctxRumah);
        ShapeColor(ctxShapeColor);
        RumahLaba(ctxRumahLaba);
        Snowman(ctxSnowman);
        CircleAnimation(canvasCircleAnimation);
        // Uh();

        // heartImage.width = 200;

        // return () => {};
    }, []);

    return (
        <div className="bg-pink-400 flex-1">
            <canvas
                className="bg-orange-400"
                // style={{ display: 'inline' }}
                height={400}
                width={400}
                ref={canvasAnimateBounceRef}
            />
            <canvas
                className="bg-blue-400"
                // style={{ display: 'inline' }}
                height={400}
                width={400}
                ref={canvasCircleAnimationRef}
            />
            <canvas
                className="bg-red-400"
                // style={{ display: 'inline' }}
                height={400}
                width={400}
                ref={canvasRumahRef}
            />
            <canvas
                className="bg-purple-400"
                // style={{ display: 'inline' }}
                height={400}
                width={400}
                ref={canvasRumahLabaRef}
            />
            <canvas
                className="bg-yellow-400"
                // style={{ display: 'inline' }}
                height={400}
                width={400}
                ref={canvasShapeColorRef}
            />
            <canvas
                className="bg-green-400"
                // style={{ display: 'inline' }}
                height={400}
                width={400}
                ref={canvasSnowmanRef}
            />
        </div>
    );
}
