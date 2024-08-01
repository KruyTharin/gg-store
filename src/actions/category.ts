'use server';

import { auth } from '@/auth';
import { db } from '@/lib/db';
import {
  CreateCategorySchema,
  CreateCategorySchemaType,
} from '@/schema/category';
import { UserRole } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export async function CategoryDeleteAction(id: string) {
  const session = await auth();
  const { role } = session?.user || {};

  if (role !== UserRole.ADMIN) {
    return { error: 'You do not have permission to delete!' };
  }

  try {
    await db.category.delete({
      where: { id },
    });

    revalidatePath('/category', 'page');

    return { success: 'Category successfully deleted!' };
  } catch (error) {
    console.error('CategoryDeleteAction.error', error);
  }
}

export const CreateCategoryAction = async (
  values: CreateCategorySchemaType
) => {
  const validationField = CreateCategorySchema.safeParse(values);

  if (!validationField.success) {
    return { error: 'Invalid field!' };
  }

  const { imageUrl, name } = validationField.data;

  const session = await auth();

  if (!session) {
    return { error: 'unAuthorize!' };
  }

  if (session.user.role !== UserRole.ADMIN) {
    return { error: 'You are not allowed to create billboard.' };
  }

  await db.category.create({
    data: {
      name,
      imageUrl,
    },
  });

  revalidatePath('/category', 'page');

  return { success: 'Category created successfully!' };
};

export const EditCategoryAction = async (
  values: CreateCategorySchemaType,
  id: string
) => {
  const validationField = CreateCategorySchema.safeParse(values);

  if (!validationField.success) {
    return { error: 'Invalid field!' };
  }

  if (!id) {
    return { error: 'Missing billboard ID!' };
  }

  const { imageUrl, name } = validationField.data;

  const session = await auth();

  if (!session) {
    return { error: 'unAuthorize!' };
  }

  if (session.user.role !== UserRole.ADMIN) {
    return { error: 'You are not allowed to create billboard.' };
  }

  await db.category.update({
    where: {
      id,
    },
    data: {
      name,
      imageUrl,
    },
  });

  revalidatePath('/category', 'page');

  return { success: 'Category updated successfully!' };
};
