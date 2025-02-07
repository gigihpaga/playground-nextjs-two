'use client';

import { useEffect, useRef } from 'react';
import { indicatorLine, SIZE_SHAPE } from '../constants';

export function BoardCanvasGuide() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(function initialBoardCanvas() {
        if (!canvasRef || !canvasRef.current) return;
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        if (!context) return;
        drawBoard(canvas);
    }, []);
    return (
        <canvas
            className="bg-orange-400"
            height={indicatorLine.length * SIZE_SHAPE}
            width={indicatorLine.length * SIZE_SHAPE}
            ref={canvasRef}
        />
    );
}

function drawBoard(elmCanvas: HTMLCanvasElement) {
    const ctx = elmCanvas.getContext('2d');
    if (!ctx) return;

    for (let idxLine = 0; idxLine < indicatorLine.length; idxLine++) {
        for (let idxRow = 0; idxRow < indicatorLine.length; idxRow++) {
            const colorEdge =
                idxLine == 0 || idxLine == indicatorLine.length - 1 || idxRow == 0 || idxRow == indicatorLine.length - 1 ? '#9c9c9c' : undefined;
            const color = colorEdge ? colorEdge : (idxLine + idxRow) % 2 == 1 ? '#e4e4e4' : '#c4c4c4';
            drawRectangel(
                idxLine * SIZE_SHAPE,
                idxRow * SIZE_SHAPE,
                {
                    row: String(idxRow + 1),
                    column: indicatorLine[idxLine],
                },
                color
            );
        }
    }

    function drawRectangel(x: number, y: number, text: { row: string; column: string }, color: string) {
        if (!ctx) return;
        ctx.beginPath();
        ctx.rect(x, y, SIZE_SHAPE, SIZE_SHAPE);
        ctx.fillStyle = color;
        // ctx.stroke();
        ctx.fill();

        ctx.font = '10px Arial';
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#5c5c5c';
        ctx.fillText(text.row, x + 5, y + 5);
        ctx.fillText(text.column, x + 5, y + 12);
    }
}
