/**
 *
 * @param array Object
 * @param key String
 * @returns Object
 * @example
 * ```ts
 * // from here
 * const arr = [
 *      { name: 'isMarried', isRequired: true, type: 'boolean' },
 *      { name: 'income', isRequired: false, type: 'number' },
 * ];
 *
 * // to here
 * const obj = {
 *      isMarried: { name: 'isMarried', isRequired: true, type: 'boolean', id: 0 },
 *      income: { name: 'income', isRequired: false, type: 'number', id: 1 },
 * };
 * ```
 */
export function transformArrayToObject<T extends Record<K, any>, K extends keyof T>(array: T[], key: K) /* : { [key: string]: T & { id: number } } */ {
    return array.reduce(
        (acc, item, idx) => {
            acc[item[key]] = { ...item /* id: idx */ };
            return acc;
        },
        {} as { [key: string]: T /* & { id: number } */ }
    );
}

export function transformObjectToArray<T>(obj: { [key: string]: T }, keyName: string): (T & { [K in typeof keyName]: string })[] {
    return Object.keys(obj).map((key) => ({
        ...obj[key],
        [keyName]: key,
    }));
}
