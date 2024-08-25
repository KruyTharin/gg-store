import React from 'react';
import { EditProductForm } from './edit-form';
import { db } from '@/lib/db';

export default async function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  const data = await db.product.findUnique({
    where: { id: params.id },
    include: {
      images: true,
    },
  });

  const categories = await db.category.findMany();
  const sizes = await db.size.findMany();
  const colors = await db.color.findMany();

  const images = await db.image.findMany({
    where: { id: params.id },
  });

  return (
    <EditProductForm
      defaultValues={data}
      categories={categories}
      colors={colors}
      sizes={sizes}
    />
  );
}
