'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const PATH = '/dev/tutorial/dive-in-dev/moving-element-div';
const otherExamples = ['/', 'refactor', 'refactor/nested-eventlistener'];

export function TabPage() {
    return (
        <nav className="flex gap-2">
            {otherExamples.map((page, idx) => (
                <Link
                    className="underline"
                    key={page}
                    href={idx === 0 ? PATH : `${PATH}/${page}`}
                >
                    {page}
                </Link>
            ))}
        </nav>
    );
}
