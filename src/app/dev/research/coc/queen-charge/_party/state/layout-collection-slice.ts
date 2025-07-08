import type { RootState } from '@/lib/redux/store';
import { createSlice, createSelector, current, nanoid, type PayloadAction } from '@reduxjs/toolkit';
import type { BuildingOnBoard, LayoutCollection, DataBuilding } from '../types';

type Layout = {
    id: number | string;
    title: string;
    description: string;
};

type ModeLayoutBuilder = 'building' | 'wall';

export type LayoutState = {
    layoutState: LayoutCollection[];
    layoutSelected: null | LayoutCollection['layoutId'];
    modeLayoutBuilder: ModeLayoutBuilder;
};

type PayloadLayoutId = LayoutState['layoutState'][number]['layoutId'];

type PayloadAddLayout = {
    name: LayoutCollection['name'];
};

type PayloadUpdatePosition = {
    layoutId: LayoutCollection['layoutId'];
    onBoardId: LayoutCollection['buildingOnBoard'][number]['onBoardId'];
    x: LayoutCollection['buildingOnBoard'][number]['position']['x'];
    y: LayoutCollection['buildingOnBoard'][number]['position']['y'];
};

type PayloadDeleteBuildingOnLayout = {
    layoutId: LayoutCollection['layoutId'];
    onBoardId: LayoutCollection['buildingOnBoard'][number]['onBoardId'];
};

type PayloadAddBuilding = {
    layoutId: LayoutCollection['layoutId'];
    building: BuildingOnBoard;
};

const initialState = {
    layoutState: [],
    layoutSelected: null,
    modeLayoutBuilder: 'building',
} satisfies LayoutState as LayoutState;

const cocLayoutCollectionSlice = createSlice({
    name: 'queen-charge:layout-collection',
    initialState,
    reducers: {
        setInitialLayout: (state, action: PayloadAction<LayoutCollection[]>) => {
            return { layoutState: action.payload, layoutSelected: null, modeLayoutBuilder: 'building' };
        },
        migrateLayoutCollection: (state, action: PayloadAction<Omit<LayoutState, 'modeLayoutBuilder'>>) => {
            return {
                ...state,
                layoutSelected: action.payload.layoutSelected,
                layoutState: action.payload.layoutState,
            };
        },
        addLayout: {
            reducer: (state, action: PayloadAction<LayoutCollection>) => {
                state.layoutState.push(action.payload);
            },
            prepare: (name: LayoutCollection['name']) => {
                const newData = {
                    layoutId: 'LC_' + nanoid(),
                    name: name,
                    buildingOnBoard: [],
                } satisfies LayoutCollection as LayoutCollection;

                return { payload: newData };
            },
        },
        deleteLayout: (state, action: PayloadAction<PayloadLayoutId>) => {
            const newLayout = state.layoutState.filter((layout) => layout.layoutId !== action.payload);
            // state.layoutState = newLayout;
            return {
                ...state,
                layoutState: newLayout,
                layoutSelected: null,
            };
        },
        setLayoutSelected: (state, action: PayloadAction<LayoutState['layoutSelected']>) => {
            return {
                ...state,
                layoutSelected: action.payload,
            } satisfies LayoutState;
        },
        addBuilding: {
            reducer: (state, action: PayloadAction<PayloadAddBuilding>) => {
                const { layoutId, building } = action.payload;
                const layoutIndex = state.layoutState.findIndex((layout) => layout.layoutId == layoutId);
                if (layoutIndex !== -1) {
                    state.layoutState[layoutIndex].buildingOnBoard.push(building);
                }
            },
            prepare: (p: { layoutId: LayoutCollection['layoutId']; building: DataBuilding; position?: BuildingOnBoard['position'] }) => {
                const newBuilding = {
                    layoutId: p.layoutId,
                    building: {
                        ...p.building,
                        onBoardId: 'BL_' + nanoid(),
                        isDestructive: false,
                        position: p.position ?? { x: 0, y: 0 },
                    },
                } satisfies PayloadAddBuilding as PayloadAddBuilding;

                return {
                    payload: newBuilding,
                };
            },
        },
        addWall: {
            reducer: (state, action: PayloadAction<PayloadAddBuilding>) => {
                const { layoutId, building } = action.payload;
                const layoutIndex = state.layoutState.findIndex((layout) => layout.layoutId == layoutId);
                if (layoutIndex !== -1) {
                    state.layoutState[layoutIndex].buildingOnBoard.push(building);
                }
            },
            prepare: (p: { layoutId: LayoutCollection['layoutId']; building: DataBuilding; position: { x: number; y: number } }) => {
                const newBuilding = {
                    layoutId: p.layoutId,
                    building: {
                        ...p.building,
                        onBoardId: 'WL_' + nanoid(),
                        isDestructive: false,
                        position: { x: p.position.x, y: p.position.y },
                    },
                } satisfies PayloadAddBuilding as PayloadAddBuilding;

                return {
                    payload: newBuilding,
                };
            },
        },
        updatePositonBuilding: (state, action: PayloadAction<PayloadUpdatePosition>) => {
            const { layoutId, onBoardId, x, y } = action.payload;
            const layoutIndex = state.layoutState.findIndex((layout) => layout.layoutId == layoutId);
            if (layoutIndex !== -1) {
                const buildingOnBoardIndex = state.layoutState[layoutIndex].buildingOnBoard.findIndex((bob) => bob.onBoardId == onBoardId);
                if (buildingOnBoardIndex !== -1) {
                    state.layoutState[layoutIndex].buildingOnBoard[buildingOnBoardIndex].position = { x: x, y: y };
                }
            }
        },
        deleteBuildingOnLayout: (state, action: PayloadAction<PayloadDeleteBuildingOnLayout>) => {
            const layoutId = action.payload.layoutId;
            const onBoardId = action.payload.onBoardId;
            const layoutIndex = state.layoutState.findIndex((layout) => layout.layoutId === layoutId);
            if (layoutIndex !== -1) {
                const buildingOnBoardIndex = state.layoutState[layoutIndex].buildingOnBoard.findIndex((bob) => bob.onBoardId === onBoardId);
                if (buildingOnBoardIndex !== -1) {
                    state.layoutState[layoutIndex].buildingOnBoard.splice(buildingOnBoardIndex, 1);
                }
            }
        },
        toggleModeBuilder: (state) => {
            return {
                ...state,
                modeLayoutBuilder: state.modeLayoutBuilder === 'building' ? 'wall' : 'building',
            };
        },
    },
});

