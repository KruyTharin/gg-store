'use client';

import { useCardStore } from '@/stores/useCard';
import { Bell, CircleUserRound, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useSession } from 'next-auth/react';

function NavIcons() {
  const { data: session } = useSession();
  const card = useCardStore();

  return (
    <div className="flex gap-x-5 items-center">
      <Avatar>
        <AvatarImage src={session?.user.image} />
        <AvatarFallback>{session?.user.name.at(0)}</AvatarFallback>
      </Avatar>

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
