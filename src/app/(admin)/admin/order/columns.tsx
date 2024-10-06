'use client';

import { ColumnDef } from '@tanstack/react-table';

import { Meta } from '@/types/interface';
import { formatDateTime } from '@/lib/date';
import { Badge } from '@/components/ui/badge';

export default function useOrderColumn() {
  function getColumns({ meta }: { meta: Meta }): ColumnDef<any>[] {
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
        cell: ({ row }) => {
          const product = row.original.orderItem.map(
            (item: any) => item.product.name
          );

          return <span className="line-clamp-1">{product.join(', ')}</span>;
        },
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
        cell: ({ row }) => {
          const totalPrice = row.original.orderItem.reduce(
            (total: any, item: any) =>
              total + item.quantity * Number(item.product.price),
            0
          );

          return <span>$ {totalPrice}</span>;
        },
      },
      {
        accessorKey: 'isPaid',
        header: 'isPaid',
        cell: ({ row }) => {
          return (
            <Badge variant={row.original.isPaid ? 'secondary' : 'destructive'}>
              {row.original.isPaid ? 'success' : 'failed'}
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
