import { db } from '@/lib/db';
import React from 'react';
import { DataTable } from './data-table';

export const getPaginatedResults = async ({
  sortType,
  column,
  searchQuery,
  currentPage,
  itemsPerPage,
}: {
  sortType?: string | undefined | null;
  column: string;
  searchQuery: string;
  currentPage: number;
  itemsPerPage: number;
}) => {
  const skip = (currentPage - 1) * itemsPerPage;

  const submission = await db.$transaction([
    db.billboard.count({
      where: {
        [column]: {
          mode: 'insensitive',
          contains: searchQuery,
        },
      },
    }),
    db.billboard.findMany({
      skip: skip,
      take: itemsPerPage,
      where: {
        [column]: {
          mode: 'insensitive',
          contains: searchQuery,
        },
      },
      orderBy: {
        [column]: sortType ?? 'asc',
      },
    }),
  ]);

  const totalItems = submission[1].length ?? 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Ensure currentPage is within bounds
  const _currentPage = Math.min(Math.max(1, currentPage), totalPages);

  // Calculate start and end indices for items on the current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

  return {
    meta: {
      totalItems,
      totalPages,
      itemsPerPage,
      currentPage: _currentPage,
    },
    data: submission[1],
  };
};

async function BillboardPage() {
  const billboards = await getPaginatedResults({
    column: 'label',
    searchQuery: '',
    currentPage: 1,
    itemsPerPage: 5,
  });

  console.log(billboards);

  return <DataTable data={billboards.data} meta={billboards.meta} />;
}

export default BillboardPage;
