import { type Doc } from 'contentlayer/generated';
import { sortDocs } from '../../utils/sorted-docs';
import Link from 'next/link';
import { Url as url } from '../../constants';
import { BlogLayoutThree } from '../../components/blog-layout-three';

interface Props {
    attribute?: string;
}

//

export function RecentPost({ docs }: { docs: Doc[] }) {
    const sortedDocs = sortDocs(docs);
    return (
        <section className="w-full mt-16 sm:mt-24 md:mt-32 px-5 sm:px-10 md:px-24 sxl:px-32 flex flex-col items-center justify-center">
            <div className="flex w-full justify-between items-center">
                <h2 className="w-fit inline-block font-bold capitalize text-2xl md:text-4xl">Recent Post</h2>
                <Link
                    className="inline-block font-medium text-cb-accent dark:text-cb-accent-dark hover:opacity-90 underline underline-offset-2 text-base md:text-lg nowrap"
                    href={`${url.categories}/all`}
                >
                    view all
                </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2  lg:grid-cols-3 grid-rows-2 gap-8 sm:gap-10 md:gap-16 mt-16">
                {sortedDocs.slice(5, 11).map((doc) => {
                    return (
                        <article
                            className="col-span-1 row-span-1 relative"
                            key={doc._id}
                        >
                            <BlogLayoutThree doc={doc} />
                        </article>
                    );
                })}
            </div>
        </section>
    );
}
