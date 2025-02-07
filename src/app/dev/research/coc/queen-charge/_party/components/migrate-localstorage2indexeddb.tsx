'use client';

import { FolderSyncIcon } from 'lucide-react';

import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';

import { Button } from '@/components/ui/button';
import { migrateAttackCollection, type AttackState } from '../state/attack-collection-slice';
import { migrateLayoutCollection, type LayoutState } from '../state/layout-collection-slice';
import type { AttackCollection, AttackStep, LayoutCollection, BuildingDestroy, OperationAttack, QueenAttack } from '../types';

export function MigrateAttackLocalstorage2Indexeddb() {
    const dispatch = useAppDispatch();

    const attacStateString = window?.localStorage.getItem('persist:cocAttackCollection');
    const attacStateObj = JSON.parse(attacStateString!) as AttackState;

    const attacCollectionkState = JSON.parse(attacStateObj.attacCollectionkState as unknown as string) as AttackCollection[];
    const attackIdActive = attacStateObj.attackIdActive;

    function handleClick() {
        dispatch(
            migrateAttackCollection({
                attacCollectionkState: attacCollectionkState,
                attackIdActive: attackIdActive,
            })
        );
    }

    return (
        <div className="w-full flex justify-between">
            <span className="text-2xs">Migrate Attack Collection Localstorage to IndexedDB</span>
            <Button
                title="migrate topic from localStorage to indexedDB"
                className="w-fit h-fit p-1"
                onClick={() => handleClick()}
            >
                <FolderSyncIcon className="size-[10px]" />
            </Button>
        </div>
    );
}

export function MigrateLayoutLocalstorage2Indexeddb() {
    const dispatch = useAppDispatch();

    const layoutStateString = window?.localStorage.getItem('persist:cocLayoutCollection');
    const layoutStateObj = JSON.parse(layoutStateString!) as LayoutState;

    console.log(layoutStateObj);

    const layoutCollectionkState = JSON.parse(layoutStateObj.layoutState as unknown as string) as LayoutCollection[];
    const layoutIdActive = layoutStateObj.layoutSelected;

    function handleClick() {
        dispatch(
            migrateLayoutCollection({
                layoutState: layoutCollectionkState,
                layoutSelected: layoutIdActive,
            })
        );
    }

    return (
        <div className="w-full flex justify-between">
            <span className="text-2xs">Migrate Layout Localstorage to IndexedDB</span>
            <Button
                title="migrate topic from localStorage to indexedDB"
                className="w-fit h-fit p-1"
                onClick={() => handleClick()}
            >
                <FolderSyncIcon className="size-[10px]" />
            </Button>
        </div>
    );
}
