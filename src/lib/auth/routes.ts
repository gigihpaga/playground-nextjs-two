/**
 * An array of routes that are accesible to the public
 * These route do not require authentication
 * @type {string[]}
 */

export const publicRoutes: string[] = [
    //
    '/blog',
    '/api/testing',
    '/api/token',
];

export const authRoutes = {
    login: '/auth/login',
    register: '/auth/register',
    error: '/auth/error',
    reset: '/auth/reset',
    newVerification: '/auth/new-verification',
    newPassword: '/auth/new-password',
} as const;

/**
 * An array of routes that are used for authentication
 * These routes will redirect logged in users to "/settings"
 * @type {string[]}
 */

export const authRoutesList = [
    ...(Object.keys(authRoutes) as Array<keyof typeof authRoutes>).map((key) => authRoutes[key]),
    // you can add other routes, example: "/blog"
];

/**
 * The prefix for API authentication routes
 * Routes that start with this prefix are used for API authentication purposes
 * @type {string}
 */
export const apiAuthPrefix = '/api/auth';

/**
 * The default redirect path adter logging in
 * @type {string}
 */

export const DEFAULT_LOGIN_REDIRECT = '/dev/tutorial/code-with-antonio/authjs/setting-user';
