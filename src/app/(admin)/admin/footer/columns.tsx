'use client';

import { ColumnDef } from '@tanstack/react-table';

import { Meta } from '@/types/interface';
import { useRouter } from 'next/navigation';
import { Config as ConfigColumn } from '@prisma/client';
import { formatDateTime } from '@/lib/date';
import { ConfigActionButton } from '@/components/button-action/config';

export default function useColorColumn() {
  const router = useRouter();

  function getColumns({ meta }: { meta: Meta }): ColumnDef<ConfigColumn>[] {
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
        accessorKey: 'email',
        header: 'Email',
      },
      {
        accessorKey: 'location',
        header: 'Location',
      },
      {
        accessorKey: 'slogan',
        header: 'Slogan',
      },
      {
        accessorKey: 'createAt',
        header: 'CreateAt',
        cell: ({ row }) => {
          return <span>{formatDateTime(row.original.createAt)}</span>;
        },
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
          const id = row.original.id;

          return (
            <ConfigActionButton
              onEdit={() => router.push(`/admin/footer/${id}/edit`)}
            ></ConfigActionButton>
          );
        },
      },
    ];
  }

  return { getColumns };
}
