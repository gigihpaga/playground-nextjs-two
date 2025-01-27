import { NextResponse, type NextRequest } from 'next/server';

import { getErrorMessage } from '@/utils/get-error-message';
import { standartErrorApiResponse } from '@/utils/standart-error-api-response';
import { getCollections } from '@/models/dev-collection';

export type ApiCollections = {
    data: Awaited<ReturnType<typeof getCollections>>;
};

export async function GET(req: NextRequest) {
    try {
        const collections = await getCollections();
        return NextResponse.json({ data: collections });
    } catch (error) {
        // console.log(error);
        // return NextResponse.json({ message: getErrorMessage(error) }, { status: 500 });
        return standartErrorApiResponse(error);
    }
}
