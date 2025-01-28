import React from 'react';
import { SortableContext, verticalListSortingStrategy, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { StandartRecord, ColumnAdapter, ColumnId, ItemData, ColumnData } from './types';
import { DroppableContainer } from './droppable-container';
import { PLACEHOLDER_ID } from './constants';
import { MultipleContainersProps } from './multiple-containers';

export type EachColumProps<C extends StandartRecord = {}, I extends StandartRecord = {}> = {
    // items: MultipleContainersProps['items'];
    columns: ColumnAdapter<C, I>;
    // dataItems:ItemData[]
    // containerIds: MultipleContainersProps['items'][keyof MultipleContainersProps['items']];
    // containerIds: (keyof MultipleContainersProps['items'])[];
    columnIds: ColumnId<C, I>[];
    isMinimal: MultipleContainersProps['isMinimal'];
    isVertical?: boolean;
    isSortingContainer: boolean;
    renderColumns: (eachColumProps: {
        // containerId: MultipleContainersProps['items'][keyof MultipleContainersProps['items']][number];
        // containerId: keyof MultipleContainersProps['column'];
        // columnId: ColumnId<C, I>;
        columnId: keyof EachColumProps<C, I>['columns'];
        indexContainer: number;
        // items: MultipleContainersProps['items'][keyof MultipleContainersProps['items']];
        // items: MultipleContainersProps['items'][keyof MultipleContainersProps['items']]['childrens'];
        dataItems: ItemData<I>[];
        dataColumn: ColumnData<C, I>;
    }) => React.ReactElement | React.ReactElement[];
    addColumFn?(): void;
};

export function EachColum<C extends StandartRecord = {}, I extends StandartRecord = {}>(_props: EachColumProps<C, I>) {
    const { columns, columnIds, isMinimal, isSortingContainer, isVertical = false, renderColumns, addColumFn } = _props;

    return (
        <SortableContext
            items={[...columnIds, PLACEHOLDER_ID]}
            strategy={isVertical ? verticalListSortingStrategy : horizontalListSortingStrategy}
        >
            {columnIds.map((columnId, indexContainer) => {
                return renderColumns({ columnId, indexContainer, dataColumn: columns[columnId], dataItems: columns[columnId].childrens });
            })}
            {isMinimal ? undefined : (
                <DroppableContainer
                    columnId={PLACEHOLDER_ID}
                    disabled={isSortingContainer}
                    // items={empty}
                    dataItems={[]}
                    onClick={addColumFn}
                    isPlaceholder
                >
                    + Add column
                </DroppableContainer>
            )}
        </SortableContext>
    );
}
