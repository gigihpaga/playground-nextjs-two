'use client';

import { useHeadsObserver } from '../../hooks/use-heads-observer';
import { cn } from '@/lib/classnames';
import { type Toc as TocType } from '~/contentlayer.config';

export function Toc({ tocs }: { tocs: TocType[] }) {
    const { activeId } = useHeadsObserver();

    return (
        <div
            aria-description="table of wrapper"
            className="_hidden _sm:block col-span-12 sticky top-0 lg:static lg:col-span-4  _bg-red-400 dark:bg-cb-dark bg-cb-light z-[2]"
        >
            <details
                open
                className=" border border-solid _border-cb-dark _dark:border-cb-light _text-cb-dark rounded-lg p-4 max-height-[80vh] overflow-x-hidden overscroll-y-auto select-none"
            >
                <summary className="md:text-lg font-semibold capitalize cursor-pointer">Table Of Content</summary>
                <ul className="mt-4 space-y-1 overflow-x-hidden text-sm">
                    {tocs.map((toc, idx) => (
                        <li
                            className="flex"
                            key={toc.slug}
                        >
                            <a
                                href={`#${toc.slug}`}
                                className={cn(
                                    // eslint-disable-next-line quotes
                                    "underline-offset-2 data-[level='1']:pl-0 data-[level='2']:pl-4 data-[level='3']:pl-7 data-[level='4']:pl-10 data-[level='5']:pl-14 data-[level=6]:pl-16 _text-nowrap flex items-start justify-start space-x-1 hover:text-cb-accent",
                                    toc.slug === activeId && 'underline'
                                )}
                                data-level={toc.level}
                            >
                                {/* {toc.level === 3 ? (
                                    <span>&#x2022;</span>
                                ) : toc.level === 4 ? (
                                    <span className="text-xs">&gt;</span>
                                ) : (
                                    <span>&#8209;</span>
                                )} */}
                                <span>&#x2022;</span>
                                <span>{toc.text}</span>
                            </a>
                        </li>
                    ))}
                </ul>
            </details>
        </div>
    );
}
