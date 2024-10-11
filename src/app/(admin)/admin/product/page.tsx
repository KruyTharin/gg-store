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
    db.product.count({
      where: {
        [column]: {
          mode: 'insensitive',
          contains: search,
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

async function ProductPage({
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

  const products = await getPaginatedResults({
    column: 'name',
    search,
    page,
    perPage,
  });

  console.log(products.data[0].images[0]);

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
  }));

  return <DataTable data={productFormatted} meta={products.meta} />;
}

export default ProductPage;
