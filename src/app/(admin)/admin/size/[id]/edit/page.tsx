import React from 'react';
import { EditSizeForm } from './edit-form';
import { db } from '@/lib/db';

export default async function EditCategoryPage({
  params,
}: {
  params: { id: string };
}) {
  const data = await db.size.findUnique({
    where: { id: params.id },
  });

  return <EditSizeForm defaultValues={data} />;
}
