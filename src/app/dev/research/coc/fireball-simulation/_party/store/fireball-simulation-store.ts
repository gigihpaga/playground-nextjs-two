import React from 'react';
import { createWithEqualityFn, type UseBoundStoreWithEqualityFn } from 'zustand/traditional';
import { type StoreApi } from 'zustand';
import { shallow } from 'zustand/shallow';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { nanoid } from '@reduxjs/toolkit';

import { type BuildingOnBoard, LayoutCollection } from '@/app/dev/research/coc/queen-charge/_party/types';
import { EntityOnBoard, Spell, Hero } from '../types';
import { heroWarden, spellEarthquake, spellInvisible } from '../constants';
import { generateEdge, getEntitySize, produceEdges } from '../utils';

/** Penggunaan Zustand dan Immer
 * Immer hanya relevan dan bekerja di dalam fungsi set()
 * immer hanya bekerja didalam method set(),
 * jadi didalam method set()
 * jangan mereturn sebuah value
 * (jika didalam method set() mereturn value, value tersebut akan di gunakan (zustand mereplace immer) oleh zustand dimana zustand akan bekerja dan akan menggunakan value tersbut untuk mereplace value hasil immer (JADINYA IMMER NGANGGUR !!))
 *
 * - Immer Beroperasi di Dalam set: Immer hanya peduli dan bekerja di dalam fungsi callback yang Anda berikan ke set. Di luar fungsi set, Immer tidak melakukan apa pun.
 * - early returns tidak mengganggu cara kerja Immer.
 * - return undefined (atau tidak return apa pun) di dalam callback set berarti tidak ada yang berubah di state, sehingga Immer dan Zustand tidak melakukan apa pun.
 * - early return bisa menghentikan pekerjaan immer jika tidak ada state yang di ubah
 * - early returns di luar set hanyalah cara standar untuk mengembalikan nilai undefined dari suatu fungsi.
 * - explicit me-return value undefinded adalah menggunakan (key "return" dan value: undefinded. contoh "return undefinded")
 * - implicit me-return adalah tidak menggunakan key "return" yang artinya adalah "void". didalam sebuah function tidak melakukan return value
 * - early return: contohnya "if (!attackState) return;" (untuk menghentikan eksekusi kode)
 * - Jangan melakukan return nilai lain di dalam callback set jika Anda ingin menggunakan Immer.
 * - return nilai di dalam set akan menimpa state yang telah diproses oleh Immer.
 * - Jika Anda secara sengaja melakukan return di dalam callback set, Immer akan diabaikan.
 * - early return (seperti if(!attackState) return;) itu aman karena tidak mengembalikan apa-apa (implisit return undefined), tidak menimpa state yang telah diproses oleh immer, jika menggunakan return undefinded maka immer tetap bekerja dengan baik dan state tetap di update
 *
 * ## Ilustrasi:
 * Bayangkan Immer adalah seorang tukang cat yang sedang mengecat dinding (state). Dia mengubah warna dinding sesuai dengan instruksi Anda. Kemudian, ada seorang bos (Zustand) yang datang setelah tukang cat selesai bekerja.
 * - Tanpa return: Bos melihat hasil kerja tukang cat dan mengatakan, "Bagus, dindingnya sudah dicat!" (state diupdate sesuai hasil kerja Immer).
 * - Dengan return { halo: "ABC" }: Bos melihat hasil kerja tukang cat, lalu memutuskan, "Ah, tidak, saya ingin menempelkan stiker besar bertuliskan 'ABC' di seluruh dinding!" (state ditimpa dengan nilai return, hasil kerja Immer diabaikan).
 * ## Rekomendasi:
 * - Pastikan tidak ada return nilai lain (selain undefined) di dalam callback set jika ingin memanfaatkan Immer.
 * - Gunakan early return untuk menghentikan eksekusi kode (seperti if(!attackState) return) itu baik dan akan tetap membuat immer bekerja dengan baik.
 */

// Define the new type for the Immer-compatible set function
type ImmerSet<T> = (
    partial: T | Partial<T> | ((state: T) => void | T | Partial<T>),
    replace?: boolean | undefined,
    action?: string | undefined
) => void;

export type FCEntityOnBoard = EntityOnBoard<Spell> | EntityOnBoard<Hero>;

const spellTypes = ['invisibility', 'earthquake'] as const;

export enum BoardType {
    SQUARE = 'square',
    DIAMOND = 'diamond',
}

