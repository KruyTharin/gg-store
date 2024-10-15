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
import { ProductDeleteAction } from '@/actions/product';
import { ProductActionButton } from '@/components/button-action/product';
import Image from 'next/image';

interface ProductColumn {
  id: string;
  name: string;
  size: string;
  category: string;
  color: string;
  isFeatured: boolean;
  createAt: string;
}

export default function useColorColumn() {
  const onDeleteShow = useDeleteAlertStore((state) => state.onShow);
  const onShowClose = useDeleteAlertStore((state) => state.onClose);

  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const params = new URLSearchParams(searchParams);

  const { mutate: onDeleteConfirm } = useMutation({
    mutationFn: async (id: string) => await ProductDeleteAction(id),

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

  function getColumns({ meta }: { meta: Meta }): ColumnDef<ProductColumn>[] {
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
        accessorKey: 'url',
        header: 'image',
        cell: ({ row }) => {
          return (
            <Image
              src={(row.original as any)?.url}
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
        accessorKey: 'stockCount',
        header: 'Quantity',
      },
      {
        accessorKey: 'category',
        header: 'Category',
      },
      {
        accessorKey: 'size',
        header: 'Size',
      },
      {
        accessorKey: 'value',
        header: 'Color',
        cell: ({ row }) => {
          const color = row.original.color;
          return (
            <div className="flex gap-2 items-center">
              <div
                className={`size-3 rounded-full border`}
                style={{ backgroundColor: `${color}` }}
              />
              <span>{row.original.color}</span>
            </div>
          );
        },
      },

      {
        accessorKey: 'isFeatured',
        header: 'isFeatured',
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
            <ProductActionButton
              onEdit={() => router.push(`/admin/product/${id}/edit`)}
            >
              <AuthRender role="SUPER_ADMIN">
                <DropdownMenuItem
                  onClick={() =>
                    onDeleteShow({
                      text: 'Products',
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
