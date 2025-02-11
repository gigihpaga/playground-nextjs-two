import { set, createStore, del, get, update, UseStore } from 'idb-keyval';
import { type WorkspaceTopic } from '../state/commit-topic-collection-slice';
import type { Node, Edge } from '@xyflow/react';

const DB_NAME = 'git-commit-topic-collection-flow',
    KEY_NAME = 'key-val';

export type WorkspaceId = WorkspaceTopic['id'];

export type GitTopicFlowState = {
    [topicId: WorkspaceId]: {
        node: Node[];
        edge: Edge[];
    };
};

const initialState: GitTopicFlowState = {};

//* using idb-keyval

const storage = createStore(DB_NAME, KEY_NAME);

/**
 * initial data indexeddb
 */
async function initStore() {
    await get<GitTopicFlowState>(KEY_NAME, storage).then((val) => {
        if (val === undefined) {
            set(KEY_NAME, initialState, storage);
        }
    });
}

/**
 * get data indexeddb
 * @returns
 */
export async function getStore() {
    const store = await get<GitTopicFlowState>(KEY_NAME, storage);
    if (!store) {
        await initStore();
        return initialState;
        // throw new Error(`Store: "${DB_NAME}" is undefined, you must first run initStore() function`);
    }

    return store;
}

export function getStoreSync(callback: (store: GitTopicFlowState) => void) {
    getStore()
        .then((store) => callback(store))
        .catch((err) => {
            throw err;
        });
}

export function setStore(value: GitTopicFlowState) {
    set(KEY_NAME, value, storage);
}

/**
 * update data indexeddb
 * @param calback
 */
async function updateStore2(calback: (oldValue: GitTopicFlowState | undefined) => GitTopicFlowState) {
    await update<GitTopicFlowState>(KEY_NAME, calback, storage);
}

/**
 * update data indexeddb
 * @param calback
 */
export async function updateStore(calback: (oldValue: GitTopicFlowState) => GitTopicFlowState) {
    try {
        await update<GitTopicFlowState>(
            KEY_NAME,
            (val) => {
                if (!val) {
                    throw new Error(
                        `Cannot save state flow to store indexeddb: because store is "${typeof val}", you must first run initStore() function`
                    );
                }

                return calback(val);
            },
            storage
        );
        return true; // Success if no errors
    } catch (error) {
        console.error('Error updating store:', error); // Log the actual error
        return false; // Failure if an error occurred
    }
}
