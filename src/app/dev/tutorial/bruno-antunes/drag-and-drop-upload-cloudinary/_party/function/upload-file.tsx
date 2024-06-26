type CloudinaryResponse = {
    asset_id: string;
    public_id: string;
    version: number;
    version_id: string;
    signature: string;
    width: number;
    height: number;
    format: string;
    resource_type: string;
    created_at: Date; // toISOString
    tags: string[];
    pages: number;
    bytes: number;
    type: string;
    etag: string;
    placeholder: boolean;
    url: string;
    secure_url: string;
    asset_folder: string;
    display_name: string;
    original_filename: string;
};

export function uploadFile(file: File, onProgess?: (precentage: number) => void) {
    const url = process.env.NEXT_PUBLIC_CLOUDINARY_URL;
    if (!url) throw new Error('NEXT_PUBLIC_CLOUDINARY_URL not found in env!');

    const preset_public_name = 'docs_upload_example_use_preset';
    const preset_default_name = 'ml_default';

    return new Promise<CloudinaryResponse['secure_url']>((res, rej) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', url);

        xhr.onload = () => {
            const resp = JSON.parse(xhr.responseText) as CloudinaryResponse;
            res(resp.secure_url);
        };

        xhr.onerror = (evt) => rej(evt);

        xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
                const precentage = (event.loaded / event.total) * 100;
                onProgess ? onProgess(Math.round(precentage)) : undefined;
            }
        };

        const formData = new FormData();
        formData.append('file', file);
        // formData.append('upload_preset', preset_public_name);
        formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_PRESET_NAME!);
        // formData.append('public_id', "gambar-paga");
        formData.append('api_key', process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!);

        xhr.send(formData);
    });
}
