import React from 'react';
import CreateCategoryForm from './create-form';
import { db } from '@/lib/db';

async function CreateCategoryPage() {
  const categories = await db.billboard.findMany();

  return <CreateCategoryForm categories={categories} />;
}

export default CreateCategoryPage;
