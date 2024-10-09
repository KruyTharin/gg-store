/* eslint-disable react/no-unescaped-entities */
'use client';

import React from 'react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';

function NoDataInCard() {
  const router = useRouter();
  return (
    <Card className="w-full p-5">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center justify-center">
          <ShoppingCart className="mr-2 h-6 w-6" />
          Your cart is empty
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        <div className="mb-4">
          <p className="text-lg text-muted-foreground">
            Looks like you have't added any items to your cart yet.
          </p>
        </div>
        <div className="flex justify-center">
          <div className="w-32 h-32 bg-muted rounded-full flex items-center justify-center">
            <ShoppingCart className="h-16 w-16 text-muted-foreground" />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button className="mt-4" size="lg" onClick={() => router.push('/')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Continue Shopping
        </Button>
      </CardFooter>
    </Card>
  );
}

export default NoDataInCard;
