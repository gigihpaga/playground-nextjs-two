import { Color } from '../constants';

/** master club */
export type Club = {
    id: string;
    name: string;
    class: string;
    color: Color;
    car: string;
    quest: {
        /** milisecond */
        cooldownTime: number;
        gold: number;
        silver: number;
    };
};

export type ClubWithTimeOn = Club & { timeOn?: HistoryQuestClub['timeOn'] };

/**
 * Mewakili catatan (record) penyelesaian quest dari sebuah klub.
 * Data ini bersifat temporary dan akan dihapus setelah proses roll-up/konsolidasi, data konsolidasi disimpan ke dalam `DailyQuestIncome`.
 */
export type HistoryQuestClub = {
    id: string;
    idClub: Club['id'];
    /** time ISO String */
    timeOn: string;
    /** winning status */
    isWin: boolean;
};

/**
 * DailyQuestIncome ==> untuk object storing
 * "Roll-up Daily Quest" ==> untuk nama button, button yang menintruksikan proses consolidate
 * mewakili catatan (record) hasil summary (proses roll-up/konsolidasi) dari HistoryQuestClub per tanggal (group by tanggal)
 *  WealthIncomeQuest QuestDailyIncome QuestDailyEarnings ConsolidatedQuestIncome DailyConsolidatedQuestIncome
 * */
export type DailyQuestIncome = {
    id: string;
    /** waktu untuk menunjukan kapan cosolidate/rollup dilakukan */
    timeRollup: string;
    /** total jumlah quest (HistoryQuestClub) per group tanggal */
    countQuestCompleted: number;
    /** gold, summary gold HistoryQuestClub relasi dengan  Club*/
    gold: Club['quest']['gold'];
    /** silver, summary gold HistoryQuestClub relasi dengan  Club*/
    silver: Club['quest']['silver'];
    /**
     * menunjukan data HistoryQuestClub yang di colidate
     */
    rangetimeOnQuest: {
        /** time ISO String waktu paling awal dari HistoryQuestClub dalam group tanggal */
        from: string;
        /** time ISO String waktu paling akhir dari HistoryQuestClub dalam group tanggal*/
        to: string;
    };
};

export type WalletEntry = {
    id: string;
    gold: Club['quest']['gold'];
    silver: Club['quest']['silver'];
    note?: string;
    /** ISO date string */
    createdAt: string;
};

export type Clock = {
    /**
     * anchorReal
     *
     * Titik acuan waktu nyata (real-life) saat pertama kali diobservasi
     * misalnya 3 Juli 2025 20:00 adalah saat jam 06:00 in-game.
     * time ISO waktu menggunakan UTC
     *
     * @example
     * '2025-07-03T20:00:00.000Z'
     */
    anchorReal: string;
    /**
     * Titik acuan jam in-game pada waktu nyata ANCHOR_REAL
     * artinya saat ANCHOR_REAL terjadi, waktu in-game adalah jam 6 pagi. An integer between 0 and 23 representing the hours.
     *
     * @example
     * ```ts
     * anchorInGameHour = 6 // artinya jam 06:00 in-game
     * ```
     */
    anchorInGameHour: number;
    /**
     * Durasi 1 siklus siang-malam penuh (24 jam in-game) dalam menit real-life.
     * Hasil pengamatan menunjukkan 50 menit di dunia nyata = 24 jam in-game
     *
     * @example
     * ```ts
     * dailyCycleRealMinutes = 50 // artinya 50 menit
     * ```
     */
    dailyCycleRealMinutes: number;
};
