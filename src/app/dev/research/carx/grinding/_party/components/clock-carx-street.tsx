'use client';

import React, { useEffect, useState } from 'react';

import { cn } from '@/lib/classnames';
import { Clock } from '../types';

/**
 * Hitung waktu in-game berdasarkan waktu nyata sekarang.
 * Menggunakan ANCHOR sebagai patokan, lalu ditambah
 * selisih waktu nyata dikali rasio in-game.
 */

export type ClockCarxStreetProps = React.HTMLAttributes<HTMLDivElement> & { clock: Clock };

export function ClockCarxStreet({ clock, className, ...restDivAttributes }: ClockCarxStreetProps) {
    const [inGameTime, setInGameTime] = useState(getInGameDate(clock));

    useEffect(() => {
        const timerId = setInterval(() => {
            setInGameTime(getInGameDate(clock));
        }, 1000); // update tiap 1 detik

        return () => clearInterval(timerId);
    }, [clock]);

    return (
        <div
            className={cn(className)}
            {...restDivAttributes}
        >
            {inGameTime}
        </div>
    );
}

//* Helper
function getInGameDate(params: Clock) {
    const { anchorReal, anchorInGameHour, dailyCycleRealMinutes } = params;

    /**
     * konfigurasi anchor
     *
     * Titik acuan waktu nyata (real-life) saat pertama kali diobservasi
     * misalnya 3 Juli 2025 20:00 adalah saat jam 06:00 in-game
     */
    const ANCHOR_REAL = new Date(anchorReal);
    /**
     * Titik acuan jam in-game pada waktu nyata ANCHOR_REAL
     * artinya saat ANCHOR_REAL terjadi, waktu in-game adalah jam 6 pagi
     */
    const ANCHOR_INGAME_HOUR = anchorInGameHour;
    /**
     * Konversi rasio:
     *
     * Berapa detik waktu in-game yang berjalan setiap detik waktu nyata
     * dihitung dari:
     * (24 jam in-game = 86400 detik) dibagi (50 menit real = 3000 detik)
     */
    const INGAME_SECONDS_PER_REAL_SECOND = (24 * 60 * 60) / (dailyCycleRealMinutes * 60);

    const nowReal = new Date().getTime(); /* Date.now() */
    const diffRealSeconds = (nowReal - ANCHOR_REAL.getTime()) / 1000; // realElapsedSeconds
    // waktu in-game yang berjalan sejak anchor
    const diffInGameSeconds = diffRealSeconds * INGAME_SECONDS_PER_REAL_SECOND;

    const anchorInGameDate = new Date();
    anchorInGameDate.setUTCHours(ANCHOR_INGAME_HOUR, 0, 0, 0);

    const newInGameDate = new Date(anchorInGameDate.getTime() + diffInGameSeconds * 1000);

    const hours = String(newInGameDate.getUTCHours()).padStart(2, '0');
    const minutes = String(newInGameDate.getUTCMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
}
