import React from 'react';
import { SortingStrategy, verticalListSortingStrategy, SortableContext } from '@dnd-kit/sortable';
import { StandartRecord, ItemData } from './types';

export type EachItemProps<I extends StandartRecord = {}> = {
    // items: UniqueIdentifier[];
    // items: MultipleContainersProps['column'][keyof MultipleContainersProps['column']]['childrens'];
    dataItems: ItemData<I>[];
    strategy?: SortingStrategy;
    renderList(props: { dataItem: ItemData<I>; itemIndex: number }): React.ReactElement | React.ReactElement[];
};

export function EachItem<I extends StandartRecord = {}>(_props: EachItemProps<I>) {
    const { dataItems, strategy = verticalListSortingStrategy, renderList } = _props;

    return (
        <SortableContext
            items={dataItems}
            strategy={strategy}
        >
            {dataItems.map((dataItem, index) => {
                return renderList({
                    dataItem,
                    itemIndex: index,
                });
            })}
        </SortableContext>
    );
}
