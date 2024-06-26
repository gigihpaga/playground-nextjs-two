'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { useDropzone, type FileRejection } from 'react-dropzone';
import { UploadIcon, XIcon } from 'lucide-react';

type ExtendFile = File & { preview?: string };

export function Dropzone({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    const [files, setFiles] = useState<ExtendFile[]>([]);
    const [rejected, setRejected] = useState<FileRejection[]>([]);

    const onDrop = useCallback((acceptedFiles: ExtendFile[], rejectedFiles: FileRejection[]) => {
        if (acceptedFiles.length) {
            setFiles((previousFiles) => [
                ...previousFiles,
                ...acceptedFiles.map((file) => Object.assign(file, { preview: URL.createObjectURL(file) })),
            ]);
        }

        if (rejectedFiles.length) {
            setRejected((previousFiles) => [...previousFiles, ...rejectedFiles]);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: {
            'image/*': ['.png', '.jpeg', '.jpg', '.svg', '.tif', '.tiff', '.webp', '.gif'],
        },
        maxSize: 1024 * 200, // 200kb
        onDrop,
    });

    useEffect(() => {
        // Revoke the data uris to avoid memory leaks
        return () =>
            files.forEach((file) => {
                if (!file.preview) return;
                URL.revokeObjectURL(file.preview);
            });
    }, [files]);

    const removeFile = (name: File['name']) => {
        setFiles((files) => files.filter((file) => file.name !== name));
    };

    const removeAll = () => {
        setFiles([]);
        setRejected([]);
    };

    const removeRejected = (name: File['name']) => {
        setRejected((files) => files.filter(({ file }) => file.name !== name));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!files?.length) return;

        const URL = process.env.NEXT_PUBLIC_CLOUDINARY_URL,
            PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_PRESET_NAME,
            API_KEY = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
        if (!URL) throw new Error('NEXT_PUBLIC_CLOUDINARY_URL not found on env!');
        if (!PRESET) throw new Error('NEXT_PUBLIC_CLOUDINARY_PRESET_NAME not found on env!');
        if (!API_KEY) throw new Error('NEXT_PUBLIC_CLOUDINARY_API_KEY not found on env!');

        const formData = new FormData();
        files.forEach((file) => formData.append('file', file));
        formData.append('upload_preset', PRESET);
        formData.append('api_key', API_KEY);

        const data = await fetch(URL, {
            method: 'POST',
            body: formData,
        }).then((res) => res.json());

        console.log(data);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div
                {...getRootProps({
                    className: className,
                })}
                {...props}
            >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center justify-center gap-4">
                    <UploadIcon className="w-5 h-5 _fill-current" />
                    {isDragActive ? <p>Drop the files here ...</p> : <p>Drag & drop files here, or click to select files</p>}
                </div>
            </div>

            {/* Preview */}
            <section className="mt-10">
                <div className="flex gap-4">
                    <h2 className="title text-3xl font-semibold">Preview</h2>
                    <button
                        type="button"
                        onClick={removeAll}
                        className="mt-1 text-[12px] uppercase tracking-wider font-bold text-neutral-500 border border-secondary-400 rounded-md px-3 hover:bg-secondary-400 hover:text-white transition-colors"
                    >
                        Remove all files
                    </button>
                    <button
                        type="submit"
                        className="ml-auto mt-1 text-[12px] uppercase tracking-wider font-bold text-neutral-500 border border-purple-400 rounded-md px-3 hover:bg-purple-400 hover:text-white transition-colors"
                    >
                        Upload to Cloudinary
                    </button>
                </div>

                {/* Accepted files */}
                <h3 className="title text-lg font-semibold text-neutral-600 mt-10 border-b pb-3">Accepted Files</h3>
                <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-10">
                    {files.map((file) => (
                        <li
                            key={file.name}
                            className="relative h-32 rounded-md shadow-lg"
                        >
                            <Image
                                src={file.preview ?? '/'}
                                alt={file.name}
                                width={100}
                                height={100}
                                onLoad={() => {
                                    if (!file.preview) return;
                                    URL.revokeObjectURL(file.preview);
                                }}
                                className="h-full w-full object-contain rounded-md"
                            />
                            <button
                                type="button"
                                className="w-7 h-7 border border-secondary-400 bg-secondary-400 rounded-full flex justify-center items-center absolute -top-3 -right-3 hover:bg-white transition-colors"
                                onClick={() => removeFile(file.name)}
                            >
                                <XIcon className="w-5 h-5 fill-white hover:fill-secondary-400 transition-colors" />
                            </button>
                            <p className="mt-2 text-neutral-500 text-[12px] font-medium">{file.name}</p>
                        </li>
                    ))}
                </ul>

                {/* Rejected Files */}
                <h3 className="title text-lg font-semibold text-neutral-600 mt-24 border-b pb-3">Rejected Files</h3>
                <ul className="mt-6 flex flex-col">
                    {rejected.map(({ file, errors }) => (
                        <li
                            key={file.name}
                            className="flex items-start justify-between"
                        >
                            <div>
                                <p className="mt-2 text-neutral-500 text-sm font-medium">{file.name}</p>
                                <ul className="text-[12px] text-red-400">
                                    {errors.map((error) => (
                                        <li key={error.code}>{error.message}</li>
                                    ))}
                                </ul>
                            </div>
                            <button
                                type="button"
                                className="mt-1 py-1 text-[12px] uppercase tracking-wider font-bold text-neutral-500 border border-secondary-400 rounded-md px-3 hover:bg-secondary-400 hover:text-white transition-colors"
                                onClick={() => removeRejected(file.name)}
                            >
                                remove
                            </button>
                        </li>
                    ))}
                </ul>
            </section>
        </form>
    );
}
