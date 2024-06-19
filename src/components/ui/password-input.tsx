'use client';

import { forwardRef, useState } from 'react';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { Input, type InputProps } from '@/components/ui/input';
import { cn } from '@/lib/classnames';

const PasswordInput = forwardRef<HTMLInputElement, Omit<InputProps, 'type'>>(({ className, ...props }, ref) => {
    const [typeInput, setTypeInput] = useState<'password' | 'text'>('password');

    return (
        <div className="relative">
            <Input
                ref={ref}
                className={cn(className)}
                type={typeInput}
                {...props}
            />
            <button
                type="button"
                className="absolute right-0 top-0 bottom-0 mr-1 px-2"
                onClick={() => setTypeInput((prev) => (prev === 'password' ? 'text' : 'password'))}
            >
                {typeInput === 'password' ? <EyeIcon className="size-4" /> : <EyeOffIcon className="size-4" />}
            </button>
        </div>
    );
});

PasswordInput.displayName = 'PasswordInput';

export { PasswordInput };
