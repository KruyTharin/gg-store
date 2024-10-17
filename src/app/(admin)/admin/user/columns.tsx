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
import { formatDateTime } from '@/lib/date';
import { ProductActionButton } from '@/components/button-action/product';
import Image from 'next/image';
import { User } from '@prisma/client';
import { UserDeleteAction } from '@/actions/user';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function useColorColumn() {
  const onDeleteShow = useDeleteAlertStore((state) => state.onShow);
  const onShowClose = useDeleteAlertStore((state) => state.onClose);

  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const params = new URLSearchParams(searchParams);

  const { mutate: onDeleteConfirm } = useMutation({
    mutationFn: async (id: string) => await UserDeleteAction(id),

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

  function getColumns({ meta }: { meta: Meta }): ColumnDef<User>[] {
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
        accessorKey: 'role',
        header: 'Role',
      },
      {
        accessorKey: 'email',
        header: 'Email',
      },
      {
        accessorKey: 'emailVerified',
        header: 'EmailVerified',
        cell: ({ row }) => {
          return <span>{formatDateTime(row?.original?.emailVerified!)}</span>;
        },
      },
      {
        header: 'Profile Image',
        cell: ({ row }) => {
          return (
            <Avatar className="cursor-pointer">
              <AvatarImage src={row?.original?.image || ''} />
              <AvatarFallback>
                {row?.original?.name?.at(0) || 'N'}
              </AvatarFallback>
            </Avatar>
          );
        },
      },

      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
          const id = row.original.id;

          return (
            <ProductActionButton
              onEdit={() => router.push(`/admin/user/${id}/edit`)}
            >
              <AuthRender role="SUPER_ADMIN">
                <DropdownMenuItem
                  onClick={() =>
                    onDeleteShow({
                      text: 'User',
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
            </ProductActionButton>
          );
        },
      },
    ];
  }

  return { getColumns };
}
