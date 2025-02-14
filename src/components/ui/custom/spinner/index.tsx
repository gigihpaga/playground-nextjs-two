import { cn } from '@/lib/classnames';
import { type CSSProperties, type HTMLAttributes } from 'react';

import styles from './spinner.module.scss';

interface MyCustomCSS extends CSSProperties {
    '--spinner-size': string;
    '--spinner-color': string;
}

export type SpinnerProps = HTMLAttributes<HTMLDivElement> & {
    /** default "16px" */
    size?: string;
    /** default undefined @example "rgb(231,248,89)" */
    color?: string;
};

export function Spinner({ className, style, size = '16px', color, ...props }: SpinnerProps) {
    return (
        <div
            className={cn(styles['spinner_wrapper'], className)}
            data-version="v1"
            style={{ '--spinner-size': size, '--spinner-color': color, ...style } as MyCustomCSS}
            {...props}
        >
            <div className={styles['spinner_inner']}>
                {Array.from({ length: 12 }).map((_, index) => (
                    <div
                        key={index}
                        className={styles['spinner_bar']}
                    />
                ))}
            </div>
        </div>
    );
}
