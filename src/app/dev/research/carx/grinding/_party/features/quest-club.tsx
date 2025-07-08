import React, { useState } from 'react';
import Link from 'next/link';
import { EllipsisIcon, PencilIcon, RocketIcon, TrashIcon } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { cn } from '@/lib/classnames';
import {
    selectAllClubs,
    selectAllHistoryQuestClub,
    addHistoryQuestClub,
    adjustNextQuestTime,
    selectCountHistoryQuestClubByClub,
    selectClub,
} from '../state/carx-grinding-slice';
import { breakDownDurationToTimeUnits } from '../utils';
import { enrichClubsWithQuestTime, dateTimeIndonesianformatter } from '../utils';
import { Club, HistoryQuestClub, ClubWithTimeOn } from '../types';
import { useCountdownTimer } from '../hooks/use-countdown-timer';

import { Button, ButtonProps } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { CountdownTimer } from '../components/countdown-timer';
import { useSearchAndSort } from '../hooks/use-search-and-filter';
import { FilterAndSearch } from '../components/filter-and-search';
import { colorObj } from '../constants';

export function ListQuestClub() {
    const allClubs = useAppSelector(selectAllClubs);
    const allHistoryQuests = useAppSelector(selectAllHistoryQuestClub);
    const allClubWithLatestTimeOn = enrichClubsWithQuestTime({ clubs: allClubs, historiesQuest: allHistoryQuests });

    const {
        keyFilters,
        query,
        setQuery,
        keySorteds,
        sortBy,
        setSortBy,
        sortDir,
        setSortDir,
        results: filteredClubs,
    } = useSearchAndSort({
        data: allClubWithLatestTimeOn,
        keyFilters: ['name', 'car', 'class', 'quest.cooldownTime'],
        keySorteds: ['name', 'car', 'class', 'quest.cooldownTime'],
    });

    console.log('ListQuestClub RENDER');

    return (
        <div className="space-y-4 h-full overflow-hidden flex flex-col">
            <FilterAndSearch
                query={query}
                setQuery={setQuery}
                keySorteds={keySorteds}
                sortBy={sortBy}
                setSortBy={setSortBy}
                sortDir={sortDir}
                setSortDir={setSortDir}
            />
            <ul className="space-y-2 flex-1 max-h-[400px] overflow-auto">
                {allClubs.length === 0 ? (
                    <div>empty quest, because club is empty</div>
                ) : (
                    filteredClubs.map((club) => (
                        <CardQuestClub
                            key={club.id}
                            club={club}
                        />
                    ))
                )}
            </ul>
        </div>
    );
}

