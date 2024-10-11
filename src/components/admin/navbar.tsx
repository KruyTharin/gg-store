'use client';

import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { UserRole } from '@prisma/client';
import { CalendarDays, LogOut, Mail } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';

function AdminNavbar() {
  const { data: session } = useSession();
  const pathname = usePathname();

  const routes = [
    {
      href: `/admin/overview`,
      label: 'Overview',
      active: pathname.startsWith('/admin/overview'),
    },

    {
      href: `/admin/billboard`,
      label: 'billboards',
      active: pathname.startsWith('/admin/billboard'),
    },

    {
      href: `/admin/category`,
      label: 'categories',
      active: pathname.startsWith('/admin/category'),
    },
    {
      href: `/admin/size`,
      label: 'sizes',
      active: pathname.startsWith('/admin/size'),
    },
    {
      href: `/admin/color`,
      label: 'colors',
      active: pathname.startsWith('/admin/color'),
    },
    {
      href: `/admin/product`,
      label: 'products',
      active: pathname.startsWith('/admin/product'),
    },
    {
      href: `/admin/order`,
      label: 'orders',
      active: pathname.startsWith('/admin/order'),
    },
    {
      href: `/admin/config`,
      label: 'config',
      active: pathname.startsWith('/admin/config'),
    },
  ];
  return (
    <div className="sticky top-0 z-50 bg-white">
      <div className="container p-3 flex justify-between items-center">
        <div className="space-x-3">
          {routes.map((route) => (
            <Link
              key={route.label}
              href={route.href}
              className={cn({
                'font-bold': route.active,
              })}
            >
              {route.label}
            </Link>
          ))}
        </div>
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
                <Link href={'/'}>Home</Link>
              </DropdownMenuItem>
            )}

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
      </div>

      <div className="h-[1px] w-full bg-gray-300"></div>
    </div>
  );
}

export default AdminNavbar;
