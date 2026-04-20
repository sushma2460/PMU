"use client";

import { useCartStore } from "@/store/useCartStore";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export function CartDrawer() {
  const { items, isOpen, setIsOpen, updateQuantity, removeItem, getCartTotal } = useCartStore();

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="w-full sm:max-w-md flex flex-col">
        <SheetHeader className="border-b pb-4">
          <SheetTitle className="text-xl">Your Cart</SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-zinc-500 space-y-4">
              <p>Your cart is empty</p>
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Continue Shopping
              </Button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.product.id} className="flex gap-4 border-b pb-4">
                <div className="relative w-20 h-20 bg-zinc-100 rounded-md overflow-hidden shrink-0">
                  <div 
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${item.product.imageUrls[0]})` }}
                  />
                </div>
                
                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <h4 className="font-medium text-sm line-clamp-2">{item.product.name}</h4>
                    <p className="text-sm font-bold mt-1 text-zinc-900">
                      ${(item.product.salePrice ?? item.product.price).toFixed(2)}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center border rounded-md">
                      <button 
                        className="p-1 text-zinc-500 hover:text-black"
                        onClick={() => updateQuantity(item.product.id as string, Math.max(1, item.quantity - 1))}
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                      <button 
                        className="p-1 text-zinc-500 hover:text-black"
                        onClick={() => updateQuantity(item.product.id as string, item.quantity + 1)}
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    
                    <button 
                      className="text-red-500 hover:text-red-700 p-1"
                      onClick={() => removeItem(item.product.id as string)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t pt-4 space-y-4 mt-auto">
            <div className="flex justify-between font-medium text-lg">
              <span>Subtotal</span>
              <span>${getCartTotal().toFixed(2)}</span>
            </div>
            <p className="text-xs text-zinc-500">Shipping and taxes calculated at checkout.</p>
            <div className="grid gap-2">
              <Link href="/checkout" onClick={() => setIsOpen(false)}>
                <Button className="w-full bg-amber-500 hover:bg-amber-600 text-black font-semibold">
                  CHECKOUT
                </Button>
              </Link>
              <Button variant="outline" className="w-full" onClick={() => setIsOpen(false)}>
                Continue Shopping
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
