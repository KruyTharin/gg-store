import DeliveryPersonnel from '@/components/delivery';
import { db } from '@/lib/db';
import React from 'react';

async function DeliveryPersonnelPage() {
  const orders = await db.order.findMany({
    where: {
      isPaid: true,
    },
    orderBy: {
      createAt: 'desc',
    },
  });

  return <DeliveryPersonnel orders={orders} />;
}

export default DeliveryPersonnelPage;
