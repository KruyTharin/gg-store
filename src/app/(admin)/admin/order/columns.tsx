'use client';

import { ColumnDef } from '@tanstack/react-table';

import { Meta } from '@/types/interface';
import { formatDateTime } from '@/lib/date';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  CheckCircleIcon,
  PackageIcon,
  TruckIcon,
  XCircleIcon,
} from 'lucide-react';
import { EditOrderStatusAction } from '@/actions/order';
import { OrderStatus } from '@prisma/client';
import { toast } from '@/components/ui/use-toast';
import { useMutation } from '@tanstack/react-query';

export default function useOrderColumn() {
  const getStatusIcon = (status: any) => {
    switch (status) {
      case 'PROCESSING':
        return <PackageIcon className="h-5 w-5 text-blue-500" />;
      case 'SHIPPED':
        return <TruckIcon className="h-5 w-5 text-yellow-500" />;
      case 'DELIVERED':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'CANCELLED':
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  const { mutate: onDeleteConfirm } = useMutation({
    mutationFn: async ({ status, id }: { status: OrderStatus; id: string }) =>
      await EditOrderStatusAction(status, id),

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
    },
  });

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
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
          return (
            <Select
              defaultValue={row.original.status}
              onValueChange={(e: OrderStatus) => {
                console.log('Row ID:', row.original.id); // Check if this is logged
                onDeleteConfirm({ status: e, id: row.original.id }); // Continue with the current implementation
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a status" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Status</SelectLabel>
                  <SelectItem value="PROCESSING">
                    <div className="flex gap-2">
                      {getStatusIcon('PROCESSING')} <span>PROCESSING </span>
                    </div>
                  </SelectItem>
                  <SelectItem value="DELIVERED">
                    <div className="flex gap-2">
                      {getStatusIcon('DELIVERED')} <span>DELIVERED</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="SHIPPED">
                    <div className="flex gap-2">
                      {getStatusIcon('SHIPPED')} <span>SHIPPED</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="CANCELLED">
                    <div className="flex gap-2">
                      {getStatusIcon('CANCELLED')} <span>CANCELLED</span>
                    </div>
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          );
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
