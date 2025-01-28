'use client';

import { useEffect, useState, useRef } from 'react';

export function useHeadsObserver() {
    const observer = useRef<IntersectionObserver | null>(null);
    const [activeId, setActiveId] = useState<string>('');

    useEffect(() => {
        function handleObsever(entries: IntersectionObserverEntry[], ob: IntersectionObserver) {
            entries.forEach((entry) => {
                if (entry?.isIntersecting) {
                    setActiveId(entry.target.id);
                }
            });
        }

        observer.current = new IntersectionObserver(handleObsever, {
            rootMargin: '-5% 0% -50% 0px',
        });

        const elementsHeadings = document.querySelectorAll('.prose h2,h3,h4,h5,h6');
        elementsHeadings.forEach((elm) => void observer.current?.observe(elm));

        return () => void observer.current?.disconnect();
    }, []);

    return { activeId };
}
