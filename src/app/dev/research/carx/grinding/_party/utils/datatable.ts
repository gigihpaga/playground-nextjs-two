import { FilterFn, FilterMeta } from '@tanstack/react-table';

/**
 * [tanstack table date between filter](https://stackblitz.com/edit/tanstack-table-mkky4i?file=src%2Fmain.tsx,date-between-filter.ts,src%2Fdate-utils.ts)
 * @param d
 * @returns
 */
export const dateBetweenFilterFn: FilterFn<any> = (row, columnId, value) => {
    const date = row.getValue(columnId) as Date;
    const [start, end] = value; // value => two date input values
    //If one filter defined and date is null filter it
    if ((start || end) && !date) return false;
    if (start && !end) {
        return date.getTime() >= start.getTime();
    } else if (!start && end) {
        return date.getTime() <= end.getTime();
    } else if (start && end) {
        return date.getTime() >= start.getTime() && date.getTime() <= end.getTime();
    } else return true;
};

dateBetweenFilterFn.autoRemove;

export default dateBetweenFilterFn;

/**
 * [tanstack table date between filter](https://stackblitz.com/edit/tanstack-table-mkky4i?file=src%2Fmain.tsx,date-between-filter.ts,src%2Fdate-utils.ts)
 * @param d
 * @returns
 */
export function isValidDate(d: any) {
    const parsedDate = new Date(d);
    // return parsedDate instanceof Date && !Number.isNaN(parsedDate);
    return parsedDate instanceof Date && !isNaN(parsedDate.getTime()); // dikoreksi oleh chatgbt
}
