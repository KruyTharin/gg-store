import { DollarSign, FolderClosed, Package } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { db } from '@/lib/db';
import { DataTable } from './data-table';
import { DEFAULT_PAGE, DEFAULT_PER_PAGE } from '@/constants';

const getPaginatedResults = async ({
  sortType,
  column,
  search,
  page,
  perPage,
}: {
  sortType?: string | undefined | null;
  column: string;
  search: string;
  page: number;
  perPage: number;
}) => {
  const skip = (page - 1) * perPage;

  const submission = await db.$transaction([
    db.product.count({
      where: {
        [column]: {
          mode: 'insensitive',
          contains: search,
        },
        stockCount: {
          lt: 10, // 'lt' stands for 'less than'
        },
      },
    }),
    db.product.findMany({
      skip: skip,
      take: perPage,
      where: {
        [column]: {
          mode: 'insensitive',
          contains: search,
        },
        stockCount: {
          lt: 10, // 'lt' stands for 'less than'
        },
      },
      include: {
        color: true,
        size: true,
        category: true,
        images: true,
      },
      orderBy: {
        [column]: sortType ?? 'asc',
      },
    }),
  ]);

  const totalItems = submission[0] ?? 0;
  const totalPages = Math.ceil(totalItems / perPage);

  // Ensure currentPage is within bounds
  const currentPage = Math.min(Math.max(1, page), totalPages);

  return {
    meta: {
      totalItems,
      totalPages,
      currentPage,
      itemsPerPage: perPage,
    },
    data: submission[1],
  };
};

export default async function OverviewPage({
  searchParams,
}: {
  searchParams: {
    status: string;
    page: string;
    per_page: string;
    search: string;
  };
}) {
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

  const search = searchParams.search;
  const page = Number(searchParams.page) || DEFAULT_PAGE;
  const perPage = Number(searchParams.per_page) || DEFAULT_PER_PAGE;

  const products = await getPaginatedResults({
    column: 'name',
    search,
    page,
    perPage,
  });

  const productFormatted = products?.data?.map((product) => ({
    id: product.id,
    name: product.name,
    isFeatured: product.isFeatured,
    isArchived: product.isArchived,
    price: product.price,
    category: product?.category?.name!,
    size: product?.size?.name!,
    color: product?.color?.name!,
    createAt: product.createAt,
    url: product.images[0].url,
    quantity: product.stockCount,
  }));

  return (
    <div className="flex-col md:flex container">
      <div className="flex-1 space-y-4 p-8 pt-6">
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
      <DataTable data={productFormatted} meta={products?.meta} />
    </div>
  );
}

interface Props {
  title: string;
  description: string;
  amount: string;
  children: React.ReactNode;
}

const OverviewCard: React.FC<Props> = ({
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
