import { NextResponse, type NextRequest } from 'next/server';

import NextAuth from 'next-auth';

import AuthConfig from '@/lib/auth/auth-config-antonio';
// import { auth } from '@/auth/auth-antonio';
import { publicRoutes, authRoutesList, apiAuthPrefix, DEFAULT_LOGIN_REDIRECT, authRoutes } from '@/lib/auth/routes';

const { auth } = NextAuth(AuthConfig);

export default auth((req) => {
    const { nextUrl } = req;

    const isLoggedIn = !!req.auth;
    const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
    const isPublicRoute = publicRoutes.some((d) => d.startsWith(`/${nextUrl.pathname.split('/')[1]}`));
    const isAuthRoute = (authRoutesList as Array<string>).includes(nextUrl.pathname);

    if (isApiAuthRoute) return NextResponse.next();

    if (nextUrl.pathname.startsWith('/api') && !isApiAuthRoute) {
        if (isLoggedIn) {
            return NextResponse.next();
        }
        return NextResponse.json(
            {
                success: false,
                data: null,
                message: 'you must loggin to acces resource',
            },
            { status: 401 }
        );
    }

    if (isAuthRoute) {
        if (isLoggedIn) {
            return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl), { status: 308 });
        }
        return NextResponse.next();
    }

    if (!isLoggedIn && !isPublicRoute && nextUrl.pathname !== '/') {
        let callbackUrl = nextUrl.pathname;
        if (nextUrl.search) {
            callbackUrl += nextUrl.search;
        }
        const encodeCallbackUrl = encodeURIComponent(callbackUrl);
        return NextResponse.redirect(new URL(`${authRoutes.login}?callbackUrl=${encodeCallbackUrl}`, nextUrl), { status: 307 });
        // return NextResponse.rewrite()
    }

    NextResponse.next();
});

/**
 * [Middleware NextJs.js](https://authjs.dev/getting-started/session-management/protecting#nextjs-middleware)
 */
export const config = {
    // matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'], // [match all route/request url by nextjs](https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher)
    matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'], // [match all route/request url by clerk](https://clerk.com/docs/quickstarts/nextjs#add-middleware-to-your-application)
    // matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
