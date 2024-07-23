'use client';

import { ColumnDef } from '@tanstack/react-table';

import { useRouter } from 'next/navigation';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Trash2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { Meta } from '@/types/interface';

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type UnitColumn = {
  id: string;
  no: number;
  name: string;
  updatedAt: string | Date;
  isActive: boolean;
};

export default function useUnitColumn() {
  const { data: session } = useSession();

  function gerColumns({ meta }: { meta: Meta }): ColumnDef<UnitColumn>[] {
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
        accessorKey: 'label',
        header: 'Label',
      },
      {
        accessorKey: 'unitLevel.name',
        header: ' Unit Level',
      },
    ];
  }

  return { gerColumns };
}
