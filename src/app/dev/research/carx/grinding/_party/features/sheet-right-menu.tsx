import { ReactNode } from 'react';

import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { DialogMasterClub } from './club';
import { DialogHistoryQuestClub } from './history-quest-club';
import { DialogWallet } from './wallet';
import { DialogDailyQuestIncome } from './rollup-daily-quest-income';
import { DialogUpdateClock } from './dialog-update-clock';

export function SheetRightMenu({ trigger }: { trigger: ReactNode }) {
    return (
        <Sheet>
            <SheetTrigger asChild>{trigger}</SheetTrigger>

            <SheetContent className="_z-[1000] flex flex-col w-1/2 sm:w-1/3 max-w-[80%] sm:max-w-[50%]">
                <SheetHeader>
                    <SheetTitle>Carx grinding menu</SheetTitle>
                    <SheetDescription>You can maintain carx street grinding data.</SheetDescription>
                </SheetHeader>
                <DialogMasterClub
                    trigger={
                        <Button
                            className="text-xs h-fit py-1"
                            title="manage club"
                        >
                            Club
                        </Button>
                    }
                />
                <DialogWallet
                    trigger={
                        <Button
                            className="text-xs h-fit py-1"
                            title="manage wealth"
                        >
                            Wallet
                        </Button>
                    }
                />
                <DialogHistoryQuestClub
                    trigger={
                        <Button
                            className="text-xs h-fit py-1"
                            title="manage history quest club"
                        >
                            History quest club
                        </Button>
                    }
                />
                <DialogDailyQuestIncome
                    trigger={
                        <Button
                            className="text-xs h-fit py-1"
                            title="daily quest income summary"
                        >
                            Daily quest income summary
                        </Button>
                    }
                />
                <DialogUpdateClock
                    trigger={
                        <Button
                            className="text-xs h-fit py-1"
                            title="setting clock"
                        >
                            Setting clock
                        </Button>
                    }
                />
            </SheetContent>
        </Sheet>
    );
}
