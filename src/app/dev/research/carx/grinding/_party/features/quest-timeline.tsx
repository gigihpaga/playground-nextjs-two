'use client';
import React, { useState } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { CheckIcon, Crown, Loader2Icon, LoaderIcon, MoveHorizontal, RefreshCwIcon, ZoomInIcon, ZoomOutIcon } from 'lucide-react';
import { Timeline, TimelineOptions as InternalTimelineOptions, DataItem, DataGroup, DateType, IdType /* TimelineItem */ } from 'vis-timeline';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';

import { selectAllClubs, selectAllHistoryQuestClub } from '../state/carx-grinding-slice';
import { enrichClubsWithQuestTime, dateTimeIndonesianformatter, formatRangeDate } from '../utils';
import { ClubWithTimeOn, HistoryQuestClub } from '../types';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/classnames';
import { colorObj } from '../constants';

export function QuestTimeline() {
    return <TimeLine />;
}

//* Timeline

type TimelineItem = DataItem & {
    data: ClubWithTimeOn & {
        completedOn: Date | null;
        /** isWin akan bernilai null jika expect timeline pada jam tersebut tidak ada history quest */
        isWin: boolean | null;
        /** counter data dimulai dari 0 */
        index: number;
    };
};
type TimelineGroup = DataGroup & { data: ClubWithTimeOn & { expectQuest: number; actualQuest: number; winCount: number; loseCount: number } };
interface HTMLDivElementWithReactRoot extends HTMLDivElement {
    _reactRoot?: Root;
}

function GroupTimeline({ group }: { group: TimelineGroup }) {
    // Anda bisa menambahkan logika atau tampilan yang lebih kompleks di sini
    return (
        <div className="custom-group-label h-full w-full overflow-hidden p-1 bg-blue-100 border border-blue-300 rounded text-sm text-blue-700">
            {/* <strong>{group.content}</strong> */}
            <div className="gap-x-1 flex items-center">
                <div
                    className={cn(
                        'size-[15px] flex justify-center items-center rounded-full border border-blue-300',
                        colorObj[group.data.color]?.background ?? 'not-found-color'
                    )}
                >
                    <span className="text-3xs">{group.data.class}</span>
                </div>
                <h6 className="leading-tight text-2xs text-nowrap">
                    {group.title}&nbsp;-&nbsp;<span className="uppercase">{group.data.car}</span>
                </h6>
            </div>

            <div className="text-3xs space-x-1">
                <strong>expect: {group.data.expectQuest}</strong>
                <strong>actual: {group.data.actualQuest}</strong>
                {group.data.actualQuest === 0 ? null : (
                    <>
                        <strong>win: {group.data.winCount}</strong>
                        <strong>lose: {group.data.loseCount}</strong>
                    </>
                )}
            </div>
            {/* Tambahkan elemen lain jika perlu, misalnya ikon atau detail tambahan */}
            {/* <span className="text-xs ml-2">(ID: {group.id})</span> */}
        </div>
    );
}

function ItemTimeline({ item }: { item: TimelineItem }) {
    return (
        <div
            aria-description="CardTimeline Item"
            className=" bg-[#fff] flex h-[30px] max-h-[30px] overflow-y-hidden p-[2px] text-2xs gap-x-1"
        >
            <div className="relative border-[#00000014] border h-full p-[4px] flex justify-center items-center gap-x-1 rounded ">
                <div className="p-[1px] rounded border border-gray-400 w-fit h-fit">
                    {item.data.completedOn ? (
                        // <CheckIcon className="size-3 text-green-600" />
                        <Crown className={cn('size-3 text-green-600', item.data.isWin === false && 'text-red-600')} />
                    ) : (
                        <LoaderIcon className="size-3 text-gray-400" />
                    )}
                </div>
                <h2 className="text-xs">{String(item.data.index + 1)}</h2>
            </div>
            <dl className="flex flex-col bg-[#f6f6f6]">
                <div className="flex text-3xs">
                    <dt>Schedule on:</dt>&nbsp;
                    <dd>
                        {item.start && item.end
                            ? formatRangeDate(new Date(item.start).toISOString(), new Date(item.end).toISOString())
                            : `${item.start ? dateTimeIndonesianformatter.format(new Date(item.start)) : 'no date'} - ${item.end ? dateTimeIndonesianformatter.format(new Date(item.end)) : 'no date'}`}
                    </dd>
                </div>
                <div className="flex text-3xs">
                    <dt>Completed on:</dt>&nbsp;
                    <dd className={cn(item.data.completedOn && 'text-green-600')}>
                        {item.data.completedOn ? dateTimeIndonesianformatter.format(new Date(item.data.completedOn)) : 'no date'}
                    </dd>
                </div>
            </dl>
        </div>
    );
}

