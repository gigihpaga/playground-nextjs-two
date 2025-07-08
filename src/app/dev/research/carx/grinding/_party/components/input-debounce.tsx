import { useEffect, useState } from 'react';
import { Input, InputProps } from '@/components/ui/input';

type InputDebounceProps = Omit<InputProps, 'onChange' | 'value'> & {
    value: string;
    onChange: (value: string) => void;
    delay?: number;
};

export function InputDebounce({ value, onChange, delay = 300, ...props }: InputDebounceProps) {
    const [tempValue, setTempValue] = useState(value);

    useEffect(() => {
        const timeId = setTimeout(() => {
            onChange(tempValue);
        }, delay);

        return () => {
            clearTimeout(timeId);
        };
    }, [tempValue, delay, onChange]);

    /**
     * Jika kamu ingin menjaga sinkronisasi antara value eksternal dan tempValue, bisa tambahkan:
     * Ini berguna jika value dari luar berubah karena aksi lain (misalnya reset form atau load ulang query), maka tempValue akan ikut update.
     */

    useEffect(() => {
        setTempValue(value);
    }, [value]);

    return (
        <Input
            {...props}
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
        />
    );
}
