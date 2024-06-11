import { dev_task } from '@prisma/client';
import { Checkbox } from '@/components/ui/checkbox';
import { format } from 'date-fns';
import { cn } from '@/lib/classnames';
import { useTransition } from 'react';
import { updateTaskDoneMutation } from '../actions/task';
import { useRouter } from 'next/navigation';
import { ReloadIcon } from '@radix-ui/react-icons';

interface Props {
    task: dev_task;
}

function getExpirationColor(expires: Date) {
    const days = Math.ceil(Math.floor(expires.getTime() - Date.now()) / 1000 / 60 / 60 / 24);
    if (days <= 3) {
        return 'text-red-500 dark:text-red-400';
    } else if (days <= 7) {
        return 'text-orange-500 dark:text-orange-400';
    } else {
        return 'text-green-500 dark:text-green-400';
    }
}

export function TaskCard({ task }: Props) {
    const [isTransactionLoading, startTransaction] = useTransition();
    const router = useRouter();
    return (
        <div className="flex gap-2 items-start">
            {isTransactionLoading ? (
                <ReloadIcon className="size-5 animate-spin" />
            ) : (
                <Checkbox
                    id={`task-${task.id.toString()}`}
                    // disabled={task.done || isTransactionLoading}
                    disabled={isTransactionLoading}
                    className="size-5"
                    checked={task.done}
                    onCheckedChange={() => {
                        startTransaction(async () => {
                            await updateTaskDoneMutation(task.id, !task.done);
                            router.refresh();
                        });
                    }}
                />
            )}
            <label
                htmlFor={`task-${task.id.toString()}`}
                className={cn(
                    'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 decoration-1 dark:decoration-white',
                    task.done && 'line-through'
                )}
            >
                {task.content}
                {task.expiresAt && (
                    <p className={cn('text-xs text-neutral-500 dark:text-neutral-400', getExpirationColor(task.expiresAt))}>
                        {format(task.expiresAt, 'dd/MM/yyyy')}
                    </p>
                )}
            </label>
        </div>
    );
}
