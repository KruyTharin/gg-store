'use server';

import { auth } from '@/auth';
import { db } from '@/lib/db';
import { UserRole } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export const EditOrderDeliveryLocationAction = async (
  deliveryLocationId: number,
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
    return { error: 'You are not allowed to update Order delivery location.' };
  }

  await db.order.update({
    where: {
      id,
    },
    data: {
      deliveryLocationId,
    },
  });

  revalidatePath('/admin/order', 'page');

  return { success: 'Order delivery location updated successfully!' };
};
