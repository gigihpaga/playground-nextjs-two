import { type CSSProperties } from 'react';
import { writeDataBuildingWithSize } from '../actions/building-preparation';

export interface CustomBoardBuildingCSS extends CSSProperties {
    '--url-image': `url(${string})`;
}

// export type DataBuildings = Awaited<ReturnType<typeof writeDataBuildingWithSize>>[number];
export type DataBuildings = Array<{
    name: string;
    entityId: number;
    entityTypeId: number;
    entityTypeName: string;
    slug: string;
    imageUrlOriginal: string;
    imageUrl: string;
    size: {
        w: number;
        h: number;
    };
}>;

export type DataBuilding = DataBuildings[number];

export type BuildingOnBoard = DataBuilding & {
    onBoardId: string;
    isDestructive: boolean;
    position: {
        x: number;
        y: number;
    };
};

export type LayoutCollection = {
    layoutId: string;
    name: string;
    buildingOnBoard: BuildingOnBoard[];
};

// export type BuildingOnArena = BuildingOnBoard & {};

export type QueenAttack = 'queen-move';
export type BuildingDestroy = 'building-destroy';

export type OperationAttack =
    | {
          type: QueenAttack;
          position: {
              x: number;
              y: number;
          };
      }
    | {
          type: BuildingDestroy;
          onBoardId: BuildingOnBoard['onBoardId'];
      };

export type AttackStep = {
    stepIndex: number;
    currentQueen: {
        x: number;
        y: number;
    };
    currentBuildings: BuildingOnBoard[];
    operationAttack: OperationAttack;
};

export type AttackCollection = {
    attackId: string;
    layoutId: LayoutCollection['layoutId'];
    attackStepIndexActive: number | null;
    attackSteps: AttackStep[];
};
