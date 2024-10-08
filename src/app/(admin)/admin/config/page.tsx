import { db } from '@/lib/db';
import React from 'react';
import { DEFAULT_PAGE, DEFAULT_PER_PAGE } from '@/constants';
import { DataTable } from './data-table';

export const getPaginatedResults = async ({
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
    db.config.count({
      where: {
        [column]: {
          mode: 'insensitive',
          contains: search,
        },
      },
    }),
    db.config.findMany({
      skip: skip,
      take: perPage,
      where: {
        [column]: {
          mode: 'insensitive',
          contains: search,
        },
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

async function SizePage({
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

  const configs = await getPaginatedResults({
    column: 'email',
    search,
    page,
    perPage,
  });

  return <DataTable data={configs.data} meta={configs.meta} />;
}

export default SizePage;
