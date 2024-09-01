'use client';

import { useCardStore } from '@/stores/useCard';
import { Bell, CircleUserRound, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

function NavIcons() {
  const card = useCardStore();

  console.log(card.items, 'item');
  return (
    <div className="flex gap-x-5 items-center">
      <CircleUserRound />
      <Bell />

      <Link className="relative " href={'/card'}>
        <ShoppingCart />

        <small className="text-xs bg-black rounded-full px-1 text-white absolute -top-1 -right-1 h-fit">
          {card.items.length}
        </small>
      </Link>
    </div>
  );
}

export default NavIcons;
