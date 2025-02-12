'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { initStore, getUsers, addUser, StateStore, User } from './lib/indexeddb-idb-keyval';

export function App() {
    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        // if (!formRef.current) return;
        const formElm = event.nativeEvent.target as HTMLFormElement;
        const dataForm = Object.fromEntries(new FormData(formElm)) as unknown as User;
        await addUser(dataForm);
        // add({ name: dataForm.name, phone: dataForm.phone });

        formElm.reset();
    }

    async function handleGetUsers() {}
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
                <Button type="submit">add user</Button>
            </form>
            <div className="flex flex-col mt-4 gap-y-1">
                <Button onClick={async () => {}}>Show</Button>
                <Button
                    type="button"
                    onClick={async () => {}}
                >
                    set
                </Button>
                <Button
                    type="button"
                    onClick={async () => {
                        const user = await getUsers();
                        console.log(user);
                    }}
                >
                    get users
                </Button>
                <Button
                    type="button"
                    onClick={async () => {}}
                >
                    clear
                </Button>
                <Button
                    type="button"
                    onClick={async () => {}}
                >
                    del
                </Button>
                <Button
                    type="button"
                    onClick={async () => {}}
                >
                    keys
                </Button>
                <Button
                    type="button"
                    onClick={async () => initStore()}
                >
                    init store
                </Button>
            </div>
        </>
    );
}
