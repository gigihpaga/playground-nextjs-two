import type { Metadata } from 'next';

// please update required information

export const siteMetadata = {
    // title: 'Next.js Blog With Tailwind CSS and Contentlayer',
    title: 'Next.js Bloger',
    author: 'GigihPaga',
    headerTitle: 'Next.js Blog',
    description: 'A blog created with Next.js, Tailwind.css and contentlayer.',
    language: 'en-us',
    theme: 'system', // system, dark or light
    siteUrl: process.env.NEXT_PUBLIC_APP_URL!, //'https://create-blog-with-nextjs.vercel.app', // your website URL
    siteLogo: '/logo.png',
    socialBanner: '/social-banner.png', // add social banner in the public folder
    email: 'gigihpatga@gmail.com',
    github: 'https://github.com/gigihpaga',
    twitter: 'https://twitter.com/gigihpaga',
    facebook: 'https://facebook.com/gigihpaga',
    youtube: 'https://youtube.com/codebucks',
    linkedin: 'https://www.linkedin.com/in/gigihpatga/',
    dribbble: 'https://www.dribbble.com',
    locale: 'en-US',
} as const;
