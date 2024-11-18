import { NextResponse, type NextRequest } from 'next/server';
import { cookies, headers } from 'next/headers';
import { type GetTokenParams, getToken as getTokenJWT } from 'next-auth/jwt';

import { getErrorMessage } from '@/utils/get-error-message';
import { auth, signIn } from '@/lib/auth/auth-antonio';

function getHeader(headerEntries: IterableIterator<[string, string]>, filters?: string[]) {
    const arrHeaders = Array.from(headerEntries)
        .map(([key, value]) => ({ key, value }))
        .filter((d) => {
            if (filters) {
                return filters.some((f) => d.key === f);
            } else {
                return true;
            }
        })
        .map(({ key, value }) => {
            return {
                key,
                value: value.split(';'),
            };
        });
    return arrHeaders;
}

async function getToken(req: NextRequest) {
    return await getTokenJWT({
        req,
        secret: process.env.AUTH_SECRET!,
        // salt: '',
        raw: true,
    } as unknown as GetTokenParams<false>);
}

/**
 * untuk bypass auth api, gunakan POSTMAN
 * set:
 * Header => key Cookie:
 *
 * authjs.callback-url=http%3A%2F%2Flocalhost%3A3000;
 * authjs.csrf-token=018b5b524c5a5fead5fcdb93f63df82bde5c9cd4aaf5992592b9711525b85098%7C0d5f52f91873949d6f6277c82c2c1afa42aad5ced255d6655f54269d11d7ac30;
 * authjs.session-token=eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2Q0JDLUhTNTEyIiwia2lkIjoibEk2TVkzdmR1UmRkMVBOd3piU1ByRUQtYUpRa19UR1BYVGItT2FXUDZlMm1XUzVpbV9LOENHWkcyOVdWNGM4MFREOE9VLVhpejIwa2FLcFN1T3hwbXcifQ..WyP0eAi_ANG3QF2isx7BHw.m9ZEelDtR_DHwRJiSXb3Sq-iurjpntUbVxh4grWZ7HbfzjNHCtzUXI7rtOUSkImWMryXDMrMQRr1FfkxXzWAYwpPrex9pJNLuevj9ObPehpz3l-QNcCJ2ELkfDtjgmShmv5XGUgTun4aBJYj57VSWaQ5Pd9Sd9Iit5Ihv5Kygdfvh81JDCu5ZAZPVi6temqRSUN48cKKOY6nKMVPGMOeM3DSCNry8TU9lT1yZS09VrJ_uFyh4eUldS5rETSiy2ZWVSrvURqYVsZ46gSKY5uRZl6MeEuVr_5Cx3USxNBbflFNMw-njB9HM3aiWMELppxK.XWLobKLfgnEgRuR4LnEXUMSvhh-3rGFMli_0o8eKjTc
 *
 * @param req
 * @returns
 */
export async function GET(req: NextRequest) {
    const arrCookies = cookies()
        .getAll()
        .map(({ name, value }) => ({ name, value }));

    const token = await getToken(req);
    const authorizationHeader = req.headers.get('authorization');
    const arrHeaders = getHeader(req.headers.entries(), ['cookie' /* 'set-cookie' */]);

    const sessionAuth = await auth();

    const data = {
        token,
        authorizationHeader,
        arrHeaders /* arrCookies */,
        sessionAuth: sessionAuth,
    };

    try {
        return NextResponse.json({ ...data });
    } catch (error) {
        return NextResponse.json({ message: getErrorMessage(error) }, { status: 500 });
    }
}
