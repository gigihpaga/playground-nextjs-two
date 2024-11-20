/**
 * reference:
 * - [stackblitz](https://stackblitz.com/edit/date-fns-playground-72kvcp?file=get-timezone.ts)
 * - [How to format hour and minutes in date-fns?](https://stackoverflow.com/questions/65317139/how-to-format-hour-and-minutes-in-date-fns)
 * @returns {string} e.g: Asia/Jakarta
 */
export const getTimezone = () => Intl.DateTimeFormat().resolvedOptions().timeZone;

/**
 * @returns {string} e.g: en-US
 */
export const getLanguage = () => Intl.DateTimeFormat().resolvedOptions().locale;
