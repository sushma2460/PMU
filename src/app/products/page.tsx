import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

// Mock Product Data to visualize the E-commerce UI before Firebase is hooked up
const MOCK_PRODUCTS = [
  {
    id: "p1",
    name: "MEKA Needle Cartridge V3 (NEW)",
    price: 29.00,
    category: "Needles",
    description: "Ultra Precision Needle Cartridges designed for precise PMU or traditional tattooing.",
    imageUrl: "https://meka999.com/cdn/shop/files/mekav3cartridges.png?v=1710461623&width=823"
  },
  {
    id: "p2",
    name: "MEKA Needle Cartridges V2 (RLLT)",
    price: 29.00,
    category: "Needles",
    description: "High-quality universal cartridges with US regulation membrane to prevent ink leakage.",
    imageUrl: "https://meka999.com/cdn/shop/files/mekav2needles.png?v=1713391851&width=823"
  },
  {
    id: "p3",
    name: "MEKA Nano Organic Pigment",
    price: 36.00,
    category: "Pigments",
    description: "Waterbase oxide free organic pigments, ideal for ombre brow and hair stroke.",
    imageUrl: "https://meka999.com/cdn/shop/files/mekapigments.png?v=1710461623&width=823"
  },
  {
    id: "p4",
    name: "Etalon Hybrid Brow Pigments (15ml)",
    price: 65.00,
    category: "Pigments",
    description: "Premium hybrid pigments known for stability and healed results.",
    imageUrl: "https://meka999.com/cdn/shop/files/etalonpigments.png?v=1710461623&width=823"
  },
  {
    id: "p5",
    name: "QVision Hyperline Needles",
    price: 42.00,
    category: "Needles",
    description: "Hyper-precision needles for meticulous PMU work, featuring an ergonomic design.",
    imageUrl: "https://meka999.com/cdn/shop/files/qvisionneedles.png?v=1710461623&width=823"
  },
  {
    id: "p6",
    name: "Milada Pigments by Qvision",
    price: 40.00,
    category: "Pigments",
    description: "Esteemed pigment line from Qvision, distributed exclusively by MEKA in USA/Canada.",
    imageUrl: "https://meka999.com/cdn/shop/files/miladapigments.png?v=1710461623&width=823"
  },
  {
    id: "p7",
    name: "Organic Smoothie Skin Treatment",
    price: 35.00,
    category: "Aftercare",
    description: "Petroleum Free! Made for professional PMU artists and the general public alike.",
    imageUrl: "https://meka999.com/cdn/shop/files/IMG_4131.jpg?v=1695668682&width=823"
  },
  {
    id: "p8",
    name: "Signature Practice Skins (Pack of 5)",
    price: 20.00,
    category: "Practice Materials",
    description: "Designers of newest versions of latex practice skin, designed for easier practice.",
    imageUrl: "https://meka999.com/cdn/shop/files/IMG-4013.jpg?v=1776421429&width=823"
  }
];

export default function ProductsPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12 flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Filters */}
        <aside className="w-full md:w-64 shrink-0 space-y-8">
          <div>
            <h3 className="font-bold text-lg mb-4 uppercase tracking-wide border-b pb-2">Categories</h3>
            <ul className="space-y-3 text-zinc-600">
              <li><Link href="/products" className="hover:text-amber-500 font-medium text-amber-600">Shop All</Link></li>
              <li><Link href="/products?category=machines" className="hover:text-amber-500">Machines & Power</Link></li>
              <li><Link href="/products?category=needles" className="hover:text-amber-500">Needles</Link></li>
              <li><Link href="/products?category=pigments" className="hover:text-amber-500">Pigments</Link></li>
              <li><Link href="/products?category=aftercare" className="hover:text-amber-500">Aftercare</Link></li>
              <li><Link href="/products?category=practice" className="hover:text-amber-500">Practice Skins</Link></li>
              <li><Link href="/products?category=lashes" className="hover:text-amber-500">Lashes</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4 uppercase tracking-wide border-b pb-2">Price Filters</h3>
            <ul className="space-y-2 text-zinc-600">
              <li><label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" /> Under $50</label></li>
              <li><label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" /> $50 - $150</label></li>
              <li><label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" /> Over $150</label></li>
            </ul>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold tracking-tight">Shop All Products</h1>
            <select className="border border-zinc-300 rounded-md p-2 text-sm bg-white cursor-pointer">
              <option>Sort by: Featured</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Alphabetically, A-Z</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {MOCK_PRODUCTS.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Pagination Mock */}
          <div className="flex justify-center mt-12 gap-2">
            <Button variant="outline" className="w-10 h-10 p-0 rounded-full border-zinc-300">1</Button>
            <Button variant="ghost" className="w-10 h-10 p-0 rounded-full text-zinc-500 hover:text-black hover:bg-zinc-100">2</Button>
            <Button variant="ghost" className="w-10 h-10 p-0 rounded-full text-zinc-500 hover:text-black hover:bg-zinc-100">{`>`}</Button>
          </div>
        </div>

      </div>
    </main>
  );
}

function ProductCard({ product }: { product: any }) {
  return (
    <Link href={`/products/${product.id}`} className="group block h-full">
      <Card className="border-none shadow-none h-full bg-transparent overflow-hidden rounded-none transition-all">
        <div className="relative aspect-square mb-4 bg-zinc-100 overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
            style={{ backgroundImage: `url("${product.imageUrl}")` }}
          />
          {product.salePrice && (
            <span className="absolute top-2 left-2 bg-amber-500 text-black text-xs font-bold px-2 py-1 tracking-wider uppercase z-10">
              SALE
            </span>
          )}
          
          <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-t from-black/50 to-transparent z-10 flex justify-center">
            <Button className="w-full bg-white text-black hover:bg-amber-500 hover:text-white transition-colors duration-300">
              QUICK ADD
            </Button>
          </div>
        </div>
        <CardContent className="p-0 text-center">
          <p className="text-sm text-zinc-500 mb-1 uppercase tracking-wider">{product.category}</p>
          <h3 className="font-medium text-zinc-900 group-hover:text-amber-600 transition-colors line-clamp-2 min-h-[48px]">
            {product.name}
          </h3>
          <div className="mt-2 flex justify-center items-center gap-2">
            {product.salePrice ? (
              <>
                <span className="text-amber-600 font-bold">${product.salePrice.toFixed(2)}</span>
                <span className="text-zinc-400 text-sm line-through">${product.price.toFixed(2)}</span>
              </>
            ) : (
              <span className="text-zinc-900 font-bold">${product.price.toFixed(2)}</span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
