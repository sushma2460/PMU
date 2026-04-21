"use client";

import { useState, useEffect, useMemo } from "react";
import { 
  Search, 
  Filter, 
  Download, 
  MoreHorizontal, 
  Eye, 
  Package, 
  CheckCircle2, 
  Clock, 
  XCircle,
  Truck,
  RotateCcw
} from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { getOrders, updateOrderStatus } from "@/lib/services/admin";
import { Order } from "@/lib/types";
import { toast } from "sonner";

const STATUS_CONFIG: Record<string, { color: string; icon: React.ReactNode }> = {
  "pending":    { color: "bg-zinc-100 text-zinc-600 border-zinc-200",    icon: <Clock className="w-3 h-3" /> },
  "paid":       { color: "bg-blue-50 text-blue-600 border-blue-100",     icon: <CheckCircle2 className="w-3 h-3" /> },
  "processing": { color: "bg-amber-50 text-amber-600 border-amber-100",  icon: <Package className="w-3 h-3" /> },
  "shipped":    { color: "bg-purple-50 text-purple-600 border-purple-100", icon: <Truck className="w-3 h-3" /> },
  "delivered":  { color: "bg-green-50 text-green-600 border-green-100",  icon: <CheckCircle2 className="w-3 h-3" /> },
  "cancelled":  { color: "bg-red-50 text-red-600 border-red-100",        icon: <XCircle className="w-3 h-3" /> },
};

const STATUS_FILTERS = ["all", "pending", "paid", "processing", "shipped", "delivered", "cancelled"];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        const data = await getOrders(filterStatus === "all" ? undefined : filterStatus);
        setOrders(data);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, [filterStatus]);

  const handleStatusUpdate = async (orderId: string, status: Order["status"]) => {
    try {
      await updateOrderStatus(orderId, status);
      toast.success(`Order updated to "${status}"`);
      const data = await getOrders(filterStatus === "all" ? undefined : filterStatus);
      setOrders(data);
    } catch (error) {
      toast.error("Failed to update order status");
    }
  };

  const filteredOrders = useMemo(() => {
    if (!searchTerm) return orders;
    const term = searchTerm.toLowerCase();
    return orders.filter(order =>
      order.id?.toLowerCase().includes(term) ||
      order.userId?.toLowerCase().includes(term) ||
      order.shippingAddress?.firstName?.toLowerCase().includes(term) ||
      order.shippingAddress?.lastName?.toLowerCase().includes(term)
    );
  }, [orders, searchTerm]);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-heading font-normal">Order Management</h1>
          <p className="text-zinc-500 text-sm mt-1">Efficiently manage status, fulfillment, and customer inquiries.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="rounded-full text-[10px] font-bold tracking-widest uppercase gap-2">
            <Download className="w-3 h-3" /> Export List
          </Button>
          <Button size="sm" className="bg-brand-gold hover:bg-brand-black text-white rounded-full text-[10px] font-bold tracking-widest uppercase">
            Create Manual Order
          </Button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row gap-4 p-4 bg-white border border-zinc-100 rounded-[2rem] shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <Input 
            placeholder="Search by Order ID or customer name..." 
            className="pl-10 h-11 border-zinc-100 rounded-2xl focus:ring-brand-gold/20 focus:border-brand-gold bg-zinc-50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {STATUS_FILTERS.map(s => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${
                filterStatus === s 
                  ? "bg-brand-gold text-white shadow" 
                  : "bg-zinc-50 text-zinc-400 border border-zinc-100 hover:border-brand-gold hover:text-brand-gold"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-zinc-100 rounded-[2.5rem] shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-zinc-50/50">
            <TableRow>
              <TableHead className="w-[160px] text-[10px] font-bold uppercase tracking-widest px-8">Order ID</TableHead>
              <TableHead className="text-[10px] font-bold uppercase tracking-widest">Customer</TableHead>
              <TableHead className="text-[10px] font-bold uppercase tracking-widest">Date</TableHead>
              <TableHead className="text-[10px] font-bold uppercase tracking-widest text-center">Items</TableHead>
              <TableHead className="text-[10px] font-bold uppercase tracking-widest">Total</TableHead>
              <TableHead className="text-[10px] font-bold uppercase tracking-widest">Status</TableHead>
              <TableHead className="text-[10px] font-bold uppercase tracking-widest text-right px-8">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="py-24 text-center">
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-gold" />
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="py-24 text-center">
                  <p className="text-zinc-400 text-sm italic">
                    {orders.length === 0 ? "No orders have been placed yet." : "No matching orders found."}
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders.map((order) => (
                <TableRow key={order.id} className="hover:bg-zinc-50/50 transition-colors group">
                  <TableCell className="px-8 font-mono text-[11px] font-bold text-zinc-400 group-hover:text-brand-gold transition-colors">
                    {order.id}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-zinc-900">
                        {order.shippingAddress 
                          ? `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`
                          : order.userId}
                      </span>
                      <span className="text-[10px] text-zinc-400 font-light">{order.shippingAddress?.city || "—"}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-zinc-500">
                    {new Date(order.createdAt).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}
                  </TableCell>
                  <TableCell className="text-center font-bold text-xs">
                    {order.items?.length ?? 0}
                  </TableCell>
                  <TableCell className="text-xs font-black text-zinc-900">
                    ${order.total?.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Badge className={`rounded-full px-3 py-1 flex items-center gap-1.5 w-fit font-bold text-[9px] uppercase tracking-tighter border ${STATUS_CONFIG[order.status]?.color}`}>
                      {STATUS_CONFIG[order.status]?.icon}
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right px-8">
                    <div className="flex justify-end gap-2">
                      <Link href={`/admin/orders/${order.id}`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-brand-gold hover:text-white transition-all">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-zinc-100">
                        <MoreHorizontal className="w-4 h-4" />
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
  );
}
