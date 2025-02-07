import type { RootState } from '@/lib/redux/store';
import { createSlice, createSelector, current, nanoid, type PayloadAction } from '@reduxjs/toolkit';
import type { AttackCollection, AttackStep, BuildingDestroy, OperationAttack, QueenAttack } from '../types';
// import { createSelector } from 'reselect';
import { getLayoutSelected } from './layout-collection-slice';

export type AttackState = {
    attacCollectionkState: AttackCollection[];
    attackIdActive: null | AttackCollection['attackId'];
    debugSpell: null | { size: number };
};

type PayloadAdd = {
    layoutId: AttackCollection['layoutId'];
    layoutBuildings: AttackCollection['attackSteps'][number]['currentBuildings'];
};
type PayloadAttackId = AttackCollection['attackId'];

const initialState = {
    attacCollectionkState: [],
    attackIdActive: null,
    debugSpell: null,
} satisfies AttackState as AttackState;

const cocAttackCollectionSlice = createSlice({
    name: 'queen-charge:attack-collection',
    initialState,
    reducers: {
        migrateAttackCollection: (state, action: PayloadAction<Omit<AttackState, 'debugSpell'>>) => {
            return {
                ...state,
                attacCollectionkState: action.payload.attacCollectionkState,
                attackIdActive: action.payload.attackIdActive,
            };
        },
        addAttackCollection: {
            reducer: (state, action: PayloadAction<AttackCollection>) => {
                state.attacCollectionkState.push(action.payload);
            },
            prepare: (p: PayloadAdd) => {
                const newData = {
                    attackId: 'AC_' + nanoid(),
                    layoutId: p.layoutId,
                    attackStepIndexActive: null,
                    attackSteps: [
                        {
                            stepIndex: 0,
                            currentQueen: {
                                x: 0,
                                y: 0,
                            },
                            currentBuildings: p.layoutBuildings,
                            operationAttack: {
                                type: 'queen-move',
                                position: {
                                    x: 0,
                                    y: 0,
                                },
                            },
                        },
                    ],
                } satisfies AttackCollection as AttackCollection;

                return { payload: newData };
            },
        },

        deleteAttackCollection: (state, action: PayloadAction<PayloadAttackId>) => {
            const newAttack = state.attacCollectionkState.filter((attack) => attack.attackId !== action.payload);
            // state.attacCollectionkState = newAttack;
            // state.attackSelected = null;
            return {
                attacCollectionkState: newAttack,
                attackIdActive: null,
                debugSpell: state.debugSpell,
            };
        },

        setAttackSelected: (state, action: PayloadAction<AttackState['attackIdActive']>) => {
            return {
                ...state,
                attackIdActive: action.payload,
            } satisfies AttackState;
        },

        toggleBuildingDestructive: (state, action: PayloadAction<{ attackId: string; onBoardId: string }>) => {
            const { attackId, onBoardId } = action.payload;
            const attackIndex = state.attacCollectionkState.findIndex((attack) => attack.attackId === attackId);

            //filter attack id
            if (attackIndex !== -1) {
                const lengthAttackStep = state.attacCollectionkState[attackIndex].attackSteps.length;
                const currentBuildings = state.attacCollectionkState[attackIndex].attackSteps[lengthAttackStep - 1].currentBuildings;
                const currentBuildingIndex = currentBuildings.findIndex((building) => building.onBoardId === onBoardId);

                // filter attack id
                if (currentBuildingIndex !== -1) {
                    // console.log(current(state.attackState[attackIndex].attackStep[lengthAttackStep - 1].currentBuilding));
                    const currentDestructive = currentBuildings[currentBuildingIndex].isDestructive;

                    state.attacCollectionkState[attackIndex].attackSteps[lengthAttackStep - 1].currentBuildings[currentBuildingIndex].isDestructive =
                        !currentDestructive;
                }
            }
        },

        nextStepAttack: (state, action: PayloadAction<{ attackId: AttackCollection['attackId']; dataAttack: OperationAttack }>) => {
            const { attackId, dataAttack } = action.payload;
            const attackCollectionIndex = state.attacCollectionkState.findIndex((ac) => ac.attackId === attackId);
            if (attackCollectionIndex !== -1) {
                const attackSteps = state.attacCollectionkState[attackCollectionIndex].attackSteps;
                const lastAttackStep = attackSteps.slice(-1)[0];

                if (dataAttack.type === 'building-destroy') {
                    const { onBoardId, type } = dataAttack;
                    const newData = {
                        ...lastAttackStep,
                        stepIndex: attackSteps.length,
                        operationAttack: { ...dataAttack },
                        currentBuildings: lastAttackStep.currentBuildings.map((building) => {
                            if (building.onBoardId === onBoardId) {
                                return {
                                    ...building,
                                    isDestructive: true,
                                };
                            } else {
                                return building;
                            }
                        }),
                    } satisfies AttackStep as AttackStep;
                    state.attacCollectionkState[attackCollectionIndex].attackSteps.push(newData);
                } else if (dataAttack.type === 'queen-move') {
                    const { x, y } = dataAttack.position;
                    const newData = {
                        ...lastAttackStep,
                        stepIndex: attackSteps.length,
                        currentQueen: {
                            x: x,
                            y: y,
                        },
                        operationAttack: { ...dataAttack },
                    } satisfies AttackStep as AttackStep;
                    state.attacCollectionkState[attackCollectionIndex].attackSteps.push(newData);
                }
            }
        },
        setAttackStepIndexActive: (
            state,
            action: PayloadAction<{
                attackId: AttackCollection['attackId'];
                attackStepIndexActive: AttackCollection['attackStepIndexActive'];
            }>
        ) => {
            const { attackId, attackStepIndexActive } = action.payload;
            const attackIndex = state.attacCollectionkState.findIndex((attack) => attack.attackId === attackId);
            if (attackIndex !== -1) {
                state.attacCollectionkState[attackIndex].attackStepIndexActive = attackStepIndexActive;
            }
        },
        deleteLastHistoryAttack: (state, action: PayloadAction<{ attackId: AttackCollection['attackId'] }>) => {
            const { attackId } = action.payload;
            const attackCollectionIndex = state.attacCollectionkState.findIndex((ac) => ac.attackId === attackId);
            if (attackCollectionIndex !== -1) {
                const attackSteps = state.attacCollectionkState[attackCollectionIndex].attackSteps;
                const attackStepsNew = attackSteps.slice(0, attackSteps.length - 1);
                state.attacCollectionkState[attackCollectionIndex].attackSteps = attackStepsNew;
            }
        },
        setDebugSpell: (state, action: PayloadAction<{ size: number } | null>) => {
            return {
                ...state,
                debugSpell: action.payload,
            } satisfies AttackState;
        },
    },
});

