import { ReactNode, useState } from 'react';
import { z } from 'zod';
import { useForm, DefaultValues, FieldValues, FieldValue } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { cn } from '@/lib/classnames';
import { selectClock, updateClock } from '../state/carx-grinding-slice';
import { Clock } from '../types';

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { fromInputDatetimeLocalValue, toInputDatetimeLocalValue } from '../utils';

//* Form
const formClockSchema: z.ZodSchema<Clock> = z.object({
    anchorReal: z.string(),
    anchorInGameHour: z.number().gte(0).lte(23),
    dailyCycleRealMinutes: z.number().gte(2),
});

type FormClockSchemaType = z.infer<typeof formClockSchema>;

export function DialogUpdateClock({ trigger }: { trigger: ReactNode }) {
    const [dialogIsOpen, setDialogIsOpen] = useState<boolean>(false);

    const dispatch = useAppDispatch();
    const clock = useAppSelector(selectClock);

    const form = useForm<FormClockSchemaType>({
        resolver: zodResolver(formClockSchema),
        defaultValues: { anchorReal: '', anchorInGameHour: 0, dailyCycleRealMinutes: 0 },
        values: {
            anchorReal: clock ? toInputDatetimeLocalValue(new Date(clock.anchorReal)) : '',
            anchorInGameHour: clock?.anchorInGameHour ?? 0,
            dailyCycleRealMinutes: clock?.dailyCycleRealMinutes ?? 0,
        },
    });

    function handleOnSubmit(data: FormClockSchemaType) {
        // console.log('FormClock submit', { ...data, dateConvert: fromDatetimeLocalValue(data.anchorReal) });

        const dataClock: Clock = {
            ...clock,
            anchorReal: fromInputDatetimeLocalValue(data.anchorReal),
            anchorInGameHour: data.anchorInGameHour,
            dailyCycleRealMinutes: data.dailyCycleRealMinutes,
        };

        // update
        dispatch(updateClock(dataClock));

        handleDialogOpenChange(false);
    }

    function handleDialogOpenChange(state: boolean) {
        setDialogIsOpen(state);
        form.reset();
    }

    return (
        <Dialog
            open={dialogIsOpen}
            onOpenChange={handleDialogOpenChange}
        >
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent
                aria-description="DialogFormClub"
                className="sm:max-w-[425px]"
            >
                <DialogHeader>
                    <DialogTitle className="flex gap-2">Edit clock</DialogTitle>
                    <DialogDescription>Edit clock data</DialogDescription>
                </DialogHeader>
                <div className="gap-4 py-4">
                    <Form {...form}>
                        <form
                            // onSubmit={form.handleSubmit((a) => handleOnSubmit(a))}
                            className="space-y-2"
                        >
                            <FormField
                                name="anchorReal"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Anchor Real</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="datetime-local"
                                                placeholder="anchor real"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                name="anchorInGameHour"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Anchor In Game Hour</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                min={0}
                                                placeholder="anchor in game hour"
                                                {...field}
                                                onChange={(event) => field.onChange(+event.target.value)}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                name="dailyCycleRealMinutes"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Daily Cycle Real Minutes</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                min={0}
                                                placeholder="daily cycle real minutes"
                                                {...field}
                                                onChange={(event) => field.onChange(+event.target.value)}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </form>
                    </Form>
                </div>
                <DialogFooter>
                    <Button
                        size="sm"
                        className={cn('w-full')}
                        onClick={form.handleSubmit((data) => handleOnSubmit(data))}
                    >
                        Confirm
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
