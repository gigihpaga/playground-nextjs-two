'use client';

import { Progress } from '@/components/ui/progress';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { FileHeader } from './file-header';
import { uploadFile } from '../../function/upload-file';

interface Props {
    file: File;
    onDelete: (file: File) => void;
    onUpload?: (file: File, url: string) => void;
}

export function SingleFileUploadField({ file, onDelete, onUpload }: Props) {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        /**
         * fetch("url") // fetch TIDAK bisa menunjukan progress upload atau progress download
         * axios.get('url', { onDownloadProgress: (pev) => {} }); // axios BISA menunjukan progress upload atau progress download
         */
        async function upload() {
            // const url = await uploadFile(file, (progress) => setProgress(progress));
            const url = await uploadFile(file, setProgress);
            console.log('res uploadFile', url);
            onUpload ? onUpload(file, url) : false;
        }
        upload();
        // return () => {};
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    console.log('SingleFileUploadField RENDER');
    return (
        <>
            <FileHeader
                file={file}
                onDelete={onDelete}
            />
            <Progress
                className="rounded-none"
                value={progress}
            />
        </>
    );
}
