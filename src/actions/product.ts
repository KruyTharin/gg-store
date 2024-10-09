'use server';

import { auth } from '@/auth';
import { db } from '@/lib/db';
import { ProductSchema, ProductSchemaType } from '@/schema/product';
import { UserRole } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export const CreateProductAction = async (values: ProductSchemaType) => {
  const validationField = ProductSchema.safeParse(values);

  if (!validationField.success) {
    return { error: 'Invalid field!' };
  }

  const {
    name,
    categoryId,
    colorId,
    isArchived,
    images,
    isFeatured,
    price,
    sizeId,
    description,
  } = validationField.data;

  if (!images || !images.length) {
    return { error: 'Images is required!' };
  }

  const session = await auth();

  if (!session) {
    return { error: 'unAuthorize!' };
  }

  if (session.user.role !== UserRole.ADMIN) {
    return { error: 'You are not allowed to create product.' };
  }

  await db.product.create({
    data: {
      name,
      price,
      categoryId,
      colorId,
      isArchived,
      images: {
        createMany: {
          data: [...images.map((image: { url: string }) => image)],
        },
      },
      isFeatured,
      sizeId,
      description,
    },
  });

  revalidatePath('/product', 'page');

  return { success: 'Product created successfully!' };
};

export async function ProductDeleteAction(id: string) {
  const session = await auth();
  const { role } = session?.user || {};

  if (role !== UserRole.ADMIN) {
    return { error: 'You do not have permission to delete!' };
  }

  try {
    await db.product.delete({
      where: { id },
    });

    revalidatePath('/product', 'page');

    return { success: 'Product successfully deleted!' };
  } catch (error) {
    console.error('ProductDeleteAction.error', error);
  }
}

export const EditProductAction = async (
  values: ProductSchemaType,
  id: string
) => {
  const validationField = ProductSchema.safeParse(values);

  if (!validationField.success) {
    return { error: 'Invalid field!' };
  }

  if (!id) {
    return { error: 'Missing product ID!' };
  }

  const {
    categoryId,
    colorId,
    images,
    isArchived,
    isFeatured,
    name,
    price,
    sizeId,
    description,
  } = validationField.data;

  const session = await auth();

  if (!session) {
    return { error: 'unAuthorize!' };
  }

  if (session.user.role !== UserRole.ADMIN) {
    return { error: 'You are not allowed to edit product.' };
  }

  await db.product.update({
    where: {
      id,
    },
    data: {
      name,
      price,
      categoryId,
      colorId,
      isArchived,
      images: {
        createMany: {
          data: [...images.map((image: { url: string }) => image)],
        },
      },
      isFeatured,
      sizeId,
      description,
    },
  });

  revalidatePath('/product', 'page');

  return { success: 'Product updated successfully!' };
};

export const FavoriteAction = async (value: boolean, id: string) => {
  try {
    if (value === false) {
      await db.product.update({
        data: {
          isFavarited: true,
        },

        where: {
          id,
        },
      });

      revalidatePath('/product', 'page');

      return { success: 'Product added to your favorite' };
    } else {
      await db.product.update({
        data: {
          isFavarited: false,
        },

        where: {
          id,
        },
      });

      revalidatePath('/product', 'page');

      return { success: 'Product removed from your favorite' };
    }
  } catch (error) {
    return { error: 'Something went wrong!' };
  }
};
