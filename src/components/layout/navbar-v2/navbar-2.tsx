import Image from 'next/image';
import Link from 'next/link';

import styles from './navbar-2.module.scss';
import { currentUser } from '@/lib/auth/current-login';
import { cn } from '@/lib/classnames';

import { ButtonLogin, ButtonLogout } from '../button-auth';
import { NavigationMenuTop } from '../navbar-menu';
import { MenuMobileWrapper } from './menu-mobile';
import { MenuMobileContent } from './menu-mobile-content';
import { ThemeSwitch } from './theme-switch';

/**
 * this component inspired by vercel
 * @returns
 */
export async function NavBar2() {
    const user = await currentUser();
    return (
        <div
            className={cn(
                styles['header_wrapper'],
                styles['hasScrolled'],
                styles['header_sticky'],
                styles['header_canGrow'],
                styles['header_transparentUntilScroll']
            )}
        >
            <header className={cn(styles['header_header'])}>
                <div className={cn(styles['header_left'])}>
                    <Link
                        href="/"
                        prefetch={false}
                        className={cn(styles['link_link'], styles['logo_logoLink'], styles['logo_logo'])}
                    >
                        <Image
                            alt="logo"
                            height="18"
                            width="18"
                            src="/favicon.ico"
                            loading="eager"
                            className="geist-hide-on-dark"
                        />
                    </Link>
                    <div className={cn(styles['header_main'])}>
                        <div>
                            <NavigationMenuTop className="w-auto max-w-[fit-content]" />
                        </div>
                    </div>
                </div>
                <div
                    id={styles['header-content']}
                    className={cn(styles['stack_stack'], styles['stack'])}
                >
                    <div className={cn('hidden', styles['stack_stack'], styles['stack'], styles['right-section_nonPrimaryContent'])}>
                        {/* more button here */}
                        <ThemeSwitch
                            size="default"
                            variant="outline"
                            className="h-8 p-3"
                        />
                    </div>
                    <div className={cn(styles['morphing-button-link_morphing'])}>{user ? <ButtonLogout /> : <ButtonLogin />}</div>
                </div>
                <div className={cn(styles['mobile-menu_root'])}>
                    <MenuMobileWrapper>
                        <MenuMobileContent />
                    </MenuMobileWrapper>
                </div>
            </header>
        </div>
    );
}
