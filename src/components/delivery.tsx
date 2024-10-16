'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Search,
  Package,
  PackageIcon,
  TruckIcon,
  CheckCircleIcon,
  XCircleIcon,
} from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { OrderStatus } from '@prisma/client';
import { EditOrderStatusAction } from '@/actions/order';
import { toast } from './ui/use-toast';
import { formatDateTime } from '@/lib/date';

export default function DeliveryPersonnel({ orders }: { orders: any[] }) {
  const [searchTerm, setSearchTerm] = useState('');

  const [deliveries, setDeliveries] = useState(
    orders?.map((order) => ({
      id: order?.id,
      address: order?.address || 'Address not provided',
      phoneNumber: order?.phoneNumber || 'phoneNumber not provided',
      customerName: order.userId, // Replace this with customer fetching logic if available
      status: order?.status,
      createAt: order?.createAt,
    }))
  );

  const filteredDeliveries = deliveries?.filter(
    (delivery) =>
      delivery.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  const { mutate: onStatusConfirm } = useMutation({
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

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Manage Deliveries</h1>
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by ID, address, or customer name"
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Phone Number</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Customer ID</TableHead>
                <TableHead>Order At</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDeliveries?.map((delivery) => (
                <TableRow key={delivery.id}>
                  <TableCell>{delivery.id}</TableCell>
                  <TableCell>{delivery.phoneNumber}</TableCell>
                  <TableCell>{delivery.address}</TableCell>
                  <TableCell>{delivery.customerName}</TableCell>
                  <TableCell>{formatDateTime(delivery.createAt)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-x-2">
                      {getStatusIcon(delivery.status)}
                      <span>{delivery.status} </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {delivery.status === 'DELIVERED' ? (
                      <Button size="sm" disabled className="w-full">
                        Delivered
                      </Button>
                    ) : (
                      <Button
                        onClick={() =>
                          onStatusConfirm({
                            status: 'DELIVERED',
                            id: delivery.id,
                          })
                        }
                        size="sm"
                      >
                        <Package className="h-4 w-4 mr-2" />
                        Mark as Delivered
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </main>
    </div>
  );
}
