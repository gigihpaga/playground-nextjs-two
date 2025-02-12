import { openDB } from 'idb';

const DB_NAME = 'learn-idb-db-2',
    KEY_NAME = 'user-key-val';

const dbPromise = openDB(DB_NAME, 1, {
    upgrade(db) {
        db.createObjectStore(KEY_NAME);
    },
});

export async function get<T>(key: string) {
    return (await dbPromise).get(KEY_NAME, key) as T;
}
export async function set(key: string, val: unknown) {
    return (await dbPromise).put(KEY_NAME, val, key);
}
export async function del(key: string) {
    return (await dbPromise).delete(KEY_NAME, key);
}
export async function clear() {
    return (await dbPromise).clear(KEY_NAME);
}
export async function keys() {
    return (await dbPromise).getAllKeys(KEY_NAME);
}
