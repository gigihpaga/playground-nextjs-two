'use client';

import React, { useRef, useState, type ComponentPropsWithoutRef } from 'react';
import { v4 as uuid } from 'uuid';
import styles from './app.module.scss';

import { indicatorLine, SIZE_SHAPE } from '../constants';
import img10_11 from '../../../../../../../public/images/coc-building/10_11.png';

import { cn } from '@/lib/classnames';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BuildingCraft } from './building-craft';
import { QueenAttack } from './queen-attack';
import { MigrateAttackLocalstorage2Indexeddb, MigrateLayoutLocalstorage2Indexeddb } from '../components/migrate-localstorage2indexeddb';

const MODE = ['building-craft', 'queen-attack', 'draft-rute'] as const;

type ModeType = (typeof MODE)[number];

export function App() {
    const [mode, setMode] = useState<ModeType>('building-craft');

    return (
        <div
            className={cn(styles['AppContainer'], '_bg-pink-400 flex-1 py-[20px] z-10 flex flex-col')}
            aria-description="queen charger app"
        >
            <div
                className="mb-[60px]"
                aria-description="toolbar"
            >
                {/* <MigrateAttackLocalstorage2Indexeddb /> */}
                {/* <MigrateLayoutLocalstorage2Indexeddb /> */}

                <div aria-description="choose your mode">
                    <Label>Mode</Label>
                    <Select
                        value={mode}
                        onValueChange={(value) => {
                            setMode(value as ModeType);
                        }}
                    >
                        <SelectTrigger className="h-8">
                            <SelectValue placeholder="Select a role" />
                        </SelectTrigger>

                        <SelectContent>
                            {MODE.map((data) => (
                                <SelectItem
                                    key={data}
                                    value={data}
                                >
                                    {data}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="ml-[20px]">
                {mode === 'building-craft' ? (
                    <BuildingCraft />
                ) : mode === 'draft-rute' ? (
                    <BoardDraftRute aria-description="board untuk draft rute" />
                ) : mode === 'queen-attack' ? (
                    <QueenAttack />
                ) : null}
            </div>
        </div>
    );
}

function BoardDraftRute({ className, style, ...props }: Omit<ComponentPropsWithoutRef<'div'>, 'children'>) {
    const boardRef = useRef<HTMLDivElement>(null);
    const [jalurRatur, setJalurRatur] = useState<Array<{ x: number; y: number }>>([]);

    function handleBoardOnClick(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        if (!boardRef || !boardRef.current) return;
        const { top, left } = boardRef.current.getBoundingClientRect();
        const { clientX, clientY, offsetX, offsetY } = event.nativeEvent;
        const clickedX = Math.ceil(clientX - left) /* offsetX */, // nilai offsetX===(clientX-left). tidak menggunakan offsetX karena saat element yang diberi event listener mempunyai child element, offsetX berpindah ke child dan itu bukan sesuai yang diharapkan
            clickedY = Math.ceil(clientY - top); /* offsetY */

        const x1 = (Math.ceil(clickedX / SIZE_SHAPE) - 1) * SIZE_SHAPE,
            y1 = (Math.ceil(clickedY / SIZE_SHAPE) - 1) * SIZE_SHAPE;

        const found = jalurRatur.findIndex((path) => path.x == x1 && path.y == y1);
        if (found !== -1) {
            // remove
            const jalurRaturCopied = [...jalurRatur];
            jalurRaturCopied.splice(found, 1);
            setJalurRatur(() => jalurRaturCopied);
        } else {
            // add
            setJalurRatur((prev) => [...prev, { x: x1, y: y1 }]);
        }
    }

    return (
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
        <div
            ref={boardRef}
            className={cn('bg-transparent absolute top-0 left-0 bottom-0 right-0', className)}
            style={{
                width: indicatorLine.length * SIZE_SHAPE,
                height: indicatorLine.length * SIZE_SHAPE,
                ...style,
            }}
            onClick={(e) => handleBoardOnClick(e)}
            {...props}
        >
            {jalurRatur.length
                ? jalurRatur.map((path) => (
                      <div
                          className="bg-yellow-600 absolute"
                          style={{ top: path.y, left: path.x, height: SIZE_SHAPE, width: SIZE_SHAPE }}
                          key={`${path.x}-${path.y}`}
                      ></div>
                  ))
                : null}
        </div>
    );
}
