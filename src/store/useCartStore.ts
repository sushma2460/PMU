import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/lib/types';

export interface CartItem {
  product: Product;
  variantId?: string;
  variantName?: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addItem: (product: Product, quantity: number, variantId?: string, variantName?: string) => void;
  removeItem: (productId: string, variantId?: string) => void;
  updateQuantity: (productId: string, quantity: number, variantId?: string) => void;
  clearCart: () => void;
  setIsOpen: (isOpen: boolean) => void;
  getCartTotal: () => number;
  getCartCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      addItem: (product: Product, quantity = 1, variantId, variantName) => {
        set((state) => {
          const existingItem = state.items.find(
            (item) => item.product.id === product.id && item.variantId === variantId
          );
          
          if (existingItem) {
            return {
              items: state.items.map((item) =>
                (item.product.id === product.id && item.variantId === variantId)
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
              isOpen: true,
            };
          }

          return { 
            items: [...state.items, { product, quantity, variantId, variantName }],
            isOpen: true,
          };
        });
      },
      removeItem: (productId: string, variantId) => {
        set((state) => ({
          items: state.items.filter(
            (item) => !(item.product.id === productId && item.variantId === variantId)
          ),
        }));
      },
      updateQuantity: (productId: string, quantity: number, variantId) => {
        set((state) => ({
          items: state.items.map((item) =>
            (item.product.id === productId && item.variantId === variantId) 
              ? { ...item, quantity } 
              : item
          ),
        }));
      },
      clearCart: () => set({ items: [] }),
      setIsOpen: (isOpen: boolean) => set({ isOpen }),
      getCartTotal: () => {
        return get().items.reduce((total, item) => {
          const variant = item.product.variants?.find(v => v.id === item.variantId);
          const price = (item.product.salePrice ?? item.product.price) + (variant?.priceModifier || 0);
          return total + price * item.quantity;
        }, 0);
      },
      getCartCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: 'pmu-supply-cart-storage',
      partialize: (state) => ({ items: state.items }),
    }
  )
);
