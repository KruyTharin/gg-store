import { toast } from '@/components/ui/use-toast';
import { Product } from '@prisma/client';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface CardStore {
  items: Product[];
  addItem: (item: Product) => void;
  removeItem: (id: string) => void;
  removeAllItems: () => void;
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
            description: 'Item is already in card',
          });
        }

        set({ items: [...get().items, data] });
        toast({
          title: 'Success',
          description: 'Item is already added to card',
        });
      },

      removeItem: (id: string) => {
        set({ items: [...get().items.filter((item) => item.id !== id)] });
        toast({
          title: 'Success',
          description: 'Item removed from card',
        });
      },

      removeAllItems: () => {
        set({ items: [] });
      },
    }),
    {
      name: 'card',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