const timelineOptions: InternalTimelineOptions = {
    stack: false,
    editable: false,
    moveable: true,
    start: new Date(new Date().setHours(0, 1, 1, 1)),
    end: new Date(new Date().setHours(23, 59, 59, 999)),
    // type: 'box',
    // autoResize: false,
    // margin: { item: 25, axis: 25 },
    // orientation: 'bottom',
    // orientation: { axis: 'both', item: 'top' },
    verticalScroll: true,
    horizontalScroll: false,
    // align: 'left',
    groupHeightMode: 'fixed',
    minHeight: '120px', // contoh jika groupHeightMode adalah 'fixed' atau untuk memastikan tinggi minimum

    groupTemplate: (group?: TimelineGroup, element?: HTMLDivElement) => {
        // console.log('template group', { group, element });
        if (!group || !element) {
            /**
             * Jika tidak ada data grup, kembalikan konten default atau string kosong
             * Vis-timeline akan menampilkan group.content secara default jika string kosong dikembalikan
             * atau jika groupTemplate tidak disediakan.
             * Untuk benar-benar kosong, Anda mungkin perlu styling CSS pada elemen grup.
             */
            return group?.content || '';
        }

        const el = element as HTMLDivElementWithReactRoot;

        if (!el._reactRoot) {
            el._reactRoot = createRoot(el);
        }
        // Render komponen GroupTimeline Anda
        el._reactRoot.render(<GroupTimeline group={group} />);

        // Penting: Kembalikan string kosong karena rendering dilakukan oleh React
        return '';
    },

    template: (item?: TimelineItem, element?: HTMLDivElement, data?: TimelineItem) => {
        /**
         * Jika item atau element tidak ada, template harus mengembalikan string kosong.
         * Ini mencegah error saat mencoba mengakses properti dari objek yang undefined
         * dan memastikan CardTimeline menerima 'item' yang valid.
         */
        if (!item || !element) return '';

        const el = element as HTMLDivElementWithReactRoot;

        if (!el._reactRoot) {
            el._reactRoot = createRoot(el);
        }

        // const root = createRoot(element); // createRoot(container!) if you use TypeScript
        // root.render(<CardTimeline item={item} />);
        el._reactRoot.render(<ItemTimeline item={item} />);

        return '';
    },

    loadingScreenTemplate: (element: HTMLDivElement) => {
        // Fungsi ini harus mengembalikan HTMLElement atau string HTML.
        // Kita buat sebuah div, render komponen React ke dalamnya, dan kembalikan div tersebut.
        const container = document.createElement('div') as HTMLDivElementWithReactRoot;

        // Opsional: Tambahkan styling ke container agar lebih terlihat
        container.style.display = 'flex';
        container.style.justifyContent = 'center';
        container.style.alignItems = 'center';
        container.style.height = '100%'; // Pastikan bisa mengisi area timeline
        container.style.padding = '20px';
        container.style.textAlign = 'center';

        const root = createRoot(container);
        root.render(
            <>
                <Loader2Icon className="animate-spin text-black size-6 mr-2 inline-block" />
                <span className="text-black">Timeline...</span>
            </>
        );
        // Simpan root di elemen jika diperlukan untuk unmount nanti,
        // meskipun untuk loading screen biasanya tidak diperlukan karena vis-timeline akan menghapusnya.
        container._reactRoot = root;
        return container; // Kembalikan HTMLElement
    },
};

