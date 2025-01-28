import Link from 'next/link';
import Image from 'next/image';
import { slug } from 'github-slugger';
import { type Doc } from 'contentlayer/generated';
import { sortDocs } from '../../utils/sorted-docs';
import { Url as url } from '../../constants';
import { Tag } from '../../components/tag';

export function HomeConverSection({ docs }: { docs: Doc[] }) {
    const sortedDocs = sortDocs(docs);
    const firstDoc = sortedDocs[0];

    return (
        <div className="w-full inline-block">
            <article className="relative flex flex-col items-start justify-end mx-5 sm:mx-10 h-[50vh]  sm:h-[75vh] overflow-hidden">
                <div
                    aria-description="overlay image"
                    className="absolute top-0 left-0 right-0 h-full bg-gradient-to-b from-transparent from-0% to-cb-dark rounded-3xl z-[1]"
                />
                <Image
                    className="w-full h-full object-center object-cover rounded-3xl"
                    fill
                    placeholder="blur"
                    blurDataURL={firstDoc.image.blurhashDataUrl}
                    src={firstDoc.image.filePath.replace('../../public', '')}
                    alt={firstDoc.image.filePath.split('/')[0] ?? 'unknowimage'}
                    sizes="100vw"
                    priority={true}
                />

                <div className="w-full lg:w-3/4 p-6 sm:p-8  md:p-12 lg:p-16 flex flex-col items-start justify-center z-[2] text-cb-light">
                    <Tag
                        className="mb-6"
                        href={`${url.categories}/${slug(firstDoc.tags[0])}`}
                    >
                        {firstDoc.tags[0]}
                    </Tag>
                    <Link
                        href={`${url.blogs}${firstDoc.slug}`}
                        className=""
                    >
                        <h1 className="capitalize font-bold text-lg sm:text-xl md:text-3xl lg:text-4xl mb-4">
                            <span className="bg-gradient-to-r from-cb-accent/50 to-cb-accent/50 dark:from-cb-accent-dark/50 dark:to-cb-accent-dark/50 bg-[length:0px_2px] hover:bg-[length:100%_2px] bg-left-bottom bg-no-repeat transition-[background-size] duration-500">
                                {firstDoc.title}
                            </span>
                        </h1>
                    </Link>
                    <p className="hidden sm:inline-block text-base md:text-lg lg:text-xl font-manrope">{firstDoc.description}</p>
                </div>
            </article>
        </div>
    );
}
