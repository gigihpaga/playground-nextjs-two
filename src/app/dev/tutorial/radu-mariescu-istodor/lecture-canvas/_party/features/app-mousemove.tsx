'use client';

import React, { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { CircleAnimation, Rumah, RumahLaba, ShapeColor, Snowman, Uh } from './builder';

export function AppMouseMove() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const minRad = useRef(10);
    const rangeRad = useRef(20);
    let p = useRef(0);
    let x = useRef(200);
    let y = useRef(200);

    useEffect(() => {
        if (!canvasRef || !canvasRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        // ctx.fillStyle = 'grey';
        // ctx.fillRect(10, 10, 100, 100);
        // Rumah(ctx);
        // ShapeColor(ctx);
        // RumahLaba(ctx);
        // Snowman(ctx);
        // CircleAnimation(canvas);
        // Uh();

        animate();
        function animate() {
            if (!ctx) return;
            p.current = p.current + 0.02;
            if (p.current > 1) {
                p.current = 0;
            }
            const rad = minRad.current + rangeRad.current * p.current;

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.beginPath();
            // ctx.arc(x - rect.x, y - rect.y, 20, 0, Math.PI * 2);
            // ctx.arc(offsetX, offsetY, rad, 0, Math.PI * 2);
            ctx.arc(x.current, y.current, rad, 0, Math.PI * 2);
            ctx.stroke();

            requestAnimationFrame(animate);
        }

        // return () => {};
    }, []);

    function handleMouseMove(event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) {
        if (!canvasRef || !canvasRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const eventX = event.nativeEvent.x,
            eventY = event.nativeEvent.y,
            offsetX = event.nativeEvent.offsetX,
            offsetY = event.nativeEvent.offsetY;

        const left = (event.target as HTMLCanvasElement).offsetLeft,
            top = (event.target as HTMLCanvasElement).offsetTop,
            rect = (event.target as HTMLCanvasElement).getBoundingClientRect();
        // console.log(`mouse move: [x: ${x}, y: ${y}]`);
        // console.log(event);
        x.current = event.nativeEvent.offsetX;
        y.current = event.nativeEvent.offsetY;
    }

    return (
        <div className="bg-green-400 flex-1">
            {/* <Button onClick={() => alert('hello world')}>Click Me!</Button> */}
            <canvas
                onMouseMove={(e) => handleMouseMove(e)}
                className="bg-purple-600"
                // style={{ display: 'inline' }}
                height={400}
                width={400}
                ref={canvasRef}
            />
        </div>
    );
}

function Img() {
    return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
            // className="h-[100px]"
            // height={'300'}
            style={{ height: 150, display: 'inline' }}
            alt="j-hill"
            src="/uploads/j-hill.jpg"
        />
    );
}
