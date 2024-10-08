/* eslint-disable @next/next/no-img-element */
import { auth } from '@/auth';
import OrderHistoryCard from '@/components/customer/order-history-card';
import NoOrderHistory from '@/components/no-order-history';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { db } from '@/lib/db';
import { ArrowRightIcon, ShoppingBagIcon } from 'lucide-react';

export default async function OrderHistory() {
  const session = await auth();

  const orders = await db.order.findMany({
    where: {
      userId: session?.user.id,
    },
    include: {
      orderItem: true, // Don't include product here for a separate fetch
    },
  });

  // Perform separate fetch for each product by its productId
  for (const order of orders) {
    for (const item of order.orderItem) {
      item.product = await db.product.findUnique({
        where: {
          id: item.productId,
        },
        include: {
          images: true,
          color: true,
        },
      });
    }
  }

  return (
    <div className="container space-y-5 mt-5">
      {!!orders?.length ? (
        orders.map((order) => <OrderHistoryCard key={order.id} data={order} />)
      ) : (
        <NoOrderHistory />
      )}
    </div>
  );
}
