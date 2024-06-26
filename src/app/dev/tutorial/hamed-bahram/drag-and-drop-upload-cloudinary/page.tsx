import { Montserrat, Playfair_Display } from 'next/font/google';
import { Dropzone } from './_party/features/dropzone';

const montserrat = Montserrat({
    subsets: ['latin'],
    variable: '--font-montserrat',
});

const playfairDisplay = Playfair_Display({
    subsets: ['latin'],
    variable: '--font-play-fair-display',
});

interface PageProps {
    params: { [key: string]: string | string[] | undefined } | Record<string, never>;
    searchParams: { [key: string]: string | string[] | undefined } | Record<string, never>;
}

export default async function DragAndDropUploadCloudinaryPage(req: PageProps) {
    return (
        <section
            style={{ fontFamily: 'var(--font-montserrat)' }}
            className={`py-16 w-full ${montserrat.variable} ${playfairDisplay.variable} font-sans`}
        >
            <div className="container">
                <h1 className="title text-3xl font-bold">Upload Files</h1>
                <Dropzone className="p-16 mt-10 border border-neutral-200" />
            </div>
        </section>
    );
}
