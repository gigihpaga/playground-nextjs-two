'use client';
import { useEffect, useState } from 'react';
import { mutationIncrementView, queryViewCount } from '../../services/fetch-blog-viewer';

interface ViewCounterProps {
    slug: string;
    noCount?: boolean;
    showCount?: boolean;
}

export function ViewCounter({ slug, noCount = false, showCount = true }: ViewCounterProps) {
    const [view, setView] = useState(0);

    useEffect(() => {
        if (!noCount) {
            void mutationIncrementView(slug);
        }
    }, [noCount, slug]);

    useEffect(() => {
        queryViewCount(slug).then((viewer) => {
            setView(viewer);
        });
    }, [slug]);

    return <div>{view} views</div>;
}
