'use client';

import React from 'react';
import { type Doc } from 'contentlayer/generated';
import { useMDXComponent } from 'next-contentlayer/hooks';
import type { MDXComponents } from 'mdx/types';
import Image from 'next/image';
import { cn } from '@/lib/classnames';
import { Button } from '@/components/ui/button';

interface Props {
    code: Doc['body']['code'];
}

const mdxComponent: MDXComponents = {
    Image,
    Button,
    h1: ({ children, className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
        <h1
            className={cn('font-heading mt-2 scroll-m-20 text-4xl font-bold', className)}
            {...props}
        >
            {children}
        </h1>
    ),
    h2: ({ children, className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
        <h2
            className={cn('font-heading mt-6 scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0 text-foreground', className)}
            {...props}
        >
            {children}
        </h2>
    ),
};

export function RenderMdx({ code }: Props) {
    const MDXContent = useMDXComponent(code);
    // console.log(MDXContent);
    return (
        <div
            className="col-span-12 max-w-fit lg:col-span-8 prose _prose-invert first-letter:text-5xl prose-sm text-foreground prose-h1:text-foreground prose-h2:text-foreground prose-h3:text-foreground prose-h4:text-foreground prose-h5:text-foreground prose-h6:text-foreground prose-p:my-1 prose-ol:my-1 prose-ul:my-1 prose-pre:my-1 prose-li:marker:text-cb-accent/80 prose-a:text-cb-accent prose-blockquote:text-cb-light prose-blockquote:bg-cb-accent/50 prose-blockquote:rounded-r-lg prose-blockquote:border-l-cb-accent prose-strong:text-foreground _prose-code:text-cb-accent [&>p>code]:!text-foreground [&>p>code]:!bg-cb-accent/50"
            aria-description="wrapper mdx"
        >
            <MDXContent components={mdxComponent} />
        </div>
    );
}
