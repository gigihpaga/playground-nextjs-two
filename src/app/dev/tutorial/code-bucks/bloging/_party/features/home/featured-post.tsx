import { type Doc } from 'contentlayer/generated';
import { sortDocs } from '../../utils/sorted-docs';
import { BlogLayoutOne } from '../../components/blog-layout-one';
import { BlogLayoutTwo } from '../../components/blog-layout-two';

interface Props {
    attribute?: string;
}

export function FeaturedPost({ docs }: { docs: Doc[] }) {
    const sortedDocs = sortDocs(docs);
    return (
        <section className="w-full mt-16 sm:mt-24 md:mt-32 px-5 sm:px-10 md:px-24 sxl:px-32 flex flex-col items-center justify-center">
            <h2 className="w-full inline-block font-bold capitalize text-2xl md:text-4xl">Featured Post</h2>
            <div className="grid grid-cols-2 grid-rows-2 gap-6 mt-8 md:mt-16">
                <article className="col-span-2 sxl:col-span-1 row-span-2 relative">
                    <BlogLayoutOne doc={sortedDocs[2]} />
                </article>
                <article className="col-span-2 sm:col-span-1 row-span-1 relative">
                    <BlogLayoutTwo doc={sortedDocs[3]} />
                </article>
                <article className="col-span-2 sm:col-span-1 row-span-1 relative">
                    <BlogLayoutTwo doc={sortedDocs[4]} />
                </article>
            </div>
        </section>
    );
}
