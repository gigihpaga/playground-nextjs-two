import { Logo } from './logo';
import { Separator } from '@/components/ui/separator';
import { ThemeSwitcherTwo } from './theme-switcher-two';
import { NavigationMenuTop } from './navbar-menu';

export function NavBar() {
    return (
        <>
            <nav className="flex w-full items-center justify-between p-4 px-8 h-[60px]">
                <Logo />
                <NavigationMenuTop />
                <div className="flex gap-4 items-center w-1/5 justify-end">
                    <ThemeSwitcherTwo />
                </div>
            </nav>
            <Separator />
        </>
    );
}
