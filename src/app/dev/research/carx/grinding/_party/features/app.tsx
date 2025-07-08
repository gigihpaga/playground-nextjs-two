'use client';

import { BookOpenTextIcon } from 'lucide-react';

import { useAppSelector } from '@/lib/redux/hooks';
import { selectClock } from '../state/carx-grinding-slice';

import { ListQuestClub } from './quest-club';
import { QuestTimeline } from './quest-timeline';
import { SheetRightMenu } from './sheet-right-menu';
import { ButtonProcessRollUpDailyQuest } from './rollup-daily-quest-income';
import { ButtonDownload } from './button-download';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ClockCarxStreet } from '../components/clock-carx-street';

export function App() {
    return (
        <div
            className="flex-1 flex flex-col gap-y-2"
            aria-description="app"
        >
            <ToolbarApp />
            <Tabs
                className="flex flex-col"
                defaultValue="questClub"
            >
                <TabsList className="justify-start">
                    <TabsTrigger value="questClub">Quests</TabsTrigger>
                    <TabsTrigger value="questTimeline">Timeline</TabsTrigger>
                </TabsList>
                <TabsContent
                    className=""
                    value="questClub"
                >
                    <ListQuestClub />
                </TabsContent>
                <TabsContent
                    className=""
                    value="questTimeline"
                >
                    <QuestTimeline />
                </TabsContent>
            </Tabs>
        </div>
    );
}

function ToolbarApp() {
    const clock = useAppSelector(selectClock);
    return (
        <div
            className="flex items-center"
            aria-description="top toolbar"
        >
            <div className="flex-1 flex justify-start items-center gap-x-1 ">
                <ButtonProcessRollUpDailyQuest />
                <ButtonDownload />
            </div>
            <div className="flex-1 flex justify-end items-center gap-x-1">
                <ClockCarxStreet clock={clock} />
                <SheetRightMenu
                    trigger={
                        <Button
                            className="text-xs h-fit w-fit py-1 px-2 self-end"
                            title="menu"
                        >
                            <BookOpenTextIcon className="size-3" />
                        </Button>
                    }
                />
            </div>
        </div>
    );
}
