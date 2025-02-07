'use client';

import { useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { addBuilding, getLayoutSelected, getModeLayoutBuilder, toggleModeBuilder } from '../state/layout-collection-slice';
import { DataBuildings } from '../types';

import { Table, TableCell, TableHead, TableHeader, TableRow, TableBody } from '@/components/ui/table';
import dataBuildingJson from '../data/data-building.json';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

export function TableBuilding() {
    const dataBuildings = useMemo(() => dataBuildingJson, []);
    const layoutActiveSelected = useAppSelector(getLayoutSelected);
    const modeLayoutBuilder = useAppSelector(getModeLayoutBuilder);

    return (
        <div className="overflow-hidden space-y-2">
            <ToggleModeBuilder />
            {modeLayoutBuilder === 'building' ? (
                <ActualTableBuilding
                    dataBuildings={dataBuildings}
                    layoutActiveSelected={layoutActiveSelected}
                />
            ) : modeLayoutBuilder === 'wall' ? (
                <div className="h-[50vh] overflow-y-auto">
                    <p className="text-xs text-muted-foreground">Click board to add wall</p>
                </div>
            ) : null}
        </div>
    );
}

function ToggleModeBuilder() {
    const modeLayoutBuilder = useAppSelector(getModeLayoutBuilder);
    const dispatch = useAppDispatch();
    return (
        <div className="flex items-center space-x-2">
            <Switch
                onCheckedChange={() => {
                    dispatch(toggleModeBuilder());
                }}
                checked={modeLayoutBuilder === 'building'}
                className="[&>span[data-state='checked']]:bg-green-500 [&>span[data-state='unchecked']]:bg-purple-500"
                id="builder-mode"
            />
            <Label
                className="text-xs"
                htmlFor="builder-mode"
            >
                {modeLayoutBuilder} mode
            </Label>
        </div>
    );
}

function ActualTableBuilding({ dataBuildings, layoutActiveSelected }: { dataBuildings: DataBuildings; layoutActiveSelected: string | null }) {
    const dispatch = useAppDispatch();
    const [textSearch, setTextSearch] = useState('');
    const dataBuildingsFiltered = dataBuildings.filter((d) => {
        if (!textSearch) return true;
        return d.name.toLowerCase().includes(textSearch.toLowerCase());
    });

    return (
        <div className="space-y-2">
            <div className="flex flex-col space-y-1 mx-1">
                <Label
                    className="text-xs"
                    htmlFor="search-building"
                >
                    Search Building
                </Label>
                <Input
                    className="h-7 text-xs dark:bg-[#161618] bg-[#f6f6f7]"
                    type="search"
                    id="search-building"
                    placeholder="Search building coc..."
                    value={textSearch}
                    onChange={(e) => setTextSearch(e.target.value)}
                />
            </div>
            <div className="overflow-hidden">
                <h2 className="font-bold">List of Building</h2>
                <p className="text-xs text-muted-foreground">Select layout and then select building to add building to the board</p>
                <div className="h-[50vh] overflow-y-auto">
                    <Table style={{ fontSize: '10px' }}>
                        <TableHeader>
                            <TableRow className="[&>th]:px-1">
                                <TableHead className="w-[20px]">ID</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Size</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {dataBuildingsFiltered.map((building) => (
                                <TableRow
                                    key={building.entityId}
                                    className="select-none cursor-pointer [&>td]:p-1"
                                    onClick={() => {
                                        if (!layoutActiveSelected) {
                                            alert('you mush select layout to edit buildings');
                                            return;
                                        }
                                        dispatch(addBuilding({ layoutId: layoutActiveSelected, building: building }));
                                    }}
                                >
                                    <TableCell className="font-medium">{building.entityId}</TableCell>
                                    <TableCell>{building.name}</TableCell>
                                    <TableCell>{`${building.size.w}x${building.size.h}`}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}
