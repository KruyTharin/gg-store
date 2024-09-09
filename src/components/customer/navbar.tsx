'use client';

import Link from 'next/link';
import SearchBar from '@/components/customer/search-bar';
import NavIcons from './navicons';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

const CustomerNavbar = () => {
  const pathname = usePathname();

  const routes = [
    {
      href: `/filter`,
      label: 'Filter',
      active: pathname.startsWith('/filter'),
    },
  ];
  return (
    <div className="h-20 container sticky top-0 z-50 bg-white shadow-sm">
      <div className="h-full flex items-center justify-between md:hidden">
        <Link href="/">
          <div className="text-2xl tracking-wide">LAMA</div>
        </Link>
      </div>
      <div className="hidden md:flex items-center justify-between gap-8 h-full">
        <div className="w-1/3 xl:w-1/2 flex items-center gap-12">
          <Link href="/" className="flex items-center gap-3">
            <div className="text-2xl tracking-wide">GG</div>
          </Link>
          <div className="hidden xl:flex gap-4">
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
        </div>

        <div className="w-2/3 xl:w-1/2 flex items-center justify-between gap-8">
          <SearchBar />
          <NavIcons />
        </div>
      </div>
    </div>
  );
};

export default CustomerNavbar;
