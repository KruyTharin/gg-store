'use client';

import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';

function AdminNavbar() {
  const { data: session } = useSession();
  const pathname = usePathname();

  const routes = [
    {
      href: `/admin/overview`,
      label: 'Overview',
      active: pathname.startsWith('/overview'),
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
        <Avatar>
          <AvatarImage src={session?.user.image} />
          <AvatarFallback>{session?.user.name.at(0)}</AvatarFallback>
        </Avatar>
      </div>

      <div className="h-[1px] w-full bg-gray-300"></div>
    </div>
  );
}

export default AdminNavbar;
