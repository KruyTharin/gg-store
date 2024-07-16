import React from 'react';
import { Heart } from 'lucide-react';
import Image from 'next/image';

function ProductCard() {
  return (
    <div className="flex flex-col gap-2">
      <Image
        src="https://images.pexels.com/photos/2983364/pexels-photo-2983364.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
        alt="product"
        width={500}
        height={500}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="object-cover aspect-[7/8]"
      />
      <div className="flex justify-between">
        <div>
          <h4 className="font-bold text-sm">US 12.90$</h4>
          <span className="text-sm">T-shirt with Print</span>
        </div>
        <Heart />
      </div>
      <div className="flex gap-2">
        <div className="size-4 bg-black border"></div>
        <div className="size-4 bg-red-500 border"></div>
        <div className="size-4 bg-white border"></div>
      </div>
    </div>
  );
}

export default ProductCard;
