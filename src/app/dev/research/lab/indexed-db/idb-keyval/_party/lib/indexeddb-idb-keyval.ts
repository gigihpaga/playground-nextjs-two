import { set, createStore, del, get, update, UseStore } from 'idb-keyval';

const DB_NAME = 'learn-idb-db-3',
    KEY_NAME = 'user-key-val';

export type User = { name: string; phone: number };

export type StateStore = {
    users: User[];
};

const initialState: StateStore = { users: [] };

/**
 * saat pertama kali page dibuka, idb-keyval otomatis membuatkan indexed-db dengan databse name=DB_NAME dan keyname=KEY_NAME
 */
const storage = createStore(DB_NAME, KEY_NAME);

export async function getStore() {
    const store = await get<StateStore>(KEY_NAME, storage);
    if (!store) {
        await set(KEY_NAME, initialState, storage);
        return initialState;
    }
    return store;
}

export async function initStore(data?: StateStore) {
    await set(KEY_NAME, data || initialState, storage);
}

export async function getUsers() {
    const store = await getStore();
    return store.users;
}

export async function addUser(data: StateStore['users'][number]) {
    await update<StateStore>(
        KEY_NAME,
        (store) => {
            if (!store) {
                const dataUser = { users: [data] };
                initStore(dataUser);
                return dataUser;
                // throw new Error('store not found');
            }
            return {
                ...store,
                users: store.users.concat(data),
            };
        },
        storage
    );
}

export async function updateUser(calback: (oldValue: StateStore | undefined) => StateStore) {
    return await update<StateStore>(KEY_NAME, calback, storage);
}
