import { combineReducers } from '@reduxjs/toolkit';
import { persistReducer, PersistConfig } from 'redux-persist';

//* persistace engines
import localStorage from './storage-persist-local';
// import indexedDBStorage from './storage-persist-indexeddb';
import indexedDBStorage from '@piotr-cz/redux-persist-idb-storage';

//* reducers
import { pwuPostReducer } from '@/app/dev/tutorial/programming-with-umair/integrate-redux-toolkit/_party/state/post-slice';
import { cocLayoutCollectionReducer } from '@/app/dev/research/coc/queen-charge/_party/state/layout-collection-slice';
import { cocAttackCollectionReducer } from '@/app/dev/research/coc/queen-charge/_party/state/attack-collection-slice';

/**
 * persist article
 * [](https://blog.logrocket.com/persist-state-redux-persist-redux-toolkit-react/)
 * [](https://dev.to/bladearya/implementing-redux-in-nextjs-app-router-a-comprehensive-guide-10ce)
 * [](https://medium.com/@ionikdev/a-simple-solution-for-redux-state-hydration-issues-when-using-localstorage-with-next-js-890d0e0343df)
 * [](https://lightrains.com/blogs/redux-persist-with-next-js/)
 * [](https://github.com/rt2zz/redux-persist/issues/1464)
 * [redux-persist failed to create sync storage. falling back to noop storage](https://github.com/vercel/next.js/discussions/15687)
 */

//* Pesist
const pwuPostPersistConfig = {
    key: 'pwuPost',
    whitelist: ['pwuPost'],
    storage: localStorage, // local storage
};

const cocLayoutCollectionConfig = {
    key: 'cocLayoutCollection',
    whitelist: ['layoutState', 'layoutSelected'],
    // storage: localStorage,
    storage: indexedDBStorage({ name: 'coc-layout-collection', storeName: 'keyval' }),
    serialize: false,
    // @ts-ignore
    deserialize: false,
};

const cocAttackCollectionConfig = {
    key: 'cocAttackCollection',
    whitelist: ['attacCollectionkState', 'attackIdActive'],
    // storage: localStorage,
    storage: indexedDBStorage({ name: 'coc-attack-collection', storeName: 'keyval' }),
    serialize: false,
    // @ts-ignore
    deserialize: false,
};

export const rootReducer = combineReducers({
    pwuPost: persistReducer(pwuPostPersistConfig, pwuPostReducer),
    // pwuPost: pwuPostReducer,

    cocLayoutCollection: persistReducer(cocLayoutCollectionConfig, cocLayoutCollectionReducer),
    // cocLayoutCollection: cocLayoutCollectionReducer,

    cocAttackCollection: persistReducer(cocAttackCollectionConfig, cocAttackCollectionReducer),
    // cocAttackCollection: cocAttackCollectionReducer,
});
