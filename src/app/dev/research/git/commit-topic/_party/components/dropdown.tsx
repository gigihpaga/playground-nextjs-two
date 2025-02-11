// import Dropdown from './Dropdown';
import Link from 'next/link';
import React, { useState, useEffect, useRef } from 'react';
// import { Link } from 'react-router-dom';

type MenuItem = {
    title: string;
    url: string;
    submenu?: MenuItem[] | undefined;
};

type DropdownProps = {
    submenus: MenuItem[];
    dropdown: boolean;
    depthLevel: number;
};
/**
 * reference:
 * - [How to create a multilevel dropdown menu in React](https://blog.logrocket.com/how-create-multilevel-dropdown-menu-react/)
 * - [How to create a multilevel dropdown menu in ReactJS? | Step by step guide](https://www.youtube.com/watch?v=b8XiPZm2qc4)
 * - [github](https://github.com/Timonwa/react-multilevel-dropdown-menu/blob/main/src/components/MenuItems.jsx)
 * @param param0
 * @returns
 */

// import MenuItems from './MenuItems';

export function Dropdown({ submenus, dropdown, depthLevel }: DropdownProps) {
    depthLevel = depthLevel + 1;
    const dropdownClass = depthLevel > 1 ? 'dropdown-submenu' : '';

    return (
        <ul className={`dropdown ${dropdownClass} ${dropdown ? 'show' : ''}`}>
            {submenus.map((submenu, index) => (
                <MenuItems
                    items={submenu}
                    key={index}
                    depthLevel={depthLevel}
                />
            ))}
        </ul>
    );
}

type MenuItemProps = {
    items: MenuItem;
    depthLevel: number;
};

export function MenuItems({ items, depthLevel }: MenuItemProps) {
    const [dropdown, setDropdown] = useState(false);
    let ref = useRef<HTMLLIElement>(null);

    useEffect(() => {
        const handler = (event: MouseEvent | TouchEvent) => {
            if (dropdown && ref.current && !ref.current.contains(event.target as HTMLElement)) {
                setDropdown(false);
            }
        };
        document.addEventListener('mousedown', handler);
        document.addEventListener('touchstart', handler);
        return () => {
            // Cleanup the event listener
            document.removeEventListener('mousedown', handler);
            document.removeEventListener('touchstart', handler);
        };
    }, [dropdown]);

    const onMouseEnter = () => {
        setDropdown(true);
    };

    const onMouseLeave = () => {
        setDropdown(false);
    };

    const toggleDropdown = () => {
        setDropdown((prev) => !prev);
    };

    const closeDropdown = () => {
        dropdown && setDropdown(false);
    };

    return (
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
        <li
            className="menu-items"
            ref={ref}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onClick={closeDropdown}
        >
            {items.url && items.submenu ? (
                <>
                    <button
                        type="button"
                        aria-haspopup="menu"
                        aria-expanded={dropdown ? 'true' : 'false'}
                        onClick={() => toggleDropdown()}
                    >
                        <Link href={items.url}>{items.title}</Link>
                        {depthLevel > 0 ? <span>&raquo;</span> : <span className="arrow" />}
                    </button>
                    <Dropdown
                        depthLevel={depthLevel}
                        submenus={items.submenu}
                        dropdown={dropdown}
                    />
                </>
            ) : !items.url && items.submenu ? (
                <>
                    <button
                        type="button"
                        aria-haspopup="menu"
                        aria-expanded={dropdown ? 'true' : 'false'}
                    >
                        {items.title}
                        {depthLevel > 0 ? <span>&raquo;</span> : <span className="arrow" />}
                    </button>
                    <Dropdown
                        depthLevel={depthLevel}
                        submenus={items.submenu}
                        dropdown={dropdown}
                    />
                </>
            ) : (
                <Link href={items.url}>{items.title}</Link>
            )}
        </li>
    );
}
