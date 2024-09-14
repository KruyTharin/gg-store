'use client';

import { ProductCard } from '@/components/customer/product-card';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Slider } from '@/components/ui/slider';
import { httpClient } from '@/lib/axios';
import { useQuery } from '@tanstack/react-query';
import FilterBySize from '@/components/filter/filter-by-size';
import FilterByColor from '@/components/filter/filter-by-color';
import { useSearchParams } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';

export default function FilterPage() {
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);

  const colorParams = params.getAll('color');
  const sizeParams = params.getAll('size');

  const { data: colors } = useQuery({
    queryKey: ['colors'],
    queryFn: async () => {
      const response = await httpClient.get('/api/color');
      return response.data;
    },
  });

  const { data: sizes } = useQuery({
    queryKey: ['sizes'],
    queryFn: async () => {
      const response = await httpClient.get('/api/size');
      return response.data;
    },
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await httpClient.get('/api/category');
      return response.data;
    },
  });

  const { data: products, isLoading } = useQuery({
    queryKey: ['products', colorParams, sizeParams],
    queryFn: async () => {
      const response = await httpClient.get('/api/product', {
        params: {
          color: colorParams,
          size: sizeParams,
        },
      });
      return response.data;
    },
    staleTime: 3000,
  });

  return (
    <main className="container">
      <div className="flex items-baseline justify-between border-b pb-5 border-gray-200 mt-5">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
          Choose your favorite products
        </h1>
      </div>

      <section className="pb-24 pt-6">
        <div className="grid grid-cols-12 gap-x-8">
          {/* Filters */}
          <div className="hidden lg:block col-span-3">
            <ul className="space-y-4 border-b border-gray-200 pb-6 text-sm font-medium text-gray-900">
              {!!categories?.length &&
                categories.map((category: any) => (
                  <li key={category.name}>
                    <button className="disabled:cursor-not-allowed disabled:opacity-60">
                      {category.name}
                    </button>
                  </li>
                ))}
            </ul>

            <Accordion type="multiple" className="animate-none">
              {/* Color filter */}
              <AccordionItem value="color">
                <AccordionTrigger className="py-3 text-sm text-gray-400 hover:text-gray-500">
                  <span className="font-medium text-gray-900">Color</span>
                </AccordionTrigger>

                <FilterByColor colors={colors} />
              </AccordionItem>

              {/* Size filters */}
              <AccordionItem value="size">
                <AccordionTrigger className="py-3 text-sm text-gray-400 hover:text-gray-500">
                  <span className="font-medium text-gray-900">Size</span>
                </AccordionTrigger>

                <FilterBySize sizes={sizes} />
              </AccordionItem>

              {/* Price filter */}
              <div>
                <span className="font-medium text-gray-900">Price</span>

                <div className="mt-5">
                  <Slider defaultValue={[33]} max={100} step={1} />
                </div>
              </div>
            </Accordion>
          </div>
          <div className="col-span-9">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 grid-cols-1 gap-5 ">
              {isLoading &&
                Array.from({ length: 8 }, (_, index) => (
                  <div className="flex items-center space-x-4" key={index}>
                    <div className="space-y-2">
                      <Skeleton className="h-[200px] w-full" />
                      <Skeleton className="h-6 w-[200px]" />
                    </div>
                  </div>
                ))}
              {!!products?.length ? (
                products?.map((product: any) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    price={product.price as any}
                    images={product.images}
                    colors={product.color.value}
                  />
                ))
              ) : (
                <div>No data</div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
