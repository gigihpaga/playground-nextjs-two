import Image from 'next/image';
import Link from 'next/link';
import { slug } from 'github-slugger';

import { type Doc } from 'contentlayer/generated';
import { Tag } from './tag';
import { Url as url } from '../constants';

interface Props {
    attribute?: string;
}

export function BlogLayoutOne({ doc }: { doc: Doc }) {
    return (
        <div className="group/card inline-block overflow-hidden rounded-xl">
            <div
                aria-description="overlay image"
                className="absolute top-0 left-0 right-0 h-full bg-gradient-to-b from-transparent from-0% to-cb-dark rounded-xl z-[1]"
            />
            <Image
                className="w-full h-full object-center object-cover rounded-xl group-hover/card:scale-105 transition-[transform] ease-linear duration-300"
                // fill
                width={doc.image.width}
                height={doc.image.height}
                placeholder="blur"
                blurDataURL={doc.image.blurhashDataUrl}
                src={doc.image.filePath.replace('../../public', '')}
                alt={doc.image.filePath.split('/')[0] ?? 'unknowimage'}
                // sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                sizes="(max-width: 1180px) 100vw, 50vw"
            />

            <div className="w-full absolute bottom-0 p-4 xs:p-6 sm:p-10 z-20">
                <Tag
                    className="mb-2 sm:mb-4 px-6 py-1 sm:py-2 text-xs sm:text-sm border"
                    href={`${url.categories}/${slug(doc.tags[0])}`}
                >
                    {doc.tags[0]}
                </Tag>
                <Link
                    href={`${url.blogs}${doc.slug}`}
                    className=""
                >
                    <h2 className="capitalize font-bold text-sm xs:text-base sm:text-xl md:text-2xl mb-4 text-cb-light">
                        <span className="bg-gradient-to-r from-cb-accent/50 to-cb-accent/50 dark:from-cb-accent-dark/50 dark:to-cb-accent-dark/50 bg-[length:0px_2px] group-hover/card:bg-[length:100%_2px] bg-left-bottom bg-no-repeat transition-[background-size] duration-500">
                            {doc.title}
                        </span>
                    </h2>
                </Link>
            </div>
        </div>
    );
}
