import { NextResponse, type NextRequest } from 'next/server';

import { getErrorMessage } from '@/utils/get-error-message';
import { standartErrorApiResponse } from '@/utils/standart-error-api-response';

/**
 * untuk mendapatkan cookie:
 * 1. buka [clashninja tab builder](https://www.clash.ninja/upgrade-tracker/rvyq9ggl/home#builders)
 * 2. login dengan `bons`
 * 3. buka devTools -> tab network
 * 4. aktifkan "Fetch/XHR" dan filter text: ".json"
 * 5. akan tampil file builder sesuai id account, file berformat .json
 * 6. di tab header:
 * > - section General -> lihat "request URL"
 * > - section Request Header -> copy value dari "Cookie" (harus di copy manual, tidak bisa di ambil dengan javascript)
 */
const clashNinjaCookie = process.env['CLASH_NINJA_COOKIE'];

export async function GET(req: NextRequest) {
    try {
        if (!clashNinjaCookie) {
            return NextResponse.json({ status: 500, message: 'clash ninja cookie not found in env file' }, { status: 500 });
        }

        const response = await fetch('https://www.clash.ninja/feed/planner/home/builders/rvyq9ggl.json', {
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Cookie': clashNinjaCookie,
            },
        });

        console.log('ninja', response.headers);
        if (!response.ok) {
            return NextResponse.json(
                { status: response.status, message: response.statusText },
                { status: response.status, statusText: response.statusText }
            );
        }

        const data = await response.json();
        return NextResponse.json({ data: data });
    } catch (error) {
        // console.log(error);
        // return NextResponse.json({ message: getErrorMessage(error) }, { status: 500 });
        return standartErrorApiResponse(error);
    }
}