function TimeLine() {
    const timelineRef = React.useRef<HTMLDivElement | null>(null);
    const timelineInstance = React.useRef<Timeline | null>(null);

    const allClubs = useAppSelector(selectAllClubs);
    const allHistoryQuests = useAppSelector(selectAllHistoryQuestClub);
    const allClubWithOldestTimeOn = enrichClubsWithQuestTime({ clubs: allClubs, historiesQuest: allHistoryQuests, sortOrder: 'oldest' });

    const { timelineItems, timelineGroups } = React.useMemo(() => {
        return generateQuestTimeline({
            clubs: allClubWithOldestTimeOn,
            historiesQuest: allHistoryQuests,
        });
    }, [allClubWithOldestTimeOn, allHistoryQuests]);

    React.useEffect(() => {
        const container = timelineRef.current;
        let localTimerId: ReturnType<typeof setTimeout> | undefined;
        if (container) {
            timelineInstance.current = new Timeline(container, timelineItems, timelineGroups, timelineOptions);
            // timelineInstance.current.on('change', handleTimelineChange);
            // let vGroups = timelineInstance.current.getVisibleGroups();

            // panggil redraw setelah sedikit delay untuk memberi waktu React render template, digunakan untuk memastikan vis-timeline mengukur ukuran custom component group dan item dengan benar
            localTimerId = setTimeout(() => {
                timelineInstance.current?.redraw();
            }, 1000);
        }

        return () => {
            if (localTimerId) {
                // Pastikan membersihkan timerId yang benar
                clearTimeout(localTimerId);
            }
            timelineInstance.current?.destroy();
        };
    }, [timelineItems, timelineGroups]);

    return (
        <div aria-description="TimeLine">
            <div
                ref={timelineRef}
                id="visualization-timeline"
                className="flex-1 bg-white shadow rounded-lg border p-4 mb-2"
            />
            <div className="flex justify-center gap-x-1">
                <Button
                    className="h-fit w-fit py-1 px-[6px] text-xs"
                    variant="outline"
                    title="Zoom in"
                    onClick={() => void timelineInstance.current?.zoomIn(0.2)}
                >
                    <ZoomInIcon className="size-4" />
                </Button>
                <Button
                    className="h-fit w-fit py-1 px-[6px] text-xs"
                    variant="outline"
                    title="Zoom out"
                    onClick={() => void timelineInstance.current?.zoomOut(0.2)}
                >
                    <ZoomOutIcon className="size-4" />
                </Button>
                <Button
                    className="h-fit w-fit py-1 px-[6px] text-xs"
                    variant="outline"
                    title="Go to now"
                    onClick={() => void timelineInstance.current?.moveTo(new Date())}
                >
                    Now
                </Button>
                <Button
                    className="h-fit w-fit py-1 px-[6px] text-xs"
                    variant="outline"
                    title="Show All Items"
                    onClick={() => timelineInstance.current?.fit()}
                >
                    <MoveHorizontal className="size-4" />
                </Button>
                <Button
                    className="h-fit w-fit py-1 px-[6px] text-xs"
                    variant="outline"
                    title="Show 1 week"
                    onClick={() => {
                        timelineInstance.current?.setWindow(new Date(), new Date(new Date().setDate(new Date().getDate() + 7)));
                    }}
                >
                    1 week
                </Button>
                <Button
                    className="h-fit w-fit py-1 px-[6px] text-xs"
                    variant="outline"
                    title="Show 1 month"
                    onClick={() => {
                        timelineInstance.current?.setWindow(new Date(), new Date(new Date().setMonth(new Date().getMonth() + 1)));
                    }}
                >
                    1 month
                </Button>
                <Button
                    className="h-fit w-fit py-1 px-[6px] text-xs"
                    variant="outline"
                    title="Show 3 month"
                    onClick={() => {
                        timelineInstance.current?.setWindow(new Date(), new Date(new Date().setMonth(new Date().getMonth() + 3)));
                    }}
                >
                    3 month
                </Button>
                <Button
                    className="h-fit w-fit py-1 px-[6px] text-xs"
                    variant="outline"
                    title="Reload"
                    onClick={() => void timelineInstance.current?.redraw()}
                >
                    <RefreshCwIcon className="size-4" />
                </Button>
            </div>
        </div>
    );
}

