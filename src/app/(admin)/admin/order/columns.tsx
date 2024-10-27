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
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CheckCircleIcon, PackageIcon, TruckIcon } from 'lucide-react';
import { EditOrderStatusAction } from '@/actions/order';
import { OrderStatus } from '@prisma/client';
import { toast } from '@/components/ui/use-toast';
import { useMutation, useQuery } from '@tanstack/react-query';
import { httpClient } from '@/lib/axios';
import { EditOrderDeliveryStatusAction } from '@/actions/delivery';
import { EditOrderDeliveryLocationAction } from '@/actions/delivery-location';

export default function useOrderColumn() {
  const getStatusIcon = (status: any) => {
    switch (status) {
      case 'PROCESSING':
        return <PackageIcon className="h-5 w-5 text-blue-500" />;
      case 'DELIVERED':
        return <TruckIcon className="h-5 w-5 text-yellow-500" />;
      case 'SUCCESS':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
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

  const { mutate: onUpdateDeliveryConfirm } = useMutation({
    mutationFn: async ({ userId, id }: { userId: string; id: string }) =>
      await EditOrderDeliveryStatusAction(userId, id),

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

  const { mutate: onUpdateDeliveryLocationConfirm } = useMutation({
    mutationFn: async ({
      deliveryLocationId,
      id,
    }: {
      deliveryLocationId: number;
      id: string;
    }) => await EditOrderDeliveryLocationAction(deliveryLocationId, id),

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

  const { data: deliveries } = useQuery({
    queryKey: ['deliveries'],
    queryFn: async () => {
      const response = await httpClient.get('/api/delivery');
      return response.data;
    },
  });

  const { data: deliveriesLocation } = useQuery({
    queryKey: ['deliveriesLocation'],
    queryFn: async () => {
      const response = await httpClient.get('/api/delivery-location');
      return response.data;
    },
  });

  const mappedData = deliveriesLocation?.map((item: any) => ({
    id: item.id,
    name: item.province === 'Phnom Penh' ? item.district : item.province,
  }));

  console.log(mappedData);

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
        accessorKey: 'deliveryLocationId',
        header: 'Location',
        cell: ({ row }) => {
          return (
            <Select
              defaultValue={row.original.deliveryLocationId}
              onValueChange={(e: any) => {
                console.log('Row ID:', row.original.id); // Check if this is logged
                onUpdateDeliveryLocationConfirm({
                  deliveryLocationId: e,
                  id: row.original.id,
                }); // Continue with the current implementation
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a location" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {!!mappedData?.length &&
                    mappedData.map((item: any) => {
                      return (
                        <SelectItem value={item?.id} key={item?.id}>
                          <div className="flex gap-2">
                            <span>{item?.name}</span>
                          </div>
                        </SelectItem>
                      );
                    })}
                </SelectGroup>
              </SelectContent>
            </Select>
          );
        },
      },
      {
        header: 'Delivery By',
        cell: ({ row }) => {
          return (
            <Select
              defaultValue={row.original.deliveryBy}
              onValueChange={(e: any) => {
                console.log('Row ID:', row.original.id); // Check if this is logged
                onUpdateDeliveryConfirm({ userId: e, id: row.original.id }); // Continue with the current implementation
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a delivery" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {!!deliveries?.length &&
                    deliveries.map((item: any) => {
                      return (
                        <SelectItem value={item?.id} key={item?.id}>
                          <div className="flex gap-2">
                            <span>{item?.name}</span>
                          </div>
                        </SelectItem>
                      );
                    })}
                </SelectGroup>
              </SelectContent>
            </Select>
          );
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
                  <SelectItem value="PROCESSING" disabled>
                    <div className="flex gap-2">
                      {getStatusIcon('PROCESSING')} <span>PROCESSING</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="DELIVERED">
                    <div className="flex gap-2">
                      {getStatusIcon('DELIVERED')} <span>DELIVERED</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="SUCCESS">
                    <div className="flex gap-2">
                      {getStatusIcon('SUCCESS')} <span>SUCCESS</span>
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
