'use client';

import * as React from 'react';

import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel';
import Image from 'next/image';
import { Billboard as Props } from '@prisma/client';

export const Billboard: React.FC<{ data: Props[] }> = ({ data }) => {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <div className="container">
      <Carousel
        setApi={setApi}
        className="w-full "
        opts={{
          loop: true,
        }}
      >
        <CarouselContent>
          {data.map((item, index) => (
            <CarouselItem key={index}>
              <Card>
                <CardContent className="flex items-center justify-center">
                  <div className="aspect-w-16 aspect-h-6 w-full h-full">
                    <Image
                      src={item.imageUrl}
                      alt={item.label}
                      fill
                      sizes="(max-width: 768px)    100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      <div className="py-2 text-center text-sm text-muted-foreground">
        Slide {current} of {count}
      </div>
    </div>
  );
};
