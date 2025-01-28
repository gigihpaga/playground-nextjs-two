import Link from 'next/link';
import { FormEmail } from './form-email';
import { mediaSocials } from '../constants';
import { cn } from '@/lib/classnames';

export function Footer() {
    return (
        <footer className="mt-16 rounded-2xl bg-cb-dark text-cb-light dark:bg-cb-light dark:text-cb-dark m-10 mx-5 sm:mx-10 flex flex-col items-center px-4">
            <h3 className="mt-16 font-bold text-center capitalize text-base sm:text-lg lg:text-4xl px-4 ">Interesting Stories | Updates | Guides</h3>
            <p className="mt-5 px-2 w-full md:px-4 text-center sm:w-3/5 font-light text-sm sm:text-base">
                Subscribe to learn about new technology and updates. Join over 5000+ members community to stay up to date with latest news.
            </p>
            <FormEmail />
            <div className="flex items-center mt-8 space-x-2">
                {mediaSocials.map((ms) => (
                    <a
                        key={ms.name}
                        href={ms.url}
                        target="_blank"
                        className="inline-block hover:scale-125 transition-[transform] ease-linear duration-200"
                    >
                        <ms.icon className={cn('size-6', ms.name === 'github' && 'dark:fill-cb-dark fill-cb-light')} />
                    </a>
                ))}
            </div>
            <div className="text-xs text-muted-foreground md:text-base w-full mt-16 md:mt-24 relative _font-medium border-t dark:border-[#e4e4e7] border-[#27272a] py-6 _px-8 flex flex-col gap-y-2 md:flex-row md:gap-y-0 items-center [&>*]:flex-1 text-center [&>*:first-child]:text-left [&>*:last-child]:text-right">
                <span>&copy;2024 gigihpaga. All rights reserved.</span>
                <span>
                    <Link
                        className="underline"
                        href="/sitemap.xml"
                    >
                        sitemap
                    </Link>
                </span>
                <span>
                    Made with ❤️ by&nbsp;
                    <a
                        target="_blank"
                        href="https://github.com/gigihpaga"
                    >
                        gigihpaga
                    </a>
                </span>
            </div>
        </footer>
    );
}