export function CardQuestClub({ club }: { club: ClubWithTimeOn }) {
    const cooldownTime = breakDownDurationToTimeUnits(club.quest.cooldownTime);

    const countHistoryQuestClub = useAppSelector((state) => selectCountHistoryQuestClubByClub(state, club.id));

    const lastResolveQuestTime = club.timeOn;
    const nextQuestTime = lastResolveQuestTime ? new Date(lastResolveQuestTime).getTime() + club.quest.cooldownTime : undefined;

    // console.log('CardQuestClub', { name: club.name, nextQuestTime: nextQuestTime ? new Date(nextQuestTime) : undefined });

    return (
        <li
            className="border-border border py-1 px-2 rounded-md flex gap-2"
            key={club.id}
            title={club.name}
        >
            <dl className="flex flex-col flex-1 overflow-x-hidden">
                <div className="gap-x-1 flex items-center">
                    <div
                        className={cn(
                            'size-[25px] flex justify-center items-center rounded border border-border',
                            colorObj[club.color]?.background ?? 'not-found-color'
                        )}
                    >
                        <span className="text-xs">{club.class}</span>
                    </div>
                    <h6 className="leading-tight text-nowrap">
                        {club.name}&nbsp;-&nbsp;<span className="uppercase">{club.car}</span>
                    </h6>
                </div>
                <div className="text-2xs flex gap-[1px]">
                    <dt className="text-muted-foreground">cooldown:</dt>
                    <dd className="">
                        {cooldownTime.hours}h&nbsp;{cooldownTime.minutes}m&nbsp;{cooldownTime.seconds}s
                    </dd>
                </div>
                <div className="text-2xs flex gap-[1px]">
                    <dt className="text-muted-foreground">reolved quest:</dt>
                    <dd className="">{countHistoryQuestClub}</dd>
                </div>
                <div className="text-2xs flex gap-[1px]">
                    <dt className="text-muted-foreground">last quest:</dt>
                    <dd className="">
                        {/* last resolve: {club.timeOn ? new Date(club.timeOn).toLocaleDateString('id-ID') : '-'} */}
                        {lastResolveQuestTime ? dateTimeIndonesianformatter.format(new Date(lastResolveQuestTime)) : '-'}
                    </dd>
                </div>

                {/* <span className="text-2xs text-muted-foreground font-bold">{club.createAt}</span> */}
            </dl>
            <div className="flex flex-col justify-between gap-1 w-[90px] overflow-hidden">
                <div className="flex gap-1">
                    <div className="flex-1">
                        <span className="text-3xs text-muted-foreground flex">next quest: </span>
                        {nextQuestTime ? (
                            <CountdownTimer
                                className="text-2xs"
                                classNameInvalid="text-red-500"
                                classNameExpired="text-green-500"
                                date={new Date(nextQuestTime)}
                            />
                        ) : (
                            <p className="text-2xs">-</p>
                        )}
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                className="text-xs w-fit h-fit p-1"
                                variant="outline"
                                title="more action"
                            >
                                <EllipsisIcon className="size-3" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DialogSetNextQuestTime
                                clubId={club.id}
                                trigger={
                                    <Button
                                        className="font-normal text-sm h-fit w-full px-2 py-1.5 justify-start flex gap-x-1"
                                        title="set next quest time"
                                        variant="ghost"
                                        disabled={!(countHistoryQuestClub > 0)}
                                    >
                                        <PencilIcon className="size-[10px]" />
                                        Adjust quest time
                                    </Button>
                                }
                            />
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <div className="flex-1">
                    <DialogConfirmResolveQuest
                        clubId={club.id}
                        trigger={
                            <ButtonResolveQuest
                                club={club}
                                nextQuestTime={nextQuestTime}
                                countHistoryQuestClub={countHistoryQuestClub}
                            />
                        }
                    />
                </div>
            </div>
        </li>
    );
}

type ButtonResolveQuestProps = Omit<ButtonProps, 'children' | 'title' | 'disabled'> & {
    countHistoryQuestClub: number;
    nextQuestTime?: number; // timestamp
    club: ClubWithTimeOn;
};

const ButtonResolveQuest = React.forwardRef<HTMLButtonElement, ButtonResolveQuestProps>(
    ({ nextQuestTime, countHistoryQuestClub, club, ...rest }, ref) => {
        const { timeLeft, isValid, isExpired } = useCountdownTimer(nextQuestTime ? new Date(nextQuestTime) : '');

        /**
         * isExpired akan bernilai true jika waktu sudah habis
         * jika belum ada history (nextQuestTime=undefined)
         */

        const isButtonDisabled: boolean = isValid === true && isExpired === false ? false : true;

        return (
            <Button
                ref={ref}
                disabled={!isButtonDisabled}
                className="text-xs h-full w-full p-1"
                title="resolve quest"
                {...rest}
            >
                <RocketIcon className="size-3" />
            </Button>
        );
    }
);

ButtonResolveQuest.displayName = 'ButtonResolveQuest';

