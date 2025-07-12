import { Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { AppWindowIcon } from 'lucide-react';

import { cn } from '@/lib/classnames';
import { currentUser } from '@/lib/auth/current-login';

import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Skeleton } from '@/app/dev/tutorial/code-with-kliton/remindme/_party/components/skeleton';
import { components, getStarteds } from '../data-nav';
import { MenuMobileScrollableWrapper } from './menu-mobile';
import { ButtonLogin, ButtonLogout } from '../button-auth';
import { ThemeSwitch } from './theme-switch';

export type MenuMobileContentProps = {
    className?: string;
};

export function MenuMobileContent({ className }: MenuMobileContentProps) {
    return (
        <MenuMobileScrollableWrapper className={cn('space-y-2', className)}>
            <div className="space-y-0 h-full w-full px-3">
                <section className="borde-border border-b py-3">
                    <ul className="space-y-2">
                        <Suspense fallback={<LoggedInFeatureFallback />}>
                            <LoggedInFeature />
                        </Suspense>
                        <li>
                            <div
                                aria-describedby="user logged in"
                                className="flex justify-between items-center h-8 px-2"
                            >
                                <p>Theme</p>
                                <ThemeSwitch className="size-7" />
                            </div>
                        </li>
                    </ul>
                </section>
                <section className="borde-border border-b py-3">
                    <Accordion
                        type="multiple"
                        className="space-y-1 py-0"
                    >
                        {[
                            { title: 'Components', links: components },
                            { title: 'Get starteds', links: getStarteds },
                        ].map((category) => {
                            return (
                                <AccordionItem
                                    className="border-b-0"
                                    key={category.title}
                                    value={category.title}
                                >
                                    <AccordionTrigger className="text-base px-2 py-1 font-normal">{category.title}</AccordionTrigger>
                                    <AccordionContent className="space-y-1 py-3 max-h-[60vh] overflow-auto">
                                        {category.links.map((link) => {
                                            return (
                                                <li
                                                    className="list-none"
                                                    key={link.href}
                                                >
                                                    <Button
                                                        asChild
                                                        variant="ghost"
                                                        className="flex justify-start h-8 px-2 font-normal"
                                                    >
                                                        <Link
                                                            prefetch={false}
                                                            href={link.href}
                                                        >
                                                            {link.title}
                                                        </Link>
                                                    </Button>
                                                </li>
                                            );
                                        })}
                                    </AccordionContent>
                                </AccordionItem>
                            );
                        })}
                    </Accordion>
                </section>
                <div className="h-[350px] bg-transparent" />
            </div>
        </MenuMobileScrollableWrapper>
    );
}

export type LoggedInFeatureProps = {};

export async function LoggedInFeature(props: LoggedInFeatureProps) {
    const user = await currentUser();

    return user ? (
        <>
            <li>
                <ButtonLogout className="w-full">Log Out</ButtonLogout>
            </li>
            <li>
                <div
                    aria-describedby="user logged in"
                    className="flex justify-between items-center h-8 px-2"
                >
                    <p className="">{user.email}</p>
                    <span className="size-5 rounded-full overflow-hidden">
                        {user.image ? (
                            <Image
                                alt={`Avatar for ${user.name}`}
                                title={`Avatar for ${user.name}`}
                                width={20}
                                height={20}
                                loading="eager"
                                src={user.image}
                            />
                        ) : (
                            <div className="bg-zinc-500 size-5" />
                        )}
                    </span>
                </div>
            </li>
            {user.role.toLowerCase() === 'admin' ? (
                <li>
                    <Button
                        asChild
                        size="sm"
                        variant="ghost"
                        className="w-full flex justify-between text-base font-normal px-2"
                    >
                        <Link
                            href="/apps"
                            prefetch={false}
                        >
                            Apps
                            <AppWindowIcon className="size-3" />
                        </Link>
                    </Button>
                </li>
            ) : null}
        </>
    ) : (
        <li>
            <ButtonLogin className="w-full" />
        </li>
    );
}

function LoggedInFeatureFallback() {
    return (
        <Skeleton
            colorOne="#1c1c1d"
            colorTwo="#302f31"
            className="w-full h-[32px] rounded-lg"
        />
    );
}
