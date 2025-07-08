import { createSlice, createSelector, current, nanoid, type PayloadAction } from '@reduxjs/toolkit';
import { formatISO } from 'date-fns';

import type { RootState } from '@/lib/redux/store';
import { Clock, Club, HistoryQuestClub, DailyQuestIncome, WalletEntry } from '../types';
import { clubs } from './data';

export type CarxGrindingState = {
    /** club adalah master (crud) */
    club: Club[];
    /** historyQuestClub untuk menyimpan data quest yang telah diselesaikan, data ini berkarakter temporary (akan dihapus setelah konsolidadi ke dailyQuestIncome)*/
    historyQuestClub: HistoryQuestClub[];
    /** dailyQuestIncome hasil dari konsolidasi/roll-up dari historyQuestClub, logika konsolidasi dari historyQuestClub dengan grouping tanggal yang sama */
    dailyQuestIncome: DailyQuestIncome[];
    wallet: WalletEntry[];
    setting: {
        clock: Clock;
    };
};

type PayloadClubId = Club['id'];
type PayloadAddClub = Omit<Club, 'id'>;
type PayloadWalletId = WalletEntry['id'];
type PayloadAddWallet = Omit<WalletEntry, 'id' | 'createdAt'>;
type PayloadHistoryQuestClubId = HistoryQuestClub['id'];
type PayloadDailyQuestIncomeid = DailyQuestIncome['id'];

const initialState: CarxGrindingState = {
    club: clubs,
    historyQuestClub: [],
    dailyQuestIncome: [],
    wallet: [],
    setting: {
        clock: {
            anchorReal: '2025-07-03T20:00:00.000Z',
            anchorInGameHour: 6,
            dailyCycleRealMinutes: 50,
        },
    },
};

