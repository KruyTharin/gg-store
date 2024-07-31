import React from 'react';
import { EditBillboardForm } from './edit-form';
import { db } from '@/lib/db';

export default async function EditBillboardPage({
  params,
}: {
  params: { id: string };
}) {
  const data = await db.billboard.findUnique({
    where: { id: params.id },
  });

  return <EditBillboardForm defaultValues={data} />;
}
