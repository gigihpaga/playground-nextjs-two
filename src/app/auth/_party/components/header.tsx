import { Poppins } from 'next/font/google';
import { cn } from '@/lib/classnames';
import { FcLock } from 'react-icons/fc';

const poppins = Poppins({
    subsets: ['latin'],
    weight: ['300', '600'],
});

interface Props {
    label: string;
}

export default function Header({ label }: Props) {
    return (
        // <div
        //     aria-description="card header buatan"
        //     className="w-full flex flex-col gap-y-4 items-center justify-center"
        // >
        <>
            <h1 className={cn('inline-flex text-3xl font-semibold', poppins.className)}>
                <FcLock className="mr-1" />
                Auth
            </h1>
            <p className="text-muted-foreground text-sm">{label}</p>
        </>
        // </div>
    );
}
