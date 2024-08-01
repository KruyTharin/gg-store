'use client';

import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useSession } from 'next-auth/react';
import { useParams, usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';

function AdminNavbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const params = useParams();

  const routes = [
    {
      href: `/dashboard`,
      label: 'Overview',
      active: pathname.startsWith('/dashboard'),
    },

    {
      href: `/billboard`,
      label: 'billboard',
      active: pathname.startsWith('/billboard'),
    },

    {
      href: `/category`,
      label: 'category',
      active: pathname.startsWith('/category'),
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
