'use client';

import React from 'react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card';
import { ArrowRightIcon, ShoppingBagIcon } from 'lucide-react';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';

function NoOrderHistory() {
  const router = useRouter();
  return (
    <Card className="w-full p-5">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center justify-center">
          <ShoppingBagIcon className="mr-2 h-6 w-6" />
          No Orders Yet
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        <div className="mb-4">
          <p className="text-lg text-muted-foreground">
            You haven't placed any orders yet. Start shopping to see your order
            history here!
          </p>
        </div>
        <div className="flex justify-center">
          <div className="w-32 h-32 bg-muted rounded-full flex items-center justify-center">
            <ShoppingBagIcon className="h-16 w-16 text-muted-foreground" />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button className="mt-4" size="lg" onClick={() => router.push('/')}>
          Start Shopping
          <ArrowRightIcon className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}

export default NoOrderHistory;
