import { toast } from '@/components/ui/use-toast';
import { Product } from '@prisma/client';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface CardStore {
  items: CartProduct[];
  addItem: (item: Product | Product[]) => void;
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
      addItem: (data: Product | Product[]) => {
        const currentItems = get().items;

        // Convert to an array if it's a single product
        const products = Array.isArray(data) ? data : [data];

        products.forEach((product) => {
          const existingItem = currentItems.find(
            (item) => item.id === product.id
          );

          if (existingItem) {
            toast({
              title: 'Warning',
              variant: 'error',
              description: `Item "${product.name}" is already in cart`,
            });
          } else {
            currentItems.push({
              ...product,
              quantity: (product as any)?.quantity,
            });
            toast({
              title: 'Success',
              description: `Item "${product.name}" added to cart`,
            });
          }
        });

        set({ items: [...currentItems] });
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
