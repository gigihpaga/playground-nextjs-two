'use client';
import createWebStorage from 'redux-persist/lib/storage/createWebStorage';
import { type WebStorage } from 'redux-persist/lib/types';

const createNoopStorage = (): WebStorage => {
    return {
        getItem(_key: any) {
            return Promise.resolve(null);
        },
        setItem(_key: any, value: any) {
            return Promise.resolve(value);
        },
        removeItem(_key: any) {
            return Promise.resolve();
        },
    };
};
/**
 * `localStorage` adalah default Storage Engines untuk redux-persist
 */
const storage = typeof window !== 'undefined' ? createWebStorage('local') : createNoopStorage();

export default storage;
