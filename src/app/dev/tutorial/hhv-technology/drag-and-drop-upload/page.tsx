'use client';

interface PageProps {
    params: { [key: string]: string | string[] | undefined } | Record<string, never>;
    searchParams: { [key: string]: string | string[] | undefined } | Record<string, never>;
}

import React, { useRef, useState } from 'react';
import axios from 'axios';
import { CheckCircleIcon, FileCheck, FileIcon, FileUpIcon, UploadIcon } from 'lucide-react';

import { cn } from '@/lib/classnames';
import styles from './app.module.css';

export default function DragAndDropUploadPage(req: PageProps) {
    const [files, setFiles] = useState<Array<{ name: File['name']; loading: number }>>([
        // { name: 'original-62d0a55993be7ce08f4b068b4d134b25.webp', loading: 50 },
    ]);
    const [uploadedFiles, setUploadedFiles] = useState<Array<{ name: File['name']; size: string }>>([
        // { name: 'original-62d0a55993be7ce08f4b068b4d134b25.webp', size: '200 KB' },
    ]);
    const [showProgress, setShowProgress] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    function handleInputFileClick(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        if (!fileInputRef.current) return;
        fileInputRef.current.click();
    }

    async function handleUploadFile(event: React.ChangeEvent<HTMLInputElement>) {
        const URL_ENDPOINT_UPLOAD = '/api/tutorial/build-saas-with-ethan/upload';
        const file = event.target.files?.[0];
        if (!file) return;
        const fileName = file.name.length > 50 ? `${file.name.substring(0, 50)}....${file.name.split('.').pop()}` : file.name;

        const formData = new FormData();
        formData.append('file', file);

        setFiles((prev) => [...prev, { name: fileName, loading: 0 }]);
        setShowProgress(true);

        const res = await axios
            .post(URL_ENDPOINT_UPLOAD, formData, {
                onUploadProgress: ({ loaded, lengthComputable, total }) => {
                    setFiles((prev) => {
                        const newFile = [...prev];
                        if (lengthComputable) {
                            newFile[newFile.length - 1].loading = Math.floor((loaded / (total ?? loaded)) * 100);
                        } else {
                            newFile[newFile.length - 1].loading = 50;
                        }

                        return newFile;
                    });

                    if (loaded == total) {
                        const fileSize = total < 1024 * 1024 ? `${(total / 1024).toFixed()} KB` : `${(loaded / (1024 * 1024)).toFixed(2)} MB`;
                        setUploadedFiles((prev) => [...prev, { name: fileName, size: fileSize }]);
                        setFiles([]);
                        setShowProgress(false);
                    }
                },
            })
            .then((r) => console.log({ r }))
            .catch((e) => console.log({ e }));
        // console.log({ file, fileName });
    }

    return (
        <div className={cn(styles['app'], 'w-full container')}>
            <div className={cn(styles.app, styles['upload-box'])}>
                <p>Upload your file</p>
                <form action="">
                    <input
                        ref={fileInputRef}
                        className={styles['file-input']}
                        type="file"
                        name="file"
                        hidden
                        onChange={(e) => handleUploadFile(e)}
                    />
                    <button
                        type="button"
                        className={styles['icon']}
                        onClick={(e) => handleInputFileClick(e)}
                    >
                        <i>
                            <FileUpIcon />
                        </i>
                    </button>
                    <p>Browse file upload</p>
                </form>
                {showProgress && (
                    <section className={styles['loading-area']}>
                        {files.map((f, idx) => (
                            <li
                                key={idx}
                                className={styles['row']}
                            >
                                <i>
                                    <FileIcon />
                                </i>
                                <div className={styles['content']}>
                                    <span className={styles['name']}>{`${f.name} - uploading`}</span>
                                    <div className={styles['details']}>
                                        <div className={styles['loading-bar']}>
                                            <div
                                                className={styles['loading']}
                                                style={{ width: `${f.loading}%` }}
                                            ></div>
                                        </div>
                                        <span className={styles['percent']}>{`${f.loading}%`}</span>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </section>
                )}
                <section className={styles['upload-area']}>
                    {uploadedFiles.map((f, idx) => (
                        <li
                            key={idx}
                            className={styles['row']}
                        >
                            <div className={cn(styles['content'], styles['upload'])}>
                                <i>
                                    <FileIcon />
                                </i>
                                <div className={styles['details']}>
                                    <span className={styles['name']}>{f.name}</span>
                                    <span className={styles['size']}>{f.size}</span>
                                </div>
                            </div>
                            <i>
                                <CheckCircleIcon className={styles['check']} />
                            </i>
                        </li>
                    ))}
                </section>
            </div>
        </div>
    );
}