function generateQuestTimeline(args: { clubs: ClubWithTimeOn[]; historiesQuest: HistoryQuestClub[] }) {
    const { clubs, historiesQuest } = args;

    // Associating club with historiesQuest
    const clubAssociatedHistoryMap = new Map<ClubWithTimeOn['id'], { club: ClubWithTimeOn; histories: HistoryQuestClub[] }>(
        clubs.map((club) => {
            return [club.id, { club: club, histories: historiesQuest.filter((history) => history.idClub === club.id) }];
        })
    );

    /**
     * data nextQuests tergenerate secara otomatis, dimulai dari data firstQuest
     * data nextQuests berikutnya start date nya dimulai dari firstQuest.end
     * jumlah data nextQuests tidak di ketahui yang pasti nextQuests.start < hari ini jam 23.59
     */
    function generateNextQuest(firstQuest: TimelineItem, historyPerClub: HistoryQuestClub[]) {
        const generatedNextQuests: TimelineItem[] = [];

        const startTime = new Date(firstQuest.end!);
        const endOfToday = new Date(new Date(firstQuest.start!).setHours(23, 59, 59, 999));
        const cooldown = firstQuest.data.quest.cooldownTime;

        let currentStart = startTime;

        for (let i = 0; i <= 199 && currentStart.getTime() < endOfToday.getTime(); i++) {
            const currentEnd = new Date(currentStart.getTime() + cooldown);

            // ✅ Cek apakah expect quest ini diselesaikan pada realita (history quest)
            const historyMatchedTimeOn = historyPerClub.find((history) => {
                const timeOn = new Date(history.timeOn);
                return timeOn >= currentStart && timeOn < currentEnd;
            });

            // const completedOn = matchedTimeOn ? new Date(matchedTimeOn) : null;
            const completedOn = historyMatchedTimeOn ? new Date(historyMatchedTimeOn.timeOn) : null;
            const isWin = historyMatchedTimeOn ? historyMatchedTimeOn.isWin : null;

            const nextQuest: TimelineItem = {
                id: `${String(firstQuest.id)}-next-${i + 2}`,
                content: `${firstQuest.data.name}-${i + 2}`,
                start: new Date(currentStart),
                end: currentEnd,
                group: String(firstQuest.id),
                data: { ...firstQuest.data, index: firstQuest.data.index + (i + 1), completedOn: completedOn, isWin: isWin },
            };

            generatedNextQuests.push(nextQuest);
            currentStart = new Date(currentEnd.getTime());
        }

        return generatedNextQuests;
    }

    const timelineItems = Array.from(clubAssociatedHistoryMap.keys()).reduce((acc, idClub) => {
        const club = clubAssociatedHistoryMap.get(idClub)!.club;
        const historiesPerClub = clubAssociatedHistoryMap.get(idClub)!.histories;

        if (club.timeOn) {
            // artinya sudah ada history
            const start = new Date(club.timeOn);
            start.setSeconds(0);
            start.setMilliseconds(0);
            const end = new Date(start.getTime() + club.quest.cooldownTime);

            const firstQuest: TimelineItem = {
                id: club.id,
                content: club.name,
                start: start,
                end: end,
                group: club.id,
                data: { ...club, completedOn: start, index: 0, isWin: historiesPerClub.length === 0 ? null : historiesPerClub[0].isWin },
            };

            const nextQuests = generateNextQuest(firstQuest, historiesPerClub);

            acc.push(firstQuest, ...nextQuests);
        } else {
            // artinya belum ada history
            const start = new Date();
            start.setSeconds(0);
            start.setMilliseconds(0);
            const end = new Date(new Date().setHours(23, 59, 59, 999)); // Set waktu ke akhir hari ini
            const firstQuest: TimelineItem = {
                id: club.id,
                content: club.name,
                start: start,
                end: end,
                group: club.id,
                data: { ...club, completedOn: null, index: 0, isWin: null },
            };

            acc.push(firstQuest);
        }

        return acc;
    }, [] as TimelineItem[]);

    const timelineGroups: TimelineGroup[] = Array.from(clubAssociatedHistoryMap.keys()).map((idClub) => {
        const club = clubAssociatedHistoryMap.get(idClub)!.club;
        const historiesPerClub = clubAssociatedHistoryMap.get(idClub)!.histories;
        const winCount = historiesPerClub.filter((history) => history.isWin === true).length;

        return {
            id: club.id,
            content: club.name,
            title: club.name,
            data: {
                ...club,
                expectQuest: timelineItems.filter((item) => item.data.id === club.id).length,
                actualQuest: historiesPerClub.length,
                winCount: winCount,
                loseCount: historiesPerClub.length - winCount,
            },
        } satisfies TimelineGroup;
    });

    return { timelineItems: timelineItems, timelineGroups: timelineGroups, clubs };
}
