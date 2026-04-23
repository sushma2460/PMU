"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Trash2, Pencil, Loader2, PackageOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Product } from "@/lib/types";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { getProductsAction, deleteProductAction } from "./actions";
import { Pagination } from "@/components/ui/pagination";
import CategoryManager from "./CategoryManager";

const ITEMS_PER_PAGE = 10;

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const result = await getProductsAction();
      if (!result.success) throw new Error(result.error);
      setProducts(result.products as Product[]);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to load products.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product? This cannot be undone.")) return;
    setDeletingId(id);
    try {
      const result = await deleteProductAction(id);
      if (!result.success) throw new Error(result.error);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      toast.success("Product deleted.");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to delete product.");
    } finally {
      setDeletingId(null);
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
  const paginatedProducts = products.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-[2rem] font-heading font-normal tracking-tight text-zinc-900">Professional Catalog</h1>
          <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">Refining Professional Standards</p>
        </div>
        <div className="flex gap-3">
          <CategoryManager />
          <Link href="/admin/products/new">
            <Button className="bg-zinc-900 hover:bg-black text-white rounded-full text-[10px] font-bold tracking-widest uppercase px-8 h-10">
              <Plus className="h-3.5 w-3.5 mr-2" /> Add Product
            </Button>
          </Link>
        </div>
      </div>

      <div className="border rounded-[2rem] bg-white dark:bg-zinc-950 overflow-hidden shadow-sm">
        <div className="overflow-x-auto no-scrollbar">
          <Table>
            <TableHeader className="bg-zinc-50/50">
              <TableRow className="border-zinc-100 hover:bg-transparent">
                <TableHead className="w-[80px] text-[10px] uppercase tracking-widest font-bold">Image</TableHead>
                <TableHead className="text-[10px] uppercase tracking-widest font-bold">Designation</TableHead>
                <TableHead className="hidden md:table-cell text-[10px] uppercase tracking-widest font-bold">Category</TableHead>
                <TableHead className="text-[10px] uppercase tracking-widest font-bold">Value</TableHead>
                <TableHead className="text-[10px] uppercase tracking-widest font-bold">Supply</TableHead>
                <TableHead className="hidden sm:table-cell text-[10px] uppercase tracking-widest font-bold">Status</TableHead>
                <TableHead className="text-right text-[10px] uppercase tracking-widest font-bold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-20">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-brand-gold/40" />
                    <p className="text-[8px] font-bold uppercase tracking-[0.3em] text-zinc-400 mt-4">Syncing Inventory...</p>
                  </TableCell>
                </TableRow>
              ) : products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-24 text-zinc-400">
                    <PackageOpen className="h-12 w-12 mx-auto mb-4 opacity-20" />
                    <p className="text-xs font-bold uppercase tracking-widest">No products found.</p>
                    <p className="text-[10px] mt-2 italic">Start by clicking Add Product above.</p>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedProducts.map((product) => (
                  <TableRow key={product.id} className="border-zinc-50 hover:bg-zinc-50/50 transition-colors group">
                    <TableCell>
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-zinc-100 border border-zinc-100 flex-shrink-0 group-hover:scale-105 transition-transform">
                        {product.imageUrls?.[0] ? (
                          <img
                            src={product.imageUrls[0]}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-zinc-300">
                            <PackageOpen size={20} />
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium max-w-[150px] md:max-w-[200px]">
                      <div className="flex flex-col">
                        <span className="truncate text-sm text-zinc-900" title={product.name}>{product.name}</span>
                        <span className="md:hidden text-[9px] text-zinc-400 uppercase font-bold tracking-tighter mt-0.5">{product.category}</span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-zinc-500 text-xs font-medium">{product.category}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-bold text-sm text-zinc-900">₹{product.price.toFixed(2)}</span>
                        {product.salePrice && product.salePrice > 0 && (
                          <span className="text-[9px] text-green-600 font-bold uppercase tracking-tighter">On Sale</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`text-xs font-bold ${product.stock === 0 ? "text-red-500" : "text-zinc-600"}`}>
                        {product.stock}
                      </span>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Badge 
                        className={`text-[9px] uppercase tracking-widest rounded-full px-2 py-0.5 border-none shadow-none ${
                          product.isActive !== false 
                            ? "bg-green-50 text-green-600" 
                            : "bg-zinc-100 text-zinc-500"
                        }`}
                      >
                        {product.isActive !== false ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                      <Link href={`/admin/products/${product.id}`}>
                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-zinc-400 hover:text-brand-gold hover:bg-zinc-100">
                          <Pencil size={16} />
                        </Button>
                      </Link>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 rounded-xl text-zinc-400 hover:text-red-600 hover:bg-red-50"
                          onClick={() => handleDelete(product.id!)}
                          disabled={deletingId === product.id}
                        >
                          {deletingId === product.id
                            ? <Loader2 size={16} className="animate-spin" />
                            : <Trash2 size={16} />
                          }
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <Pagination 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
