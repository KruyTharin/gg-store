'use client';

import React from 'react';
import { Heart, ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import { Image as ImageType } from '@prisma/client';
import { useCardStore } from '@/stores/useCard';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '../ui/card';
import { cn } from '@/lib/utils';
import { FavoriteAction } from '@/actions/product';
import { toast } from '../ui/use-toast';
import { useMutation } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';

interface Props {
  price: number;
  name: string;
  colors: string;
  images: ImageType[];
  id: string;
  isFavarited: boolean;
}

export const ProductCard: React.FC<Props> = (props) => {
  const { images, name, price, id: productId, isFavarited } = props;

  const router = useRouter();
  const card = useCardStore();
  const { data: session } = useSession();

  const addToCard = () => {
    if (!session?.user) return router.push('/auth/login');
    card.addItem(props as any);
  };

  // Handle redirection before triggering the mutation
  const handleToggleFavorite = ({
    isFavorite,
    id,
  }: {
    isFavorite: boolean;
    id: string;
  }) => {
    if (!session?.user) {
      router.push('/auth/login');
      return;
    }
    toggleFavorite({ isFavorite, id });
  };

  const { mutate: toggleFavorite } = useMutation({
    mutationFn: async ({
      isFavorite,
      id,
    }: {
      isFavorite: boolean;
      id: string;
    }) => await FavoriteAction(isFavorite, id),

    onSuccess: (data) => {
      if (data?.success) {
        toast({
          title: 'Success',
          description: data.success,
        });
      }

      if (data?.error) {
        toast({
          title: 'Error',
          description: data.error,
        });
      }
    },
  });

  return (
    <Card>
      <CardContent className="p-4 relative">
        <div className="aspect-w-1 aspect-h-1 relative">
          <Image
            onClick={() => router.push(`/product/${productId}/detail`)}
            src={images[0].url}
            alt="product"
            width={500}
            height={500}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover cursor-pointer"
          />
        </div>
        <Heart
          className={cn('size-6 absolute top-2 right-3 cursor-pointer', {
            'text-rose-500': isFavarited === true,
            'text-black': isFavarited === false,
          })}
          onClick={() =>
            handleToggleFavorite({ isFavorite: isFavarited, id: productId })
          }
        />
        <div className="flex justify-between mb-5 mt-3">
          <div>
            <h4 className="font-bold text-sm">Price {price}$</h4>
            <span className="text-sm line-clamp-1 hover:underline cursor-pointer">
              {name}
            </span>
          </div>
        </div>

        <Button className="w-full" onClick={addToCard}>
          <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
        </Button>
      </CardContent>
    </Card>
  );
};
