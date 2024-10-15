'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  ShoppingCart,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Image as ImageType } from '@prisma/client';
import { useCardStore } from '@/stores/useCard';
import { ProductCard } from '../customer/product-card';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function ProductDetail({
  data,
  relatedProducts,
}: {
  data: any;
  relatedProducts: any;
}) {
  const [currentImage, setCurrentImage] = useState(0);
  const { data: session } = useSession();
  const router = useRouter();

  const { images, ...res } = data;

  const addToCard = () => {
    if (!session?.user) return router.push('/auth/login');
    card.addItem({ ...data, quantity: count } as any);
  };

  const card = useCardStore();

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };

  const [count, setCount] = useState(1);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="relative">
          <div className="relative h-[600px] w-full">
            {data.images.map((img: ImageType, index: number) => (
              <Image
                key={img.id}
                src={img.url}
                alt={img.id}
                fill
                className={`object-cover rounded-lg transition-opacity duration-300 ${
                  index === currentImage ? 'opacity-100' : 'opacity-0'
                }`}
              />
            ))}
          </div>
          <Button
            variant="outline"
            size="icon"
            className="absolute left-2 top-1/2 transform -translate-y-1/2"
            onClick={prevImage}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute right-2 top-1/2 transform -translate-y-1/2"
            onClick={nextImage}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-4">{data.name ?? 'N/A'}</h1>
          <p className="text-2xl font-semibold mb-4">
            Price: ${data.price ?? 'N/A'}
          </p>

          <div className="mb-5">
            <h3 className="mb-5">
              product in stock{' '}
              <span className="text-yellow-500">{data.stockCount} left</span>
            </h3>
            <Button
              variant="outline"
              size="icon"
              disabled={count <= 1}
              onClick={() => setCount((pre) => pre - 1)}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="mx-3">{count}</span>
            <Button
              variant="outline"
              size="icon"
              disabled={count >= data.stockCount}
              onClick={() => setCount((pre) => pre + 1)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <Button
            className="w-full mb-6"
            onClick={addToCard}
            disabled={data.quantity === 0}
          >
            <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
          </Button>
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Product Description</h2>
            <p className="text-muted-foreground">{data.description}</p>
          </div>
        </div>
      </div>
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {relatedProducts.map((product: any) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              price={product.price as any}
              images={product.images}
              colors={product.color.name}
              isFavarited={product.isFavarited}
              stockCount={product.stockCount}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
