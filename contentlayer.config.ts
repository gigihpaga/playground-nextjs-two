import { defineDocumentType, defineNestedType, makeSource, type ComputedFields } from '@contentlayer/source-files';
import readingTime, { type ReadTimeResults } from 'reading-time';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutoLinkHeadings, { type Options as rALHOption } from 'rehype-autolink-headings';
import rehypePrettyCode, { type Options as rPcOptions } from 'rehype-pretty-code';
import GithubSlugger from 'github-slugger';

type Body = {
    raw: string;
    code: string;
};

export type Toc = {
    level: number;
    text: string;
    slug: string;
};

/** @type {import('contentlayer/source-files').ComputedFields} */
const computedFields: ComputedFields = {
    slug: {
        type: 'string',
        resolve: (doc) => `/${doc._raw.flattenedPath.split('/').slice(-1)}`, // ex: "/automating-repetitive-tasks-productivity-hacks-for-developers"
    },
    slugAsParams: {
        type: 'string',
        resolve: (doc) => doc._raw.flattenedPath.split('/').slice(-1).join('/'), // ex: "automating-repetitive-tasks-productivity-hacks-for-developers"
    },
    readingTime: {
        type: 'json',
        resolve: (doc) => readingTime((doc.body as Body).raw),
    },
    toc: {
        type: 'list',
        resolve: async (d) => {
            const regex = /\n(?<flag>#{1,6})\s+(?<content>.+)/g;
            const slugger = new GithubSlugger();
            const headings = Array.from((d.body as Body).raw.matchAll(regex))
                .map((rgx) => {
                    const flag = rgx.groups?.flag;
                    const content = rgx.groups?.content;
                    if (typeof flag == 'string' && typeof content == 'string') {
                        return {
                            level: flag.length,
                            text: content,
                            slug: slugger.slug(content),
                        } satisfies Toc;
                    } else {
                        return null;
                    }
                })
                .filter((d) => d !== null);
            return headings;
        },
    },
};

const Doc = defineDocumentType(() => {
    return {
        name: 'Doc',
        filePathPattern: 'docs/**/*.mdx',
        contentType: 'mdx',
        fields: {
            title: {
                type: 'string',
                required: true,
            },
            publishedAt: {
                type: 'date',
                required: true,
            },
            updatedAt: {
                type: 'date',
                required: true,
            },
            description: {
                type: 'string',
                required: true,
            },
            image: {
                type: 'image',
                required: true,
            },
            isPublished: {
                type: 'boolean',
                default: false,
                required: false,
            },
            author: {
                type: 'string',
                required: true,
            },
            tags: {
                type: 'list',
                of: {
                    type: 'string',
                },
                required: true,
            },
        },
        computedFields: computedFields,
    };
});

export default makeSource({
    contentDirPath: './src/content',
    documentTypes: [Doc],
    mdx: {
        remarkPlugins: [
            remarkGfm, // for transform table markdown to table html
        ],
        rehypePlugins: [
            rehypeSlug, // for inject id attribute on heading html
            [
                rehypeAutoLinkHeadings, // for inject Anchor Element (<a>) in the Heading (h1,h2,..) Element html
                { behavior: 'append' } satisfies rALHOption,
            ],
            [
                rehypePrettyCode as any, // for styling code blog
                {
                    theme: 'one-dark-pro',
                } satisfies rPcOptions,
            ],
        ],
    },
});
