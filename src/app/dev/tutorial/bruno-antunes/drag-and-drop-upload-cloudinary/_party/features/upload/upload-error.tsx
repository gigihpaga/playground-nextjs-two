import { Progress } from '@/components/ui/progress';
import { FileHeader } from './file-header';
import { type FileError } from 'react-dropzone';

interface Props {
    file: File;
    errorText?: FileError['message'];
    onDelete: (file: File) => void;
}

export function UploadError({ file, errorText, onDelete }: Props) {
    return (
        <>
            <FileHeader
                file={file}
                onDelete={onDelete}
            />
            {errorText && <p className="text-xs font-light">{errorText}</p>}
            <Progress
                className="[&>div]:bg-destructive"
                value={100}
            />
        </>
    );
}
