'use client';

import React from 'react';
import { Heart, ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import { Image as ImageType } from '@prisma/client';
import { useCardStore } from '@/stores/useCard';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '../ui/card';

interface Props {
  price: number;
  name: string;
  colors: string;
  images: ImageType[];
  id: string;
}

export const ProductCard: React.FC<Props> = (props) => {
  const { colors, images, name, price, id } = props;

  const addToCard = () => {
    card.addItem(props as any);
  };

  const router = useRouter();

  const card = useCardStore();
  return (
    <Card>
      <CardContent className="p-4">
        <div className="aspect-w-1 aspect-h-1">
          <Image
            onClick={() => router.push(`/product/${id}/detail`)}
            src={images[0].url}
            alt="product"
            width={500}
            height={500}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover "
          />
        </div>
        <div className="flex justify-between mb-5">
          <div>
            <h4 className="font-bold text-sm">US {price}$</h4>
            <span className="text-sm line-clamp-1">{name}</span>
          </div>
          <Heart />
        </div>

        <Button className="w-full" onClick={addToCard}>
          <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
        </Button>
      </CardContent>
    </Card>
  );
};