const carxGrindingSlice = createSlice({
    name: 'carx:grinding',
    initialState: initialState,
    reducers: {
        addClub: {
            reducer: (state, action: PayloadAction<Club>) => {
                state.club.push(action.payload);
            },
            prepare: (dataClub: PayloadAddClub) => {
                const newData = {
                    id: 'CLB_' + nanoid(6),
                    ...dataClub,
                };

                return { payload: newData };
            },
        },
        updateClub: (state, action: PayloadAction<Club>) => {
            const { id, ...restClub } = action.payload;
            const clubIndex = state.club.findIndex((club) => club.id === id);
            if (clubIndex !== -1) {
                state.club[clubIndex] = { id, ...restClub };
            }
        },
        deleteClub: (state, action: PayloadAction<PayloadClubId | PayloadClubId[]>) => {
            const idsToDelete = action.payload;
            if (typeof idsToDelete === 'string') {
                const newClub = state.club.filter((club) => club.id !== idsToDelete);
                return {
                    ...state,
                    club: newClub,
                };
            } else {
                const newClub = state.club.filter((club) => !idsToDelete.includes(club.id));
                state.club = newClub;
            }
        },
        addHistoryQuestClub: {
            reducer: (state, action: PayloadAction<HistoryQuestClub>) => {
                state.historyQuestClub.push(action.payload);
            },
            prepare: (params: { idClub: PayloadClubId; isWin: HistoryQuestClub['isWin'] }) => {
                const newData: HistoryQuestClub = {
                    id: 'HQC_' + nanoid(5),
                    idClub: params.idClub,
                    timeOn: new Date().toISOString(),
                    isWin: params.isWin,
                };

                return { payload: newData };
            },
        },
        updateHistoryQuestClub: (state, action: PayloadAction<HistoryQuestClub>) => {
            const { id, ...restHistoryQuestClub } = action.payload;
            const historyIndex = state.historyQuestClub.findIndex((history) => history.id === id);
            if (historyIndex !== -1) {
                state.historyQuestClub[historyIndex] = { id, ...restHistoryQuestClub };
            }
        },
        deleteHistoryQuestClub: (state, action: PayloadAction<PayloadHistoryQuestClubId | PayloadHistoryQuestClubId[]>) => {
            const idsToDelete = action.payload;
            if (typeof idsToDelete === 'string') {
                const newHistory = state.historyQuestClub.filter((history) => history.id !== idsToDelete);
                return {
                    ...state,
                    historyQuestClub: newHistory,
                };
            } else {
                const newHistory = state.historyQuestClub.filter((history) => !idsToDelete.includes(history.id));
                state.historyQuestClub = newHistory;
            }
        },
        adjustNextQuestTime: (state, action: PayloadAction<{ idClub: PayloadClubId; duration: number }>) => {
            const { idClub, duration } = action.payload;
            const clubIndex = state.club.findIndex((club) => club.id === idClub);
            if (clubIndex !== -1) {
                const questHistoryIndex = state.historyQuestClub.findIndex((historyQuest) => historyQuest.idClub === idClub);

                const club = state.club[clubIndex];

                const newTimeOnDuration = duration >= club.quest.cooldownTime ? 0 : club.quest.cooldownTime - duration;
                const newTimeOn = new Date(new Date().getTime() - new Date(newTimeOnDuration).getTime()).toISOString();

                if (questHistoryIndex !== -1) {
                    // edit lastest history by idClub
                    const historiesUpdated = updateLatestHistoryByIdClub({
                        histories: state.historyQuestClub,
                        idClub: idClub,
                        newData: { timeOn: newTimeOn },
                    });

                    state.historyQuestClub = historiesUpdated;
                }
                /** 
                else {
                    // add new history
                    const newData: HistoryQuestClub = {
                        id: 'HQC_' + nanoid(),
                        idClub: idClub,
                        timeOn: newTimeOn,
                    };
                    state.historyQuestClub.push(newData);
                }
                */
            }
        },
        addWalletEntry: {
            reducer: (state, action: PayloadAction<WalletEntry>) => {
                state.wallet.push(action.payload);
            },
            prepare: (dataWallet: PayloadAddWallet) => {
                const newData: WalletEntry = {
                    ...dataWallet,
                    id: 'WCS_' + nanoid(6),
                    createdAt: new Date().toISOString(),
                };

                return { payload: newData };
            },
        },
        updateWalletEntry: (state, action: PayloadAction<WalletEntry>) => {
            const { id, ...restWallet } = action.payload;
            const walletIndex = state.wallet.findIndex((wallet) => wallet.id === id);
            if (walletIndex !== -1) {
                state.wallet[walletIndex] = { id: id, ...restWallet };
            }
        },
        deleteWalletEntry: (state, action: PayloadAction<PayloadWalletId | PayloadWalletId[]>) => {
            const idsToDelete = action.payload;
            if (typeof idsToDelete === 'string') {
                const newWalletEntry = state.wallet.filter((wallet) => wallet.id !== idsToDelete);
                return {
                    ...state,
                    wallet: newWalletEntry,
                };
            } else {
                const newWalletEntry = state.wallet.filter((wallet) => !idsToDelete.includes(wallet.id));
                state.wallet = newWalletEntry;
            }
        },
        rollupDailyQuestIncome: (state) => {
            // 1. Group state.historyQuestClub by date (from timeOn)
            const newDailyIncomes = processRollUpDailyQuestIncome({ club: state.club, historyQuestClub: state.historyQuestClub });
            // 2. Jika ada hasil roll-up
            if (newDailyIncomes.length > 0) {
                for (const newEntry of newDailyIncomes) {
                    const newDate = new Date(newEntry.rangetimeOnQuest.from).toLocaleDateString('en-CA', { timeZone: 'Asia/Jakarta' }); // yyyy-mm-dd, en-CA hasilkan format yyyy-mm-dd

                    // 3. Cek apakah sudah ada roll-up di tanggal yang sama
                    const existingEntry = state.dailyQuestIncome.find((e) => {
                        const existingDate = new Date(e.rangetimeOnQuest.from).toLocaleDateString('en-CA', { timeZone: 'Asia/Jakarta' }); // yyyy-mm-dd, en-CA hasilkan format yyyy-mm-dd
                        return existingDate === newDate;
                    });

                    if (existingEntry) {
                        // 4. Jika ada, update data lama
                        existingEntry.timeRollup = newEntry.timeRollup;
                        existingEntry.gold += newEntry.gold;
                        existingEntry.silver += newEntry.silver;
                        existingEntry.countQuestCompleted += newEntry.countQuestCompleted;
                        existingEntry.rangetimeOnQuest.to = newEntry.rangetimeOnQuest.to;
                    } else {
                        // 5. Jika tidak ada, tambahkan entry baru (tambahkan hasil summary ke state.dailyQuestIncome)
                        state.dailyQuestIncome.push(newEntry);
                    }
                }

                // 4. Hapus semua HistoryQuestClub karena sudah di roll-up (sudah disummary)
                state.historyQuestClub = [];
            }
        },
        deleteDailyQuestIncome: (state, action: PayloadAction<PayloadDailyQuestIncomeid | PayloadDailyQuestIncomeid[]>) => {
            const idsToDelete = action.payload;
            if (typeof idsToDelete === 'string') {
                const newDailyQuestIncome = state.dailyQuestIncome.filter((questIncome) => questIncome.id !== idsToDelete);
                return {
                    ...state,
                    dailyQuestIncome: newDailyQuestIncome,
                };
            } else {
                const newDailyQuestIncome = state.dailyQuestIncome.filter((questIncome) => !idsToDelete.includes(questIncome.id));
                state.dailyQuestIncome = newDailyQuestIncome;
            }
        },
        updateClock: (state, action: PayloadAction<Clock>) => {
            const { anchorReal, ...restClockPayload } = action.payload;
            const newDate = new Date(anchorReal);

            if (!isNaN(newDate.getTime())) {
                state.setting.clock = {
                    anchorReal: newDate.toISOString(),
                    ...restClockPayload,
                };
            }
        },
    },
});

