import { currentRole } from '@/lib/auth/current-login';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const role = await currentRole();
    if (role === 'ADMIN') {
        return NextResponse.json({ message: 'halo' }, { status: 200 }); // mime type auto "application/json"
    }

    return new NextResponse(JSON.stringify({ message: 'error response api' }), { status: 403 }); // mime type "text/plain;charset=UTF-8"
    // return new NextResponse(null, { status: 200 });
    // return NextResponse.json({ message: 'halo' }, { status: 200 }); // mime type auto "application/json"
}