export type SpellType = (typeof spellTypes)[number];

export type BuildingOnBoardLoacal = BuildingOnBoard & {
    /** default false, akan menjadi true jika terkena effect dari Invisibility Spell  */
    isColliding: boolean;
    /** default false, akan menjadi true jika terkena effect dari Earthquake Spell  */
    isShaked: boolean;
    /** default false, akan menjadi true jika terkena effect fireball  */
    isAffectedFireball: boolean;
};

export type EdgeProperty = {
    distance: number;
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    textX: number;
    textY: number;
};

export type Edge = {
    id: string;
    onBoardId: BuildingOnBoard['onBoardId'];
    stroke?: React.SVGAttributes<SVGLineElement>['stroke'];
    textColor?: React.SVGAttributes<SVGTextElement>['fill'];
    property: EdgeProperty;
};

type FireballAttackState = {
    layoutId: LayoutCollection['layoutId'];
    /**
     * default false,
     * secara default edges yang mempunya distance > target fireball tidak akan di tampilkan. ini hanya status untuk tampilan saja
     */
    isAllEdgesVisible: boolean;
    targetFireBall: null | BuildingOnBoard;
    /** data warden dan spell disimpan disini */
    entityOnBoard: FCEntityOnBoard[];
    /** data ini dari redux */
    buildingsOnBoardLocal: BuildingOnBoardLoacal[];
    edges: Edge[];
};

type FireballSimulationState = {
    /** @default false, hanya untuk memakasa re-render saja */
    refresh: boolean;
    /** @default false */
    paneDragging: boolean;
    wardenActionMode: null | 'search-target';
    attackState: FireballAttackState[];
    boardType: BoardType;
    setting: {
        user: {
            spellRadius: {
                invisibility: number;
                earthquake: number;
            };
            fireBallRadius: number;
        };
    };
};

type FireballSimulationAction = ReturnType<typeof fcAction>;

const fcInitialState: FireballSimulationState = {
    refresh: false,
    paneDragging: false,
    wardenActionMode: null,
    attackState: [],
    boardType: BoardType.SQUARE,
    setting: {
        user: {
            spellRadius: {
                invisibility: 4,
                earthquake: 4.7,
            },
            fireBallRadius: 6,
        },
    },
};

