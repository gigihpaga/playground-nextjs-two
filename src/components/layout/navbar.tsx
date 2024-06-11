import { UserButton } from '@clerk/nextjs';
import { Logo } from './logo';
import { Separator } from '@/components/ui/separator';
import { ThemeSwitcher } from './theme-switcher';

export function NavBar() {
    return (
        <>
            <nav className="flex w-full items-center justify-between p-4 px-8 h-[60px]">
                <Logo />
                <div className="flex gap-4 items-center">
                    <UserButton afterSignOutUrl="/sign-in" />
                    <ThemeSwitcher />
                </div>
            </nav>
            <Separator />
        </>
    );
}
