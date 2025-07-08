export type BaseEntity<R extends Record<any, any> = Record<any, any>> = {
    name: string;
    entityId: number;
    entityTypeId: number;
    entityTypeName: string;
    slug: string;
    imageUrlOriginal: string;
    imageUrl: string;
} & R;

export type Hero = BaseEntity<{ size: { w: number; h: number } }>;

export type Spell = BaseEntity<{ radius: number }>;

export type EntityOnBoard<R extends Record<any, any> = Record<any, any>> = {
    onBoardId: string;
    position: { x: number; y: number };
} & R;
