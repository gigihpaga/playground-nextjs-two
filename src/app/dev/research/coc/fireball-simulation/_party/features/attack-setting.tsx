'use client';

import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';

import { RotateCcwIcon, SaveIcon } from 'lucide-react';

import {
    addBuilding,
    addWall,
    deleteBuildingOnLayout,
    getLayoutSelected,
    getModeLayoutBuilder,
    selectBuildingOnBoard,
    selectWallOnBoard,
    updatePositonBuilding,
} from '@/app/dev/research/coc/queen-charge/_party/state/layout-collection-slice';
import { indicatorLine, SIZE_SHAPE } from '@/app/dev/research/coc/queen-charge/_party/constants';
import { shallow, useFireballSimulationStore, type FCEntityOnBoard } from '../store/fireball-simulation-store';

import { cn } from '@/lib/classnames';

import { spellEarthquake, spellInvisible } from '../constants';

import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useZoomPanPinch } from '../components/zoom-pan-pinch-new';
import { calculateViewportCenterCoordinates } from '../utils';
import { SpellImage } from '../components/spell-image';
import { Label } from '@/components/ui/label';
import React from 'react';

export default function AttackSetting() {
    const layoutActiveSelected = useAppSelector(getLayoutSelected);
    const store = useFireballSimulationStore((state) => {
        return {
            paneDragging: state.paneDragging,
            setPaneDragging: state.setPaneDragging,
            wardenActionMode: state.wardenActionMode,
            setWardenActionMode: state.setWardenActionMode,
            resetWardenActionMode: state.resetWardenActionMode,
            getTargetFireBall: state.getTargetFireBall,
            attackState: state.attackState,
            getAttackState: state.getAttackState,
            addAttackState: state.addAttackState,
            getEntityOnBoard: state.getEntityOnBoard,
            setTargetFireBall: state.setTargetFireBall,
            updateEntityPosition: state.updateEntityPosition,
            addSpell: state.addSpell,
            refresh: state.refresh,
            toggleRefresh: state.toggleRefresh,
            getLayoutEdgesVisibility: state.getLayoutEdgesVisibility,
            setLayoutEdgesVisibility: state.setLayoutEdgesVisibility,
            setting: state.setting,
            setFireballRadius: state.setFireballRadius,
        };
    }, shallow);
    const zoomPanPinchContext = useZoomPanPinch();

    // console.log(`refresh ${new Date()}`);
    const isAllEgesVisible = store.getLayoutEdgesVisibility(layoutActiveSelected);
    const targetFireball = store.getTargetFireBall(layoutActiveSelected);

    function handleOnChangeFireballRadius(event: React.ChangeEvent<HTMLInputElement>) {
        console.log('handleOnChangeFireballRadius', event.target.value, typeof event.target.value);
        store.setFireballRadius(Number(event.target.value));
    }

    return (
        <div>
            <div className="flex items-center space-x-1">
                <label
                    htmlFor={`${layoutActiveSelected || 'no-layout'}-checkbox-layoutedgesvisibility`}
                    className={cn(
                        'text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                        // !targetFireball && 'text-muted-foreground'
                    )}
                >
                    Is All Edges Visible?
                </label>
                <Checkbox
                    id={`${layoutActiveSelected || 'no-layout'}-checkbox-layoutedgesvisibility`}
                    // disabled={!targetFireball}
                    checked={isAllEgesVisible}
                    onCheckedChange={(checked) => {
                        if (!layoutActiveSelected) return;
                        store.setLayoutEdgesVisibility(layoutActiveSelected, checked === 'indeterminate' ? false : checked);
                    }}
                />
            </div>
            <div className="flex w-full max-w-sm items-center space-x-2">
                <Label
                    className="text-nowrap"
                    htmlFor="fireball-radius"
                >
                    Fireball radius
                </Label>
                <Input
                    id="fireball-radius"
                    value={store.setting.user.fireBallRadius}
                    type="number"
                    placeholder="4"
                    min={4}
                    max={6}
                    onChange={(e) => handleOnChangeFireballRadius(e)}
                />
                {/*    <Button type="submit">
                    <SaveIcon className="size-3" />
                </Button> */}
            </div>
        </div>
    );
}
