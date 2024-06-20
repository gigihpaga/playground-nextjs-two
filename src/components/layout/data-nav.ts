type Std = { title: string; href: string; description: string };

export const components: Std[] = [
    {
        title: 'Alert Dialog',
        href: '/docs/primitives/alert-dialog',
        description: 'A modal dialog that interrupts the user with important content and expects a response.',
    },
    {
        title: 'Hover Card',
        href: '/docs/primitives/hover-card',
        description: 'For sighted users to preview content available behind a link.',
    },
    {
        title: 'Progress',
        href: '/docs/primitives/progress',
        description: 'Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.',
    },
    {
        title: 'Scroll-area',
        href: '/docs/primitives/scroll-area',
        description: 'Visually or semantically separates content.',
    },
    {
        title: 'Tabs',
        href: '/docs/primitives/tabs',
        description: 'A set of layered sections of content—known as tab panels—that are displayed one at a time.',
    },
    {
        title: 'Tooltip',
        href: '/docs/primitives/tooltip',
        description: 'A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.',
    },
];

export const getStarteds: Std[] = [
    {
        title: 'gigihpaga/dev',
        href: '/',
        description: 'Beautifully designed components built with Radix UI and Tailwind CSS.',
    },
    {
        title: 'Introduction',
        href: '/docs',
        description: 'Re-usable components built using Radix UI and Tailwind CSS.',
    },
    {
        title: 'Installation',
        href: '/docs/installation',
        description: 'How to install dependencies and structure your app.',
    },
    {
        title: 'Typography',
        href: '/docs/primitives/typography',
        description: ' Styles for headings, paragraphs, lists...etc',
    },
];

const TagValue = ['Drag N Drop', 'Data Fetching', 'Database', 'UI/UX', 'Motion', 'Auth', 'Component'] as const;

const PackageValue = ['zod', 'react-hook-form', 'next-auth', 'framer-motion', 'prisma', 'shadcn'] as const;

export type Book = {
    title: string;
    description: string;
    urlCode: `/${string}`;
    titleTutorial: string;
    urlTutorial: string;
    tags: Array<(typeof TagValue)[number]>;
    packages: Array<(typeof PackageValue)[number]>;
    urlResources: Array<string>;
};

export type Tutorial = {
    instructorName: string;
    urlBase: `/${string}`;
    books: Array<Book>;
};

export const tutorial: Tutorial[] = [
    {
        instructorName: 'elliott chong',
        urlBase: '/dev/tutorial/elliott-chong',
        books: [
            {
                title: 'form step',
                description: 'form 2 step with frammer motion',
                urlCode: '/form-step',
                titleTutorial: 'I Never Want To Create Forms Any Other Way',
                urlTutorial: 'https://www.youtube.com/watch?v=26bSDD9IEG4&t=121s',
                urlResources: ['https://github.com/Elliott-Chong/shadcn-form-yt'],
                tags: ['UI/UX', 'Motion', 'Component'],
                packages: ['framer-motion', 'zod', 'shadcn'],
            },
        ],
    },
    {
        instructorName: 'code with kliton',
        urlBase: '/dev/tutorial/code-with-kliton',
        books: [
            {
                title: 'remind me',
                description: 'task manager app',
                urlCode: '/remindme',
                titleTutorial: 'NextJs course Full Stack RemindApp ReactJs Typescript, React Hook form, ShadcnUI, TailwindCSS',
                urlTutorial: 'https://www.youtube.com/watch?v=jAMVODrNd9I&t=2286s',
                urlResources: ['https://github.com/Kliton/fullstack_remindMe_youtube_video', 'https://fullstack-remind-me-youtube-video.vercel.app/'],
                tags: ['Database'],
                packages: ['shadcn', 'react-hook-form', 'zod', 'prisma'],
            },
        ],
    },
    {
        instructorName: 'code with antonio',
        urlBase: '/dev/tutorial/code-with-antonio',
        books: [
            {
                title: 'autentication next-auth 5',
                description: 'OAuth google, github dan credtial with email verification using resend',
                urlCode: '/authjs',
                titleTutorial: 'NextJs course Full Stack RemindApp ReactJs Typescript, React Hook form, ShadcnUI, TailwindCSS',
                urlTutorial: 'https://www.youtube.com/watch?v=1MTyCvS05V4',
                urlResources: ['https://www.codewithantonio.com/projects/auth-masterclass'],
                tags: ['Auth'],
                packages: ['shadcn', 'react-hook-form', 'zod', 'next-auth'],
            },
        ],
    },
];
