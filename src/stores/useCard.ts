import { toast } from '@/components/ui/use-toast';
import { Product } from '@prisma/client';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface CardStore {
  items: CartProduct[];
  addItem: (item: Product) => void;
  addQty: (item: Product) => void;
  removeQty: (item: Product) => void;
  removeItem: (id: string) => void;
  removeAllItems: () => void;
}

interface CartProduct extends Product {
  quantity: number; // Add quantity field to product in cart
}

export const useCardStore = create(
  persist<CardStore>(
    (set, get) => ({
      items: [],
      addItem: (data: Product) => {
        const currentItem = get().items;
        const existingItem = currentItem.find((item) => item.id === data.id);

        if (existingItem) {
          return toast({
            title: 'Warning',
            variant: 'error',
            description: 'Item is already in card',
          });
        }

        set({ items: [...get().items, { ...data, quantity: 1 }] });
        toast({
          title: 'Success',
          description: 'Item is already added to card',
        });
      },

      removeItem: (id: string) => {
        set({ items: [...get().items.filter((item) => item.id !== id)] });
        toast({
          variant: 'default',
          title: 'Success',
          description: 'Item removed from card',
        });
      },

      removeAllItems: () => {
        set({ items: [] });
      },

      addQty: (data: Product) => {
        const currentItems = get().items;
        const existingItemIndex = currentItems.findIndex(
          (item) => item.id === data.id
        );

        if (existingItemIndex !== -1) {
          const updatedItems = [...currentItems];
          updatedItems[existingItemIndex].quantity += 1;

          set({ items: updatedItems });
        }
      },

      removeQty: (data: Product) => {
        const currentItems = get().items;
        const existingItemIndex = currentItems.findIndex(
          (item) => item.id === data.id
        );

        if (existingItemIndex !== -1) {
          const updatedItems = [...currentItems];
          if (updatedItems[existingItemIndex].quantity > 1) {
            updatedItems[existingItemIndex].quantity -= 1;
          }
          set({ items: updatedItems });
        }
      },
    }),
    {
      name: 'card',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
