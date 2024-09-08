'use client';

import { ColumnDef } from '@tanstack/react-table';

import { Meta } from '@/types/interface';
import { Order as OrderColumn } from '@prisma/client';
import { formatDateTime } from '@/lib/date';
import { Badge } from '@/components/ui/badge';

export default function useOrderColumn() {
  function getColumns({ meta }: { meta: Meta }): ColumnDef<OrderColumn>[] {
    const offset = (meta.currentPage - 1) * meta.itemsPerPage;

    return [
      {
        accessorKey: 'no',
        header: 'No',
        cell: ({ row }) => {
          return <span>{row.index + 1 + offset}</span>;
        },
      },
      {
        accessorKey: 'products',
        header: 'Products',
      },
      {
        accessorKey: 'phoneNumber',
        header: 'Phone Number',
      },
      {
        accessorKey: 'address',
        header: 'Address',
      },
      {
        accessorKey: 'totalPrice',
        header: 'Total Price',
      },
      {
        accessorKey: 'isPaid',
        header: 'isPaid',
        cell: ({ row }) => {
          return (
            <Badge variant={row.original.isPaid ? 'secondary' : 'destructive'}>
              Badge
            </Badge>
          );
        },
      },
      {
        accessorKey: 'createAt',
        header: 'CreateAt',
        cell: ({ row }) => {
          return <span>{formatDateTime(row.original.createAt)}</span>;
        },
      },
    ];
  }

  return { getColumns };
}
