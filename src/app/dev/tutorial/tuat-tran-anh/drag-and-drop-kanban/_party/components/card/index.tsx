import React from 'react';
import styles from './card.module.scss';

export function Card({ children }: React.HTMLAttributes<HTMLDivElement>) {
    return <div className={styles['card']}>{children}</div>;
}
