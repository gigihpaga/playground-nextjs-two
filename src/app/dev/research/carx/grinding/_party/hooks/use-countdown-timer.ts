'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';

type TimeLeft = {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
};

export function useCountdownTimer(date: Date | string) {
    const parsedDate = useMemo(() => (date instanceof Date ? date : new Date(date)), [date]);
    const isValid = useMemo(() => !isNaN(parsedDate.getTime()), [parsedDate]);

    const calculateTimeLeft = useCallback((): TimeLeft => {
        const now = new Date().getTime();
        const target = parsedDate.getTime();
        const difference = target - now;

        if (!isValid || difference <= 0) {
            return { days: 0, hours: 0, minutes: 0, seconds: 0 };
        }

        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        return { days, hours, minutes, seconds };
    }, [parsedDate, isValid]);

    const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft);

    // Cek apakah waktu habis
    const isExpired = useMemo(() => {
        return timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0;
    }, [timeLeft]);

    useEffect(() => {
        if (!isValid) return;

        const timerId = setInterval(() => {
            const newTime = calculateTimeLeft();
            setTimeLeft(newTime);

            const expired = newTime.days === 0 && newTime.hours === 0 && newTime.minutes === 0 && newTime.seconds === 0;
            if (expired) {
                clearInterval(timerId);
            }
        }, 1000);

        return () => clearInterval(timerId);
    }, [calculateTimeLeft, isValid]);

    return {
        timeLeft,
        isValid,
        isExpired,
    };
}
