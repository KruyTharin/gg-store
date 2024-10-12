'use client';

import Link from 'next/link';
import SearchBar from '@/components/customer/search-bar';
import NavIcons from './navicons';
import { cn } from '@/lib/utils';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { useQuery } from '@tanstack/react-query';
import { httpClient } from '@/lib/axios';

const CustomerNavbar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const categoryParams = params.get('cat');

  const routes = [
    {
      href: `/filter`,
      label: 'Filter',
      active: pathname.startsWith('/filter'),
    },

    {
      href: `/favorite`,
      label: 'Favorite',
      active: pathname.startsWith('/favorite'),
    },

    {
      href: `/order-history`,
      label: 'Order History',
      active: pathname.startsWith('/order-history'),
    },
  ];

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await httpClient.get('/api/category');
      return response.data;
    },
  });
  return (
    <div className="h-20  sticky top-0 z-50 bg-white shadow-sm">
      <div className="flex items-center justify-between gap-8 h-full container">
        <div className="w-1/3 xl:w-1/2 flex items-center gap-12">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="product"
              width={70}
              height={500}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover aspect-1"
            />
          </Link>
          <div className="flex gap-4 items-center">
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

            <Select
              onValueChange={(value) => router.push(`/filter?cat=${value}`)}
            >
              <SelectTrigger className="w-fit border-none focus:outline-none ring-0">
                <SelectValue placeholder="Categories" className="font-bold" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {categories?.length > 0 &&
                    categories?.map((category: any) => (
                      <SelectItem
                        value={category.id}
                        key={category.id}
                        className={cn('', {
                          'font-bold': category.id === categoryParams,
                        })}
                      >
                        {category?.name}
                      </SelectItem>
                    ))}
                </SelectGroup>
              </SelectContent>
            </Select>
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
