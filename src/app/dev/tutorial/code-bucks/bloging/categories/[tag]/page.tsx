import { type Metadata } from 'next';
import GithubSlugger, { slug } from 'github-slugger';
import { allDocs } from '~/.contentlayer/generated';
import { CategoriesPopulate } from '../../_party/features/categories/categories-populate';
import { BlogLayoutThree } from '../../_party/components/blog-layout-three';
import { Url as url, siteMetadata } from '../../_party/constants';

const slugger = new GithubSlugger();

interface PageProps {
    params: { tag: string };
    searchParams: { [key: string]: string | string[] | undefined } | Record<string, never>;
}

/**
 * build static page on build,
 * when in dev mode, page generate on demand
 * when in production mode, page ready to use because, page is generated on build
 * function generateStaticParams() setara dengan getStaticProps(), fungsinya untuk generate static page waktu build
 */
export async function generateStaticParams() {
    let categories: Array<string> = [];
    let paths = [
        {
            tag: 'all',
        } satisfies PageProps['params'],
    ];

    allDocs.map((doc) => {
        if (doc.isPublished) {
            doc.tags.map((tag) => {
                // let slugified = slugger.slug(tag);  // ["web-development", "web-development-11", "code-quality"]
                let slugified = slug(tag); // ["web-development", "code-quality"]
                if (!categories.includes(slugified)) {
                    categories.push(slugified);
                    paths.push({ tag: slugified });
                }
            });
        }
    });

    return paths;
}

export async function generateMetadata({ params }: PageProps) {
    return {
        title: `${params.tag.replace('-', ' ')} blogs`,
        description: `Learn more about ${params.tag === 'all' ? 'web development' : `${params.tag.replace('-', ' ')}`} through our collection of expert blog and tutorials`,
    } satisfies Metadata;
}

export default async function PageCategoryByTag({ params }: PageProps) {
    const allCategoriesFaceted = ['all'].concat(
        Array.from(
            new Set(
                allDocs
                    .map((doc) => doc.tags)
                    .flat()
                    .map((tag) => slug(tag))
            )
        )
    );

    const docs = allDocs.filter((doc) => {
        return doc.tags.some((tag) => {
            const slugified = slug(tag); // transform string "Web Development" to "web-development"

            if (params.tag === 'all') {
                return true;
            } else {
                return slugified === params.tag;
            }
        });
    });

    return (
        <article className="mt-6 flex flex-col _text-cb-dark">
            <div className="px-5 sm:px-10 md:px-24 sxl:px-32 flex flex-col">
                <h1 className="_mt-4 font-semibold text-2xl md:text-4xl lg:text-5xl">#{params.tag}</h1>
                <span className="mt-2 text-muted-foreground inline-block">Dicover more categories and expand your knowledge!</span>
            </div>
            <CategoriesPopulate
                categories={allCategoriesFaceted}
                currentSlug={params.tag}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 grid-rows-2 gap-16 mt-5 sm:mt-10 md:mt-24 sxl:mt-32 px-5 sm:px-10 md:px-24 sxl:px-32">
                {docs.length ? (
                    docs.map((doc) => (
                        <article
                            key={doc.title}
                            className="col-span-1 row-span-1 relative"
                        >
                            <BlogLayoutThree doc={doc} />
                        </article>
                    ))
                ) : (
                    <div className="col-span-3 row-span-2 flex items-center justify-center flex-col">
                        <p className="text-2xl">
                            Article with tag:&nbsp;<strong>&ldquo;{params.tag}&rdquo;</strong>&nbsp;Not Found
                        </p>
                        <span className="text-muted-foreground">please select other tag or select all</span>
                    </div>
                )}
            </div>
        </article>
    );
}
