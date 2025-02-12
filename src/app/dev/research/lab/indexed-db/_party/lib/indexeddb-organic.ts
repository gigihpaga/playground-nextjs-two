const DB_NAME = 'learn-idb-db',
    KEY_NAME = 'user-key-val';

export function read() {
    // const DB_NAME = 'learn-idb-db', KEY_NAME = 'user-key-val';

    const DB_NAME_1 = DB_NAME,
        KEY_NAME_1 = KEY_NAME;

    return new Promise<Array<{ name: string; phone: string }>>((resolve, reject) => {
        let idb = indexedDB.open(DB_NAME_1, 1);
        let datas: Array<{ name: string; phone: string }> = [];
        idb.onsuccess = (event) => {
            try {
                let res = idb.result;
                let tx = res.transaction(KEY_NAME_1, 'readonly');
                let store = tx.objectStore(KEY_NAME_1);
                let cursor = store.openCursor();
                tx.onerror = (event) => {
                    reject((event.target as IDBRequest).error);
                };
                tx.oncomplete = (event) => {};
                tx.onabort = (even) => {
                    reject((event.target as IDBRequest).error);
                };
                res.onerror = (event) => {
                    reject((event.target as IDBRequest).error);
                };

                cursor.onsuccess = (event) => {
                    let curRes = cursor.result;
                    if (curRes) {
                        const data = { name: curRes.value.name, phone: curRes.value.phone };
                        datas.push({ ...curRes.value });
                        // console.log(data);
                        curRes.continue();
                    } else {
                        // resolve(event);
                        resolve(datas); // Resolve the promise with the collected data
                    }
                };
                cursor.onerror = (event) => {
                    reject((event.target as IDBRequest).error); // Reject the promise if an error occurs
                };
            } catch (error) {
                if (error instanceof Error) {
                    reject(error.message);
                } else {
                    reject('Unknow Error...');
                }
            }
        };

        idb.onerror = (event) => {
            const err = (event.target as IDBRequest).error;
            reject(err); // Reject the promise if there is an error opening the database
        };
    });
}

export function add(data: unknown) {
    let idb = indexedDB.open(DB_NAME, 1);
    idb.onupgradeneeded = (vc) => {
        let res = idb.result;
        res.createObjectStore(KEY_NAME, { autoIncrement: true });
    };
    idb.onsuccess = (event) => {
        let res = idb.result;
        let tx = res.transaction(KEY_NAME, 'readwrite');
        let store = tx.objectStore(KEY_NAME);
        store.put(data);
    };
    idb.onerror = (event) => {
        console.error(event);
    };
}

function open(callback: <T>(v: IDBDatabase) => T) {
    let idb = indexedDB.open(DB_NAME, 1);
    idb.onsuccess = (_) => callback(idb.result);
}
function read2() {
    let idb = indexedDB.open(DB_NAME, 1);
    let datas: Array<{ name: string; phone: string }> = [];

    idb.onsuccess = (event) => {
        let res = idb.result;
        let tx = res.transaction(KEY_NAME, 'readonly');
        let store = tx.objectStore(KEY_NAME);
    };
}

function getAllStudents() {
    let idb = indexedDB.open(DB_NAME, 1);
    const request = idb?.result?.transaction(KEY_NAME, 'readonly').objectStore(KEY_NAME).getAll();

    request.onsuccess = () => {
        const students = request.result;

        console.log('Got all the students');
        console.table(students);

        return students;
    };

    request.onerror = (err) => {
        console.error(`Error to get all students: ${err}`);
    };
}
