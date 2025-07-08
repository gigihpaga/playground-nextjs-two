import { parseISO, format } from 'date-fns';
import { Club, ClubWithTimeOn, HistoryQuestClub } from '../types';

/**
 * decompose duration, for compose duration use `timeUnitsToMilliseconds`
 * @param time - in milisecond
 * @returns
 */
export function breakDownDurationToTimeUnits(time: number) {
    const inMilisecond = 1,
        inSecond = 1000 * inMilisecond,
        inMinute = 60 * inSecond,
        inHour = 60 * inMinute,
        inDay = 24 * inHour,
        inMonth = 30 * inDay;

    let remainingTime = time;

    const months = Math.floor(remainingTime / inMonth);
    remainingTime %= inMonth;

    const days = Math.floor(remainingTime / inDay);
    remainingTime %= inDay;

    const hours = Math.floor(remainingTime / inHour);
    remainingTime %= inHour;

    const minutes = Math.floor(remainingTime / inMinute);
    remainingTime %= inMinute;

    const seconds = Math.floor(remainingTime / inSecond);
    remainingTime %= inSecond;

    const miliseconds = Math.floor(remainingTime / inMilisecond);

    return {
        miliseconds,
        seconds,
        minutes,
        hours,
        days,
        months,
    };
}

/**
 * Function for formated duration
 * @param {number} duration - in milisecond
 * @returns {string} Formatted duration string (e.g., "1h 30m", "59s", "1d 5h 10m")
 */
export function formatedDuration(duration: number): string {
    if (duration < 0) {
        // Handle negative duration, perhaps return "0s" or throw an error
        return '0s';
    }
    if (duration === 0) {
        return '0s';
    }

    const breakDown = breakDownDurationToTimeUnits(duration);
    const parts: string[] = [];

    if (breakDown.months > 0) {
        parts.push(`${breakDown.months}mo`);
    }
    if (breakDown.days > 0) {
        parts.push(`${breakDown.days}d`);
    }
    if (breakDown.hours > 0) {
        parts.push(`${breakDown.hours}h`);
    }
    if (breakDown.minutes > 0) {
        parts.push(`${breakDown.minutes}m`);
    }
    // Include seconds only if there are no larger units (duration < 1 minute)
    // or if you want to show seconds alongside larger units.
    // Based on the example "1h 30m", seconds are omitted if minutes or hours are present.
    // Let's include seconds only if the total duration is less than 1 minute.
    if (duration < 60000 && breakDown.seconds > 0) {
        parts.push(`${breakDown.seconds}s`);
    }
    // If you wanted to show seconds always when > 0:
    // if (breakDown.seconds > 0) {
    //     parts.push(`${breakDown.seconds}s`);
    // }

    // If after checking all units, parts is still empty, it means the duration was
    // less than 1 second but greater than 0. We can return "0s" or handle milliseconds.
    // Sticking to seconds for simplicity based on the example format.
    if (parts.length === 0 && duration > 0) {
        // This case should be covered by the seconds check above if duration > 0
        // and less than 60000. This line is mostly a safeguard.
        return '0s';
    }

    return parts.join(' ');
}

/**
 * @returns string
 * @example
 * ```js
 *
 * questClubDateformatter.format(new Date("2025-06-10T09:58:42.344Z") // akan menhasilkan 10/06/25, 16.58
 *
 * ```
 */
export const dateTimeIndonesianformatter = new Intl.DateTimeFormat('id-ID', {
    timeStyle: 'short',
    dateStyle: 'short',
});

export function currencyIndonesianformatter(value: number, showCurrencyCode: boolean | undefined = false) {
    const indonesianformatter = new Intl.NumberFormat('id', {
        style: 'currency',
        currency: 'idr',
        maximumFractionDigits: 0,
    });
    const valueFormatted = indonesianformatter.format(value);
    return showCurrencyCode === true ? valueFormatted : valueFormatted.replace(/Rp\s/g, '');
}

// Definisikan tipe untuk parameter urutan
export type QuestTimeSortOrder = 'latest' | 'oldest';

