import React from 'react';
import { EditCategoryForm } from './edit-form';
import { db } from '@/lib/db';

export default async function EditCategoryPage({
  params,
}: {
  params: { id: string };
}) {
  const data = await db.category.findUnique({
    where: { id: params.id },
  });

  return <EditCategoryForm defaultValues={data} />;
}
