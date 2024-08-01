import React from 'react';
import CreateCategoryForm from './create-form';
import { db } from '@/lib/db';

async function CreateCategoryPage() {
  const billboards = await db.billboard.findMany();

  return <CreateCategoryForm billboards={billboards} />;
}

export default CreateCategoryPage;
