'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { read, add } from './lib/indexeddb-organic';
import { set, get, clear, del, keys } from './lib/indexeddb-idb';

export function App() {
    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        // if (!formRef.current) return;
        const formElm = event.nativeEvent.target as HTMLFormElement;
        const dataForm = Object.fromEntries(new FormData(formElm));

        add({ name: dataForm.name, phone: dataForm.phone });

        formElm.reset();
    }
    return (
        <>
            <h1 className="text-lg">Form User</h1>
            <form
                className="space-y-2"
                onSubmit={(event) => handleSubmit(event)}
            >
                <Input
                    type="text"
                    name="name"
                    placeholder="name"
                />
                <Input
                    type="number"
                    name="phone"
                    placeholder="phone"
                />
                <Button type="submit">Save</Button>
            </form>
            <Button
                onClick={async () => {
                    // const data = await read()
                    //     .then((d) => d)
                    //     .catch((e) => e);
                }}
            >
                Show
            </Button>
            <Button
                type="button"
                onClick={async () => {
                    // const result = await get('abcx');
                    set('abcx', { nama: 'paga', no: 2 });
                }}
            >
                set
            </Button>
            <Button
                type="button"
                onClick={async () => {
                    const result = await get('abcx');
                    console.log(result);
                }}
            >
                get
            </Button>
            <Button
                type="button"
                onClick={async () => {
                    await clear();
                }}
            >
                clear
            </Button>
            <Button
                type="button"
                onClick={async () => {
                    await del('abcx');
                }}
            >
                del
            </Button>
            <Button
                type="button"
                onClick={async () => {
                    const key = await keys();
                    console.log(key);
                }}
            >
                keys
            </Button>
        </>
    );
}
