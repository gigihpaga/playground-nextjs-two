import Image from 'next/image';
import { notFound } from 'next/navigation';
import { type Metadata } from 'next';
import { slug } from 'github-slugger';
import { allDocs, Doc } from 'contentlayer/generated';
import '@/app/mdx.scss';

import { Tag } from '../../_party/components/tag';
import { siteMetadata, Url as url } from '../../_party/constants';
import { BlogDetails, RenderMdx } from '../../_party/features/blog';
import { type Toc as TocType } from '~/contentlayer.config';
import { Toc } from '../../_party/features/blog/toc';

interface PageProps {
    params: { slug: string };
    searchParams: { [key: string]: string | string[] | undefined } | Record<string, never>;
}

/**
 * build static page on build,
 * when in dev mode, page generate on demand
 * when in production mode, page ready to use because, page is generated on build
 */
export async function generateStaticParams() {
    const doc = allDocs.map((d) => {
        return {
            // slug: d._raw.flattenedPath,
            slug: d.slugAsParams,
        } satisfies PageProps['params'];
    });

    return doc;
}

export async function generateMetadata({ params }: PageProps) {
    const doc = allDocs.find((d) => d.slugAsParams === params.slug);
    if (!doc) return undefined;

    const publishedAt = new Date(doc.publishedAt).toISOString();
    const updatedAt = new Date(doc.updatedAt || doc.publishedAt).toISOString();

    const imageList = getImageList(doc);
    const ogImages = imageList.map((img) => {
        return { url: img.includes('http') ? img : siteMetadata.siteUrl + img };
    });

    const authors = doc.author ? [doc.author] : siteMetadata.author;

    return {
        title: doc.title,
        openGraph: {
            title: doc.title,
            description: siteMetadata.description + ' | ' + doc.description,
            url: `${url.blogs}/${doc.slug}`,
            siteName: siteMetadata.title,
            images: ogImages,
            locale: 'en-US',
            type: 'article',
            publishedTime: publishedAt,
            modifiedTime: updatedAt,
            authors: authors.length > 0 ? authors : [siteMetadata.author],
        },
        twitter: {
            card: 'summary_large_image',
            title: doc.title,
            description: doc.description,
            images: ogImages,
        },
    } satisfies Metadata;
}

export default async function PageBlogBySlug({ params }: PageProps) {
    const doc = allDocs.find((d) => d.slugAsParams === params.slug);

    const imageList = getImageList(doc);

    const jsonLd = {
        // https://developers.google.com/search/docs/appearance/structured-data/article#examples
        // https://nextjs.org/docs/app/building-your-application/optimizing/metadata#json-ld
        '@context': 'https://schema.org',
        '@type': 'NewsArticle',
        headline: doc?.title,
        description: doc?.description,
        image: imageList,
        datePublished: doc ? new Date(doc.publishedAt).toISOString() : undefined,
        dateModified: doc ? new Date(doc.updatedAt || doc.publishedAt).toISOString() : undefined,
        author: [
            {
                '@type': 'Person',
                name: doc?.author ? [doc.author] : siteMetadata.author,
                url: siteMetadata.facebook,
            },
        ],
    };

    return !doc ? (
        // return this div or return notFound() page
        <div className="w-full px-10 py-10 h-[70vh]">
            <div className="bg-muted-foreground/10 h-full rounded-2xl flex justify-center items-center">
                <p className="text-2xl">
                    Article with title:&nbsp;<strong>&ldquo;{params.slug}&rdquo;</strong>&nbsp;Not Found
                </p>
            </div>
        </div>
    ) : (
        <>
            {/* Add JSON-LD to page */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <article className="relative">
                <div className="mb-8 text-center relative w-full h-[70vh]">
                    <div className="w-full z-[1] flex flex-col items-center justify-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                        <Tag
                            className="px-6 text-sm py2"
                            href={`${url.categories}/${slug(doc.tags[0])}`}
                        >
                            {doc.tags[0]}
                        </Tag>
                        <h1 className="inline-block mt-6 font-semibold capitalize text-cb-light text-xl sm:text-2xl md:text-3xl lg:text-5xl leading-normal relative w-5/6">
                            {doc.title}
                        </h1>
                    </div>
                    <div
                        aria-description="image overlay"
                        className="absolute top-0 left-0 right-0 bottom-0 h-full bg-cb-dark/60 dark:bg-cb-dark/40"
                    />
                    <Image
                        className="aspect-square w-full h-full object-center object-cover"
                        // fill
                        width={doc.image.width}
                        height={doc.image.height}
                        placeholder="blur"
                        blurDataURL={doc.image.blurhashDataUrl}
                        src={doc.image.filePath.replace('../../public', '')}
                        alt={doc.image.filePath.split('/')[0] ?? 'unknowimage'}
                        priority={true}
                        sizes="100vw"
                    />
                </div>
                <BlogDetails
                    doc={doc}
                    slugParams={params.slug}
                />
                <div className="grid grid-cols-12 gap-y-8 lg:gap-8 sxl:gap-16 mt-8 px-5 md:px-10 ">
                    <Toc tocs={doc.toc as TocType[]} />
                    <RenderMdx code={doc.body.code} />
                </div>
            </article>
        </>
    );
}

function getImageList(doc: Doc | undefined) {
    let imageList = [siteMetadata.socialBanner as string];
    if (doc && doc.image) {
        imageList = typeof doc.image.filePath === 'string' ? [siteMetadata.siteUrl + doc.image.filePath.split('public')[1]] : doc.image.filePath;
    }

    return imageList;
}
