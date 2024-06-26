'use client';

import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import {
    BsFiletypePng as PNGIcon,
    BsFiletypeCss as CSSIcon,
    BsFiletypePdf as PDFIcon,
    BsFileEarmark,
    BsFileEarmarkImage as FileDefaultIcon,
    BsFiletypeJpg as JPGIcon,
    BsX as XIcon,
} from 'react-icons/bs';

import { TbCloudUpload as UploadIcon } from 'react-icons/tb';

import styles from './drop-file-input.module.css';

const IconFile = {
    default: FileDefaultIcon,
    pdf: PDFIcon,
    png: PNGIcon,
    css: CSSIcon,
    jpg: JPGIcon,
    jpeg: JPGIcon,
};

type IconFileKeys = keyof typeof IconFile;

interface DropFileInputProps {
    onFileChange: (files: File[]) => void;
}

export function DropFileInput({ onFileChange }: DropFileInputProps) {
    const wrapperRef = useRef<HTMLDivElement | null>(null);

    const [fileList, setFileList] = useState<File[]>([]);

    const onDragEnter = () => {
        if (!wrapperRef.current) return;
        wrapperRef.current.classList.add(styles['dragover']);
    };

    const onDragLeave = () => {
        if (!wrapperRef.current) return;
        wrapperRef.current.classList.remove(styles['dragover']);
    };

    const onDrop = () => {
        if (!wrapperRef.current) return;
        wrapperRef.current.classList.remove(styles['dragover']);
    };

    const onFileDrop = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newFile = e.target.files?.[0];
        if (newFile) {
            const updatedList = [...fileList, newFile];
            setFileList(updatedList);
            onFileChange(updatedList);
        }
    };

    const fileRemove = (file: File) => {
        const updatedList = [...fileList];
        updatedList.splice(fileList.indexOf(file), 1);
        setFileList(updatedList);
        onFileChange(updatedList);
    };

    return (
        <>
            <div
                ref={wrapperRef}
                className={styles['drop-file-input']}
                onDragEnter={onDragEnter}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
            >
                <div className={styles['drop-file-input__label']}>
                    {/* <img
                        src={uploadImg}
                        alt=""
                    /> */}
                    <UploadIcon className="size-[75px] text-blue-500" />
                    <p>Drag & Drop your files here</p>
                </div>
                <input
                    type="file"
                    value=""
                    onChange={onFileDrop}
                />
            </div>
            {fileList.length > 0 ? (
                <div className={styles['drop-file-preview']}>
                    <p className={styles['drop-file-preview__title']}>Ready to upload</p>
                    {fileList.map((item, index) => (
                        <div
                            key={index}
                            className={styles['drop-file-preview__item']}
                        >
                            {/* {console.log(item.type.split('/')[1]) as ReactNode} */}
                            {/* <IconFile.default /> */}
                            {/* {IconFile[item.type.split('/')[1] as IconFileKeys] === undefined ? } */}
                            {Object.keys(IconFile).some((key) => key === item.type.split('/')[1])
                                ? IconFile[item.type.split('/')[1] as IconFileKeys]({ size: 24, className: 'mr-[15px] mt-[5px]' })
                                : IconFile['default']({ size: 24, className: 'mr-[15px] mt-[5px]' })}
                            <div className={styles['drop-file-preview__item__info']}>
                                <p>{item.name}</p>
                                <p>{item.size}B</p>
                            </div>
                            <button
                                className={styles['drop-file-preview__item__del']}
                                onClick={() => fileRemove(item)}
                            >
                                <XIcon className="size-6" />
                            </button>
                        </div>
                    ))}
                </div>
            ) : null}
        </>
    );
}

// DropFileInput.propTypes = { onFileChange: PropTypes.func };
