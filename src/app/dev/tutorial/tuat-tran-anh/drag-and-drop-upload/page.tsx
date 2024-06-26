import { Dropzone } from './_party/features/dropzone';

interface PageProps {
    params: { [key: string]: string | string[] | undefined } | Record<string, never>;
    searchParams: { [key: string]: string | string[] | undefined } | Record<string, never>;
}

export default async function DragAndDropUploadPage(req: PageProps) {
    return (
        <div className="w-full container">
            <Dropzone />
        </div>
    );
}
