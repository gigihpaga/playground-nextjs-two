import { FormUpload } from './_party/features/form-upload';

interface PageProps {
    params: { [key: string]: string | string[] | undefined } | Record<string, never>;
    searchParams: { [key: string]: string | string[] | undefined } | Record<string, never>;
}

export default async function UploadDragAndDropPage(req: PageProps) {
    return (
        <div className="w-full container">
            <p className="mb-[50px]">UploadDragAndDropPage</p>
            <FormUpload />
        </div>
    );
}
