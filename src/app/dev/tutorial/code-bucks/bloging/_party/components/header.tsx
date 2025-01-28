'use client';

import Link from 'next/link';
import { Logo } from './logo';
import { Url as url, mediaSocials } from '../constants';
import { cn } from '@/lib/classnames';
import { ThemeSwitch } from './theme-switch';
import { useState } from 'react';

export function Header() {
    return (
        <header className="w-full p-4 px-5 sm:px-10 flex items-center justify-between ">
            <Logo />
            <NavBarMobile />
            <nav className="hidden sm:flex fixed z-[4] w-max py-3 px-8 border border-solid border-cb-dark dark:border-cb-light rounded-full font-medium capitalize  items-center gap-x-2 right-1/2 translate-x-1/2 top-[calc(60px+(50px/2))] bg-cb-light/60 backdrop-blur-sm ">
                <Link href={url.root}>Home</Link>
                <Link href={url.about}>About</Link>
                <Link href={url.contact}>Contact</Link>
                <ThemeSwitch />
            </nav>
            <div className="space-x-2 hidden sm:block">
                {mediaSocials.map((ms) => (
                    <a
                        key={ms.name}
                        href={ms.url}
                        target="_blank"
                        className="inline-block hover:scale-125 transition-[transform] ease-linear duration-200"
                    >
                        <ms.icon className={cn('size-6', ms.name === 'github' && 'dark:fill-cb-light fill-cb-dark')} />
                    </a>
                ))}
            </div>
        </header>
    );
}

function NavBarMobile() {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <>
            <div
                aria-description="tirgger navbar mobile"
                className="inline-block sm:hidden z-50"
            >
                <button
                    className="size-6 "
                    onClick={() => setIsOpen((prev) => !prev)}
                >
                    <div className="w-6 cursor-pointer transition-all ease-linear duration-300">
                        <div className="relative">
                            <span
                                style={{
                                    transform: isOpen ? 'rotate(-45deg) translateY(0)' : 'rotate(0deg) translateY(6px)',
                                }}
                                className="absolute top-0 left-0 inline-block w-full h-0.5 bg-cb-dark dark:bg-cb-light rounded transition-all ease-linear duration-200"
                            >
                                &nbsp;
                            </span>
                            <span
                                style={{
                                    opacity: isOpen ? 0 : 1,
                                }}
                                className="absolute top-0 left-0 inline-block w-full h-0.5 bg-cb-dark dark:bg-cb-light rounded transition-all ease-linear duration-200"
                            >
                                &nbsp;
                            </span>
                            <span
                                style={{
                                    transform: isOpen ? 'rotate(45deg) translateY(0)' : 'rotate(0deg) translateY(-6px)',
                                }}
                                className="absolute top-0 left-0 inline-block w-full h-0.5 bg-cb-dark dark:bg-cb-light rounded transition-all ease-linear duration-200"
                            >
                                &nbsp;
                            </span>
                        </div>
                    </div>
                </button>
            </div>
            {/* eslint-disable-next-line jsx-a11y/role-supports-aria-props */}
            <nav
                style={{
                    left: isOpen ? '0%' : '-100%',
                    transition: 'left linear  200ms',
                }}
                aria-description="navbar mobile"
                className="flex sm:hidden gap-2 pt-[50px] fixed z-[100] h-screen top-0 bottom-0 w-max py-3 px-8 border border-solid border-cb-dark dark:border-cb-light _rounded-full font-medium capitalize  flex-col gap-x-2   bg-cb-light/60 backdrop-blur-sm "
            >
                <Link
                    className="pl-1 pr-10 hover:text-cb-accent"
                    href={url.root}
                >
                    Home
                </Link>
                <Link
                    className="pl-1 pr-10 hover:text-cb-accent"
                    href={url.about}
                >
                    About
                </Link>
                <Link
                    className="pl-1 pr-10 hover:text-cb-accent"
                    href={url.contact}
                >
                    Contact
                </Link>
                <ThemeSwitch />
            </nav>
        </>
    );
}
