import React from 'react';
import { EditUserForm } from './edit-form';
import { db } from '@/lib/db';

export default async function EditUserPage({
  params,
}: {
  params: { id: string };
}) {
  const data = await db.user.findUnique({
    where: { id: params.id },
  });

  return <EditUserForm defaultValues={data!} />;
}
