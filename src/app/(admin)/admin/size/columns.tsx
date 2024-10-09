'use client';

import { ColumnDef } from '@tanstack/react-table';

import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Trash2 } from 'lucide-react';
import { Meta } from '@/types/interface';
import { AuthRender } from '@/components/auth-render';
import { useDeleteAlertStore } from '@/app/stores/useDeleteStore';
import { useMutation } from '@tanstack/react-query';
import { toast } from '@/components/ui/use-toast';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Size as SizeColumn } from '@prisma/client';
import { formatDateTime } from '@/lib/date';
import { SizeActionButton } from '@/components/button-action/size';
import { SizeDeleteAction } from '@/actions/size';

export default function useSizeColumn() {
  const onDeleteShow = useDeleteAlertStore((state) => state.onShow);
  const onShowClose = useDeleteAlertStore((state) => state.onClose);

  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const params = new URLSearchParams(searchParams);

  const { mutate: onDeleteConfirm } = useMutation({
    mutationFn: async (id: string) => await SizeDeleteAction(id),

    onSuccess: (data) => {
      if (data?.success) {
        toast({
          title: 'Success',
          description: data.success,
        });
      }

      if (data?.error) {
        toast({
          title: 'Error',
          description: data.error,
        });
      }

      // Reset page to default
      params.set('page', '1');
      router.replace(`${pathname}?${params.toString()}`);
      onShowClose();
    },
  });

  function getColumns({ meta }: { meta: Meta }): ColumnDef<SizeColumn>[] {
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
        accessorKey: 'name',
        header: 'Name',
      },
      {
        accessorKey: 'value',
        header: 'Value',
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
            <SizeActionButton
              onEdit={() => router.push(`/admin/size/${id}/edit`)}
            >
              <AuthRender role="ADMIN">
                <DropdownMenuItem
                  onClick={() =>
                    onDeleteShow({
                      text: 'Delete Size',
                      onAccept: () => onDeleteConfirm(id),
                    })
                  }
                >
                  <div className="flex items-center space-x-1 cursor-pointer">
                    <Trash2 className="w-4 h-4 text-destructive" />
                    <span>Delete</span>
                  </div>
                </DropdownMenuItem>
              </AuthRender>
            </SizeActionButton>
          );
        },
      },
    ];
  }

  return { getColumns };
}
