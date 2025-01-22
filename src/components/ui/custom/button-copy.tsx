'use client';

import React from 'react';
import { BoxIcon, CopyIcon, CheckIcon, ClipboardIcon } from 'lucide-react';
import { Button, ButtonProps, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/classnames';

interface ButtonCopyProps extends Omit<ButtonProps, 'onClick'> {
    data: string;
    onClick?: (event?: React.MouseEvent<HTMLButtonElement>, state?: boolean) => void /* React.MouseEventHandler<HTMLButtonElement> */;
}

/**
 * [inspired](https://codesandbox.io/p/sandbox/copy-to-clipboard-animation-qt8pf?file=%2Fsrc%2Findex.js%3A4%2C23-4%2C30)
 *
 * @param className
 * @returns React.JSX.Element
 */
export function ButtonCopy({ className, children, variant, size, data = '', onClick, ...props }: ButtonCopyProps) {
    const [isCopied, setIsCopied] = React.useState(false);

    React.useEffect(() => {
        const timeout = setTimeout(() => {
            if (isCopied === true) setIsCopied(false);
        }, 1000);

        return () => clearTimeout(timeout);
    }, [isCopied]);

    function handleCopy(event?: React.MouseEvent<HTMLButtonElement>) {
        if (isCopied === false) {
            try {
                window.navigator.clipboard.writeText(data);
                setIsCopied(true);
            } catch (error) {
                throw new Error('ButtonCopy');
            }
        }
        if (onClick instanceof Function) {
            onClick(event, isCopied);
        }
    }
    return (
        <Button
            className={cn(
                'size-7 justify-center items-center p-0 [&_.btn-copy-icon-wrapper]:size-4 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
                className
            )}
            variant={variant}
            size={size}
            onClick={(event) => handleCopy(event)}
            {...props}
        >
            <div className="relative btn-copy-icon-wrapper">
                <CopyIcon
                    className="absolute top-0 bottom-0 left-0 right-0"
                    style={{
                        strokeDasharray: 50,
                        strokeDashoffset: isCopied ? -50 : 0,
                        transition: 'all 300ms ease-in-out',
                    }}
                />
                <CheckIcon
                    className="absolute top-0 bottom-0 left-0 right-0 text-green-500"
                    strokeWidth="3"
                    style={{
                        // visibility: isCopied === false ? 'hidden' : 'visible',
                        strokeDasharray: 50,
                        strokeDashoffset: isCopied ? 0 : -50,
                        transition: 'all 300ms ease-in-out',
                    }}
                />
            </div>

            {children}
        </Button>
    );
}
