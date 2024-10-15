import { db } from '@/lib/db';
import React from 'react';
import { DEFAULT_PAGE, DEFAULT_PER_PAGE } from '@/constants';
import { DataTable } from './data-table';

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
    db.order.count({
      where: {
        [column]: {
          mode: 'insensitive',
          contains: search,
        },
        isPaid: true,
      },
    }),
    db.order.findMany({
      skip: skip,
      take: perPage,
      where: {
        [column]: {
          mode: 'insensitive',
          contains: search,
        },
        isPaid: true,
      },
      orderBy: {
        [column]: sortType ?? 'asc',
      },
      include: {
        orderItem: {
          include: {
            product: true,
          },
        },
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

async function OrderPage({
  searchParams,
}: {
  searchParams: {
    status: string;
    page: string;
    per_page: string;
    search: string;
  };
}) {
  const search = searchParams.search;
  const page = Number(searchParams.page) || DEFAULT_PAGE;
  const perPage = Number(searchParams.per_page) || DEFAULT_PER_PAGE;

  const orders = await getPaginatedResults({
    column: 'id',
    search,
    page,
    perPage,
  });

  console.log(orders.data);

  return <DataTable data={orders.data} meta={orders.meta} />;
}

export default OrderPage;
