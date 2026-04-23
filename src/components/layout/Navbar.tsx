"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingCart, User, Search, Menu, LogOut, ChevronDown } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { getCategoriesAction } from "@/app/admin/products/category-actions";
import { useRouter } from "next/navigation";

export function Navbar() {
  const { getCartCount, setIsOpen } = useCartStore();
  const { user, logout } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categories, setCategories] = useState<{id: string, name: string}[]>([]);
  const [categoriesExpanded, setCategoriesExpanded] = useState(false);

  useEffect(() => {
    setMounted(true);
    async function loadCategories() {
      const res = await getCategoriesAction();
      if (res.success && res.categories) {
        setCategories(res.categories);
      }
    }
    loadCategories();
  }, []);

  const slugify = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[\s/&_-]+/g, '-') 
      .replace(/[^\w-]/g, '')    
      .replace(/^-+|-+$/g, '');
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      router.push("/");
    } catch (error: any) {
      toast.error(error.message || "Failed to logout");
    }
  };
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Left: Mobile Menu + Logo */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 hover:bg-zinc-100 rounded-md transition-colors"
          >
            <Menu className="h-6 w-6" />
          </button>
          <Link href={user ? "/home" : "/"} className="font-heading font-bold text-2xl tracking-tighter text-brand-black uppercase">
            PMU<span className="text-brand-gold pl-1">SUPPLY</span>
          </Link>
        </div>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 top-16 z-[100] lg:hidden bg-brand-cream animate-in slide-in-from-left duration-300 overflow-y-auto h-[calc(100vh-4rem)]">
            <div className="container mx-auto px-4 py-8 flex flex-col gap-8 pb-20">
              <Link onClick={() => setMobileMenuOpen(false)} href="/products" className="text-2xl font-heading tracking-widest uppercase text-brand-rose border-b border-brand-gold/10 pb-4">Shop All</Link>
              
              <div className="space-y-4">
                <button 
                  onClick={() => setCategoriesExpanded(!categoriesExpanded)}
                  className="w-full flex items-center justify-between text-lg font-bold tracking-[0.2em] uppercase text-brand-rose"
                >
                  Product Categories
                  <ChevronDown className={`h-5 w-5 transition-transform duration-300 ${categoriesExpanded ? 'rotate-180' : ''}`} />
                </button>
                
                {categoriesExpanded && (
                  <div className="grid grid-cols-1 gap-4 pl-4 animate-in fade-in slide-in-from-top-2 duration-300">
                    {categories.map((cat) => (
                      <Link 
                        key={cat.id}
                        onClick={() => setMobileMenuOpen(false)}
                        href={`/products?category=${slugify(cat.name)}`}
                        className="text-sm font-bold text-brand-rose/80 hover:text-brand-black transition-colors flex items-center justify-between group uppercase tracking-widest"
                      >
                        {cat.name}
                        <span className="h-px w-0 bg-brand-rose group-hover:w-8 transition-all duration-300" />
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-8 pt-4 border-t border-brand-gold/10">
                <Link onClick={() => setMobileMenuOpen(false)} href="/products?category=on-my-tray" className="block text-lg font-bold tracking-[0.2em] uppercase text-brand-rose">On My Tray</Link>
                <Link onClick={() => setMobileMenuOpen(false)} href="/pages/international" className="block text-lg font-bold tracking-[0.2em] uppercase text-brand-rose">International</Link>
                <Link onClick={() => setMobileMenuOpen(false)} href="/pages/contact" className="block text-lg font-bold tracking-[0.2em] uppercase text-brand-rose">Contact</Link>
                <Link onClick={() => setMobileMenuOpen(false)} href="/pages/disclaimer" className="block text-lg font-bold tracking-[0.2em] uppercase text-brand-rose">Disclaimer</Link>
              </div>

              {/* Mobile Footer Area */}
              <div className="mt-auto pt-12 space-y-4">
                <p className="text-[8px] font-bold tracking-[0.5em] uppercase text-zinc-400">PMU SUPPLY INDIA</p>
                <div className="flex gap-4">
                   <div className="h-8 w-8 rounded-full border border-zinc-200 flex items-center justify-center text-zinc-400">IG</div>
                   <div className="h-8 w-8 rounded-full border border-zinc-200 flex items-center justify-center text-zinc-400">FB</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Center: Navigation - Condensed with Dropdown */}
        <nav className="hidden lg:flex items-center gap-8 text-[11px] font-bold tracking-[0.2em] text-zinc-800">
          <Link href="/products" className="hover:text-brand-gold transition-colors whitespace-nowrap uppercase">Shop All</Link>
          
          {/* Categories Dropdown */}
          <div className="relative group py-4">
            <button 
              onMouseEnter={() => window.dispatchEvent(new CustomEvent('close-page-filters'))}
              className="flex items-center gap-2 hover:text-brand-gold transition-colors whitespace-nowrap uppercase"
            >
              Product Categories
              <ChevronDown className="h-3 w-3 group-hover:rotate-180 transition-transform duration-300" />
            </button>
            <div className="absolute top-full left-0 w-64 bg-white border border-zinc-100 shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-2 group-hover:translate-y-0 z-[100] rounded-xl overflow-hidden">
              <div className="py-2 max-h-[220px] overflow-y-auto no-scrollbar">
                {categories.map((cat) => (
                  <Link 
                    key={cat.id}
                    href={`/products?category=${slugify(cat.name)}`}
                    className="block px-6 py-3 text-[10px] text-zinc-600 hover:bg-brand-rose hover:text-brand-black transition-colors"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <Link href="/products?category=on-my-tray" className="hover:text-brand-gold transition-colors whitespace-nowrap uppercase">On My Tray</Link>
          <Link href="/pages/international" className="hover:text-brand-gold transition-colors whitespace-nowrap uppercase">International</Link>
          <Link href="/pages/contact" className="hover:text-brand-gold transition-colors whitespace-nowrap uppercase">Contact</Link>
          <Link href="/pages/disclaimer" className="hover:text-brand-gold transition-colors whitespace-nowrap uppercase">Disclaimer</Link>
        </nav>

        {/* Right: Icons */}
        <div className="flex items-center gap-2 md:gap-4">
          <button className="p-2 hover:text-brand-gold transition-colors group">
            <Search className="h-5 w-5 group-hover:scale-110 transition-transform" />
          </button>
          
          {user ? (
            <div className="flex items-center gap-2">
              <Link href="/profile" className="flex items-center p-2 hover:text-brand-gold transition-colors group">
                <User className="h-5 w-5 group-hover:scale-110 transition-transform" />
              </Link>
              <button 
                onClick={handleLogout}
                className="flex items-center p-2 hover:text-red-500 transition-colors group"
                title="Logout"
              >
                <LogOut className="h-5 w-5 group-hover:scale-110 transition-transform" />
              </button>
            </div>
          ) : (
            <Link href="/login" className="flex items-center p-2 hover:text-brand-gold transition-colors group">
              <User className="h-5 w-5 group-hover:scale-110 transition-transform" />
            </Link>
          )}
          <button onClick={() => setIsOpen(true)} className="relative p-2 hover:text-brand-gold transition-colors group">
            <ShoppingCart className="h-5 w-5 group-hover:scale-110 transition-transform" />
            {mounted && getCartCount() > 0 && (
              <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-brand-gold text-white text-[10px] font-bold flex items-center justify-center">
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
