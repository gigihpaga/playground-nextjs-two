'use client';

import { FaUser } from 'react-icons/fa';

import { useCurrentUser } from '@/hooks/use-current-login';

import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

import { LogoutButton } from './logout-button';
import { ExitIcon } from '@radix-ui/react-icons';

interface Props {
    attribute?: string;
}

export function UserButton({ attribute }: Props) {
    const user = useCurrentUser();
    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Avatar>
                    <AvatarImage src={user?.image || ''} />
                    <AvatarFallback className="bg-foreground ">
                        <FaUser className="text-muted" />
                    </AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className="w-40"
                align="end"
            >
                <LogoutButton>
                    <DropdownMenuItem>
                        <ExitIcon className="mr-2" />
                        Logout
                    </DropdownMenuItem>
                </LogoutButton>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
