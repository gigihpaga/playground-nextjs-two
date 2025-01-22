'use client';

import React, { ReactNode } from 'react';
import ReactDOM from 'react-dom';
import { Cross2Icon } from '@radix-ui/react-icons';
import { motion, HTMLMotionProps, AnimatePresence } from 'framer-motion';

// import { useControllableState } from '@radix-ui/react-use-controllable-state';
import { useControllableState } from '@/hooks/use-controllable-state';
import { useComposedRefs } from '@/hooks/use-compose-refs';
import { cn } from '@/lib/classnames';
import { Button, ButtonProps } from '@/components/ui/button';

interface DialogContextValue {
    triggerRef: React.RefObject<HTMLButtonElement | null>;
    contentRef: React.RefObject<DialogContentElement | null>;
    isOpen: boolean;
    openDialog: () => void;
    closeDialog: () => void;
}

const DialogContext = React.createContext<DialogContextValue | undefined>(undefined);

export const useDialogContext = (): DialogContextValue => {
    const context = React.useContext(DialogContext);
    if (!context) {
        throw new Error('useDialogContext must be used within a DialogRoot');
    }
    return context;
};

interface DialogProps {
    children: ReactNode;
    defaultOpen?: boolean;
    open?: boolean;
    onOpenChange?: (isOpen: boolean) => void;
}

/**
 * own custome dialog like radix
 * - link
 * - [official radix dialog](https://www.radix-ui.com/primitives/docs/components/dialog#api-reference)
 * - [github radix dialog](https://github.dev/radix-ui/primitives)
 * @param DialogProps
 * @returns
 */
export const Dialog = ({ children, open: openProp, onOpenChange, defaultOpen }: DialogProps) => {
    // Local state for uncontrolled usage
    const [localOpen = false, setLocalOpen] = useControllableState({
        prop: openProp,
        defaultProp: defaultOpen,
        onChange: onOpenChange,
    });

    const triggerRef = React.useRef<HTMLButtonElement>(null);
    const contentRef = React.useRef<DialogContentElement>(null);

    const openDialog = () => {
        setLocalOpen(true);
    };

    const closeDialog = () => {
        setLocalOpen(false);
        triggerRef?.current?.focus();
    };

    React.useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                closeDialog();
            }
        };

        if (localOpen) {
            document.addEventListener('keydown', handleKeyDown);
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [localOpen]);

    return (
        <DialogContext.Provider value={{ isOpen: localOpen, openDialog: openDialog, closeDialog: closeDialog, contentRef, triggerRef }}>
            {children}
        </DialogContext.Provider>
    );
};

interface DialogPortalProps extends React.ButtonHTMLAttributes<HTMLDivElement> {}

export const DialogPortal = React.forwardRef<HTMLDivElement, DialogPortalProps>(({ children }, ref) => {
    const { isOpen } = useDialogContext();

    return ReactDOM.createPortal(<AnimatePresence mode="wait">{isOpen && <>{children}</>}</AnimatePresence>, document.body);
});

DialogPortal.displayName = 'DialogPortal';

