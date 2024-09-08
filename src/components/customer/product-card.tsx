'use client';

import React from 'react';
import { Heart } from 'lucide-react';
import Image from 'next/image';
import { Image as ImageType } from '@prisma/client';
import { useCardStore } from '@/stores/useCard';

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

  const card = useCardStore();
  return (
    <div className="space-y-2">
      <div className="aspect-w-1 aspect-h-1">
        <Image
          src={images[0].url}
          alt="product"
          width={500}
          height={500}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover "
        />
      </div>
      <div className="flex justify-between">
        <div>
          <h4 className="font-bold text-sm">US {price}$</h4>
          <span className="text-sm">{name}</span>
        </div>
        <Heart />
      </div>
      <div className="flex gap-2">
        <div className="size-4  border" style={{ backgroundColor: colors }} />
      </div>

      <button onClick={addToCard}>ADD TO CARD</button>
    </div>
  );
};
