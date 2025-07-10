import Link from 'next/link';
import { cn } from '@/lib/classnames';

export function ListApp({ paths }: { paths: Array<{ url: string }> }) {
    return (
        <div className="w-full grid grid-cols-3 md:grid-cols-4 gap-2 auto-rows-[1fr] min-h-[50px]">
            {paths.map((path) => (
                <Card
                    key={path.url}
                    path={path}
                />
            ))}
        </div>
    );
}

function Card({ path }: { path: { url: string } }) {
    if (path.url.includes('[')) {
        return null;
    }
    const pathSection = path.url.split('/');
    const pageName = pathSection.at(-1);
    const sectionTwo = pathSection.at(2);
    return (
        <Link
            href={path.url}
            prefetch={false}
            className="border border-border rounded-md p-1 relative flex flex-col justify-between"
        >
            <div
                className={cn(
                    'absolute top-1 right-1 min-w-2 size-2 md:size-4 rounded-full bg-muted',
                    sectionTwo === 'research' && 'bg-red-600 text-white',
                    sectionTwo === 'tutorial' && 'bg-purple-600 text-white'
                )}
            />
            <div>
                <p className="text-xs leading-snug md:text-lg">{pageName}</p>
                <p className="text-3xs">{path.url}</p>
            </div>
            <div>
                {sectionTwo ? (
                    <div
                        className={cn(
                            'rounded-full bg-muted text-2xs px-1 py-[2px] flex items-center',
                            sectionTwo === 'research' && 'text-red-600',
                            sectionTwo === 'tutorial' && 'text-purple-600'
                        )}
                    >
                        {sectionTwo}
                    </div>
                ) : null}
            </div>
        </Link>
    );
}
