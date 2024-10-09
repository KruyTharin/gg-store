import ProductDetail from '@/components/product/product-detail';
import { db } from '@/lib/db';
import React from 'react';

export default async function Page({ params }: { params: { id: string } }) {
  const productDetail = await db.product.findUnique({
    where: { id: params.id },
    include: {
      images: true,
      category: true,
    },
  });

  let productByCategories;

  if (productDetail?.category?.name) {
    productByCategories = await db.product.findMany({
      where: {
        category: {
          id: productDetail?.category?.id,
        },
      },
      include: {
        images: true,
        size: true,
        color: true,
      },
    });
  }
  return (
    <ProductDetail data={productDetail} relatedProducts={productByCategories} />
  );
}
