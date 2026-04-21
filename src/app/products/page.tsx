"use client";

import { Suspense, useMemo } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { useState, useEffect } from "react";
import { getProducts, getShopAllSettings, DEFAULT_SHOP_ALL_SETTINGS } from "@/lib/services/admin";
import { Product, ShopAllSettings } from "@/lib/types";

// Normalized Category Mapping
const CATEGORY_MAP: Record<string, string> = {
  "machines": "Machines & Power Supplies",
  "needles": "Needles",
  "pigments": "Pigments",
  "numbing": "Anesthetic/Numbing",
  "practice": "Practice Materials",
  "lashes": "Lashes",
  "aftercare": "Aftercare",
};

function ProductGrid() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");
  const [products, setProducts] = useState<Product[]>([]);
  const [settings, setSettings] = useState<ShopAllSettings>(DEFAULT_SHOP_ALL_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch products first so they appear immediately
      try {
        const productsData = await getProducts();
        setProducts(productsData);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }

      // Fetch settings independently
      try {
        const settingsData = await getShopAllSettings();
        setSettings(settingsData);
      } catch (error) {
        console.warn("Using default settings due to fetch error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredProducts = useMemo(() => {
    if (!categoryParam || categoryParam === "all") return products;
    const mappedCategory = CATEGORY_MAP[categoryParam] || categoryParam;
    return products.filter((p) => p.category === mappedCategory);
  }, [categoryParam, products]);

  const activeCategoryName = useMemo(() => {
    if (!categoryParam || categoryParam === "all") return "All Products";
    return categoryParam.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
  }, [categoryParam]);

  if (isLoading) {
    return <div className="flex justify-center items-center h-40">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-gold"></div>
    </div>;
  }

  // Dynamic grid classes
  const gridColsDesktop = {
    2: 'lg:grid-cols-2',
    3: 'lg:grid-cols-3',
    4: 'lg:grid-cols-4',
    5: 'lg:grid-cols-5',
    6: 'lg:grid-cols-6',
  }[settings.grid.desktop] || 'lg:grid-cols-4';

  const gridColsMobile = settings.grid.mobile === 2 ? 'grid-cols-2' : 'grid-cols-1';

  return (
    <>
      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 py-6 border-b border-zinc-100 mb-12">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-6">
            <span className="text-[10px] font-bold tracking-widest uppercase text-zinc-900">
               Viewing: <span className="text-brand-gold ml-2">{activeCategoryName}</span>
            </span>
            <button className="flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase text-zinc-800 hover:text-brand-gold transition-colors ml-4">
              Availability <ChevronDown className="h-3 w-3" />
            </button>
            <button className="flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase text-zinc-800 hover:text-brand-gold transition-colors">
              Price <ChevronDown className="h-3 w-3" />
            </button>
          </div>
        </div>
        
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">Sort by:</span>
            <button className="flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase text-zinc-800 hover:text-brand-gold transition-colors">
              Alphabetically, A-Z <ChevronDown className="h-3 w-3" />
            </button>
          </div>
          <span className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">{filteredProducts.length} products</span>
        </div>
      </div>

      {/* Grid */}
      <div 
        className={`grid ${gridColsMobile} sm:grid-cols-2 ${gridColsDesktop} mb-24`}
        style={{ 
          gap: `${settings.grid.gap}px`,
        }}
      >
        {filteredProducts.map((product) => (
          <Link key={product.id} href={`/products/${product.id}`} className="group cursor-pointer flex flex-col space-y-4">
            <div 
              className="relative overflow-hidden bg-white border border-zinc-100 flex items-center justify-center p-0"
              style={{ 
                aspectRatio: '1/1', // Enforced Square Fit
                borderRadius: `${settings.card.borderRadius}px`
              }}
            >
              {product.imageUrls?.[0] ? (
                <img 
                  src={product.imageUrls[0]}
                  alt={product.name}
                  className="w-full h-full transition-transform duration-700 group-hover:scale-105"
                  style={{ 
                    objectFit: 'cover' // Forced Cover Fit
                  }}
                  loading="lazy"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-zinc-200">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                </div>
              )}
              {settings.card.showBadge && (
                <div className="absolute top-4 left-4 z-10">
                   <div className="bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-[4px] text-[7px] font-black tracking-[0.3em] uppercase text-zinc-900 border border-zinc-200/50 shadow-sm">
                      {product.name.toLowerCase().includes('mosha') ? 'MOSHA STUDIO' : 'PMU SUPPLY'}
                   </div>
                </div>
              )}
            </div>
            <div 
              className="space-y-1"
              style={{ textAlign: settings.card.textAlignment as any }}
            >
               <h3 
                 className="font-normal leading-snug text-zinc-900 group-hover:text-brand-gold transition-colors line-clamp-2"
                 style={{ fontSize: settings.card.titleSize === 'xs' ? '11px' : settings.card.titleSize === 'sm' ? '12px' : '14px' }}
               >
                 {product.name.startsWith('*') || product.name.startsWith('.') ? product.name : `*${product.name}`}
               </h3>
               <p 
                 className="font-bold text-zinc-900 mt-1"
                 style={{ fontSize: settings.card.priceSize === 'xs' ? '11px' : settings.card.priceSize === 'sm' ? '13px' : '15px' }}
               >
                  {product.salePrice && product.salePrice > 0 ? (
                    <span className={`flex gap-2 items-center ${settings.card.textAlignment === 'center' ? 'justify-center' : settings.card.textAlignment === 'right' ? 'justify-end' : ''}`}>
                      <span className="text-green-600">${product.salePrice.toFixed(2)}</span>
                      <span className="line-through text-zinc-400 font-normal text-[0.8em]">${product.price.toFixed(2)}</span>
                    </span>
                  ) : (
                    `$${product.price.toFixed(2)}`
                  )}
               </p>
            </div>
          </Link>
        ))}

        {filteredProducts.length === 0 && (
          <div className="col-span-full py-32 text-center space-y-4">
            <p className="text-zinc-400 text-sm italic">No products found in this collection.</p>
            <Link href="/products" className="text-[10px] font-bold text-brand-gold tracking-widest uppercase border-b border-brand-gold">
               Back to Shop All
            </Link>
          </div>
        )}
      </div>
    </>
  );
}

export default function ProductsPage() {
  return (
    <main className="min-h-screen bg-brand-cream">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-zinc-400 uppercase mb-8">
          <Link href="/" className="hover:text-brand-gold transition-colors">Home</Link>
          <span>/</span>
          <span className="text-zinc-800">Products</span>
        </div>

        <Suspense fallback={<div className="py-20 text-center">Loading collection...</div>}>
          <ProductGrid />
        </Suspense>

        <div className="flex justify-center items-center gap-6 py-12">
          <span className="text-[11px] font-bold border-b border-zinc-900 pb-0.5">1</span>
          <span className="text-[11px] font-light text-zinc-400">›</span>
        </div>
      </div>

      <Footer />
    </main>
  );
}
