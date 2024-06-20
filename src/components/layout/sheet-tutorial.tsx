'use client';

import { useDeferredValue, useMemo, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { XIcon } from 'lucide-react';

import { Book, tutorial as DataTutorial, type Tutorial } from './data-nav';
import { cn } from '@/lib/classnames';

import { Button, buttonVariants } from '@/components/ui/button';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';

export function SheetTutorial({ trigger }: { trigger: ReactNode }) {
    return (
        <Sheet>
            <SheetTrigger asChild>{trigger}</SheetTrigger>
            <SheetContent className="z-[1000] flex flex-col w-3/4 sm:max-w-[50%]">
                <SheetHeader>
                    <SheetTitle>Tutorial data</SheetTitle>
                    <SheetDescription>You can search for tutorial data then click to navigate to the page.</SheetDescription>
                </SheetHeader>
                <div className="_flex-1 h-[76%] overflow-y-scroll pl-1 pr-3 relative">
                    <AccordionTutorial />
                </div>
                <SheetFooter>
                    <SheetClose asChild>
                        <Button
                            size="sm"
                            type="button"
                            onClick={() => window.alert('no action')}
                        >
                            Action
                        </Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}

function AccordionTutorial() {
    const [txtSearch, setTxtSearch] = useState('');
    const txtSearchDefered = useDeferredValue(txtSearch);

    const booksFiltered = useMemo(() => searchBook(txtSearchDefered), [txtSearchDefered]);

    return (
        <>
            <div className="pt-[2px]  sticky top-0 right-0 left-0 backdrop-blur-sm bg-background/50 z-[1] drop-shadow-md">
                {/* <Label>Search</Label> */}
                <Input
                    className="h-7"
                    placeholder="search tutorial..."
                    value={txtSearch}
                    onChange={(e) => {
                        setTxtSearch(e.target.value);
                    }}
                />
                <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-0 bottom-0 p-0 size-6 m-auto"
                    onClick={() => {
                        if (txtSearch === '') return;
                        setTxtSearch('');
                    }}
                >
                    <XIcon className="size-4" />
                </Button>
            </div>
            <Accordion
                type="multiple"
                className="w-full"
            >
                {booksFiltered === null &&
                    DataTutorial.map((tutorial) => (
                        <AccordionItem
                            key={tutorial.urlBase}
                            value={tutorial.urlBase}
                        >
                            <AccordionTrigger className="underline-offset-4 capitalize">{tutorial.instructorName}</AccordionTrigger>
                            <AccordionContent>
                                {tutorial.books.map((d) => (
                                    <LinkCard
                                        key={tutorial.urlBase + d.urlCode}
                                        url={tutorial.urlBase + d.urlCode}
                                        title={d.title}
                                        instructorName={tutorial.instructorName}
                                        description={d.description}
                                        tags={d.tags}
                                        packages={d.packages}
                                    />
                                ))}
                            </AccordionContent>
                        </AccordionItem>
                    ))}

                {booksFiltered !== null && booksFiltered.length > 0 ? (
                    <div className="space-y-2 py-4">
                        {booksFiltered.map((d) => (
                            <LinkCard
                                key={d.urlCode}
                                url={d.urlCode}
                                title={d.title}
                                instructorName={d.instructorName}
                                description={d.description}
                                tags={d.tags}
                                packages={d.packages}
                            />
                        ))}
                    </div>
                ) : booksFiltered !== null && booksFiltered.length === 0 ? (
                    <div className="text-center">
                        no data with search: <span className="text-purple-400 font-bold">{txtSearchDefered}</span>
                    </div>
                ) : null}
            </Accordion>
        </>
    );
}

type LinkCardProps = {
    url: Tutorial['instructorName'];
    title: Book['title'];
    instructorName: Tutorial['instructorName'];
    description: Book['description'];
    tags: Book['tags'];
    packages: Book['packages'];
};

function LinkCard(props: LinkCardProps) {
    return (
        <Link
            prefetch={false}
            className={cn(
                buttonVariants({ variant: 'secondary' }),
                'flex space-y-1 h-fit flex-col group rounded-xl px-3 py-2 items-start justify-start'
            )}
            href={props.url}
        >
            <span className="capitalize">{props.title}</span>
            <span className="text-xs text-purple-500 font-light">{props.instructorName}</span>
            <span className="h-[32px] text-xs text-muted-foreground font-light text-wrap line-clamp-2 ">tags: {props.tags.join(', ')}</span>
            <span className="h-[32px] text-xs text-muted-foreground font-light text-wrap line-clamp-2 ">packages: {props.packages.join(', ')}</span>
            <span className="h-[32px] text-xs text-muted-foreground font-light text-wrap line-clamp-2 ">{props.description}</span>
        </Link>
    );
}

function searchBook(txtSearch: string) {
    if (txtSearch === '' || txtSearch === null || txtSearch === undefined) return null;

    return DataTutorial.reduce((prevVal, currVal, idx, dataArr) => {
        /**
         * reference:
         * - [How to search for a string in a nested array of objects and keep the nested structure](https://devrecipes.net/inline-string-search-in-nested-objects-by-preserving-the-array-structure/)
         */
        let books = currVal.books.filter((book) => {
            const keysBook = Object.keys(book) as Array<keyof Book>;
            const resultBook = keysBook.some((key) => {
                const currentKey = book[key];
                if (Array.isArray(currentKey)) {
                    return currentKey.some((l) => l.toLowerCase().includes(txtSearch.toLowerCase()));
                } else {
                    return currentKey.toLowerCase().includes(txtSearch.toLowerCase());
                }
            });
            return resultBook;
        });

        if (books) {
            books = books.map((d) => {
                return {
                    ...d,
                    instructorName: currVal.instructorName,
                    urlCode: (currVal.urlBase + d.urlCode) as `/${string}`,
                };
            });
        }

        // a.push({ ...t, books: books });
        prevVal.push({ urlBase: currVal.urlBase, instructorName: currVal.instructorName, books: books });
        return prevVal;
    }, [] as Tutorial[])
        .map((d) => d.books as Array<Book & { instructorName: Tutorial['instructorName'] }>)
        .flat();
}
