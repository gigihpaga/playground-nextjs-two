'use client';

import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import {
    getAttackIdActive,
    selectAttackStep,
    getAttackStepIndexActive,
    selectAttackStepAll,
    setAttackStepIndexActive,
    deleteLastHistoryAttack,
    getDebugSpell,
    setDebugSpell,
} from '../state/attack-collection-slice';

import { Table, TableCell, TableHead, TableHeader, TableRow, TableBody } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ChevronLeftIcon, ChevronRightIcon, Divide, ListRestartIcon, ListXIcon, Trash2Icon, TrashIcon } from 'lucide-react';
import { cn } from '@/lib/classnames';
import { useState } from 'react';

export function TableAttackHistory() {
    const attackIdActive = useAppSelector(getAttackIdActive); // attackId
    const attackStepIndexActive = useAppSelector((states) => getAttackStepIndexActive(states, attackIdActive)); // stepIndex
    const attackSteps = useAppSelector((state) => selectAttackStepAll(state, attackIdActive));
    const dispatch = useAppDispatch();
    return (
        <div className="space-y-2">
            <div className="flex justify-between items-center">
                <div className="flex gap-1">
                    <p className=" text-xs"> Attack index active:&nbsp;</p>
                    {attackStepIndexActive === null ? (
                        <p className="h-6 text-xs text-green-400 font-bold underline">default (last index)</p>
                    ) : (
                        <div className="flex gap-1">
                            <Button
                                className="size-6"
                                size="icon"
                                onClick={() => {
                                    if (!attackIdActive) {
                                        alert('you mush select attack collection to set attack index active');
                                        return;
                                    }
                                    const wantPrev = attackStepIndexActive - 1,
                                        maxPrev = attackSteps.length - 1;
                                    const finalPrev = wantPrev >= 0 && wantPrev <= maxPrev ? wantPrev : maxPrev;
                                    dispatch(setAttackStepIndexActive({ attackId: attackIdActive, attackStepIndexActive: finalPrev }));
                                }}
                                data-tooltip="previous"
                            >
                                <ChevronLeftIcon className="size-4" />
                            </Button>
                            <div className="size-5 text-center  bg-muted rounded">{attackStepIndexActive}</div>
                            <Button
                                className="size-6"
                                size="icon"
                                onClick={() => {
                                    if (!attackIdActive) {
                                        alert('you mush select attack collection to set attack index active');
                                        return;
                                    }
                                    const wantNext = attackStepIndexActive + 1,
                                        maxNext = attackSteps.length - 1;
                                    const finalNext = wantNext <= maxNext ? wantNext : 0;
                                    dispatch(setAttackStepIndexActive({ attackId: attackIdActive, attackStepIndexActive: finalNext }));
                                }}
                                data-tooltip="next"
                            >
                                <ChevronRightIcon className="size-4" />
                            </Button>
                        </div>
                    )}
                </div>
                <Button
                    className="size-6"
                    size="icon"
                    onClick={() => {
                        if (!attackIdActive) {
                            alert('you must select attack collection to set attack index active');
                            return;
                        }
                        dispatch(setAttackStepIndexActive({ attackId: attackIdActive, attackStepIndexActive: null }));
                    }}
                    data-tooltip="set attack index active to default"
                >
                    <ListRestartIcon className="size-4" />
                </Button>
            </div>
            <ToglleDebugSpell />
            <div className="overflow-hidden">
                <h2 className="font-bold">List of Attack History</h2>
                <p className="text-xs text-muted-foreground mb-2">Select step index history attack to jump step index</p>
                <Button
                    className="size-7"
                    size="icon"
                    variant="destructive"
                    onClick={() => {
                        if (!attackIdActive) {
                            alert('you must select attack collection to set attack index active');
                            return;
                        }
                        if (attackSteps.length === 1) {
                            alert('you cant delete last history, because history count is 1 (initial value)');
                            return;
                        }
                        dispatch(deleteLastHistoryAttack({ attackId: attackIdActive }));
                    }}
                    data-tooltip="delete last history attack"
                >
                    <ListXIcon className="size-4" />
                </Button>
                <div className="h-[50vh] overflow-y-auto">
                    <Table style={{ fontSize: '10px' }}>
                        <TableHeader>
                            <TableRow className="text-nowrap [&>th]:px-1">
                                <TableHead className="w-[50px]">Step Index</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Operation</TableHead>
                                {/* <TableHead>Action</TableHead> */}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {attackSteps.map((attackStep) => (
                                <TableRow
                                    key={attackStep.stepIndex}
                                    className={cn(
                                        'select-none cursor-pointer [&>td]:p-1',
                                        attackStepIndexActive == attackStep.stepIndex && 'text-green-400'
                                    )}
                                    onClick={() => {
                                        if (!attackIdActive) {
                                            alert('you mush select attack collection to set attack index active');
                                            return;
                                        }
                                        dispatch(setAttackStepIndexActive({ attackId: attackIdActive, attackStepIndexActive: attackStep.stepIndex }));
                                    }}
                                >
                                    <TableCell className="_w-[10%]">{attackStep.stepIndex}</TableCell>
                                    <TableCell className=" text-nowrap">{attackStep.operationAttack.type}</TableCell>
                                    {attackStep.operationAttack.type === 'queen-move' ? (
                                        <TableCell>
                                            x: {attackStep.operationAttack.position.x} y: {attackStep.operationAttack.position.y}
                                        </TableCell>
                                    ) : (
                                        <TableCell>{attackStep.operationAttack.onBoardId.substring(0, 8)}</TableCell>
                                    )}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}

function ToglleDebugSpell() {
    const debugSpell = useAppSelector(getDebugSpell);
    const dispatch = useAppDispatch();
    return (
        <div className="flex items-center space-x-2 h-8">
            <Label
                className="text-xs text-nowrap"
                htmlFor="toglle-debug-spell"
            >
                debug spell?
            </Label>
            <Switch
                onCheckedChange={() => {
                    if (debugSpell === null) {
                        dispatch(setDebugSpell({ size: 4 }));
                    } else {
                        dispatch(setDebugSpell(null));
                    }
                }}
                checked={debugSpell !== null}
                className="[&>span[data-state='checked']]:bg-green-500 [&>span[data-state='unchecked']]:bg-purple-500"
                id="toglle-debug-spell"
            />
            {debugSpell && (
                <>
                    <Label
                        className="text-xs text-nowrap"
                        htmlFor="size-spell"
                    >
                        size spell
                    </Label>
                    <Input
                        type="number"
                        min={1}
                        max={10}
                        className="h-7 w-[70px] text-xs dark:bg-[#161618] bg-[#f6f6f7]"
                        defaultValue={debugSpell.size}
                        onChange={(e) => {
                            dispatch(setDebugSpell({ size: Number(e.target.value) }));
                        }}
                    />
                </>
            )}
        </div>
    );
}
