import { cn } from '@/lib/classnames';
import React, { type SVGProps } from 'react';

export const LoadingElipseIcon = ({ className, ...props }: SVGProps<SVGSVGElement>) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={200}
        height={200}
        preserveAspectRatio="xMidYMid"
        className={cn('size-6 fill-[hsla(0,0%,56%)] _bg-yellow-600', className)}
        style={{
            shapeRendering: 'auto',
            display: 'block',
            // background: '0 0',
        }}
        viewBox="0 0 100 100"
        {...props}
    >
        <rect
            // width={6}
            width={8}
            // height={14}
            height={26}
            x={47}
            // y={25}
            y={6}
            // fill="#fe718d"
            rx={3}
            ry={3.64}
        >
            <animate
                attributeName="opacity"
                begin="-0.875s"
                dur="1s"
                keyTimes="0;1"
                repeatCount="indefinite"
                values="1;0"
            />
        </rect>
        <rect
            // width={6}
            width={8}
            // height={14}
            height={26}
            x={47}
            // y={25}
            y={6}
            // fill="#fe718d"
            rx={3}
            ry={3.64}
            transform="rotate(45 50 50)"
        >
            <animate
                attributeName="opacity"
                begin="-0.75s"
                dur="1s"
                keyTimes="0;1"
                repeatCount="indefinite"
                values="1;0"
            />
        </rect>
        <rect
            // width={6}
            width={8}
            // height={14}
            height={26}
            x={47}
            // y={25}
            y={6}
            // fill="#fe718d"
            rx={3}
            ry={3.64}
            transform="rotate(90 50 50)"
        >
            <animate
                attributeName="opacity"
                begin="-0.625s"
                dur="1s"
                keyTimes="0;1"
                repeatCount="indefinite"
                values="1;0"
            />
        </rect>
        <rect
            // width={6}
            width={8}
            // height={14}
            height={26}
            x={47}
            // y={25}
            y={6}
            // fill="#fe718d"
            rx={3}
            ry={3.64}
            transform="rotate(135 50 50)"
        >
            <animate
                attributeName="opacity"
                begin="-0.5s"
                dur="1s"
                keyTimes="0;1"
                repeatCount="indefinite"
                values="1;0"
            />
        </rect>
        <rect
            // width={6}
            width={8}
            // height={14}
            height={26}
            x={47}
            // y={25}
            y={6}
            // fill="#fe718d"
            rx={3}
            ry={3.64}
            transform="rotate(180 50 50)"
        >
            <animate
                attributeName="opacity"
                begin="-0.375s"
                dur="1s"
                keyTimes="0;1"
                repeatCount="indefinite"
                values="1;0"
            />
        </rect>
        <rect
            // width={6}
            width={8}
            // height={14}
            height={26}
            x={47}
            // y={25}
            y={6}
            // fill="#fe718d"
            rx={3}
            ry={3.64}
            transform="rotate(225 50 50)"
        >
            <animate
                attributeName="opacity"
                begin="-0.25s"
                dur="1s"
                keyTimes="0;1"
                repeatCount="indefinite"
                values="1;0"
            />
        </rect>
        <rect
            // width={6}
            width={8}
            // height={14}
            height={26}
            x={47}
            // y={25}
            y={6}
            // fill="#fe718d"
            rx={3}
            ry={3.64}
            transform="rotate(270 50 50)"
        >
            <animate
                attributeName="opacity"
                begin="-0.125s"
                dur="1s"
                keyTimes="0;1"
                repeatCount="indefinite"
                values="1;0"
            />
        </rect>
        <rect
            // width={6}
            width={8}
            // height={14}
            height={26}
            x={47}
            // y={25}
            y={6}
            // fill="#fe718d"
            rx={3}
            ry={3.64}
            transform="rotate(315 50 50)"
        >
            <animate
                attributeName="opacity"
                begin="0s"
                dur="1s"
                keyTimes="0;1"
                repeatCount="indefinite"
                values="1;0"
            />
        </rect>
    </svg>
);
