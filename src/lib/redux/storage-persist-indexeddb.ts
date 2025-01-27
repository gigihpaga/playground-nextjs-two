'use client';
import createWebStorage from 'redux-persist/lib/storage/createWebStorage';
import { type WebStorage } from 'redux-persist/lib/types';
import idbStorage from '@piotr-cz/redux-persist-idb-storage';

type NoopStorageProps = {
    name?: string;
    storeName?: string;
    version?: number;
};

const createNoopStorage = (opts: NoopStorageProps): WebStorage => idbStorage({ name: opts.name, storeName: opts.storeName, version: opts.version });
/**
 * `localStorage` adalah default Storage Engines untuk redux-persist
 */
const indexedDBStorage = (opts: NoopStorageProps) => (typeof window !== 'undefined' ? createWebStorage('local') : createNoopStorage(opts));

export default indexedDBStorage;
