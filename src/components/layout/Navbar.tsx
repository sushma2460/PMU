"use client";

import Link from "next/link";
import { ShoppingCart, User, Search, Menu } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { CartDrawer } from "@/components/cart/CartDrawer";

export function Navbar() {
  const { getCartCount, setIsOpen } = useCartStore();
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <button className="lg:hidden p-2">
            <Menu className="h-6 w-6" />
          </button>
          <Link href="/" className="font-bold text-2xl tracking-wider uppercase">
            MEKA.999
          </Link>
          <nav className="hidden xl:flex items-center gap-4 text-[13px] font-semibold ml-4 tracking-wide">
            <Link href="/products" className="hover:text-amber-500 transition-colors whitespace-nowrap">SHOP ALL</Link>
            <Link href="/products?category=on-my-tray" className="hover:text-amber-500 transition-colors whitespace-nowrap">ON MY TRAY</Link>
            <Link href="/products?category=machines" className="hover:text-amber-500 transition-colors whitespace-nowrap">MACHINES & POWER</Link>
            <Link href="/products?category=needles" className="hover:text-amber-500 transition-colors whitespace-nowrap">NEEDLES</Link>
            <Link href="/products?category=pigments" className="hover:text-amber-500 transition-colors whitespace-nowrap">PIGMENTS</Link>
            <Link href="/products?category=numbing" className="hover:text-amber-500 transition-colors whitespace-nowrap">NUMBING</Link>
            <Link href="/products?category=practice" className="hover:text-amber-500 transition-colors whitespace-nowrap">PRACTICE</Link>
            <Link href="/products?category=lashes" className="hover:text-amber-500 transition-colors whitespace-nowrap">LASHES</Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <button className="p-2 hover:text-amber-500 transition-colors">
            <Search className="h-5 w-5" />
          </button>
          <Link href="/login" className="hidden sm:flex items-center p-2 hover:text-amber-500 transition-colors">
            <User className="h-5 w-5" />
          </Link>
          <button onClick={() => setIsOpen(true)} className="relative p-2 hover:text-amber-500 transition-colors">
            <ShoppingCart className="h-5 w-5" />
            {getCartCount() > 0 && (
              <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-amber-500 text-black text-[10px] font-bold flex items-center justify-center">
                {getCartCount()}
              </span>
            )}
          </button>
        </div>
      </div>
      <CartDrawer />
    </header>
  );
}
