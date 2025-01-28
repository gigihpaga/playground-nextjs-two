import { allDocs } from './.contentlayer/generated/index.mjs';
// import nextSitemap, { ISitemapField } from 'next-sitemap';

/**
 * @param {import('./.contentlayer/generated/types.d.ts').Doc} doc
 * @returns {import('next-sitemap').ISitemapField}
 */
function getSitemapField(doc) {
    return {
        loc: `${process.env.NEXT_PUBLIC_APP_URL}/dev/tutorial/code-bucks/bloging/blogs/${doc.slug}`,
        lastmod: doc.updatedAt || doc.publishedAt,
        changefreq: 'monthly',
        priority: 0.7,
    };
}
/** @type  {import('next-sitemap').ISitemapField} */
const home = {
    loc: process.env.NEXT_PUBLIC_APP_URL,
    // lastmod: new Date().toString(),
    lastmod: new Date().toISOString(),
};

/** @type {import('next-sitemap').IConfig} */
const nextSitemapConfig = {
    siteUrl: process.env.NEXT_PUBLIC_APP_URL,
    generateRobotsTxt: true,
    // sitemapSize: 7000,
    additionalPaths: async () => {
        /** @type {import('next-sitemap').ISitemapField[]} */
        const result = [];
        result.push(home);
        result.push(...allDocs.map((d) => getSitemapField(d)));
        return result;
    },
};

export default nextSitemapConfig;
