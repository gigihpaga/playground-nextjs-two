import { Logo } from './logo';
import { Separator } from '@/components/ui/separator';
import { ThemeSwitcherTwo } from './theme-switcher-two';
import { NavigationMenuTop } from './navbar-menu';
import { ButtonLogin, ButtonLogout } from './button-auth';
import { currentUser } from '@/lib/auth/current-login';

export async function NavBar() {
    const user = await currentUser();
    return (
        <>
            <nav className="flex w-full items-center justify-between p-4 px-8 h-[60px]">
                <Logo />
                <NavigationMenuTop />
                <div className="flex gap-4 items-center w-1/5 justify-end">
                    <ThemeSwitcherTwo />
                    {user ? <ButtonLogout /> : <ButtonLogin />}
                </div>
            </nav>
            <Separator />
        </>
    );
}
