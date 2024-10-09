/* eslint-disable react/no-unescaped-entities */
'use client';

import React from 'react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card';
import { ArrowRight, Heart, ShoppingBag } from 'lucide-react';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';

function NoFavorite() {
  const router = useRouter();
  return (
    <Card className="w-full p-5">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center justify-center">
          <Heart className="mr-2 h-6 w-6" />
          No Favorites Yet
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        <div className="mb-4">
          <p className="text-lg text-muted-foreground">
            You haven't added any items to your favorites list.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Explore our products and heart the ones you love!
          </p>
        </div>
        <div className="flex justify-center">
          <div className="w-32 h-32 bg-muted rounded-full flex items-center justify-center">
            <Heart className="h-16 w-16 text-muted-foreground" />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center space-x-4">
        <Button className="mt-4" size="lg" onClick={() => router.push('/')}>
          <ShoppingBag className="mr-2 h-4 w-4" />
          Start Shopping
        </Button>
        <Button
          className="mt-4"
          variant="outline"
          size="lg"
          onClick={() => router.push('/#categories')}
        >
          Explore Categories
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}

export default NoFavorite;
