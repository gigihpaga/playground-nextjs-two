'use client';

import React, { useRef } from 'react';
import { DownloadIcon } from 'lucide-react';

import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { selectCarxGrindingState, type CarxGrindingState } from '../state/carx-grinding-slice';

import { Button } from '@/components/ui/button';
import { useCurrentUser } from '@/hooks/use-current-login';

export function ButtonDownload() {
    const carxGrindingState = useAppSelector(selectCarxGrindingState);
    const elementAnchorDonwloadRef = useRef<HTMLAnchorElement | null>(null);
    const user = useCurrentUser();

    function handleDownload(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        const { current: anchor } = elementAnchorDonwloadRef;
        if (!anchor) return;

        const dataState: CarxGrindingState = carxGrindingState;

        let urlBlob = '';
        const fileName = `data carx grinding - ${user?.name ?? 'nouser'} - ${new Date().toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'medium', hour12: false })}.json`;

        anchor.onclick = (ev) => {
            event.preventDefault();
            const blob = new Blob([JSON.stringify(dataState, null, 2)], { type: 'application/json' });
            urlBlob = window.URL.createObjectURL(blob);

            anchor.href = urlBlob;
            anchor.download = fileName;
        };

        anchor.click();
        window.URL.revokeObjectURL(urlBlob);
        anchor.href = 'yourblob';
        anchor.download = 'filename.json';
    }

    return (
        <>
            <Button
                size="icon"
                className="size-6"
                title="download data carx grinding"
                onClick={(event) => handleDownload(event)}
            >
                <DownloadIcon className="size-4" />
            </Button>
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid, jsx-a11y/anchor-has-content */}
            <a
                ref={elementAnchorDonwloadRef}
                href=""
                download=""
                target="_blank"
                className="sr-only"
                rel="noopener noreferrer"
            />
        </>
    );
}
