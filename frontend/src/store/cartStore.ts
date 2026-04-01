import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, Promo } from '../types';

interface CartStore {
  cart: CartItem[];
  promo: Promo | null;
  addToCart: (item: Omit<CartItem, 'qty'>) => void;
  removeFromCart: (id: string) => void;
  changeQty: (id: string, delta: number) => void;
  clearCart: () => void;
  setPromo: (p: Promo | null) => void;
  reorder: (items: CartItem[]) => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      cart: [],
      promo: null,

      addToCart: (item) =>
        set((s) => {
          const existing = s.cart.find((i) => i._id === item._id);
          if (existing) {
            return { cart: s.cart.map((i) => i._id === item._id ? { ...i, qty: i.qty + 1 } : i) };
          }
          return { cart: [...s.cart, { ...item, qty: 1 }] };
        }),

      removeFromCart: (id) =>
        set((s) => ({ cart: s.cart.filter((i) => i._id !== id) })),

      changeQty: (id, delta) =>
        set((s) => {
          const updated = s.cart.map((i) =>
            i._id === id ? { ...i, qty: i.qty + delta } : i
          ).filter((i) => i.qty > 0);
          return { cart: updated };
        }),

      clearCart: () => set({ cart: [], promo: null }),

      setPromo: (p) => set({ promo: p }),

      reorder: (items) =>
        set((s) => {
          const updated = [...s.cart];
          items.forEach((item) => {
            const existing = updated.find((i) => i._id === item._id);
            if (existing) existing.qty += item.qty;
            else updated.push({ ...item });
          });
          return { cart: updated };
        }),
    }),
    { name: 'clover-cart' }
  )
);
