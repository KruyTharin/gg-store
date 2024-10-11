'use client';

import { useCardStore } from '@/stores/useCard';
import {
  CalendarDays,
  LogOut,
  Mail,
  Settings,
  ShoppingCart,
} from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useSession, signOut } from 'next-auth/react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { UserRole } from '@prisma/client';

function NavIcons() {
  const { data: session } = useSession();
  const card = useCardStore();

  return (
    <div className="flex gap-x-5 items-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="cursor-pointer">
            <AvatarImage src={session?.user.image} />
            <AvatarFallback>{session?.user.name.at(0)}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel className="font-normal">
            <Link href={'/setting'} className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {session?.user.name}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                @{session?.user?.role}
              </p>
            </Link>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {session?.user.role === UserRole.ADMIN && (
            <DropdownMenuItem>
              <CalendarDays className="mr-2 h-4 w-4" />
              <Link href={'/admin/overview'}>Dashboard</Link>
            </DropdownMenuItem>
          )}

          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            <Link href={'/setting'}>Setting</Link>
          </DropdownMenuItem>

          <DropdownMenuItem>
            <Mail className="mr-2 h-4 w-4" />
            <span>{session?.user.email}</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              signOut({
                callbackUrl: '/auth/login',
              })
            }
            className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Link className="relative " href={'/card'}>
        <ShoppingCart />

        <small className="text-xs bg-black rounded-full px-1 text-white absolute -top-1 -right-1 h-fit">
          {card.items.length}
        </small>
      </Link>
    </div>
  );
}

export default NavIcons;
