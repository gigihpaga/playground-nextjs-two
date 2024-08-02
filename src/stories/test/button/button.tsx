import { cn } from '@/lib/classnames';
import React from 'react';
import styles from './btn.module.css';
import styles2 from './btn2.module.scss';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    size?: 'default' | 'sm' | 'md' | 'lg' | 'xl';
    color?: 'default' | 'primary' | 'danger' | 'warning' | 'succes';
}

export function Button({ size = 'default', color = 'primary', children, className, ...props }: Props) {
    let mycolor = '';
    switch (color) {
        case 'default':
            mycolor = '';
            break;
        case 'danger':
            mycolor = 'bg-red-500';
            break;
        case 'primary':
            mycolor = 'bg-purple-500';
            break;
        case 'warning':
            mycolor = 'bg-yellow-400';
            break;
        case 'succes':
            mycolor = 'bg-green-400';
            break;
        default:
            mycolor = 'bg-purple-500';
            break;
    }

    let mysize = '';
    switch (size) {
        case 'default':
            mysize = '!py-2 !px-4';
            break;
        case 'sm':
            mysize = '!py-1 !px-2';
            break;
        case 'md':
            mysize = '!py-4 !px-6';
            break;
        case 'lg':
            mysize = '!py-6 !px-8';
            break;
        case 'xl':
            mysize = '!py-8 !px-10';
            break;
        default:
            mysize = '!py-2 !px-4';
            break;
    }

    return (
        <button
            className={cn(styles['btn'], styles2['btn'], mysize, mycolor, className)}
            {...props}
        >
            {children}
        </button>
    );
}
