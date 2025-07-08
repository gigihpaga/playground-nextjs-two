'use client';

import { useState } from 'react';

function CodeExperiment() {
    const [people, SetPeople] = useState({ name: 'paga', height: 170, isSingle: true });
    const [ticket, setTicket] = useState<{ from: string; to: string; name?: string; isSingle?: boolean; height?: number }>({
        from: 'indonesia',
        to: 'london',
        height: 0.5,
    });

    function handleUpdate(name: string, height: number) {
        /** 1 */
        SetPeople({ ...people, name: 'tina' });
        /**
         * SetPeople({ ...people, name: 'tina' });
         * (1): State people sementara menjadi { name: 'tina', height: 170, isSingle: true }.
         */

        /** 2 */
        SetPeople((prev) => ({ ...prev, height: prev.height + height })); //2
        /**
         * SetPeople((prev) => ({ ...prev, height: prev.height + height }));
         * (2): React akan menggunakan state terbaru yang tertunda
         * ({ name: 'tina', height: 170, isSingle: true }) dan menambah height.
         * height menjadi 190. State menjadi { name: 'tina', height: 190, isSingle: true }
         */

        /** 3 */
        SetPeople({ ...people, height: people.height + 5 }); // 3
        /**
         * SetPeople({ ...people, height: people.height + 5 });
         * (3): Perhatikan disini, people yang digunakan adalah nilai lama,
         * yaitu { name: 'paga', height: 170, isSingle: true }.
         * height akan menjadi 175.
         * State menjadi { name: 'paga', height: 175, isSingle: true }.
         */

        /** 4 */
        SetPeople((prev) => ({ ...prev, height: prev.height + 3 })); // 4
        /**
         * SetPeople((prev) => ({ ...prev, height: prev.height + 3 }));
         * (4): React menggunakan state terbaru ({ name: 'paga', height: 175, isSingle: true })
         * dan menambah height dengan 3.
         * height menjadi 178. State menjadi { name: 'paga', height: 178, isSingle: true }.
         */

        /** 5 */
        SetPeople((prev) => ({ ...prev, name: name })); // 5
        /**
         * SetPeople((prev) => ({ ...prev, name: name }));
         * (5): prev adalah { name: 'paga', height: 178, isSingle: true },
         * dan name yang dipakai adalah dari parameter function yaitu dani.
         * State menjadi { name: 'dani', height: 178, isSingle: true }.
         */

        /** 6 */
        SetPeople({ ...people, name: 'maya' }); // 6
        /**
         * SetPeople({ ...people, name: 'maya' });
         * (6): Sekali lagi, kita menggunakan nilai people yang lama ({ name: 'paga', height: 170, isSingle: true }).
         * name menjadi maya. State menjadi { name: 'maya', height: 170, isSingle: true }.
         */

        /**
         * Hasil Akhir people: Setelah semua pembaruan di atas,
         * state people akan menjadi { name: 'maya', height: 170, isSingle: true }.
         */

        /** 7 */
        setTicket((prev) => {
            return {
                ...prev,
                ...people,
                height: (prev.height || 0) + people.height,
            };
        });
        /**
         * setTicket((prev) => { ... });
         * (7): React menggunakan state ticket terbaru ({ from: 'indonesia', to: 'london', height: 0.5 })
         * dan state people terbaru ({ name: 'maya', height: 170, isSingle: true })
         * untuk melakukan pembaruan
         *
         * - Pembaruan state tiket dilakukan dengan spread syntax dan mengupdate height.
         * - height: (prev.height || 0) + people.height, height di ticket akan menjadi 0.5 + 170 = 170.5.
         * - State menjadi { from: 'indonesia', to: 'london', name: 'maya', isSingle: true, height: 170.5 }
         * - Hasil Akhir ticket: Setelah pembaruan, state ticket akan menjadi { from: 'indonesia', to: 'london', name: 'maya', isSingle: true, height: 170.5 }.
         */

        /**
         * render sekali dan data yang akan di lihat user
         *
         * people
         * {"name":"maya","height":170,"isSingle":true}
         *
         * ticket
         * {"from":"indonesia","to":"london","name":"maya","isSingle":true,"height":170.5}
         */
    }

    return (
        <div>
            <h1>people</h1>
            <pre>{JSON.stringify(people)}</pre>
            <h1>ticket</h1>
            <pre>{JSON.stringify(ticket)}</pre>
            <button onClick={() => handleUpdate('dani', 20)}>update</button>
        </div>
    );
}

function CodeSurveyExperiment() {
    const [people, SetPeople] = useState({ name: 'paga', height: 170, isSingle: true });
    const [ticket, setTicket] = useState<{ from: string; to: string; name?: string; isSingle?: boolean; height?: number }>({
        from: 'indonesia',
        to: 'london',
        height: 0.5,
    });

    function handleUpdate(name: string, height: number) {
        SetPeople({ ...people, name: 'tina' });

        SetPeople((prev) => ({ ...prev, height: prev.height + height })); //2

        SetPeople({ ...people, height: people.height + 5 }); // 3

        setTicket((prev) => {
            return {
                ...prev,
                ...people,
                height: (prev.height || 0) + people.height,
            };
        });

        SetPeople((prev) => ({ ...prev, height: prev.height + 3 })); // 4

        SetPeople((prev) => ({ ...prev, name: name })); // 5

        SetPeople({ ...people, name: 'maya' }); // 6
    }

    return (
        <div>
            <h1>people</h1>
            <pre>{JSON.stringify(people)}</pre>
            <h1>ticket</h1>
            <pre>{JSON.stringify(ticket)}</pre>
            <button onClick={() => handleUpdate('dani', 20)}>update</button>
        </div>
    );
}

function CodeBarterExperiment() {
    const [people, SetPeople] = useState({ name: 'paga', height: 170, isSingle: true });
    const [ticket, setTicket] = useState<{ from: string; to: string; name?: string; isSingle?: boolean; height?: number }>({
        from: 'indonesia',
        to: 'london',
        height: 0.5,
    });

    function handleUpdate(name: string, height: number) {
        SetPeople((prev) => {
            const peopleNewhigh = prev.height + height;

            setTicket((prev) => {
                return {
                    ...prev,
                    ...people,
                    name,
                    height: (prev.height || 0) + peopleNewhigh,
                };
            });

            return { ...prev, name, height: peopleNewhigh, isSingle: false };
        }); //2
    }

    return (
        <div>
            <h1>people</h1>
            <pre>{JSON.stringify(people)}</pre>
            <h1>ticket</h1>
            <pre>{JSON.stringify(ticket)}</pre>
            <button onClick={() => handleUpdate('dani', 20)}>update</button>
        </div>
    );
}
