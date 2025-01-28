import { type Doc } from 'contentlayer/generated';
import { compareDesc, parseISO } from 'date-fns';

export const sortDocs = (docs: Doc[]) => {
    return docs.slice().sort((a, b) => compareDesc(parseISO(a.publishedAt), parseISO(b.publishedAt)));
};
