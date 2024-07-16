import { Bell, CircleUserRound, ShoppingCart } from 'lucide-react';
import React from 'react';

function NavIcons() {
  return (
    <div className="flex gap-x-5 items-center">
      <CircleUserRound />
      <Bell />
      <ShoppingCart />
    </div>
  );
}

export default NavIcons;
