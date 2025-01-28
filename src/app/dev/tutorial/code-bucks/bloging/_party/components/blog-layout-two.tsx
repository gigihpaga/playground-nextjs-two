import Image from 'next/image';
import { type Doc } from 'contentlayer/generated';
import Link from 'next/link';
import { Tag } from './tag';
import { Url as url } from '../constants';
import { format } from 'date-fns';

export function BlogLayoutTwo({ doc }: { doc: Doc }) {
    return (
        <div
            aria-description="BlogLayoutTwo"
            className="group/card grid grid-cols-12 gap-4 items-center text-cb-dark dark:text-cb-light"
        >
            <Link
                href={`${url.blogs}${doc.slug}`}
                className="col-span-12 lg:col-span-4 h-full rounded-xl overflow-hidden"
            >
                <Image
                    className="aspect-[4/3] lg:aspect-square w-full h-full object-center object-cover rounded-xl group-hover/card:scale-105 transition-[transform] ease-linear duration-300"
                    // fill
                    width={doc.image.width}
                    height={doc.image.height}
                    placeholder="blur"
                    blurDataURL={doc.image.blurhashDataUrl}
                    src={doc.image.filePath.replace('../../public', '')}
                    alt={doc.image.filePath.split('/')[0] ?? 'unknowimage'}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
            </Link>

            <div className="col-span-12 lg:col-span-8 w-full">
                <span className="inline-block w-full uppercase text-cb-accent dark:text-cb-accent-dark  font-semibold text-xs sm:text-sm">
                    {doc.tags[0]}
                </span>
                <Link
                    href={`${url.blogs}${doc.slug}`}
                    className="_inline-block my-1"
                >
                    <h2 className="capitalize font-semibold text-base sm:text-lg _mb-4">
                        <span className="bg-gradient-to-r from-cb-accent/50 to-cb-accent/50  dark:from-cb-accent-dark/50 dark:to-cb-accent-dark/50 bg-[length:0px_2px] group-hover/card:bg-[length:100%_2px] bg-left-bottom bg-no-repeat transition-[background-size] duration-500">
                            {doc.title}
                        </span>
                    </h2>
                </Link>
                <span className="inline-block w-full capitalize text-cb-dark/70 dark:text-cb-light/70  text-xs sm:text-sm font-semibold">
                    {format(doc.publishedAt, 'MMMM dd, yyyy')}
                </span>
            </div>
        </div>
    );
}
