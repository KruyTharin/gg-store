'use client';

import { ProductCard } from '@/components/customer/product-card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { httpClient } from '@/lib/axios';
import { useQuery } from '@tanstack/react-query';
import FilterBySize from '@/components/filter/filter-by-size';
import FilterByColor from '@/components/filter/filter-by-color';
import { useRouter, useSearchParams } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { useCallback, useState } from 'react';

export default function FilterPage() {
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);

  const colorParams = params.getAll('color');
  const sizeParams = params.getAll('size');
  const query = params.get('query');
  const categoryParams = params.get('cat');
  const router = useRouter();

  const MAX_PRICE = 500;
  const MIN_PRICE = 0;

  const DEFAULT_CUSTOM_PRICE = [0, MAX_PRICE] as [number, number];

  const [filter, setFilter] = useState<any>({
    price: { isCustom: false, range: DEFAULT_CUSTOM_PRICE },
  });

  const PRICE_FILTERS = {
    id: 'price',
    name: 'Price',
    options: [
      { value: [MIN_PRICE, MAX_PRICE], label: 'Any price' },
      {
        value: [MIN_PRICE, 50],
        label: 'Under 50$',
      },
      {
        value: [MIN_PRICE, 100],
        label: 'Under 100$',
      },
    ],
  } as const;

  const minPrice = Math.min(filter.price.range[0], filter.price.range[1]);
  const maxPrice = Math.max(filter.price.range[0], filter.price.range[1]);

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

  const {
    data: products,
    isLoading,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: [
      'products',
      colorParams,
      sizeParams,
      query,
      filter,
      categoryParams,
    ],
    queryFn: async () => {
      const response = await httpClient.get('/api/product', {
        params: {
          color: colorParams,
          size: sizeParams,
          price: filter.price,
          query,
          category: categoryParams,
        },
      });
      return response.data;
    },
    staleTime: 3000,
  });

  const onSubmit = () => refetch();

  // const debouncedSubmit = debounce(onSubmit, 400);
  const _debouncedSubmit = useCallback(onSubmit, []);

  const filterByCat = (cat: string) => {
    const params = new URLSearchParams(window.location.search);
    params.set('cat', cat);

    const newUrl = `${window.location.pathname}?${params.toString()}`;
    router.replace(newUrl); // Update the URL without reloading
  };

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
                categories?.map((category: any) => (
                  <li key={category.name}>
                    <button
                      className="disabled:cursor-not-allowed disabled:opacity-60"
                      onClick={() => filterByCat(category.id)}
                    >
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

              <AccordionItem value="price">
                <AccordionTrigger className="py-3 text-sm text-gray-400 hover:text-gray-500">
                  <span className="font-medium text-gray-900">Price</span>
                </AccordionTrigger>
                <AccordionContent className="pt-6 animate-none">
                  <ul className="space-y-4">
                    {PRICE_FILTERS.options.map((option, optionIdx) => (
                      <li key={option.label} className="flex items-center">
                        <input
                          type="radio"
                          id={`price-${optionIdx}`}
                          onChange={() => {
                            setFilter((prev: any) => ({
                              ...prev,
                              price: {
                                isCustom: false,
                                range: [...option.value],
                              },
                            }));

                            _debouncedSubmit();
                          }}
                          checked={
                            !filter.price.isCustom &&
                            filter.price.range[0] === option.value[0] &&
                            filter.price.range[1] === option.value[1]
                          }
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <label
                          htmlFor={`price-${optionIdx}`}
                          className="ml-3 text-sm text-gray-600"
                        >
                          {option.label}
                        </label>
                      </li>
                    ))}
                    <li className="flex justify-center flex-col gap-2">
                      <div>
                        <input
                          type="radio"
                          id={`price-${PRICE_FILTERS.options.length}`}
                          onChange={() => {
                            setFilter((prev: any) => ({
                              ...prev,
                              price: {
                                isCustom: true,
                                range: [0, MAX_PRICE],
                              },
                            }));

                            _debouncedSubmit();
                          }}
                          checked={filter.price.isCustom}
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <label
                          htmlFor={`price-${PRICE_FILTERS.options.length}`}
                          className="ml-3 text-sm text-gray-600"
                        >
                          Custom
                        </label>
                      </div>

                      <div className="flex justify-between">
                        <p className="font-medium">Price</p>
                        <div>
                          {filter.price.isCustom
                            ? minPrice.toFixed(0)
                            : filter.price.range[0].toFixed(0)}{' '}
                          $ -{' '}
                          {filter.price.isCustom
                            ? maxPrice.toFixed(0)
                            : filter.price.range[1].toFixed(0)}{' '}
                          $
                        </div>
                      </div>

                      <Slider
                        className={cn({
                          'opacity-50': !filter.price.isCustom,
                        })}
                        disabled={!filter.price.isCustom}
                        onValueChange={(range) => {
                          const [newMin, newMax] = range;

                          setFilter((prev: any) => ({
                            ...prev,
                            price: {
                              isCustom: true,
                              range: [newMin, newMax],
                            },
                          }));

                          _debouncedSubmit();
                        }}
                        value={
                          filter.price.isCustom
                            ? filter.price.range
                            : DEFAULT_CUSTOM_PRICE
                        }
                        min={DEFAULT_CUSTOM_PRICE[0]}
                        defaultValue={DEFAULT_CUSTOM_PRICE}
                        max={DEFAULT_CUSTOM_PRICE[1]}
                        step={5}
                      />
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
          <div className="col-span-9">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 grid-cols-1 gap-5">
              {/* Show skeletons while loading */}
              {isLoading || isFetching ? (
                Array.from({ length: 20 }, (_, index) => (
                  <div className="flex items-center space-x-4" key={index}>
                    <div className="space-y-2">
                      <Skeleton className="h-[200px] w-full" />
                      <Skeleton className="h-6 w-[200px]" />
                    </div>
                  </div>
                ))
              ) : !!products?.length ? (
                /* Show products if available */
                products.map((product: any) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    price={product.price as any}
                    images={product.images}
                    colors={product.color.value}
                    isFavarited={product.isFavarited}
                  />
                ))
              ) : (
                /* Show "No data" if no products */
                <div>No data</div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
