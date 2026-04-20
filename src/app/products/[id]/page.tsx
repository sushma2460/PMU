"use client";

import { use, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/useCartStore";
import { ArrowLeft, Minus, Plus, ShieldCheck, Truck, RotateCcw } from "lucide-react";
import Link from "next/link";
import { Product } from "@/lib/types";

// Temporarily keep mock products here for demonstration
const MOCK_PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "MEKA Needle Cartridge V3 (NEW)",
    price: 29.00,
    category: "Needles",
    imageUrls: ["https://meka999.com/cdn/shop/files/mekav3cartridges.png?v=1710461623&width=823"],
    description: "Ultra Precision Needle Cartridges designed for precise PMU or traditional tattooing.",
    stock: 100,
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  {
    id: "p2",
    name: "MEKA Needle Cartridges V2 (RLLT)",
    price: 29.00,
    category: "Needles",
    imageUrls: ["https://meka999.com/cdn/shop/files/mekav2needles.png?v=1713391851&width=823"],
    description: "High-quality universal cartridges with US regulation membrane to prevent ink leakage.",
    stock: 85,
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  {
    id: "p3",
    name: "MEKA Nano Organic Pigment",
    price: 36.00,
    category: "Pigments",
    imageUrls: ["https://meka999.com/cdn/shop/files/mekapigments.png?v=1710461623&width=823"],
    description: "Waterbase oxide free organic pigments, ideal for ombre brow and hair stroke.",
    stock: 50,
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  {
    id: "p7",
    name: "Organic Smoothie Skin Treatment",
    price: 35.00,
    category: "Aftercare",
    imageUrls: ["https://meka999.com/cdn/shop/files/IMG_4131.jpg?v=1695668682&width=823"],
    description: "Petroleum Free! Made for professional PMU artists and the general public alike.",
    stock: 200,
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  {
    id: "p8",
    name: "Signature Practice Skins (Pack of 5)",
    price: 20.00,
    category: "Practice Materials",
    imageUrls: ["https://meka999.com/cdn/shop/files/IMG-4013.jpg?v=1776421429&width=823"],
    description: "Designers of newest versions of latex practice skin, designed for easier practice.",
    stock: 300,
    createdAt: Date.now(),
    updatedAt: Date.now()
  }
];

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state) => state.addItem);

  // In real app, fetch from Firestore. Here we use mock data.
  const product = MOCK_PRODUCTS.find(p => p.id === unwrappedParams.id) || MOCK_PRODUCTS[1];

  const handleAddToCart = () => {
    addItem(product, quantity);
  };

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/products" className="text-zinc-500 hover:text-amber-600 inline-flex items-center text-sm font-medium transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Products
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-12 lg:gap-24 mb-20">
          
          {/* Image Gallery Column */}
          <div className="space-y-4">
            <div className="relative aspect-square w-full bg-zinc-50 rounded-xl overflow-hidden border border-zinc-100">
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url("${product.imageUrls[0]}")` }}
              />
              {product.salePrice && (
                <span className="absolute top-4 left-4 bg-amber-500 text-black px-3 py-1 font-bold text-sm tracking-wide uppercase rounded-sm">
                  SALE
                </span>
              )}
            </div>
            
            {/* Thumbnail Gallery */}
            {product.imageUrls.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2">
                {product.imageUrls.map((url, i) => (
                  <button key={i} className="relative w-24 h-24 rounded-md overflow-hidden border-2 border-transparent focus:border-amber-500 shrink-0">
                    <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url("${url}")` }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details Column */}
          <div className="flex flex-col pt-4">
            <div className="mb-2">
              <span className="text-xs font-bold text-amber-500 tracking-wider uppercase">
                {product.category}
              </span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-zinc-900 mb-4">
              {product.name}
            </h1>
            
            <div className="flex items-end gap-3 mb-6">
              {product.salePrice ? (
                <>
                  <span className="text-3xl font-bold text-zinc-900">${product.salePrice.toFixed(2)}</span>
                  <span className="text-xl text-zinc-400 line-through mb-1">${product.price.toFixed(2)}</span>
                </>
              ) : (
                <span className="text-3xl font-bold text-zinc-900">${product.price.toFixed(2)}</span>
              )}
            </div>

            <div className="prose prose-zinc text-zinc-600 mb-8 max-w-none">
              <p>{product.description}</p>
            </div>

            <div className="space-y-6 pt-6 border-t border-zinc-100 mt-auto">
              <div>
                <span className="text-sm font-medium text-zinc-900 uppercase tracking-wide">Quantity</span>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center border border-zinc-300 rounded-md">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-3 text-zinc-500 hover:text-black transition-colors"
                      disabled={quantity <= 1}
                    >
                      <Minus size={18} />
                    </button>
                    <span className="w-12 text-center font-medium">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="p-3 text-zinc-500 hover:text-black transition-colors"
                      disabled={quantity >= product.stock}
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                  
                  <div className="flex-1">
                    <Button 
                      onClick={handleAddToCart}
                      className="w-full h-[50px] bg-amber-500 hover:bg-amber-600 text-black font-semibold text-base"
                    >
                      ADD TO CART
                    </Button>
                  </div>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-zinc-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-zinc-50 flex items-center justify-center text-zinc-700">
                    <ShieldCheck size={20} />
                  </div>
                  <span className="text-xs font-medium text-zinc-600">Secure<br/>Checkout</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-zinc-50 flex items-center justify-center text-zinc-700">
                    <Truck size={20} />
                  </div>
                  <span className="text-xs font-medium text-zinc-600">Fast<br/>Shipping</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-zinc-50 flex items-center justify-center text-zinc-700">
                    <RotateCcw size={20} />
                  </div>
                  <span className="text-xs font-medium text-zinc-600">Easy<br/>Returns</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}
