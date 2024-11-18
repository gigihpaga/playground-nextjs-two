import { NextResponse, type NextRequest } from 'next/server';

import NextAuth from 'next-auth';

import AuthConfig from '@/lib/auth/auth-config-antonio';
// import { auth } from '@/auth/auth-antonio';
import { publicRoutes, authRoutesList, apiAuthPrefix, DEFAULT_LOGIN_REDIRECT, authRoutes } from '@/lib/auth/routes';

const { auth } = NextAuth(AuthConfig);
/**
 * i want to get role user in middleware
 * fix single instants
 * - [in the middleware, the session is not extended with custom fields](https://github.com/nextauthjs/next-auth/issues/9836#issuecomment-1925514747)
 * - change
 * ```js
 * import NextAuth from 'next-auth';
 * import AuthConfig from '@/lib/auth/auth-config-antonio';
 * const { auth } = NextAuth(AuthConfig)
 *
 * // to
 * import { auth } from '@/lib/auth/auth-antonio';
 * ```
 * setelah mendapatkan solusi, muncul masalah baru 🤣
 * - [Can't use Prisma client in Next.js middleware, even when deploying to Node.js](https://github.com/prisma/prisma/issues/21310)
 */
// import { auth } from '@/lib/auth/auth-antonio';

export default auth((req) => {
    const { nextUrl } = req;

    const isLoggedIn = !!req.auth;
    const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
    const isPublicRoute = publicRoutes.some((d) => d.startsWith(`/${nextUrl.pathname.split('/')[1]}`));
    const isApiPublic = publicRoutes.filter((d) => d.startsWith('/api/')).some((d) => d.startsWith(nextUrl.pathname));
    const isAuthRoute = (authRoutesList as Array<string>).includes(nextUrl.pathname);

    if (isApiAuthRoute || isApiPublic) return NextResponse.next();

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
 * /((?!.*\\..*|_next|_next/static|_next/image|images).*)
 */
export const config = {
    // matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'], // [match all route/request url by nextjs](https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher)
    matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'], // [match all route/request url by clerk](https://clerk.com/docs/quickstarts/nextjs#add-middleware-to-your-application)
    // matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
