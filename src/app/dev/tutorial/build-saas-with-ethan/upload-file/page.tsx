'use client';

import React, { useState } from 'react';

function fetching() {
    fetch('/uploads/projaqk - Gorgeous gradient inspirations for designers.jpg', { method: 'GET' })
        .then((d) => {
            return d.body?.getReader();
        })
        .then((d) => {
            console.log('result fetch image', d);
        })
        .catch((e) => {
            console.log('error fetch image');
        });
}

export default function UploadFilePage() {
    const [file, setFile] = useState<File | undefined>(undefined);
    const [files, setFiles] = useState<FileList | null>(null);

    async function handleOnSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!file) return;
        try {
            /**
             * dengan menggunakan form data akan mengatur header dan menangani semua pengunggahan form-multipart
             * jadi kita sudah TIDAK perlu men-set header secara manual
             */

            const data = new FormData();
            data.set('file', file);

            const data2 = { nama: 'paga', kelas: 9 };
            const data2Send = JSON.stringify(data2);

            const res = await fetch('/api/tutorial/build-saas-with-ethan/upload', {
                method: 'POST',
                body: data,
                headers: {
                    // 'Content-Type': 'application/json',
                },
            });

            if (!res.ok) {
                console.log(res);
                throw new Error(res.statusText);
                // throw new Error(await res.text());
            }
        } catch (error) {
            console.log('error UploadFilePage ethan: ', error);
        }
    }

    return (
        <div className="w-full">
            <form onSubmit={handleOnSubmit}>
                <input
                    accept="image/png, image/jpeg"
                    // multiple
                    type="file"
                    name="file"
                    onChange={(e) => setFile(e.target.files?.[0])}
                />
                <button
                    className="bg-muted px-2 py-1 rounded-md hover:bg-muted/70"
                    type="submit"
                >
                    upload
                </button>
                {/* <input
                    type="submit"
                    value="upload"
                /> */}
            </form>
        </div>
    );
}