export const {
    //
    addClub,
    updateClub,
    deleteClub,
    addHistoryQuestClub,
    updateHistoryQuestClub,
    deleteHistoryQuestClub,
    adjustNextQuestTime,
    addWalletEntry,
    updateWalletEntry,
    deleteWalletEntry,
    rollupDailyQuestIncome,
    deleteDailyQuestIncome,
    updateClock,
} = carxGrindingSlice.actions;

export function selectAllClubs(state: RootState) {
    return state.carxGrinding.club;
}

export const selectClub = createSelector(
    [
        selectAllClubs,
        function (state: RootState, idClub?: Club['id'] | null) {
            return idClub;
        },
    ],
    (clubs, idClub) => {
        return clubs.find((club) => club.id === idClub);
    }
);

export function selectAllHistoryQuestClub(state: RootState) {
    return state.carxGrinding.historyQuestClub;
}

export const selectHistoryQuestClub = createSelector(
    [
        selectAllHistoryQuestClub,
        function (state: RootState, idHistoryQuest?: HistoryQuestClub['id'] | null) {
            return idHistoryQuest;
        },
    ],
    (histories, idHistoryQuest) => {
        if (!idHistoryQuest) {
            return undefined;
        } else {
            return histories.find((history) => history.id === idHistoryQuest);
        }
    }
);

export const selectCountHistoryQuestClubByClub = createSelector(
    [
        selectAllHistoryQuestClub,
        function (state: RootState, idClub?: Club['id'] | null) {
            return idClub;
        },
    ],
    (histories, idClub) => {
        const historyFiltered = histories.filter((history) => {
            return history.idClub === idClub && new Date(history.timeOn).toLocaleDateString('en-CA') === new Date().toLocaleDateString('en-CA');
        });

        return historyFiltered.length;
    }
);

//* daily

export function selectCarxGrindingState(state: RootState) {
    return state.carxGrinding;
}
export function selectAllDailyQuestIncome(state: RootState) {
    return state.carxGrinding.dailyQuestIncome;
}

