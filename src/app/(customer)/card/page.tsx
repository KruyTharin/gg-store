/* eslint-disable @next/next/no-img-element */
'use client';

import NoDataInCard from '@/components/customer/no-data-in-card';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/use-toast';
import { useCardStore } from '@/stores/useCard';
import { CreditCard, Minus, Plus, Trash } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import React, { useEffect } from 'react';

function CardPage() {
  const cardStore = useCardStore();
  const items = useCardStore((state) => state.items);
  const searchParams = useSearchParams();

  const totalPrice = items.reduce(
    (total, item) => total + Number(item.price) * item.quantity,
    0
  );

  const handleRemoveItems = (id: string) => {
    cardStore.removeItem(id);
  };

  const onCheckOut = async () => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_STRIPE_CHECKOUT_API!}`,
      {
        method: 'POST',
        body: JSON.stringify({ items }),
      }
    );

    const res = await response.json();
    window.location = res.url;
  };

  useEffect(() => {
    if (searchParams.get('success')) {
      toast({
        title: 'Payment success',
        description: 'Thank you for your order!',
      });
    }

    if (searchParams.get('cancelled')) {
      toast({
        title: 'Payment error',
        description: 'Something went wrong!',
      });
    }
  }, []);
  return (
    <div className="container mt-5">
      {!!cardStore?.items.length ? (
        <Card className="p-5">
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 mt-5">
            <div className="space-y-4">
              {cardStore.items.map((item: any) => (
                <div
                  className="flex justify-between items-center space-x-4"
                  key={item.id}
                >
                  <img
                    src={item?.images[0]?.url}
                    alt={item?.images[0]?.id}
                    className="w-16 h-16 rounded object-cover"
                  />
                  <div className="flex-1 space-y-1">
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-sm text-gray-500">Black</p>
                  </div>
                  <div className="flex gap-5 items-center justify-center">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => cardStore.removeQty(item)}
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span>{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => cardStore.addQty(item)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                      <span className="font-semibold">${item.price}</span>

                      <Button
                        variant="destructive"
                        onClick={() => handleRemoveItems(item.id)}
                      >
                        <Trash className="mr-2 h-4 w-4" /> Remove
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Separator />
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${totalPrice}</span>
              </div>
            </div>
            <Separator />
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>${totalPrice}</span>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full mt-5" onClick={() => onCheckOut()}>
              <CreditCard className="mr-2 h-4 w-4" /> Pay ${totalPrice}
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <NoDataInCard />
      )}
    </div>
  );
}

export default CardPage;
