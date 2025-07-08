'use client';

import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { BuildingCraft } from './building-craft';
import { FireballAttack } from './fireball-attack';

const MODE = ['building-craft', 'fireball-attack', 'draft-rute'] as const;

type ModeType = (typeof MODE)[number];

export function Debug({ data }: { data?: any }) {
    console.table(data);
    return (
        <div>
            <p className="text-red-500">debug</p>
        </div>
    );
}

export function App() {
    const [mode, setMode] = useState<ModeType>('fireball-attack');
    return (
        <div
            aria-description="fireball estimate app"
            className="flex-1 flex flex-col min-h-0 overflow-auto _bg-yellow-300 _overflow-hidden"
        >
            <div
                className="mb-1 md:mb-2"
                aria-description="toolbar"
            >
                <div
                    className="flex flex-row items-center gap-x-2 p-[1px]"
                    aria-description="choose your mode"
                >
                    <Label>Mode</Label>
                    <Select
                        value={mode}
                        onValueChange={(value) => {
                            setMode(value as ModeType);
                        }}
                    >
                        <SelectTrigger className="h-6 md:h-7 flex-1">
                            <SelectValue placeholder="Select a role" />
                        </SelectTrigger>

                        <SelectContent>
                            {MODE.map((data) => (
                                <SelectItem
                                    key={data}
                                    value={data}
                                >
                                    {data.replaceAll('-', ' ')}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
            {mode === 'building-craft' ? (
                <BuildingCraft />
            ) : mode === 'fireball-attack' ? (
                <FireballAttack />
            ) : mode === 'draft-rute' ? (
                // <BoardDraftRute aria-description="board untuk draft rute" />
                <div>halo</div>
            ) : null}
            {/* <div className="flex gap-2"></div> */}
        </div>
    );
}