type DialogContentProps = HTMLMotionProps<'div'> & {};
type DialogContentElement = React.ElementRef<typeof DialogContent>;
export const DialogContent = React.forwardRef<HTMLDivElement, DialogContentProps>(({ className, children, ...props }, ref) => {
    const context = useDialogContext();
    const contentRef = React.useRef<HTMLDivElement | null>(null);
    const composedRefs = useComposedRefs(ref, context.contentRef, contentRef);

    // Trap focus inside the dialog
    React.useEffect(() => {
        const dialog = contentRef.current;
        if (!dialog) return;

        const focusableSelectors = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
        const focusableElements = Array.from(dialog.querySelectorAll<HTMLElement>(focusableSelectors));

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Tab') {
                if (focusableElements.length === 0) {
                    event.preventDefault();
                    return;
                }

                if (event.shiftKey && document.activeElement === firstElement) {
                    // Shift + Tab -> Fokus ke elemen terakhir
                    event.preventDefault();
                    lastElement.focus();
                } else if (!event.shiftKey && document.activeElement === lastElement) {
                    // Tab -> Fokus ke elemen pertama
                    event.preventDefault();
                    firstElement.focus();
                }
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    // Focus the first focusable element when the dialog opens
    React.useEffect(() => {
        const dialog = contentRef.current;
        if (!dialog) return;
        const selectors = 'input, select, textarea, radio, button:not([tabindex="-1"]), [href], [tabindex]:not([tabindex="-1"])';
        const focusable = dialog.querySelector<HTMLElement>(selectors);
        focusable?.focus();
    }, []);

    return (
        <motion.div
            {...props}
            ref={(currElement) => composedRefs(currElement)}
            className={cn(
                `fixed
                left-[50%]
                top-[50%]
                z-50
                grid
                w-full
                max-w-lg
                translate-x-[-50%]
                translate-y-[-50%]
                gap-4
                border
                bg-background
                p-6
                shadow-lg
                duration-200
                _data-[state=open]:animate-in
                _data-[state=closed]:animate-out
                _data-[state=closed]:fade-out-0
                _data-[state=open]:fade-in-0
                _data-[state=closed]:zoom-out-95
                _data-[state=open]:zoom-in-95
                _data-[state=closed]:slide-out-to-left-1/2
                _data-[state=closed]:slide-out-to-top-[50%]
                _data-[state=open]:slide-in-from-left-1/2
                _data-[state=open]:slide-in-from-top-[50%]
                sm:rounded-lg
                `,
                className
            )}
            style={{
                // position: 'fixed',
                // top: '50%',
                // left: '50%',
                // backgroundColor: 'white',
                // borderRadius: '8px',
                // padding: '20px',
                // zIndex: 1010,
                // transform: 'translate(-50%, -50%)', // replace with x and y, because transform properti in motion.div will overide frammer motion
                x: '-50%',
                y: '-50%',
                // boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                // width: '400px',
                ...props.style,
            }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.18, easings: ['easeIn', 'easeOut'] }}
        >
            {children}
        </motion.div>
    );
});

DialogContent.displayName = 'DialogContent';

interface DialogTriggerProps extends ButtonProps {}

export const DialogTrigger = React.forwardRef<HTMLButtonElement, DialogTriggerProps>(({ asChild = false, children, className, ...props }, ref) => {
    const context = useDialogContext();
    const triggerRef = React.useRef<HTMLButtonElement | null>(null);
    const composedRefs = useComposedRefs(ref, context.triggerRef, triggerRef);

    if (asChild && React.isValidElement(children)) {
        return React.cloneElement(children as React.ReactElement<any>, {
            onClick: (event: React.MouseEvent<HTMLButtonElement>) => {
                /**
                 * code dibawah ini setara dengan
                 * ```js
                 * if (children?.props?.onClick) {
                 * children.props.onClick(event);
                 * }
                 * ```
                 */
                // Call the original onClick if it exists
                (children as React.ReactElement).props?.onClick?.(event);

                context.openDialog();
            },
            ref: (currElement: HTMLButtonElement | null) => composedRefs(currElement),
        });
    }

    return (
        <Button
            onClick={context.openDialog}
            ref={(currElement) => composedRefs(currElement)}
            className={cn('', className)}
            {...props}
        >
            {children}
        </Button>
    );
});

DialogTrigger.displayName = 'DialogTrigger';

interface DialogCloseProps extends ButtonProps {}

export const DialogClose = React.forwardRef<HTMLButtonElement, DialogCloseProps>((props, ref) => {
    const { asChild = false, children, size = 'icon', variant = 'ghost', className } = props;
    const { closeDialog } = useDialogContext();

    if (asChild && React.isValidElement(children)) {
        return React.cloneElement(children as React.ReactElement<any>, {
            onClick: (event: React.MouseEvent<HTMLButtonElement>) => {
                // Call the original onClick if it exists
                (children as React.ReactElement).props?.onClick?.(event);

                closeDialog();
            },
            ref,
        });
    }

    return (
        <Button
            onClick={closeDialog}
            ref={ref}
            tabIndex={-1}
            className={cn(
                `
                flex
                justify-center
                items-center
                absolute
                right-4
                top-4
                size-fit
                bg-transparent
                rounded
                p-[2px]
                opacity-70
                hover:bg-transparent
                hover:opacity-100
                focus:opacity-100
                transition-opacity
                _ring-offset-background
                _focus:ring-offset-2
                _focus:outline-none
                _focus:ring-2
                _focus:ring-ring
                _disabled:pointer-events-none
                _data-[state=open]:bg-accent
                _data-[state=open]:text-muted-foreground`,
                className
            )}
            size={size}
            variant={variant}
            {...props}
        >
            <Cross2Icon className="h-4 w-4" />
            <span className="sr-only">Close</span>
        </Button>
    );
});

DialogClose.displayName = 'DialogClose';

interface DialogOverlayProps extends HTMLMotionProps<'div'> {}

export const DialogOverlay = React.forwardRef<HTMLDivElement, DialogOverlayProps>(({ ...props }, ref) => {
    const { closeDialog } = useDialogContext();

    return (
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
        <motion.div
            ref={ref}
            style={{
                // position: 'fixed',
                // top: 0,
                // left: 0,
                // right: 0,
                // bottom: 0,
                // backgroundColor: 'rgba(0, 0, 0, 0.5)',
                // zIndex: 1000,
                ...props.style,
            }}
            className={cn(
                `fixed
                inset-0
                z-50
                bg-black/80
                _data-[state=open]:animate-in
                _data-[state=closed]:animate-out
                _data-[state=closed]:fade-out-0
                _data-[state=open]:fade-in-0
                `,
                props.className
            )}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            {...props}
            onClick={closeDialog}
        />
    );
});

DialogOverlay.displayName = 'DialogOverlay';

interface DialogTitleProps extends React.ButtonHTMLAttributes<HTMLHeadingElement> {}

export const DialogTitle = React.forwardRef<HTMLHeadingElement, DialogTitleProps>(({ children, ...props }, ref) => (
    <h2
        ref={ref}
        style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}
        {...props}
    >
        {children}
    </h2>
));

DialogTitle.displayName = 'DialogTitle';

interface DialogDescriptionProps extends React.ButtonHTMLAttributes<HTMLParagraphElement> {}

export const DialogDescription = React.forwardRef<HTMLParagraphElement, DialogDescriptionProps>(({ children, ...props }, ref) => (
    <p
        ref={ref}
        style={{ margin: '10px 0', fontSize: '14px', color: '#666' }}
        {...props}
    >
        {children}
    </p>
));

DialogDescription.displayName = 'DialogDescription';
