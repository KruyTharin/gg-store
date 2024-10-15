'use client';

import { ColumnDef } from '@tanstack/react-table';

import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Trash2 } from 'lucide-react';
import { Meta } from '@/types/interface';
import Image from 'next/image';
import { BillboardActionButton } from '@/components/button-action/billboard';
import { AuthRender } from '@/components/auth-render';
import { useDeleteAlertStore } from '@/app/stores/useDeleteStore';
import { useMutation } from '@tanstack/react-query';
import { BillboardDeleteAction } from '@/actions/billboard';
import { toast } from '@/components/ui/use-toast';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Billboard as BillboardColumn } from '@prisma/client';
import { formatDateTime } from '@/lib/date';

export default function useBillboardColumn() {
  const onDeleteShow = useDeleteAlertStore((state) => state.onShow);
  const onShowClose = useDeleteAlertStore((state) => state.onClose);

  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const params = new URLSearchParams(searchParams);

  const { mutate: onDeleteConfirm } = useMutation({
    mutationFn: async (id: string) => await BillboardDeleteAction(id),

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

  function gerColumns({ meta }: { meta: Meta }): ColumnDef<BillboardColumn>[] {
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
        accessorKey: 'imageUrl:',
        header: 'Background Image',
        cell: ({ row }) => {
          return (
            <Image
              src={row.original.imageUrl}
              alt="product"
              width={70}
              height={500}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover aspect-1"
            />
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
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
          const id = row.original.id;

          return (
            <BillboardActionButton
              onEdit={() => router.push(`/admin/billboard/${id}/edit`)}
            >
              <AuthRender role="SUPER_ADMIN">
                <DropdownMenuItem
                  onClick={() =>
                    onDeleteShow({
                      text: 'Delete Billboard',
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
            </BillboardActionButton>
          );
        },
      },
    ];
  }

  return { gerColumns };
}
