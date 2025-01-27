'use client';

import { Suspense, useEffect, useRef, useState, type ReactNode } from 'react';
import { Provider } from 'react-redux';
import { makeStore, type AppStore } from '@/lib/redux/store';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';

export default function ReduxProvider({ children }: { children: ReactNode | ReactNode[] }) {
    // const [isMounted, setIsMounted] = useState(false);
    const storeRef = useRef<AppStore | null>(null);
    if (!storeRef.current) {
        // Create the store instance the first time this renders
        storeRef.current = makeStore();
    }

    /**
     * [A Simple Solution for Redux State Hydration Issues When Using localStorage with Next.js](https://medium.com/@ionikdev/a-simple-solution-for-redux-state-hydration-issues-when-using-localstorage-with-next-js-890d0e0343df)
     * harus tetap pakai persistStore() kalo ingin menggunakan redux-persist.
     * walaupun tidak menggunakan <PersistGate> tetap bisa digunakan.
     * jika tidak menggunakan <PersistGate> akan muncul message error "Text content did not match" di mode development, tapi di mode production message tersebut tidak akan muncul karena di root layout app "suppressHydrationWarning" disetting ke "true"
     * jika tidak menggunakan <PersistGate> kita akan melihat blank white page diseluruh aplikasi
     *
     * akhirnya saya sendiri mengakali menggunakan useState, useEffect dan Suspense, it work. tapi gatau salah atau benar
     */

    /** uncomment this code for using localStorage with redux */
    const persistore = persistStore(storeRef.current);

    /**
    useEffect(() => {
        // setIsMounted(true);
    }, []);
    */
    return (
        <Provider store={storeRef.current}>
            {/* <Suspense fallback={<div>loading redux store...</div>}>{children}</Suspense> */}
            {/* {children} */}

            <PersistGate
                persistor={persistore}
                loading={<div className="h-screen w-screen flex justify-center items-center">loading storage...</div>}
            >
                {children}
            </PersistGate>
        </Provider>
    );
}
