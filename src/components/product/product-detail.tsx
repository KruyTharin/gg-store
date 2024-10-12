'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Image as ImageType } from '@prisma/client';
import { useCardStore } from '@/stores/useCard';
import { ProductCard } from '../customer/product-card';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

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
    card.addItem(data as any);
  };

  const card = useCardStore();

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };

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
          <p className="text-2xl font-semibold mb-4">${data.price ?? 'N/A'}</p>
          <Button className="w-full mb-6" onClick={addToCard}>
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
            />
          ))}
        </div>
      </div>
    </div>
  );
}
