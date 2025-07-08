import React from 'react';
import { useCountdownTimer } from '../hooks/use-countdown-timer';
import { cn } from '@/lib/classnames';

type CountdownTimerProps = React.InputHTMLAttributes<HTMLParagraphElement> & {
    date: Date | string;
    classNameInvalid?: string;
    classNameExpired?: string;
};

export const CountdownTimer: React.FC<CountdownTimerProps> = ({ date, className, classNameInvalid, classNameExpired, ...props }) => {
    const { timeLeft, isValid, isExpired } = useCountdownTimer(date);

    return (
        <p
            className={cn('text-2xs font-bold', isValid === false && classNameInvalid, isExpired === true && classNameExpired, className)}
            {...props}
        >
            {isValid === false
                ? 'Invalid date format'
                : isExpired === true
                  ? '🚀 It`s time!'
                  : `${timeLeft.hours}h ${timeLeft.minutes}m ${timeLeft.seconds}s`}
        </p>
    );
};
