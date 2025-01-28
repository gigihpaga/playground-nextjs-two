import Image from 'next/image';
import { type Doc } from 'contentlayer/generated';
import Link from 'next/link';
import { Tag } from './tag';
import { Url as url } from '../constants';
import { format } from 'date-fns';

export function BlogLayoutThree({ doc }: { doc: Doc }) {
    return (
        <div className="group/card flex flex-col items-center text-cb-dark dark:text-cb-light">
            <Link
                href={`${url.blogs}${doc.slug}`}
                className="h-full rounded-xl overflow-hidden"
            >
                <Image
                    className="aspect-[4/3] w-full h-full object-center object-cover rounded-xl group-hover/card:scale-105 transition-[transform] ease-linear duration-300"
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

            <div className="flex flex-col w-full mt-4">
                <span className="uppercase text-cb-accent dark:text-cb-accent-dark font-semibold text-xs sm:text-sm">{doc.tags[0]}</span>
                <Link
                    href={`${url.blogs}${doc.slug}`}
                    className="inline-block my-1"
                >
                    <h2 className="capitalize font-semibold text-sm sm:text-lg _mb-4">
                        <span className="bg-gradient-to-r from-cb-accent/50 to-cb-accent/50 dark:from-cb-accent-dark/50 dark:to-cb-accent-dark/50  bg-[length:0px_2px] group-hover/card:bg-[length:100%_2px] bg-left-bottom bg-no-repeat transition-[background-size] duration-500">
                            {doc.title}
                        </span>
                    </h2>
                </Link>
                <span className="capitalize text-cb-dark/70 dark:text-cb-light/70 text-xs sm:text-sm font-semibold">
                    {format(doc.publishedAt, 'MMMM dd, yyyy')}
                </span>
            </div>
        </div>
    );
}
