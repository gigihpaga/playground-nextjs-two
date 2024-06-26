'use client';

import { useCallback, useEffect, useState } from 'react';
import { useField } from 'formik';
import { useDropzone, type FileRejection, type FileError } from 'react-dropzone';

import { SingleFileUploadField } from './single-file-upload-field';
import { UploadError } from './upload-error';

interface Props {
    name: string;
}

interface UploadableFile {
    file: File;
    errors: FileError[];
    url?: string;
}

let currentId = 0;

function getNewId() {
    // we could use a fancier solution instead of a sequential ID :)
    return ++currentId;
}

export function MultipleFileUploadField({ name }: Props) {
    const [fi, fm, helpers] = useField(name);
    const [files, setFiles] = useState<UploadableFile[]>([]);

    useEffect(() => {
        helpers.setValue(files);
        // helpers.setTouched(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [files]);

    const onDrop = useCallback((acceptedFiles: File[], fileRejections: FileRejection[]) => {
        // Do something with the files
        const mappedAcc = acceptedFiles.map((file) => ({ file: file, errors: [], id: getNewId() }));
        const mappedRej = fileRejections.map((r) => ({ ...r, id: getNewId() }));
        setFiles((curr) => [...curr, ...mappedAcc, ...mappedRej]);
    }, []);

    /**
     * accept:
     * - [Accepting specific file types](https://react-dropzone.js.org/#!/Accepting%20specific%20file%20types)
     */
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.png', '.jpeg', '.jpg', '.svg', '.tif', '.tiff', '.webp', '.gif'],
        },
        maxSize: 1024 * 200, // 200kb
    });

    function handleOnUpload(file: File, url: string) {
        setFiles((curr) =>
            curr.map((fw) => {
                if (fw.file === file) {
                    return { ...fw, url };
                }
                return fw;
            })
        );
    }

    function handleOnDelete(file: File) {
        setFiles((curr) => curr.filter((fw) => fw.file !== file));
    }

    console.log('MultipleFileUploadField RENDER', { files });
    return (
        <>
            <div
                className="h-[8rem] flex justify-center items-center border cursor-pointer"
                aria-description="dropzone file"
                {...getRootProps()}
            >
                <input {...getInputProps()} />
                {isDragActive ? <p>Drop the files here ...</p> : <p>Drag drop some files here, or click to select files</p>}
            </div>
            <div className="space-y-4">
                {files.map((fw, idx) => (
                    <div
                        key={fw.file.name + Date.now().toString()}
                        className="space-y-1"
                    >
                        {fw.errors.length ? (
                            <UploadError
                                file={fw.file}
                                onDelete={handleOnDelete}
                                errorText={fw.errors[0].message}
                            />
                        ) : (
                            <SingleFileUploadField
                                file={fw.file}
                                onDelete={(e) => handleOnDelete(e)}
                                // onUpload={(f, u) => handleOnUpload(f, u)}
                            />
                        )}
                    </div>
                ))}
            </div>
            <pre className="mt-[50px]">files: {JSON.stringify(files, null, 4)}</pre>
        </>
    );
}
