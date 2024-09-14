import { DollarSign, FolderClosed, Package } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { db } from '@/lib/db';

export default async function OverviewPage() {
  const stocks = await db.product.count({
    where: {
      isArchived: false,
    },
  });

  const saleCount = await db.order.count({
    where: {
      isPaid: true,
    },
  });

  const orders = await db.order.findMany({
    where: {
      isPaid: true,
    },
    include: {
      orderItem: {
        include: {
          product: true,
        },
      },
    },
  });

  const totalRevenue = orders.reduce(
    (total: any, item: any) =>
      total +
      item.orderItem.reduce(
        (total: any, item: any) =>
          total + item.quantity * Number(item.product.price),
        0
      ),
    0
  );

  return (
    <div className="flex-col md:flex container">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <div className="flex items-center space-x-2">
            <Button>Download</Button>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <OverviewCard
            title="Total Revenue"
            amount={`$${totalRevenue}`}
            description="show the total of revenue"
          >
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </OverviewCard>

          <OverviewCard
            title="Sales"
            amount={`${saleCount}`}
            description="products that sold"
          >
            <FolderClosed className="h-4 w-4 text-muted-foreground" />
          </OverviewCard>
          <OverviewCard
            title="Stocks"
            amount={`${stocks}`}
            description="product in stock"
          >
            <Package className="h-4 w-4 text-muted-foreground" />
          </OverviewCard>
        </div>
      </div>
    </div>
  );
}

interface Props {
  title: string;
  description: string;
  amount: string;
  children: React.ReactNode;
}

export const OverviewCard: React.FC<Props> = ({
  amount,
  description,
  title,
  children,
}) => {
  return (
    <Card className="p-3">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {children}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{amount}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
};
