"use client";

import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { ChevronDown, X } from "lucide-react";
import Link from "next/link";
import { Product, ShopAllSettings } from "@/lib/types";
import { DEFAULT_SHOP_ALL_SETTINGS, getShopAllSettings } from "@/lib/services/admin";
import { Pagination } from "@/components/ui/pagination";

const ITEMS_PER_PAGE = 12;

interface ProductGridClientProps {
  initialProducts: Product[];
  initialCategories: { id: string; name: string }[];
}

const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/[\s/&_-]+/g, "-")
    .replace(/[^\w-]/g, "")
    .replace(/^-+|-+$/g, "");

export function ProductGridClient({ initialProducts, initialCategories }: ProductGridClientProps) {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");

  const [settings, setSettings] = useState<ShopAllSettings>(DEFAULT_SHOP_ALL_SETTINGS);
  const [sortBy, setSortBy] = useState("alphabetical-az");
  const [showInStockOnly, setShowInStockOnly] = useState(false);
  const [priceFilterOpen, setPriceFilterOpen] = useState(false);
  const [sortFilterOpen, setSortFilterOpen] = useState(false);
  const [priceRange, setPriceRange] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    getShopAllSettings().then(setSettings).catch(() => {});
  }, []);

  // Close filters when navbar interaction fires
  useEffect(() => {
    const handleCloseFilters = () => {
      setPriceFilterOpen(false);
      setSortFilterOpen(false);
    };
    window.addEventListener("close-page-filters", handleCloseFilters);
    return () => window.removeEventListener("close-page-filters", handleCloseFilters);
  }, []);

  // Reset to page 1 on filter/sort change
  useEffect(() => {
    setCurrentPage(1);
  }, [categoryParam, sortBy, showInStockOnly, priceRange]);

  const filteredProducts = useMemo(() => {
    let result = [...initialProducts];

    // Category filter
    if (categoryParam && categoryParam !== "all") {
      if (categoryParam === "on-my-tray") {
        const categoryMap = new Map<string, Product>();
        result.forEach((product) => {
          if (!categoryMap.has(product.category)) categoryMap.set(product.category, product);
        });
        result = Array.from(categoryMap.values());
      } else {
        const targetCategory = initialCategories.find((c) => slugify(c.name) === categoryParam);
        const categoryName = targetCategory ? targetCategory.name : categoryParam;
        result = result.filter((p) => p.category === categoryName);
      }
    }

    // Active only
    result = result.filter((p) => p.isActive !== false);

    // Availability filter
    if (showInStockOnly) result = result.filter((p) => (p.stock || 0) > 0);

    // Price range filter
    if (priceRange) {
      result = result.filter((p) => {
        const price = p.salePrice || p.price;
        if (priceRange === "under-1000") return price < 1000;
        if (priceRange === "1000-5000") return price >= 1000 && price <= 5000;
        if (priceRange === "over-5000") return price > 5000;
        return true;
      });
    }

    // Sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case "price-low-high":
          return (a.salePrice || a.price) - (b.salePrice || b.price);
        case "price-high-low":
          return (b.salePrice || b.price) - (a.salePrice || a.price);
        case "alphabetical-za":
          return b.name.localeCompare(a.name);
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return result;
  }, [categoryParam, initialProducts, initialCategories, sortBy, showInStockOnly, priceRange]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

  const paginatedProducts = useMemo(
    () =>
      filteredProducts.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
      ),
    [filteredProducts, currentPage]
  );

  const activeCategoryName = useMemo(() => {
    if (!categoryParam || categoryParam === "all") return "All Products";
    if (categoryParam === "on-my-tray") return "On My Tray";
    return categoryParam
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }, [categoryParam]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* ── Filter Bar ── */}
      <div className="py-4 md:py-6 border-b border-zinc-100 mb-8 md:mb-12 space-y-3 md:space-y-0">

        {/* ── Row 1 (mobile): Category label + product count ── */}
        <div className="flex items-center justify-between md:hidden">
          <span className="text-[10px] font-bold tracking-widest uppercase text-zinc-500">
            {activeCategoryName}
          </span>
          <span className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">
            {filteredProducts.length} products
          </span>
        </div>

        {/* ── Row 2 (mobile): Filter chips ── */}
        <div className="flex md:hidden items-center gap-2">
          {/* Availability chip */}
          <button
            onClick={() => setShowInStockOnly(!showInStockOnly)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-[10px] font-bold tracking-widest uppercase border transition-all ${
              showInStockOnly
                ? "bg-brand-gold text-white border-brand-gold"
                : "bg-white text-zinc-600 border-zinc-200 hover:border-brand-gold"
            }`}
          >
            {showInStockOnly ? "In Stock ✓" : "Availability"}
            <ChevronDown className={`h-3 w-3 ${showInStockOnly ? "rotate-180" : ""}`} />
          </button>

          {/* Price chip */}
          <div className="relative">
            <button
              onClick={() => { setPriceFilterOpen(!priceFilterOpen); setSortFilterOpen(false); }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-[10px] font-bold tracking-widest uppercase border transition-all ${
                priceRange
                  ? "bg-brand-gold text-white border-brand-gold"
                  : priceFilterOpen
                  ? "bg-zinc-900 text-white border-zinc-900"
                  : "bg-white text-zinc-600 border-zinc-200 hover:border-brand-gold"
              }`}
            >
              {priceRange === "under-1000" ? "Under ₹1K" : priceRange === "1000-5000" ? "₹1K–5K" : priceRange === "over-5000" ? "Over ₹5K" : "Price"}
              <ChevronDown className={`h-3 w-3 transition-transform ${priceFilterOpen ? "rotate-180" : ""}`} />
            </button>
            {priceFilterOpen && (
              <>
                <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[90]" onClick={() => setPriceFilterOpen(false)} />
                <div className="fixed bottom-0 left-0 right-0 bg-white shadow-2xl z-[100] rounded-t-[2rem] animate-in slide-in-from-bottom duration-300">
                  <div className="px-6 py-4 border-b border-zinc-50 flex justify-between items-center">
                    <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold">Price Range</p>
                    <div className="flex items-center gap-4">
                      {priceRange && (
                        <button onClick={() => { setPriceRange(null); setPriceFilterOpen(false); }}
                          className="text-[9px] font-bold text-brand-gold uppercase border-b border-brand-gold/30">Clear</button>
                      )}
                      <button onClick={() => setPriceFilterOpen(false)} className="text-zinc-300">
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  <div className="py-4 space-y-1 pb-8">
                    {[{ id: "under-1000", label: "Under ₹1,000" }, { id: "1000-5000", label: "₹1,000 – ₹5,000" }, { id: "over-5000", label: "Over ₹5,000" }].map(opt => (
                      <button key={opt.id} onClick={() => { setPriceRange(opt.id); setPriceFilterOpen(false); }}
                        className={`block w-full text-left px-6 py-4 text-sm font-bold uppercase transition-colors ${priceRange === opt.id ? "text-brand-gold bg-zinc-50" : "text-zinc-600 hover:bg-zinc-50 hover:text-brand-gold"}`}>
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Sort chip */}
          <div className="relative ml-auto">
            <button
              onClick={() => { setSortFilterOpen(!sortFilterOpen); setPriceFilterOpen(false); }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-[10px] font-bold tracking-widest uppercase border transition-all ${
                sortBy !== "alphabetical-az"
                  ? "bg-zinc-900 text-white border-zinc-900"
                  : sortFilterOpen
                  ? "bg-zinc-900 text-white border-zinc-900"
                  : "bg-white text-zinc-600 border-zinc-200 hover:border-brand-gold"
              }`}
            >
              Sort
              <ChevronDown className={`h-3 w-3 transition-transform ${sortFilterOpen ? "rotate-180" : ""}`} />
            </button>
            {sortFilterOpen && (
              <>
                <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[90]" onClick={() => setSortFilterOpen(false)} />
                <div className="fixed bottom-0 left-0 right-0 bg-white shadow-2xl z-[100] rounded-t-[2rem] animate-in slide-in-from-bottom duration-300">
                  <div className="px-6 py-4 border-b border-zinc-50 flex justify-between items-center">
                    <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold">Sort Order</p>
                    <button onClick={() => setSortFilterOpen(false)} className="text-zinc-300">
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="py-4 space-y-1 pb-8">
                    {[
                      { id: "alphabetical-az", label: "Alphabetically, A–Z" },
                      { id: "alphabetical-za", label: "Alphabetically, Z–A" },
                      { id: "price-low-high", label: "Price, Low to High" },
                      { id: "price-high-low", label: "Price, High to Low" },
                    ].map(opt => (
                      <button key={opt.id} onClick={() => { setSortBy(opt.id); setSortFilterOpen(false); }}
                        className={`block w-full text-left px-6 py-4 text-sm font-bold uppercase transition-colors ${sortBy === opt.id ? "text-brand-gold bg-zinc-50" : "text-zinc-600 hover:bg-zinc-50 hover:text-brand-gold"}`}>
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* ── Desktop layout (unchanged) ── */}
        <div className="hidden md:flex justify-between items-center gap-6">
          <div className="flex items-center gap-8">
            <span className="text-[10px] font-bold tracking-widest uppercase text-zinc-900">
              Viewing: <span className="text-brand-gold ml-2">{activeCategoryName}</span>
            </span>
            <button
              onClick={() => setShowInStockOnly(!showInStockOnly)}
              className={`flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase transition-colors ${
                showInStockOnly ? "text-brand-gold" : "text-zinc-800 hover:text-brand-gold"
              }`}
            >
              Availability {showInStockOnly ? "(In Stock)" : ""}
              <ChevronDown className={`h-3 w-3 ${showInStockOnly ? "rotate-180" : ""}`} />
            </button>
            <div className="relative">
              <button
                onClick={() => { setPriceFilterOpen(!priceFilterOpen); setSortFilterOpen(false); }}
                className={`flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase transition-colors ${
                  priceFilterOpen ? "text-brand-gold" : "text-zinc-800 hover:text-brand-gold"
                }`}
              >
                Price <ChevronDown className={`h-3 w-3 transition-transform ${priceFilterOpen ? "rotate-180" : ""}`} />
              </button>
              {priceFilterOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-zinc-100 shadow-2xl z-[100] py-2 rounded-xl animate-in fade-in zoom-in-95 duration-300">
                  <div className="px-4 py-2 border-b border-zinc-50 flex justify-between items-center">
                    <p className="text-[9px] text-zinc-400 uppercase tracking-widest">Price Range</p>
                    {priceRange && (
                      <button onClick={() => { setPriceRange(null); setPriceFilterOpen(false); }}
                        className="text-[8px] font-bold text-brand-gold uppercase border-b border-brand-gold/30">Clear</button>
                    )}
                  </div>
                  <div className="py-2 space-y-1">
                    {[{ id: "under-1000", label: "Under ₹1,000" }, { id: "1000-5000", label: "₹1,000 – ₹5,000" }, { id: "over-5000", label: "Over ₹5,000" }].map(opt => (
                      <button key={opt.id} onClick={() => { setPriceRange(opt.id); setPriceFilterOpen(false); }}
                        className={`block w-full text-left px-4 py-2 text-[10px] transition-colors font-bold uppercase ${priceRange === opt.id ? "text-brand-gold bg-zinc-50" : "text-zinc-600 hover:bg-zinc-50 hover:text-brand-gold"}`}>
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">Sort by:</span>
            <div className="relative">
              <button
                onClick={() => { setSortFilterOpen(!sortFilterOpen); setPriceFilterOpen(false); }}
                className={`flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase transition-colors ${
                  sortFilterOpen ? "text-brand-gold" : "text-zinc-800 hover:text-brand-gold"
                }`}
              >
                {sortBy === "alphabetical-az" ? "Alphabetically, A-Z" : sortBy === "alphabetical-za" ? "Alphabetically, Z-A" : sortBy === "price-low-high" ? "Price, Low to High" : "Price, High to Low"}
                <ChevronDown className={`h-3 w-3 transition-transform ${sortFilterOpen ? "rotate-180" : ""}`} />
              </button>
              {sortFilterOpen && (
                <div className="absolute top-full right-0 mt-2 w-56 bg-white border border-zinc-100 shadow-2xl z-[100] py-2 rounded-xl animate-in fade-in zoom-in-95 duration-300">
                  <div className="px-4 py-2 border-b border-zinc-50">
                    <p className="text-[9px] text-zinc-400 uppercase tracking-widest">Sort Order</p>
                  </div>
                  <div className="py-2 space-y-1">
                    {[
                      { id: "alphabetical-az", label: "Alphabetically, A-Z" },
                      { id: "alphabetical-za", label: "Alphabetically, Z-A" },
                      { id: "price-low-high", label: "Price, Low to High" },
                      { id: "price-high-low", label: "Price, High to Low" },
                    ].map(opt => (
                      <button key={opt.id} onClick={() => { setSortBy(opt.id); setSortFilterOpen(false); }}
                        className={`block w-full text-left px-4 py-2 text-[10px] transition-colors font-bold uppercase ${sortBy === opt.id ? "text-brand-gold bg-zinc-50" : "text-zinc-600 hover:bg-zinc-50 hover:text-brand-gold"}`}>
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <span className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">
              {filteredProducts.length} products
            </span>
          </div>
        </div>
      </div>


      {/* Product Grid */}
      <div
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6 mb-12"
        style={{ gap: `${settings.grid.gap}px` }}
      >
        {paginatedProducts.map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.id}`}
            className="group cursor-pointer flex flex-col space-y-4"
          >
            <div
              className="relative overflow-hidden bg-white border border-zinc-100 flex items-center justify-center p-0"
              style={{
                aspectRatio: "1/1",
                borderRadius: `${settings.card.borderRadius}px`,
              }}
            >
              {product.imageUrls?.[0] ? (
                <img
                  src={product.imageUrls[0]}
                  alt={product.name}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-zinc-200">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
              {settings.card.showBadge && (
                <div className="absolute top-4 left-4 z-10">
                  <div className="bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-[4px] text-[7px] font-black tracking-[0.3em] uppercase text-zinc-900 border border-zinc-200/50 shadow-sm">
                    {product.name.toLowerCase().includes("mosha") ? "MOSHA STUDIO" : "PMU SUPPLY"}
                  </div>
                </div>
              )}
            </div>
            <div className="space-y-1" style={{ textAlign: settings.card.textAlignment as any }}>
              <h3
                className="font-normal leading-snug text-zinc-900 group-hover:text-brand-gold transition-colors line-clamp-2"
                style={{
                  fontSize:
                    settings.card.titleSize === "xs"
                      ? "11px"
                      : settings.card.titleSize === "sm"
                      ? "12px"
                      : "14px",
                }}
              >
                {product.name.startsWith("*") || product.name.startsWith(".")
                  ? product.name
                  : `*${product.name}`}
              </h3>
              <p
                className="font-bold text-zinc-900 mt-1"
                style={{
                  fontSize:
                    settings.card.priceSize === "xs"
                      ? "11px"
                      : settings.card.priceSize === "sm"
                      ? "13px"
                      : "15px",
                }}
              >
                {product.salePrice && product.salePrice > 0 ? (
                  <span
                    className={`flex gap-2 items-center ${
                      settings.card.textAlignment === "center"
                        ? "justify-center"
                        : settings.card.textAlignment === "right"
                        ? "justify-end"
                        : ""
                    }`}
                  >
                    <span className="text-green-600">₹{product.salePrice.toFixed(2)}</span>
                    <span className="line-through text-zinc-400 font-normal text-[0.8em]">
                      ₹{product.price.toFixed(2)}
                    </span>
                  </span>
                ) : (
                  `₹${product.price.toFixed(2)}`
                )}
              </p>
            </div>
          </Link>
        ))}

        {filteredProducts.length === 0 && (
          <div className="col-span-full py-32 text-center space-y-4">
            <p className="text-zinc-400 text-sm italic">No products found in this collection.</p>
            <Link
              href="/products"
              className="text-[10px] font-bold text-brand-gold tracking-widest uppercase border-b border-brand-gold"
            >
              Back to Shop All
            </Link>
          </div>
        )}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        className="mb-12"
      />
    </>
  );
}
