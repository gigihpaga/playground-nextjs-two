import { type ReactNode } from 'react';
import type { Metadata } from 'next';
import { Manrope } from 'next/font/google';
import { cn } from '@/lib/classnames';

import { Header } from './_party/components/header';
import { Footer } from './_party/components/footer';
import { siteMetadata } from './_party/constants';

const manrope = Manrope({ subsets: ['latin'], display: 'swap', variable: '--font-manrope' });

export const metadata: Metadata = {
    metadataBase: new URL(siteMetadata.siteUrl),
    title: {
        template: `%s | ${siteMetadata.title}`,
        default: siteMetadata.title,
    },
    description: siteMetadata.description,
    openGraph: {
        title: siteMetadata.title,
        description: siteMetadata.description,
        url: siteMetadata.siteUrl,
        siteName: siteMetadata.title,
        images: [
            {
                url: siteMetadata.socialBanner,
                width: 800,
                height: 600,
            },
        ],
        locale: 'en-US',
        type: 'website',
    },
    robots: {
        index: true,
        follow: true,
        // nocache: true,
        googleBot: {
            index: true,
            follow: false,
            noimageindex: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    twitter: {
        card: 'summary_large_image',
        title: siteMetadata.title,
        images: siteMetadata.socialBanner,
        // description: siteMetadata.description,
        // siteId:"123"
        // creator: '',
        // creatorId: '',
    },
};

export default function BlogLayout({ children }: { children: ReactNode | ReactNode[] }) {
    return (
        <div
            aria-description="blog layout"
            className={cn(manrope.variable, 'w-full bg-cb-light dark:bg-cb-dark')}
        >
            <Header />
            {children}
            <Footer />
        </div>
    );
}
