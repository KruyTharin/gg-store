/* eslint-disable @next/next/no-img-element */
import { auth } from '@/auth';
import OrderHistoryCard from '@/components/customer/order-history-card';
import NoOrderHistory from '@/components/no-order-history';
import { db } from '@/lib/db';

const OrderHistory = async () => {
  const session = await auth();

  const orders = await db.order.findMany({
    where: {
      userId: session?.user.id,
      isPaid: true,
    },
    include: {
      orderItem: true, // Don't include product here for a separate fetch
    },
  });

  // Perform separate fetch for each product by its productId
  for (const order of orders) {
    for (const item of order.orderItem) {
      (item as any).product = await db.product.findUnique({
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
  console.log(orders[0].orderItem);

  return (
    <div className="container space-y-5 mt-5">
      {!!orders?.length ? (
        orders.map((order) => <OrderHistoryCard key={order.id} data={order} />)
      ) : (
        <NoOrderHistory />
      )}
    </div>
  );
};

export default OrderHistory;
