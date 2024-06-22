'use client';

import Image from 'next/image';
import React, { useRef, useState } from 'react';

export default function DownloadUploadFilePage() {
    const [file, setFile] = useState<File | undefined>(undefined);
    const [fileDataURL, setFileDataURL] = useState<string | null>(null);
    const anchorUrlRef = useRef<HTMLAnchorElement>(null);

    function fileInputToUrl(f: File | undefined) {
        /**
         * metode file FileReader
         * - readAsArrayBuffer
         * - readAsBinaryString
         * - readAsDataURL: membuat File Object menjadi url base 64, yang digunakan untuk preview sebelum upload, di tampilkan di "src" element <img src>
         * - readAsText
         */
        if (!f) return;
        const reader = new FileReader();
        reader.onloadend = () => {
            setFileDataURL(reader.result as string);
        };
        reader.readAsDataURL(f);
    }

    async function handleDownload() {
        const { current: a } = anchorUrlRef;
        if (!a || !fileDataURL || !file) return;
        const response = await fetch(fileDataURL); // fetch url base 64
        if (!response.ok) {
            window.alert('error fetching image');
            return;
        }
        const blob = await response.blob(); // url base 64 to blob
        const url = URL.createObjectURL(blob); // blob to url blob, yang digunakan di "href" element <a href/>
        console.log('url', url);
        console.log('fileDataURL', fileDataURL);
        a.href = url;
        a.download = file.name;
        a.click();
        URL.revokeObjectURL(url); // delete url blob
    }

    function handleOnChange(e: React.ChangeEvent<HTMLInputElement>) {
        const imageMimeType = /image\/(png|jpg|jpeg)/i;

        const fileDummy = e.target.files?.[0];

        if (fileDummy && !fileDummy.type.match(imageMimeType)) {
            alert('Image mime type is not valid');
            return;
        }

        setFile(fileDummy);
        fileInputToUrl(fileDummy);
    }

    return (
        <div className="w-full">
            <div aria-description="image preview wrapper">
                {fileDataURL ? (
                    <Image
                        alt="preview.jpg"
                        width={200}
                        height={200}
                        src={fileDataURL}
                    />
                ) : (
                    <div style={{ width: '200px', height: '200px' }}>
                        <p>upload preview</p>
                    </div>
                )}
            </div>
            <form onSubmit={() => {}}>
                <input
                    accept="image/*" // semua image entah png atau jpg
                    // accept='.png, .jpg, .jpeg'
                    // multiple
                    type="file"
                    name="file"
                    onChange={(e) => handleOnChange(e)}
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
            <button
                onClick={() => handleDownload()}
                className="bg-muted px-2 py-1 rounded-md hover:bg-muted/70"
                type="button"
            >
                download local image
            </button>
            {/* eslint-disable-next-line jsx-a11y/anchor-has-content */}
            <a
                href="/"
                aria-hidden="true"
                ref={anchorUrlRef}
                style={{ display: 'none' }}
            />
        </div>
    );
}
