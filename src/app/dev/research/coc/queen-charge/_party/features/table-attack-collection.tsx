'use client';

import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { getLayoutSelected, selectBuildingOnBoard } from '../state/layout-collection-slice';
import { addAttackCollection, deleteAttackCollection, getAttackIdActive, selectAllAttacks, setAttackSelected } from '../state/attack-collection-slice';

import { Table, TableCell, TableHead, TableHeader, TableRow, TableBody } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Trash2Icon } from 'lucide-react';
import { cn } from '@/lib/classnames';

export function TableAttackCollection() {
    const attackCollection = useAppSelector(selectAllAttacks);
    const layoutActiveSelected = useAppSelector(getLayoutSelected);
    const attackActiveSelected = useAppSelector(getAttackIdActive);
    const buildingOnBoard = useAppSelector((state) => selectBuildingOnBoard(state, layoutActiveSelected));
    const dispatch = useAppDispatch();
    return (
        <div className="space-y-2">
            <p className="text-xs">
                Attack active: <br />
                <span className={cn('font-bold underline text-green-300', attackActiveSelected === null && 'text-red-400')}>
                    {attackActiveSelected ?? 'attack id not selected'}
                </span>
            </p>
            <Button
                onClick={() => {
                    if (!layoutActiveSelected) {
                        alert('Select layout first ');
                        return;
                    }
                    dispatch(addAttackCollection({ layoutId: layoutActiveSelected, layoutBuildings: buildingOnBoard }));
                }}
                variant="outline"
                size="sm"
                className="w-full"
                data-tooltip="create new attack collection"
            >
                Create new
            </Button>
            <div className="overflow-hidden">
                <h2 className="font-bold">List of Attack Collections</h2>
                <p className="text-xs text-muted-foreground">Select attack to set attack active</p>
                <div className="h-[50vh] overflow-y-auto">
                    <Table style={{ fontSize: '10px' }}>
                        <TableHeader>
                            <TableRow className="[&>th:last-child]:text-right [&>th]:px-1">
                                <TableHead className="w-[70px]">ID Attack</TableHead>
                                <TableHead>ID Layout</TableHead>
                                <TableHead className="w-[50px]">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {attackCollection.map((attack) => (
                                <TableRow
                                    key={attack.attackId}
                                    className={cn(
                                        'select-none cursor-pointer [&>td]:p-1 [&>td:last-child]:text-right',
                                        attackActiveSelected === attack.attackId && 'text-green-400'
                                    )}
                                    onClick={() => {
                                        // if (!layoutActiveSelected) {
                                        //     alert('you must select layout to edit buildis');
                                        //     return;
                                        // }
                                        dispatch(setAttackSelected(attack.attackId));
                                    }}
                                >
                                    <TableCell className="font-medium">{attack.attackId.substring(0, 8)}</TableCell>
                                    <TableCell>{attack.layoutId.substring(0, 8)}</TableCell>
                                    <TableCell className="font-medium">
                                        <Button
                                            variant="destructive"
                                            size="icon"
                                            className="size-5"
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                dispatch(deleteAttackCollection(attack.attackId));
                                            }}
                                        >
                                            <Trash2Icon className="size-3" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}