function fcAction(set: ImmerSet<FireballSimulationState>, get: () => FireballSimulationState) {
    /**
     * Fungsi helper untuk mencari attackState berdasarkan layoutId
     * @param state
     * @param layoutId
     * @returns
     */
    const findAttackStateByLayoutId = (state: FireballSimulationState, layoutId: FireballAttackState['layoutId']) => {
        return state.attackState.find((attack) => attack.layoutId === layoutId);
    };

    const findHeroWarden = (state: FireballSimulationState, layoutId: FireballAttackState['layoutId']) => {
        const attackState = findAttackStateByLayoutId(state, layoutId);
        if (attackState) {
            const heroWarden = attackState.entityOnBoard.find((e) => e.entityTypeName === 'hero');
            return heroWarden as EntityOnBoard<Hero> | undefined;
        }
    };

    /**
     * Fungsi helper untuk menghasilkan dan mengupdate edges
     * - update edges dengan cara re-generate edges lalu me-replace data edges yang sudah ada
     * @param attackState
     * @param heroWarden
     */
    const generateAndSetEdges = (attackState: FireballAttackState, heroWarden: FCEntityOnBoard) => {
        const targetFireball = attackState.targetFireBall;

        if (!heroWarden || !targetFireball) return;

        const buildingsOnBoard = attackState.buildingsOnBoardLocal.filter((bob) => bob.slug !== 'wall');

        const edges: Edge[] = produceEdges({ targetFireball: targetFireball, buildingsOnBoard, entityOnBoard: heroWarden }).map((edge, idx) => {
            const { onBoardId, ...properties } = edge;
            return {
                id: `${attackState.layoutId}-${onBoardId}-${idx}`,
                onBoardId: onBoardId,
                property: { ...properties },
            } satisfies Edge;
        });

        attackState.edges = edges;
    };
    /**
     * Helper internal untuk membuat dan menambahkan attackState baru jika belum ada.
     * Mencegah duplikasi kode antara addAttackState dan syncBuildingFromRedux.
     * @private
     */
    const createAndAddAttackState = (
        state: FireballSimulationState,
        layoutId: FireballAttackState['layoutId'],
        buildingsOnBoard: BuildingOnBoard[]
    ) => {
        const initialWarden: EntityOnBoard<Hero> = {
            ...heroWarden,
            onBoardId: `my-warden-in-${layoutId}`,
            position: { x: 0, y: 0 },
        };
        state.attackState.push({
            layoutId: layoutId,
            isAllEdgesVisible: false,
            targetFireBall: null,
            entityOnBoard: [initialWarden],
            buildingsOnBoardLocal: buildingsOnBoard.map((bob) => ({ ...bob, isColliding: false, isShaked: false, isAffectedFireball: false })),
            edges: [],
        });
    };

    return {
        toggleRefresh: () => {
            set((state) => {
                state.refresh = !state.refresh;
            });
        },
        setPaneDragging: (paneDragging: FireballSimulationState['paneDragging']) => {
            set((state) => {
                state.paneDragging = paneDragging;
            });
        },
        setWardenActionMode: (wardenActionMode: NonNullable<FireballSimulationState['wardenActionMode']>) => {
            set((state) => {
                state.wardenActionMode = wardenActionMode;
            });
        },
        resetWardenActionMode: () => {
            set((state) => {
                state.wardenActionMode = null;
            });
        },
        setTargetFireBall: (layoutId: FireballAttackState['layoutId'], targetFireBall: FireballAttackState['targetFireBall']) => {
            set((state) => {
                const attackState = findAttackStateByLayoutId(state, layoutId);
                console.log('store:setTargetFireBall jalan');
                if (attackState) {
                    // Update existing object
                    attackState.targetFireBall = targetFireBall;
                }
                // Jika layoutId tidak ditemukan, tidak melakukan apa pun (implicitly return void)
                // Jika layoutId tidak ditemukan, tidak melakukan apa pun.
                // Asumsi: attackState dengan layoutId ini harus sudah dibuat sebelumnya
            });
        },
        getTargetFireBall: (layoutId: FireballAttackState['layoutId'] | null) => {
            if (!layoutId) {
                return null;
            }
            const state = get();
            const attackState = findAttackStateByLayoutId(state, layoutId);
            if (attackState) {
                return attackState.targetFireBall;
            } else {
                return null;
            }
        },
        getAttackState: (layoutId: FireballAttackState['layoutId']) => {
            const state = get();
            const attackState = findAttackStateByLayoutId(state, layoutId);
            return attackState;
        },
        addAttackState: (layoutId: FireballAttackState['layoutId'], buildingsOnBoard: BuildingOnBoard[]) => {
            set((state) => {
                const attackState = findAttackStateByLayoutId(state, layoutId);
                if (!attackState) {
                    createAndAddAttackState(state, layoutId, buildingsOnBoard);
                }
            });
        },
        syncBuildingFromRedux: (layoutId: FireballAttackState['layoutId'], buildingsOnBoard: BuildingOnBoard[]) => {
            set((state) => {
                console.log('useFireballSimulationStore: syncBuildingFromRedux running...');
                const attackState = findAttackStateByLayoutId(state, layoutId);
                if (!attackState) {
                    createAndAddAttackState(state, layoutId, buildingsOnBoard);
                } else {
                    // disini attack state sudah ada jadi update buildingsOnBoardLocal saja. karena mungkin ada perubahan
                    const oldBuildings = attackState.buildingsOnBoardLocal;
                    const newBuildings = buildingsOnBoard.map((bob) => {
                        const oldBuilding = oldBuildings.find((oldBuild) => oldBuild.onBoardId === bob.onBoardId);
                        return {
                            ...bob,
                            isColliding: oldBuilding ? oldBuilding.isColliding : false,
                            isShaked: oldBuilding ? oldBuilding.isShaked : false,
                            isAffectedFireball: oldBuilding ? oldBuilding.isAffectedFireball : false,
                        };
                    });
                    attackState.buildingsOnBoardLocal = newBuildings;
                }
            });
        },
        getEntityOnBoard: (layoutId: FireballAttackState['layoutId']) => {
            const state = get();
            const attackState = findAttackStateByLayoutId(state, layoutId);
            if (attackState) {
                return attackState.entityOnBoard;
            } else {
                return [];
            }
        },
        updateEntityPosition: (payload: { layoutId: FireballAttackState['layoutId'] } & EntityOnBoard) => {
            set((state) => {
                const attackState = findAttackStateByLayoutId(state, payload.layoutId);
                if (attackState) {
                    const entityIndex = attackState.entityOnBoard.findIndex((eob) => eob.onBoardId === payload.onBoardId);
                    if (entityIndex !== -1) {
                        attackState.entityOnBoard[entityIndex].position.x = payload.position.x;
                        attackState.entityOnBoard[entityIndex].position.y = payload.position.y;
                    }
                }
            });
        },
        addSpell: (layoutId: FireballAttackState['layoutId'], typeSpell: SpellType, position?: FCEntityOnBoard['position']) => {
            set((state) => {
                const attackState = findAttackStateByLayoutId(state, layoutId);
                if (attackState) {
                    const defaultPosition = { x: 0, y: 0 };
                    if (typeSpell === 'invisibility') {
                        attackState.entityOnBoard.push({
                            ...spellInvisible,
                            onBoardId: 'INVISPEL_' + nanoid(),
                            position: position ? position : defaultPosition,
                        });
                    } else {
                        attackState.entityOnBoard.push({
                            ...spellEarthquake,
                            onBoardId: 'EARTSPEL_' + nanoid(),
                            position: position ? position : defaultPosition,
                        });
                    }
                }
            });
        },
        setBuildingsOnBoardLocal: (layoutId: FireballAttackState['layoutId'], buildingsOnBoardLocal: BuildingOnBoardLoacal[]) => {
            set((state) => {
                const attackState = findAttackStateByLayoutId(state, layoutId);
                if (attackState) {
                    attackState.buildingsOnBoardLocal = buildingsOnBoardLocal;
                }
            });
        },
        getBuildingsOnBoardLocal: (layoutId: FireballAttackState['layoutId']) => {
            const state = get();
            const attackState = findAttackStateByLayoutId(state, layoutId);
            if (attackState) {
                return attackState.buildingsOnBoardLocal;
            } else {
                return [];
            }
        },
        getEdges: (layoutId: FireballAttackState['layoutId']) => {
            const state = get();
            const attackState = findAttackStateByLayoutId(state, layoutId);
            if (attackState) {
                return attackState.edges;
            } else {
                return [];
            }
        },
        createEdges: (layoutId: FireballAttackState['layoutId']) => {
            set((state) => {
                const attackState = findAttackStateByLayoutId(state, layoutId);
                if (!attackState) return;

                const heroWarden = attackState.entityOnBoard.find((e) => e.entityTypeName === 'hero');
                if (!heroWarden) return;

                generateAndSetEdges(attackState, heroWarden);
            });
        },
        updateEdgesOnDragging: (layoutId: FireballAttackState['layoutId'], heroWarden: FCEntityOnBoard) => {
            set((state) => {
                const attackState = findAttackStateByLayoutId(state, layoutId);
                if (!attackState) return;

                generateAndSetEdges(attackState, heroWarden);
            });
        },
        clearEdges: (layoutId: FireballAttackState['layoutId']) => {
            set((state) => {
                const attackState = findAttackStateByLayoutId(state, layoutId);
                if (!attackState) return;
                attackState.edges = [];
            });
        },
        getLayoutEdgesVisibility: (layoutId: FireballAttackState['layoutId'] | null) => {
            const state = get();
            if (!layoutId) {
                return false;
            }
            const attackState = findAttackStateByLayoutId(state, layoutId);
            return attackState ? attackState.isAllEdgesVisible : false;
        },
        setLayoutEdgesVisibility: (layoutId: FireballAttackState['layoutId'], isVisible: FireballAttackState['isAllEdgesVisible']) => {
            set((state) => {
                const attackState = findAttackStateByLayoutId(state, layoutId);
                if (attackState) {
                    attackState.isAllEdgesVisible = isVisible;
                }
            });
        },
        setBoardType: (boardType: BoardType) => {
            set((state) => {
                state.boardType = boardType;
            });
        },
        setFireballRadius: (newFireballRadius: number) => {
            set((state) => {
                state.setting.user.fireBallRadius = newFireballRadius;
            });
        },
    };
}

export const useFireballSimulationStore = createWithEqualityFn<
    FireballSimulationState & FireballSimulationAction,
    [['zustand/devtools', never], ['zustand/immer', never]]
>(
    devtools(
        immer((set, get) => ({
            ...fcInitialState,
            ...fcAction(set, get),
        }))
    )
);

export { shallow };
