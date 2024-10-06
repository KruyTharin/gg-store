import React from 'react';
import CreateColorForm from './create-form';
import { db } from '@/lib/db';

async function CreateColorPage() {
  const categories = await db.category.findMany();
  const sizes = await db.size.findMany();
  const colors = await db.color.findMany();

  return (
    <CreateColorForm categories={categories} colors={colors} sizes={sizes} />
  );
}

export default CreateColorPage;
