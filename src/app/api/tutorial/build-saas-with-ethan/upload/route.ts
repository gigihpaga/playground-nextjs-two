import { getErrorMessage } from '@/utils/get-error-message';
import { writeFile } from 'fs/promises';
import { NextResponse, type NextRequest } from 'next/server';
import { join } from 'path';

export async function POST(req: NextRequest) {
    try {
        const data = await req.formData();
        const file: File | null = data.get('file') as unknown as File;

        if (!file) return NextResponse.json({ message: 'file is required' }, { status: 400 });

        const bytes = await file.arrayBuffer();
        const buffer = new Uint8Array(bytes);

        /**
         * with the file data in the buffer, you can di whatever you want with it,
         * for this , we'll just write it to the file filesystem in a new location
         */
        const path = join(process.cwd(), '/public/uploads', file.name);
        await writeFile(path, buffer);

        console.log(`open ${path} to see the uploaded file`);
        // console.log('API build-saas-with-ethan: ', buffer);

        return NextResponse.json({ message: 'oke', data: file.name });
    } catch (error) {
        return NextResponse.json({ message: getErrorMessage(error) }, { status: 500 });
    }
}
