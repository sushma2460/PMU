import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function AdminProductsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-zinc-500 mt-2">Manage your catalog, inventory, and pricing.</p>
        </div>
        <Link href="/admin/products/new">
          <Button className="w-full sm:w-auto gap-2">
            <Plus size={16} />
            Add Product
          </Button>
        </Link>
      </div>

      <div className="border rounded-md bg-white dark:bg-zinc-950">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* We will map real products here once Firebase is connected */}
            <TableRow>
              <TableCell colSpan={6} className="text-center py-10 text-zinc-500">
                No products found. Start by adding a new product.
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
