'use client';
import { getErrorMessage } from '@/utils/get-error-message';
import axios, { isCancel, AxiosError } from 'axios';
import { useRef } from 'react';

export default function DownloadFileAxiosPage() {
    const anchorUrlRef = useRef<HTMLAnchorElement>(null);

    async function handleClick() {
        try {
            const response = await axios.get('/uploads/projaqk - Gorgeous gradient inspirations for designers.jpg', {
                responseType: 'blob', // transform response axios as blob, when using fetch API like a "res.blob()"
                onDownloadProgress: (progressEvent) => {
                    if (progressEvent.lengthComputable) {
                        const progress = ((progressEvent.loaded / (progressEvent?.total ?? 0)) * 100).toFixed();
                        console.log(`progress download: ${progress}%`);
                    } else {
                        console.log('download in progress, please wait...');
                    }
                },
            });
            if (response.status !== 200) {
                window.alert(`status not oke, but status is: ${response.statusText}`);
                return;
            }
            const data = response.data as Blob;
            const url = URL.createObjectURL(data);
            const { current: a } = anchorUrlRef;
            if (!a) return;
            const extention = data.type.split('/').pop();
            a.href = url;
            a.download = `image-dummy.${extention ?? 'jpg'}`;
            a.click();
            URL.revokeObjectURL(url);
        } catch (error) {
            window.alert(`error fetch ${JSON.stringify(getErrorMessage(error), null, 2)}`);
        }
    }

    return (
        <div className="w-full">
            <button
                className="bg-muted px-2 py-1 rounded-md hover:bg-muted/70"
                onClick={() => handleClick()}
            >
                download image
            </button>
            {/* eslint-disable-next-line jsx-a11y/anchor-has-content */}
            <a
                href="/"
                ref={anchorUrlRef}
                style={{ display: 'none' }}
            />
        </div>
    );
}
