import Link from 'next/link';
import { format, parseISO } from 'date-fns';
import { type ReadTimeResults } from 'reading-time';
import { slug } from 'github-slugger';
import { type Doc } from 'contentlayer/generated';
import { Url as url } from '../../constants';
import { ViewCounter } from './view-counter';

interface BlogDetailsProps {
    doc: Doc;
    slugParams: string;
}

export function BlogDetails({ doc, slugParams }: BlogDetailsProps) {
    return (
        <div
            aria-description="blog details"
            className="px-2 md:px-10 py-2 mx-5 md:mx-10 bg-cb-accent dark:bg-cb-accent-dark text-cb-light flex items-center justify-around flex-wrap text-lg sm:text-xl font-medium  rounded-lg "
        >
            <time className="m-3">{format(parseISO(doc.publishedAt), 'LLLL d, yyyy')}</time>
            <span className="m-3">
                <ViewCounter slug={slugParams} />
            </span>
            <div className="m-3">{(doc.readingTime as ReadTimeResults).text}</div>
            <Link href={`${url.categories}/${slug(doc.tags[0])}`}>#{doc.tags[0]}</Link>
        </div>
    );
}
