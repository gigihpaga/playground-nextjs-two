import { NextResponse, type NextRequest } from 'next/server';

export const middleware = (req: NextRequest) => {
    return NextResponse.next();
};

export const config = {
    matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
