import { UniqueIdentifier } from '@dnd-kit/core';

export type NonUndefined<T> = T extends undefined ? never : T;
export type Id = UniqueIdentifier;
export type StandartRecord = Record<string, unknown>;

export type ItemData<I extends StandartRecord = {}> = I & {
    id: Id;
    title?: string;
    description?: string;
};

export type ColumnData<C extends StandartRecord = {}, I extends StandartRecord = {}> = C & {
    id: Id;
    title?: string;
    childrens: ItemData<I>[];
};

export type ColumnAdapter<C extends StandartRecord = {}, I extends StandartRecord = {}> = {
    [columnId: Id]: ColumnData<C, I>;
};

export type ColumnId<C extends StandartRecord = {}, I extends StandartRecord = {}> = keyof ColumnAdapter<C, I>;
