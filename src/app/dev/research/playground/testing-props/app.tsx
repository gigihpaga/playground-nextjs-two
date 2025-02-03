'use client';

import { Input } from '@/components/ui/input';
import React, { useEffect } from 'react';

interface Props {
    attribute?: string;
}

export function App({ attribute }: Props) {
    return (
        <div className="bg-red-500 p-24">
            <InputKu
                onChange2={(e) => {
                    console.log('on app', e + 70);
                }}
            />
        </div>
    );
}

type InputKuProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> & {
    onChange2: (a: number) => void;
};

export function InputKu({ onChange2, ...props }: InputKuProps) {
    function onChange3(e: React.ChangeEvent<HTMLInputElement> | number) {
        if (typeof e === 'number') {
            onChange2(e);
        }
    }

    useEffect(() => {
        onChange2(7777);
    }, [onChange2]);

    return (
        <Input
            value={88}
            onChange={(e) => onChange3(e)}
            {...props}
        />
    );
}