//* Core
export const {
    //
    migrateLayoutCollection,
    addLayout,
    deleteLayout,
    addBuilding,
    addWall,
    updatePositonBuilding,
    setLayoutSelected,
    deleteBuildingOnLayout,
    toggleModeBuilder,
} = cocLayoutCollectionSlice.actions;

export const cocLayoutCollectionReducer = cocLayoutCollectionSlice.reducer;

//? Extra Selector

export function selectAllLayout(state: RootState) {
    return state.cocLayoutCollection.layoutState;
}

export function selectLayoutById(state: RootState, layoutId: LayoutCollection['layoutId'] | null) {
    if (layoutId) {
        const finded = state.cocLayoutCollection.layoutState.filter((layout) => layout.layoutId == layoutId);
        return finded;
    } else {
        return [];
    }
}

export const selectBuildingOnBoard = createSelector(
    [
        selectAllLayout,
        function (state: RootState, layoutId: LayoutCollection['layoutId'] | null) {
            return layoutId;
        },
    ],
    (layouts, layoutId) => {
        if (layoutId) {
            const layoutFound = layouts.find((layout) => layout.layoutId == layoutId);
            if (!layoutFound) return [];
            return layoutFound.buildingOnBoard;
        } else {
            return [];
        }
    }
);

export const selectWallOnBoard = createSelector(
    [
        selectAllLayout,
        function (state: RootState, layoutId: LayoutCollection['layoutId'] | null) {
            return layoutId;
        },
    ],
    (layouts, layoutId) => {
        if (layoutId) {
            const layoutFound = layouts.find((layout) => layout.layoutId == layoutId);
            if (!layoutFound) return [];
            return layoutFound.buildingOnBoard.filter((building) => building.slug === 'wall');
        } else {
            return [];
        }
    }
);

export function getLayoutSelected(state: RootState) {
    return state.cocLayoutCollection.layoutSelected;
}

export function getModeLayoutBuilder(state: RootState) {
    return state.cocLayoutCollection.modeLayoutBuilder;
}

export const selectLayoutByTitle = createSelector(
    [
        selectAllLayout,
        function (state: RootState, name: LayoutCollection['name']) {
            return name;
        },
    ],
    function (layouts, name) {
        return layouts.filter((layout) => layout.name === name);
    }
);
