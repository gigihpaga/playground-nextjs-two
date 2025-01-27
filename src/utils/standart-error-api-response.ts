import { NextResponse } from 'next/server';
import { serializeErrorMessage } from './serialize-error-message';

export function standartErrorApiResponse(error: unknown) {
    const err = serializeErrorMessage(error);
    let status = 500;
    if (err.errorType === 'prisma') {
        status = 501;
    } else if (err.errorType === 'zod') {
        status = 400;
    } else {
        status = 500;
    }

    return NextResponse.json(err, { status: status });
}
