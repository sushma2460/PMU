"use client";

import { useState, useMemo } from "react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";
import { 
  TrendingUp, 
  ShoppingCart, 
  Users, 
  DollarSign, 
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  ExternalLink
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Mock Data for the Dashboard
const SALES_DATA = [
  { date: "Oct 1", revenue: 4200, orders: 12 },
  { date: "Oct 5", revenue: 3800, orders: 10 },
  { date: "Oct 10", revenue: 5100, orders: 15 },
  { date: "Oct 15", revenue: 4800, orders: 14 },
  { date: "Oct 20", revenue: 6200, orders: 18 },
  { date: "Oct 25", revenue: 5900, orders: 16 },
  { date: "Oct 30", revenue: 7500, orders: 22 },
];

const RECENT_ORDERS = [
  { id: "PMU-8902", customer: "Sarah Johnson", date: "2 mins ago", total: "$235.00", status: "Pending" },
  { id: "PMU-8901", customer: "Michael Chen", date: "15 mins ago", total: "$1,240.00", status: "Paid" },
  { id: "PMU-8900", customer: "Elena Rodriguez", date: "1 hour ago", total: "$89.50", status: "Processing" },
  { id: "PMU-8899", customer: "Dr. Amara Okoro", date: "3 hours ago", total: "$450.00", status: "Paid" },
];

const LOW_STOCK_ITEMS = [
  { name: "V3 Nano Cartridge 0.30mm", stock: 3, sku: "NC-30-V3" },
  { name: "Organic Black M90 Pigment", stock: 2, sku: "PG-OR-M90" },
  { name: "Booms Butter 50ml", stock: 5, sku: "AB-BB-50" },
];

import { getDashboardStats, seedDatabase, getProducts } from "@/lib/services/admin";
import { toast } from "sonner";
import { useEffect } from "react";

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [hasProducts, setHasProducts] = useState(true);
  const [isInitializing, setIsInitializing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const dashboardData = await getDashboardStats();
      setStats(dashboardData);
      
      const products = await getProducts();
      setHasProducts(products.length > 0);
    };
    fetchData();
  }, []);

  const handleSeed = async () => {
    setIsInitializing(true);
    try {
      await seedDatabase();
      toast.success("Database Seeded Successfully");
      setHasProducts(true);
      window.location.reload();
    } catch (error) {
      toast.error("Failed to seed database");
    } finally {
      setIsInitializing(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-heading font-normal">Console Overview</h1>
          <p className="text-zinc-500 text-sm mt-1">Real-time performance metrics and system health.</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={handleSeed} 
            disabled={isInitializing}
            variant="outline"
            className="border-emerald-600 text-emerald-600 hover:bg-emerald-50 rounded-full text-[10px] font-bold tracking-widest uppercase"
          >
            {isInitializing ? "Seeding..." : "Refresh Seed Data"}
          </Button>
          <Button variant="outline" size="sm" className="rounded-full text-[10px] font-bold tracking-widest uppercase">Export CSV</Button>
          <Button size="sm" className="bg-brand-gold hover:bg-brand-black text-white rounded-full text-[10px] font-bold tracking-widest uppercase">Live View</Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <KPICard 
          title="Total Revenue" 
          value={stats ? `$${stats.totalRevenue.toLocaleString()}` : "$0"} 
          trend="+20.1%" 
          trendUp={true} 
          icon={<DollarSign className="w-4 h-4" />} 
          description="vs last month"
        />
        <KPICard 
          title="Total Orders" 
          value={stats ? stats.totalOrders : "0"} 
          trend="+12.5%" 
          trendUp={true} 
          icon={<ShoppingCart className="w-4 h-4" />} 
          description="vs last month"
        />
        <KPICard 
          title="Active Artists" 
          value="--" 
          trend="+5.1%" 
          trendUp={true} 
          icon={<Users className="w-4 h-4" />} 
          description="Live from DB"
        />
        <KPICard 
          title="Conversion Rate" 
          value="3.42%" 
          trend="-2.1%" 
          trendUp={false} 
          icon={<TrendingUp className="w-4 h-4" />} 
          description="avg session value"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-7">
        {/* Main Chart */}
        <Card className="lg:col-span-4 border-zinc-200 shadow-sm rounded-[2rem] overflow-hidden">
          <CardHeader className="p-8 pb-4">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-lg font-heading">Revenue Growth</CardTitle>
                <CardDescription className="text-xs uppercase tracking-widest font-bold text-zinc-400 mt-1">Last 30 Days Growth Analytics</CardDescription>
              </div>
              <div className="flex gap-1">
                 <button className="px-3 py-1 bg-zinc-100 rounded-full text-[9px] font-black uppercase">Revenue</button>
                 <button className="px-3 py-1 text-zinc-400 hover:bg-zinc-50 rounded-full text-[9px] font-black uppercase">Orders</button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8 pt-0">
            <div className="h-[300px] w-full mt-6">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={SALES_DATA}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#C9A84C" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#C9A84C" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fontSize: 10, fill: '#888'}} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fontSize: 10, fill: '#888'}}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                    itemStyle={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#C9A84C" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorRev)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Status Feed */}
        <div className="lg:col-span-3 space-y-6">
          {/* Low Stock Alerts */}
          <Card className="border-red-100 bg-red-50/10 rounded-[2rem] overflow-hidden">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-500" />
                <CardTitle className="text-sm font-bold uppercase tracking-widest text-red-600">Critical Stock Alerts</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {LOW_STOCK_ITEMS.map((item) => (
                <div key={item.sku} className="flex items-center justify-between p-3 bg-white border border-red-100 rounded-2xl">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-zinc-900">{item.name}</p>
                    <p className="text-[10px] text-zinc-400 font-mono uppercase">{item.sku}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-black text-red-600 uppercase">{item.stock} LEFT</p>
                    <Link href="/admin/products" className="text-[9px] font-bold text-zinc-400 hover:text-brand-gold underline underline-offset-4">RESTOCK</Link>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Orders List */}
          <Card className="rounded-[2.5rem] border-zinc-200 shadow-sm overflow-hidden">
            <CardHeader className="pb-4">
              <CardTitle className="text-sm font-bold uppercase tracking-widest text-zinc-800">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {RECENT_ORDERS.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 bg-zinc-50 rounded-2xl border border-zinc-100 hover:border-brand-gold transition-colors group cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[10px] font-bold border border-zinc-200">
                      {order.customer.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-zinc-900">{order.customer}</p>
                      <div className="flex items-center gap-2 text-[10px] text-zinc-400">
                        <Clock className="w-3 h-3" />
                        {order.date}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-black text-zinc-900">{order.total}</p>
                    <span className="text-[9px] font-bold text-brand-gold uppercase tracking-tighter shadow-sm">{order.status}</span>
                  </div>
                </div>
              ))}
              <Link href="/admin/orders" className="flex items-center justify-center gap-2 text-[10px] font-black text-zinc-400 hover:text-brand-black transition-colors pt-2 uppercase">
                 View All Merchant Activity <ExternalLink className="w-3 h-3" />
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function KPICard({ title, value, trend, trendUp, icon, description }: any) {
  return (
    <Card className="border-none shadow-sm rounded-[2rem] bg-zinc-50/50 hover:bg-zinc-50 transition-colors">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
          {title}
        </CardTitle>
        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center border border-zinc-100 shadow-sm text-brand-gold">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-black tracking-tight text-zinc-900">{value}</div>
        <div className="flex items-center gap-2 mt-1">
          <div className={`flex items-center text-[10px] font-black ${trendUp ? 'text-green-500' : 'text-red-500'}`}>
            {trendUp ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
            {trend}
          </div>
          <span className="text-[10px] text-zinc-400 font-medium">{description}</span>
        </div>
      </CardContent>
    </Card>
  );
}
