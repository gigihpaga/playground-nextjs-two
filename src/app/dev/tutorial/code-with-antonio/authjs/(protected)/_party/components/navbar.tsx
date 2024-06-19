'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { UserButton } from '@/app/auth/_party/components/user-button';

const linkNav = [
    '/dev/tutorial/code-with-antonio/authjs/server',
    '/dev/tutorial/code-with-antonio/authjs/client',
    '/dev/tutorial/code-with-antonio/authjs/admin',
    '/dev/tutorial/code-with-antonio/authjs/setting-user',
];

export function Navbar() {
    const pathname = usePathname();
    return (
        <nav className="bg-secondary flex justify-between items-center p-4 rounded-xl w-[600px] shadow-sm">
            <div className="flex gap-x-2">
                {linkNav.map((link) => (
                    <Button
                        key={link}
                        asChild
                        variant={pathname === link ? 'default' : 'outline'}
                    >
                        <Link href={link}>{link.split('/').pop()}</Link>
                    </Button>
                ))}
            </div>
            <UserButton />
        </nav>
    );
}
