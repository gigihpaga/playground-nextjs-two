'use client';

import { cn } from '@/lib/classnames';
import { DropFileInput } from '../components/drop-file-input';
import styles from '../components/drop-file-input.module.css';

export function Dropzone() {
    function onFileChange(files: File[]) {
        console.log(files);
    }
    return (
        <div className={cn(styles['app'], '_bg-[#fff] shadow-[rgba(149,157,165,0.2)_0px_8px_24px] p-[30px] rounded-[20px]')}>
            <h2 className="header mb-[30px] text-center">React drop files input</h2>
            <DropFileInput onFileChange={(files) => onFileChange(files)} />
        </div>
    );
}
