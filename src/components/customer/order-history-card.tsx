'use client';
import {
  CalendarIcon,
  PackageIcon,
  TruckIcon,
  CheckCircleIcon,
  XCircleIcon,
  CircleDollarSign,
  RefreshCcw,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { formatDateTime } from '@/lib/date';
import { useCardStore } from '@/stores/useCard';
import { useRouter } from 'next/navigation';

export default function OrderHistoryCard({ data }: { data: any }) {
  const dataFormatted = data?.orderItem?.map((item: any) => ({
    ...item.product,
    quantity: item.quantity,
    color: item.product.color.value,
  }));
  const getStatusIcon = (status: any) => {
    switch (status) {
      case 'Processing':
        return <PackageIcon className="h-5 w-5 text-blue-500" />;
      case 'Shipped':
        return <TruckIcon className="h-5 w-5 text-yellow-500" />;
      case 'Delivered':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'Cancelled':
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getPaymentStatusIcon = (status: boolean) => {
    switch (status) {
      case true:
        return <CircleDollarSign className="h-5 w-5 text-green-500" />;
      case false:
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  const totalPrice = data?.orderItem?.reduce(
    (total: any, item: any) =>
      total + Number(item.product.price) * item.quantity,
    0
  );

  const card = useCardStore();
  const router = useRouter();
  const reOrder = () => {
    card.addItem(dataFormatted as any);
    router.push('/card');
  };

  return (
    <Card className="w-full p-5">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl">Order {data?.id ?? 'N/A'}</CardTitle>
          <div className="space-x-2">
            <Badge variant={'outline'}>
              {getStatusIcon('Processing')}
              <span className="ml-2">Processing</span>
            </Badge>

            <Badge variant={'outline'}>
              {getPaymentStatusIcon(data?.isPaid)}
              <span className="ml-2">
                {data?.isPaid ? 'Payment Success' : 'Payment Failed'}
              </span>
            </Badge>
          </div>
        </div>
        <CardDescription className="flex items-center mt-2">
          <CalendarIcon className="h-4 w-4 mr-2" />
          Order placed on {formatDateTime(data?.createAt) ?? 'N/A'}
        </CardDescription>
      </CardHeader>
      <CardContent className="mt-3">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center space-x-4">
            <Avatar className="h-12 w-12">
              <AvatarImage
                src={data?.orderItem[0]?.product?.images[0].url ?? ''}
                alt={data?.orderItem[0]?.product?.name ?? ''}
              />
              <AvatarFallback>OH</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold">{data?.orderItem?.length} items</h3>
              <p className="text-sm text-muted-foreground">
                Total: ${totalPrice.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
        <Accordion type="single" collapsible>
          <AccordionItem value="details">
            <AccordionTrigger className="font-semibold">
              Order Details
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 mt-4">
                <div>
                  <h4 className="font-semibold mb-2">Order Items</h4>
                  <ul className="space-y-2">
                    {!!data?.orderItem.length &&
                      data?.orderItem.map((item: any) => (
                        <li
                          key={item.id}
                          className="flex justify-between text-sm"
                        >
                          <div className="flex gap-5 items-center">
                            <Avatar className="h-12 w-12">
                              <AvatarImage
                                src={item?.product?.images[0].url ?? ''}
                                alt={item?.product?.name ?? ''}
                              />
                              <AvatarFallback>OH</AvatarFallback>
                            </Avatar>
                            <span>
                              {item.product.name} x{item.quantity}
                            </span>
                          </div>

                          <span>
                            ${(item.product.price * item.quantity).toFixed(2)}
                          </span>
                        </li>
                      ))}
                  </ul>
                </div>
                <div>
                  <div>
                    <h4 className="font-semibold mb-2">Shipping Address </h4>
                    <p className="text-sm">{data?.address || 'N/A'}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Phone Number</h4>
                    <p className="text-sm">{data?.phoneNumber || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
      <CardFooter className="flex justify-end mt-3">
        <Button variant="default" onClick={reOrder}>
          <RefreshCcw className="size-4 mr-1" />
          <span>ReOrder</span>
        </Button>
      </CardFooter>
    </Card>
  );
}