export const {
    //
    migrateAttackCollection,
    addAttackCollection,
    setAttackSelected,
    deleteAttackCollection,
    toggleBuildingDestructive,
    nextStepAttack,
    setAttackStepIndexActive,
    deleteLastHistoryAttack,
    setDebugSpell,
} = cocAttackCollectionSlice.actions;

export function selectAllAttacks(state: RootState) {
    return state.cocAttackCollection.attacCollectionkState;
}

export function getAttackIdActive(state: RootState) {
    return state.cocAttackCollection.attackIdActive;
}

export function getAttackStepIndexActive(state: RootState, attackId: AttackCollection['attackId'] | null) {
    if (typeof attackId !== 'string') return null;
    const attacCollection = state.cocAttackCollection.attacCollectionkState.find((attackCollection) => attackCollection.attackId == attackId);
    if (!attacCollection) return null;

    return attacCollection.attackStepIndexActive;
}

export const selectAttackStep = createSelector(
    [
        selectAllAttacks,
        getAttackIdActive,
        getAttackStepIndexActive,
        /*
        function (state: RootState, attackId: AttackCollection['attackId'] | null, attackStepIndexActive: AttackCollection['attackStepIndexActive']) {
            return { attackId, attackStepIndexActive };
        },
        */
    ],

    (attacks, attackId, attackStepIndexActive) => {
        if (typeof attackId === 'string') {
            const attacCollection = attacks.find((attack) => attack.attackId === attackId);
            if (!attacCollection) return null;

            if (typeof attackStepIndexActive === 'number') {
                //* attack step by index
                const attackStepByIndex = attacCollection.attackSteps.find((attackStep) => attackStep.stepIndex === attackStepIndexActive);
                if (!attackStepByIndex) return null;
                return attackStepByIndex;
            } else {
                //* attack step by last
                const lastAttackStep = attacCollection.attackSteps.slice(-1)[0] as AttackStep | undefined;
                if (!lastAttackStep) return null;
                return lastAttackStep;
            }
        } else {
            return null;
        }
    }
);

export const selectAttackStepAll = createSelector(
    [
        selectAllAttacks,
        function (state: RootState, attackId: AttackCollection['attackId'] | null) {
            return attackId;
        },
    ],
    (attacks, attackId) => {
        if (typeof attackId === 'string') {
            const attacCollection = attacks.find((attack) => attack.attackId === attackId);
            if (!attacCollection) return [];

            return attacCollection.attackSteps;
        } else {
            return [];
        }
    }
);

export function getDebugSpell(state: RootState) {
    return state.cocAttackCollection.debugSpell;
}

export const cocAttackCollectionReducer = cocAttackCollectionSlice.reducer;
