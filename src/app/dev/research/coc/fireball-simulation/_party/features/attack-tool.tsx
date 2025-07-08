'use client';

import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';

import { RotateCcwIcon } from 'lucide-react';

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
import { useZoomPanPinch } from '../components/zoom-pan-pinch-new';
import { calculateViewportCenterCoordinates } from '../utils';
import { SpellImage } from '../components/spell-image';

export default function AttackTool() {
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
        };
    }, shallow);
    const zoomPanPinchContext = useZoomPanPinch();

    // console.log(`refresh ${new Date()}`);
    const isAllEgesVisible = store.getLayoutEdgesVisibility(layoutActiveSelected);
    const targetFireball = store.getTargetFireBall(layoutActiveSelected);

    function handleAddInvisSpell() {
        if (!layoutActiveSelected) {
            console.error('cannot add invisible spell, because layout not selected');
            return;
        }
        const { wrapperComponent, contentComponent, transformState, getContext } = zoomPanPinchContext;
        // const { state } = getContext();
        const { positionX, positionY, scale, previousScale } = transformState;

        const center = calculateViewportCenterCoordinates({
            viewportWrapper: wrapperComponent,
            elementSize: spellInvisible.radius,
            tileSize: SIZE_SHAPE,
            positionX: positionX,
            positionY: positionY,
            scale: scale,
        });

        store.addSpell(layoutActiveSelected, 'invisibility', { x: center.x, y: center.y });
    }

    function handleAddEarthQuakeSpell() {
        if (!layoutActiveSelected) {
            console.error('cannot add earthquake spell, because layout not selected');
            return;
        }
        const { wrapperComponent, transformState } = zoomPanPinchContext;
        const { positionX, positionY, scale } = transformState;

        const center = calculateViewportCenterCoordinates({
            viewportWrapper: wrapperComponent,
            elementSize: spellEarthquake.radius,
            tileSize: SIZE_SHAPE,
            positionX: positionX,
            positionY: positionY,
            scale: scale,
        });

        store.addSpell(layoutActiveSelected, 'earthquake', { x: center.x, y: center.y });
    }

    function handleRefresh() {
        store.toggleRefresh();
    }
    // console.log('AttackTool:zoomPanPinchState', zoomPanPinchContext);

    return (
        <div>
            <Button
                title=" add invis spell"
                className="h-fit w-fit py-1 px-2 text-xs gap-x-[2px]"
                onClick={() => handleAddInvisSpell()}
            >
                {SpellImage.invisible}
                <p>(+1)</p>
            </Button>
            <Button
                title="add earthquake spell"
                className="h-fit w-fit py-1 px-2 text-xs gap-x-[2px]"
                onClick={() => handleAddEarthQuakeSpell()}
            >
                {SpellImage.earthquake}
                <p>(+1)</p>
            </Button>
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
            <Button
                title=" refresh"
                className="h-fit w-fit py-1 px-2 text-xs"
                onClick={() => handleRefresh()}
            >
                <RotateCcwIcon className="size-4" />
            </Button>
        </div>
    );
}
