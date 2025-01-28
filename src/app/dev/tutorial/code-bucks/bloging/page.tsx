import { allDocs } from 'contentlayer/generated';
import { HomeConverSection, FeaturedPost, RecentPost } from './_party/features/home';

export default async function BlogingPage() {
    return (
        <div className="flex flex-col items-center justify-center">
            <HomeConverSection docs={allDocs} />
            <FeaturedPost docs={allDocs} />
            <RecentPost docs={allDocs} />
        </div>
    );
}

// export const rootUrl = '/dev/tutorial/code-bucks/bloging' as const;
