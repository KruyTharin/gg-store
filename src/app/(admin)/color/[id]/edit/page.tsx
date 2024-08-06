import React from 'react';
import { EditColorForm } from './edit-form';
import { db } from '@/lib/db';

export default async function EditColorPage({
  params,
}: {
  params: { id: string };
}) {
  const data = await db.color.findUnique({
    where: { id: params.id },
  });

  return <EditColorForm defaultValues={data} />;
}