type DialogConfirmResolveQuestProps = {
    trigger: React.ReactNode;
    clubId: Club['id'];
};
export function DialogConfirmResolveQuest({ clubId, trigger }: DialogConfirmResolveQuestProps) {
    const [open, setOpen] = useState<boolean>(false);
    const dispatch = useAppDispatch();

    function handleOpenChange(state: boolean) {
        setOpen(state);
    }

    function handleResolveQuest(statusWinning: boolean) {
        dispatch(addHistoryQuestClub({ idClub: clubId, isWin: statusWinning }));
        handleOpenChange(false);
    }
    return (
        <Dialog
            open={open}
            onOpenChange={handleOpenChange}
        >
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex gap-2">Confirm resolve quest</DialogTitle>
                    <DialogDescription>Save progress quest done.</DialogDescription>
                </DialogHeader>
                <div className="gap-4 py-4 flex">
                    {[true, false].map((statusWinning) => {
                        return (
                            <Button
                                className={cn(
                                    'flex flex-1 bg-green-400 hover:bg-green-500 text-white',
                                    statusWinning === false && 'bg-red-400 hover:bg-red-500'
                                )}
                                key={String(statusWinning)}
                                onClick={() => handleResolveQuest(statusWinning)}
                            >
                                {statusWinning ? 'win' : 'lose'}
                            </Button>
                        );
                    })}
                </div>
            </DialogContent>
        </Dialog>
    );
}

const FormSetNextQuestTimeSchema = z.object({
    hour: z.number().nonnegative(),
    minute: z.number().nonnegative(),
});

type DialogSetNextQuestTimeProps = {
    trigger: React.ReactNode;
    clubId: Club['id'];
};

export function DialogSetNextQuestTime({ clubId, trigger }: DialogSetNextQuestTimeProps) {
    const dispatch = useAppDispatch();
    const [open, setOpen] = useState<boolean>(false);
    /** 
    const allClubs = useAppSelector(selectAllClubs);
    const allHistoryQuests = useAppSelector(selectAllHistoryQuestClub);
    const allClubWithLatestTimeOn = enrichClubsWithQuestTime({ clubs: allClubs, historiesQuest: allHistoryQuests });
    const club = allClubWithLatestTimeOn.find((club) => club.id === clubId);
    */
    const club = useAppSelector(selectClub);

    const form = useForm<z.infer<typeof FormSetNextQuestTimeSchema>>({
        resolver: zodResolver(FormSetNextQuestTimeSchema),
        defaultValues: {
            hour: 0,
            minute: 0,
        },
    });

    function handleOnSubmit(data: z.infer<typeof FormSetNextQuestTimeSchema>) {
        const minuteInMilisecond = 1_000 * 60;
        const duration = data.hour * 60 * minuteInMilisecond + data.minute * minuteInMilisecond;

        dispatch(adjustNextQuestTime({ idClub: clubId, duration: duration }));
        setOpen(false);
    }

    function handleOpenChange(state: boolean) {
        setOpen(state);
        form.reset();
    }

    return (
        <Dialog
            open={open}
            onOpenChange={handleOpenChange}
        >
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex gap-2">
                        Club <span className="font-bold">{club ? club.name : '-'}</span>
                    </DialogTitle>
                    <DialogDescription>Adjust next quest time.</DialogDescription>
                </DialogHeader>
                <div className="gap-4 py-4">
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit((a) => handleOnSubmit(a))}
                            className="space-y-6"
                        >
                            <div className="flex gap-x-2">
                                <FormField
                                    name="hour"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormLabel>Hour</FormLabel>
                                            <Select
                                                onValueChange={(v) => field.onChange(Number(v))}
                                                defaultValue={String(field.value)}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Hour" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent className="max-h-[280px]">
                                                    {Array.from({ length: 13 }, (_, i) => (
                                                        <SelectItem
                                                            className="py-[2px]"
                                                            key={i}
                                                            value={i.toString()}
                                                        >
                                                            {i.toString()}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    name="minute"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormLabel>Minute</FormLabel>
                                            <Select
                                                onValueChange={(v) => field.onChange(Number(v))}
                                                defaultValue={String(field.value)}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Minute" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent className="max-h-[280px]">
                                                    {Array.from({ length: 61 }, (_, i) => (
                                                        <SelectItem
                                                            className="py-[2px]"
                                                            key={i}
                                                            value={i.toString()}
                                                        >
                                                            {i.toString()}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </form>
                    </Form>
                </div>
                <DialogFooter>
                    <Button
                        size="sm"
                        className={cn('w-full')}
                        onClick={form.handleSubmit((d) => handleOnSubmit(d))}
                    >
                        Confirm
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