export const selectDailyQuestIncome = createSelector(
    [
        selectAllDailyQuestIncome,
        function (state: RootState, idDailyQuestIncome?: HistoryQuestClub['id'] | null) {
            return idDailyQuestIncome;
        },
    ],
    (dailyQuestIncomes, idDailyQuestIncome) => {
        if (!idDailyQuestIncome) {
            return undefined;
        } else {
            return dailyQuestIncomes.find((dailyQuest) => dailyQuest.id === idDailyQuestIncome);
        }
    }
);

export function selectAllWalletEntry(state: RootState) {
    return state.carxGrinding.wallet;
}

export const selectWalletEntry = createSelector(
    [
        selectAllWalletEntry,
        function (state: RootState, idWallet?: WalletEntry['id'] | null) {
            return idWallet;
        },
    ],
    (wallets, idWallet) => {
        return wallets.find((wallet) => wallet.id === idWallet);
    }
);

export function selectClock(state: RootState) {
    return state.carxGrinding.setting.clock;
}

export const carxGrindingReducer = carxGrindingSlice.reducer;

//* Logic
export function processRollUpDailyQuestIncome(state: Pick<CarxGrindingState, 'club' | 'historyQuestClub'>) {
    const { club: clubs, historyQuestClub } = state;

    // 1. Buat lookup Club berdasarkan ID (agar cepat akses saat kalkulasi)
    const clubMap = new Map(clubs.map((club) => [club.id, club]));

    // 2. Grouping berdasarkan local date string (YYYY-MM-DD)
    const grouped = historyQuestClub.reduce<Record<string, HistoryQuestClub[]>>((acc, item) => {
        const localDate = new Date(item.timeOn).toLocaleDateString('en-CA'); // YYYY-MM-DD, toLocaleDateString('en-CA') digunakan karena format ini menghasilkan YYYY-MM-DD tanpa perlu string parsing manual
        if (!acc[localDate]) acc[localDate] = [];
        acc[localDate].push(item);
        return acc;
    }, {});

    // 3. Map hasil group menjadi DailyQuestIncome[]
    const rollUpDailyQuestIncomeResult: DailyQuestIncome[] = Object.entries(grouped).map(([dateKey, histories]) => {
        const [oldestHistory, newestHistory] = [
            histories.reduce((min, i) => (new Date(i.timeOn) < new Date(min.timeOn) ? i : min), histories[0]),
            histories.reduce((max, i) => (new Date(i.timeOn) > new Date(max.timeOn) ? i : max), histories[0]),
        ];

        const { totalGold, totalSilver } = histories.reduce(
            (totals, item) => {
                const club = clubMap.get(item.idClub);
                if (club && item.isWin === true) {
                    totals.totalGold += club.quest.gold;
                    totals.totalSilver += club.quest.silver;
                }
                return totals;
            },
            { totalGold: 0, totalSilver: 0 }
        );

        return {
            id: 'DQI_' + nanoid(6), // manual dengan `DQI_${Math.random().toString(36).slice(2, 8)}`
            timeRollup: new Date().toISOString(), // waktu saat roll-up terjadi setara dengan formatISO(new Date())
            gold: totalGold,
            silver: totalSilver,
            rangetimeOnQuest: { from: oldestHistory.timeOn, to: newestHistory.timeOn },
            countQuestCompleted: histories.length,
        } satisfies DailyQuestIncome;
    });

    return rollUpDailyQuestIncomeResult;
}

function updateLatestHistoryByIdClub(args: { histories: HistoryQuestClub[]; idClub: Club['id']; newData: Partial<HistoryQuestClub> }) {
    const { histories, idClub, newData } = args;

    // Filter berdasarkan idClub
    const filtered = histories.filter((h) => h.idClub === idClub);

    if (filtered.length === 0) return histories; // tidak ada yang perlu di-update

    // Cari data dengan timeOn paling baru
    const latest = filtered.reduce((latest, current) => (new Date(current.timeOn) > new Date(latest.timeOn) ? current : latest));

    // Update hanya item yang memiliki idHistory sama
    return histories.map((history) => (history.id === latest.id ? { ...history, ...newData } : history));
}
