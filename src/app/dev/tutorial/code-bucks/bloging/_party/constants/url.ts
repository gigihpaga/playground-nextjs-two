const URL_ROOT = '/dev/tutorial/code-bucks/bloging' as const;

export const Url = {
    root: URL_ROOT,
    categories: `${URL_ROOT}/categories`,
    blogs: `${URL_ROOT}/blogs`,
    about: `${URL_ROOT}/about`,
    contact: `${URL_ROOT}/contact`,
} as const;
