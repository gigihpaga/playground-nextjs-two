'use client';

import * as React from 'react';
import Link from 'next/link';
import { Carrot } from 'lucide-react';

import { components, getStarteds } from './data-nav';
import { cn } from '@/lib/classnames';

import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { Button } from '@/components/ui/button';
import { SheetTutorial } from './sheet-tutorial';

export function NavigationMenuTop() {
    return (
        <NavigationMenu className="">
            <NavigationMenuList>
                <NavigationMenuItem>
                    <NavigationMenuTrigger>Getting started</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                            {getStarteds.map((data, idx) => {
                                return idx === 0 ? (
                                    <li
                                        key={data.title}
                                        className="row-span-3"
                                    >
                                        <NavigationMenuLink asChild>
                                            <Link
                                                prefetch={false}
                                                className="text-white flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-deg-135 from-[#8e4ec6] to-[#3e63dd] p-6 no-underline outline-none focus:shadow-md"
                                                href={data.href}
                                            >
                                                <Carrot className="h-6 w-6" />
                                                <div className="mb-2 mt-4 text-lg font-medium">{data.title}</div>
                                                <p className="text-sm leading-tight dark:text-muted-foreground text-muted">{data.description}</p>
                                            </Link>
                                        </NavigationMenuLink>
                                    </li>
                                ) : (
                                    <ListItem
                                        key={data.title}
                                        href={data.href}
                                        title={data.title}
                                    >
                                        {data.description}
                                    </ListItem>
                                );
                            })}
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuTrigger>Components</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                            {components.map((component) => (
                                <ListItem
                                    key={component.title}
                                    title={component.title}
                                    href={component.href}
                                >
                                    {component.description}
                                </ListItem>
                            ))}
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <Link
                        href="/docs"
                        legacyBehavior
                        passHref
                    >
                        <NavigationMenuLink className={navigationMenuTriggerStyle()}>Documentation</NavigationMenuLink>
                    </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <SheetTutorial
                        trigger={
                            <Button
                                variant="ghost"
                                className={navigationMenuTriggerStyle()}
                            >
                                Tutorial
                            </Button>
                        }
                    />
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    );
}

const ListItem = React.forwardRef<React.ElementRef<'a'>, React.ComponentPropsWithoutRef<'a'>>(({ className, title, children, ...props }, ref) => {
    return (
        <li>
            <NavigationMenuLink asChild>
                <a
                    ref={ref}
                    className={cn(
                        'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
                        className
                    )}
                    {...props}
                >
                    <div className="text-sm font-medium leading-none">{title}</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{children}</p>
                </a>
            </NavigationMenuLink>
        </li>
    );
});
ListItem.displayName = 'ListItem';
