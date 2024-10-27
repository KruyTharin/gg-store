'use server';

import { auth } from '@/auth';
import { db } from '@/lib/db';
import { UserRole } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export const EditOrderDeliveryStatusAction = async (
  userId: string,
  id: string
) => {
  if (!id) {
    return { error: 'Missing order ID!' };
  }
  const session = await auth();

  if (!session) {
    return { error: 'unAuthorize!' };
  }

  if (session.user.role === UserRole.USER) {
    return { error: 'You are not allowed to update Order Status.' };
  }

  await db.order.update({
    where: {
      id,
    },
    data: {
      deliveryBy: userId,
    },
  });

  revalidatePath('/admin/order', 'page');

  return { success: 'Order delivery updated successfully!' };
};
