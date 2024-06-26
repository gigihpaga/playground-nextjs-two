'use client';

import React, { useRef, useState } from 'react';
import styles from './_party/components/comp.module.css';

interface PageProps {
    params: { [key: string]: string | string[] | undefined } | Record<string, never>;
    searchParams: { [key: string]: string | string[] | undefined } | Record<string, never>;
}

function fileFiltered(files: FileList, images: Array<{ name: File['name']; url: string }>) {
    return Array.from(files)
        .filter((f) => f.type.split('/')[0] == 'image')
        .filter((f) => !images.some((img) => img.name == f.name));
}

export default function DragAndDroImagePage(req: PageProps) {
    const [images, setImages] = useState<Array<{ name: File['name']; url: string }>>([]);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    function selectFile(event: React.MouseEvent<HTMLSpanElement, MouseEvent>) {
        if (!fileInputRef.current) return;
        fileInputRef.current.click();
    }

    function handleOnChange(event: React.ChangeEvent<HTMLInputElement>) {
        const files = event.target.files;
        if (!files || files.length == 0) return;
        /* // using for loop
        for (let i = 0; i < files.length; i++) {
            if (files[i].type.split('/')[0] !== 'image') continue;
            if (!images.some((e) => e.name === files[i].name)) {
                setImages((prev) => [...prev, { name: files[i].name, url: URL.createObjectURL(files[i]) }]);
            }
        }
        */
        const validFiles = fileFiltered(files, images);
        if (validFiles.length) {
            setImages((prev) => [...prev, ...validFiles.map((f) => ({ name: f.name, url: URL.createObjectURL(f) }))]);
        }
    }

    function handleDeleteImage(index: number) {
        setImages((prev) => {
            URL.revokeObjectURL(prev[index].url);
            return prev.filter((d, i) => i != index);
        });
    }

    function handleDragEnter(event: React.DragEvent<HTMLDivElement>) {
        //* FIRE ONCE
        event.preventDefault();
        console.log('DRAG ENTER');
        setIsDragging(true);
        event.dataTransfer.dropEffect = 'copy';
    }

    function handleOnDragOver(event: React.DragEvent<HTMLDivElement>) {
        //! FIRE CONTINUES !!!!
        event.preventDefault();
        console.log('DRAG OVER');
        // setIsDragging(true);
        // event.dataTransfer.dropEffect = 'copy';
    }

    function handleOnDragLeave(event: React.DragEvent<HTMLDivElement>) {
        event.preventDefault();
        console.log('DRAG LEAVE');
        setIsDragging(false);
    }

    function handleOnDrop(event: React.DragEvent<HTMLDivElement>) {
        event.preventDefault();
        console.log('DRAG DROP');
        setIsDragging(false);
        const files = event.dataTransfer.files;
        // console.log('DROP', files);
        if (!files || files.length == 0) return;
        const validFiles = fileFiltered(files, images);
        if (validFiles.length) {
            setImages((prev) => [...prev, ...validFiles.map((f) => ({ name: f.name, url: URL.createObjectURL(f) }))]);
        }
    }

    return (
        <section className="w-full container">
            <div className={styles['card']}>
                <div className={styles['top']}>
                    <p>Drag & Drop image uploading</p>
                </div>
                <div
                    className={styles['drag-area']}
                    onDragEnter={(e) => handleDragEnter(e)}
                    onDragOver={(e) => handleOnDragOver(e)}
                    onDragLeave={(e) => handleOnDragLeave(e)}
                    onDrop={(e) => handleOnDrop(e)}
                >
                    {isDragging ? (
                        <span className={styles['select']}>Drop Image here</span>
                    ) : (
                        <>
                            &nbsp;Drag & Drop image here&nbsp;
                            {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events */}
                            <span
                                className={styles['select']}
                                role="button"
                                tabIndex={-1}
                                onClick={(e) => selectFile(e)}
                            >
                                Browse
                            </span>
                        </>
                    )}

                    <input
                        type="file"
                        name="file"
                        className={styles['file']}
                        multiple
                        ref={fileInputRef}
                        onChange={(e) => handleOnChange(e)}
                    />
                </div>
                <div className={styles['container']}>
                    {images.map((d, idx) => (
                        <div
                            key={d.name}
                            className={styles['image']}
                        >
                            {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events */}
                            <span
                                role="button"
                                tabIndex={-1}
                                onClick={() => handleDeleteImage(idx)}
                                className={styles['delete']}
                            >
                                &times;
                            </span>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={d.url}
                                alt={d.name}
                            />
                        </div>
                    ))}
                    <button type="button">Upload</button>
                </div>
            </div>
        </section>
    );
}
