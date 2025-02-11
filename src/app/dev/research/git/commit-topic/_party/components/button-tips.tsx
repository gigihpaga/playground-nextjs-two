import { CalendarIcon, CircleHelpIcon } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button, type ButtonProps } from '@/components/ui/button';
import { Portal as HoverCardPortal } from '@radix-ui/react-hover-card';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';

import { cn } from '@/lib/classnames';

export function ButtonTips({
    variant = 'ghost',
    className,
    content,
    ...props
}: { content?: { title?: string; description?: string } } & Omit<ButtonProps, 'content'>) {
    return (
        <HoverCard openDelay={0}>
            <HoverCardTrigger asChild>
                <Button
                    variant={variant}
                    className={cn('w-fit h-fit p-1', className)}
                    {...props}
                >
                    <CircleHelpIcon className="size-4" />
                </Button>
            </HoverCardTrigger>
            {content ? (
                <HoverCardPortal>
                    <HoverCardContent className="min-w-52 max-w-80 p-2.5">
                        <div className="flex justify-between space-x-4">
                            <div className="space-y-1">
                                {content?.title && <h4 className="text-sm font-semibold">{content.title}</h4>}
                                {content?.description && <p className="text-xs">{content.description}</p>}
                            </div>
                        </div>
                    </HoverCardContent>
                </HoverCardPortal>
            ) : null}
        </HoverCard>
    );
}