/**
 * Memperkaya setiap objek klub dengan informasi waktu quest (`timeOn`) berdasarkan urutan yang diinginkan.
 *
 * Fungsi ini memproses array objek `Club` dan array objek `HistoryQuestClub`.
 * Untuk setiap klub:
 * 1. Menyaring `histories` untuk mendapatkan catatan yang sesuai dengan `club.id`.
 * 2. Mengurutkan catatan riwayat yang cocok tersebut berdasarkan properti `timeOn`.
 *    - Jika `sortOrder` adalah 'latest' (`default`), urutkan secara menurun (dari yang terbaru ke terlama).
 *    - Jika `sortOrder` adalah 'oldest', urutkan secara menaik (dari yang terlama ke terbaru).
 * 3. Mengambil nilai `timeOn` dari catatan riwayat paling awal sesuai urutan.
 * 4. Menambahkan nilai `timeOn` ini sebagai properti baru ke objek klub yang bersangkutan.
 *
 * Jika sebuah klub tidak memiliki catatan riwayat yang terkait, properti `timeOn` pada klub tersebut akan bernilai `undefined`.
 *
 * @param  args Objek yang berisi:
 *   - `clubs`: Array dari `Club`.
 *   - `histories`: Array dari `HistoryQuestClub`.
 *   - `sortOrder`: Menentukan apakah akan mengambil waktu quest 'latest' (terbaru) atau 'oldest' (terlama). Defaultnya adalah 'latest'.
 * @returns Array dari objek `Club`, di mana setiap klub telah ditambahkan properti `timeOn` (berupa string ISO atau `undefined`).
 */
export function enrichClubsWithQuestTime(args: { clubs: Club[]; historiesQuest: HistoryQuestClub[]; sortOrder?: QuestTimeSortOrder }) {
    const { clubs, historiesQuest, sortOrder = 'latest' } = args;
    return clubs.map((club) => {
        // Filter histories berdasarkan idClub & Urutkan hasilnya berdasarkan timeOn sesuai sortOrder
        const clubHistoriesSorted = historiesQuest
            .filter((history) => history.idClub === club.id)
            .sort((a, b) => {
                const timeA = new Date(a.timeOn).getTime();
                const timeB = new Date(b.timeOn).getTime();
                return sortOrder === 'latest' ? timeB - timeA : timeA - timeB;
            });

        // Ambil data timeOn yang sesuai
        const relevantTimeOn = clubHistoriesSorted.length > 0 ? clubHistoriesSorted[0].timeOn : undefined;

        // Kembalikan object club yang sudah ditambahkan key "timeOn"
        return {
            ...club,
            timeOn: relevantTimeOn,
        } satisfies ClubWithTimeOn as ClubWithTimeOn;
    });
}

//*

/**
 * @param {string} fromISO - Date ISO string
 * @param {string} toISO - Date ISO string
 * @returns
 *
 * @example
 * ```js
 * formatRangeDate("2025-06-08T23:49:00.000Z", "'2025-06-09T15:22:00.000Z'")
 * // result: "09/06/25, 06.49-22.22"
 * ``
 */
export function formatRangeDate(fromISO: string, toISO: string): string {
    const from = parseISO(fromISO);
    const to = parseISO(toISO);

    const date = format(from, 'dd/MM/yy');
    const fromTime = format(from, 'HH.mm');
    const toTime = format(to, 'HH.mm');

    return `${date}, ${fromTime}-${toTime}`;
}

/**
 * mengubah `Date ISO UTC` menjadi `local datetime` (seperti yang dibutuhkan input element html dengan type datetime-local )
 * @param date
 * @returns {string}
 * @example
 * ```js
 *
 * const myLocalDateTime = toInputDatetimeLocalValue(new Date('2025-07-04T10:00:00.000Z'))
 * // hasilnya: "2025-07-04T17:00"
 * ```
 */
export function toInputDatetimeLocalValue(date: Date): string {
    // contoh data = '2025-06-07T02:47:45.895Z'
    const offset = date.getTimezoneOffset(); // dalam menit
    const localDate = new Date(date.getTime() - offset * 60000);
    return localDate.toISOString().slice(0, 16); // cocok dengan format input datetime-local hasilnyya '2025-06-07T02:47'
}

/**
 * mengubah `local datetime` (seperti hasil dari input element html dengan type datetime-local ) menjadi `string ISO UTC`
 * @param date
 * @returns {string}
 * @example
 * ```js
 *
 * const myUTCDateTime = fromInputDatetimeLocalValue("2025-07-04T17:00")
 * // hasilnya: "2025-07-04T10:00:00.000Z"
 * ```
 */
export function fromInputDatetimeLocalValue(inputValue: string): string {
    const localDate = new Date(inputValue);
    return localDate.toISOString(); // ini UTC ISO string
}
