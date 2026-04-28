"use client";

import { useState, useMemo, useEffect } from "react";

import {
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
  ExternalLink,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Download,
  Eye
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getDashboardStatsAction, DashboardPeriod } from "./actions";
import { seedDatabase, getProducts } from "@/lib/services/admin";
import { toast } from "sonner";

const PERIOD_OPTIONS: { label: string; short: string; value: DashboardPeriod }[] = [
  { label: "Today", short: "1D", value: "today" },
  { label: "Last Week", short: "7D", value: "7d" },
  { label: "Last Month", short: "30D", value: "30d" },
  { label: "Last Quarter", short: "90D", value: "90d" },
  { label: "Last Year", short: "1Y", value: "12m" },
  { label: "All Time", short: "All", value: "all" },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [hasProducts, setHasProducts] = useState(true);
  const [isInitializing, setIsInitializing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [period, setPeriod] = useState<DashboardPeriod>("today");
  const [isPeriodLoading, setIsPeriodLoading] = useState(false);

  const [stockAlertPage, setStockAlertPage] = useState(1);
  const [recentActivityPage, setRecentActivityPage] = useState(1);
  const ITEMS_PER_PAGE = 3;

  const paginatedStockAlerts = useMemo(() => {
    if (!stats?.lowStockItems) return [];
    const start = (stockAlertPage - 1) * ITEMS_PER_PAGE;
    return stats.lowStockItems.slice(start, start + ITEMS_PER_PAGE);
  }, [stats, stockAlertPage]);
  const totalStockAlertPages = stats?.lowStockItems
    ? Math.ceil(stats.lowStockItems.length / ITEMS_PER_PAGE) : 0;

  const paginatedRecentActivity = useMemo(() => {
    if (!stats?.recentActivity) return [];
    const start = (recentActivityPage - 1) * ITEMS_PER_PAGE;
    return stats.recentActivity.slice(start, start + ITEMS_PER_PAGE);
  }, [stats, recentActivityPage]);
  const totalRecentActivityPages = stats?.recentActivity
    ? Math.ceil(stats.recentActivity.length / ITEMS_PER_PAGE) : 0;

  const handleExportCSV = () => {
    if (!stats) return;
    let csvContent = "";
    csvContent += "Summary\n";
    csvContent += `Total Revenue,${stats.totalRevenue}\n`;
    csvContent += `Total Orders,${stats.totalOrders}\n`;
    csvContent += `Active Users,${stats.activeUsers}\n`;
    csvContent += `Total Users,${stats.totalUsers}\n\n`;
    if (stats.salesData?.length > 0) {
      csvContent += "Sales Data\nDate,Revenue\n";
      stats.salesData.forEach((r: any) => { csvContent += `${r.date},${r.revenue}\n`; });
      csvContent += "\n";
    }
    if (stats.lowStockItems?.length > 0) {
      csvContent += "Low Stock Items\nName,SKU,Stock\n";
      stats.lowStockItems.forEach((r: any) => {
        csvContent += `"${(r.name || "").replace(/"/g, '""')}",${r.sku},${r.stock}\n`;
      });
      csvContent += "\n";
    }
    if (stats.recentActivity?.length > 0) {
      csvContent += "Recent Activity\nType,Title,Details,Date\n";
      stats.recentActivity.forEach((r: any) => {
        csvContent += `${r.type},"${(r.title || "").replace(/"/g, '""')}","${(r.subtitle || "").replace(/"/g, '""')}",${new Date(r.timestamp).toISOString()}\n`;
      });
    }
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `dashboard_export_${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Dashboard exported to CSV");
  };

  useEffect(() => {
    let cancelled = false;

    const fetchData = async (isAutoRefresh = false) => {
      if (!isAutoRefresh) {
        if (stats) setIsPeriodLoading(true);
        else setIsLoading(true);
      }
      try {
        const [res, products] = await Promise.all([
          getDashboardStatsAction(period),
          getProducts(),
        ]);
        if (cancelled) return;
        if (res.success) setStats(res.stats);
        setHasProducts(products.length > 0);
      } catch {
        if (!cancelled && !isAutoRefresh) toast.error("Failed to load dashboard data");
      } finally {
        if (!cancelled) {
          setIsLoading(false);
          setIsPeriodLoading(false);
        }
      }
    };

    fetchData();
    const interval = setInterval(() => fetchData(true), 30000);
    return () => { cancelled = true; clearInterval(interval); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [period]);

  const handlePeriodChange = (newPeriod: DashboardPeriod) => {
    if (newPeriod === period) return;
    setPeriod(newPeriod);
  };

  const handleSeed = async () => {
    setIsInitializing(true);
    try {
      await seedDatabase();
      toast.success("Database Seeded Successfully");
      setHasProducts(true);
      window.location.reload();
    } catch {
      toast.error("Failed to seed database");
    } finally {
      setIsInitializing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-40 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-gold mx-auto" />
        <p className="mt-4 text-zinc-400 font-bold uppercase tracking-widest text-[10px]">Syncing live analytics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-5 md:space-y-8 animate-in fade-in duration-700 pb-20">

      {/* ── Header ── */}
      <div className="flex flex-col gap-3 md:flex-row md:justify-between md:items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-heading font-normal">Console Overview</h1>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <p className="text-zinc-500 text-xs md:text-sm">Real-time performance metrics.</p>
            {stats?.lastUpdated && (
              <span className="text-[10px] text-zinc-300 font-bold uppercase tracking-widest flex items-center gap-1">
                <RefreshCw className="w-2 h-2 animate-spin-slow" />
                {new Date(stats.lastUpdated).toLocaleTimeString()}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {!hasProducts && (
            <Button onClick={handleSeed} disabled={isInitializing} variant="outline"
              className="border-emerald-600 text-emerald-600 hover:bg-emerald-50 rounded-full text-[10px] font-bold tracking-widest uppercase h-8 px-3">
              {isInitializing ? "Seeding..." : "Bootstrap"}
            </Button>
          )}
          {/* Export — icon only on mobile, text on desktop */}
          <Button onClick={handleExportCSV} variant="outline" size="sm"
            className="rounded-full text-[10px] font-bold tracking-widest uppercase h-8 px-3 gap-1.5">
            <Download className="w-3 h-3" />
            <span className="hidden sm:inline">Export CSV</span>
          </Button>
          <Link href="/admin/orders">
            <Button size="sm"
              className="bg-zinc-900 hover:bg-black text-white rounded-full text-[10px] font-bold tracking-widest uppercase h-8 px-4 gap-1.5">
              <Eye className="w-3 h-3" />
              <span className="hidden sm:inline">Live View</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* ── Period Filter Pills ── horizontal scroll on mobile */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 shrink-0">Period:</span>
          {PERIOD_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => handlePeriodChange(opt.value)}
              disabled={isPeriodLoading}
              className={`shrink-0 px-3 md:px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-300 border ${period === opt.value
                ? "bg-zinc-900 text-white border-zinc-900 shadow-sm"
                : "bg-white text-zinc-500 border-zinc-200 hover:border-zinc-400 hover:text-zinc-800"
                } ${isPeriodLoading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {isPeriodLoading && period === opt.value ? (
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full border border-white border-t-transparent animate-spin inline-block" />
                  <span className="hidden sm:inline">{opt.label}</span>
                  <span className="sm:hidden">{opt.short}</span>
                </span>
              ) : (
                <>
                  <span className="hidden sm:inline">{opt.label}</span>
                  <span className="sm:hidden">{opt.short}</span>
                </>
              )}
            </button>
          ))}
        </div>
        {stats?.dateRangeLabel && (
          <p className="text-[10px] font-bold text-zinc-400 tracking-wide">
            📅 <span className="text-zinc-700">{stats.dateRangeLabel}</span>
            <span className="text-zinc-400"> · {stats.totalOrders} orders · ₹{stats.totalRevenue?.toLocaleString()}</span>
          </p>
        )}
      </div>

      {/* ── KPI Cards — 2 cols on mobile, 4 on desktop ── */}
      <div className={`relative transition-opacity duration-300 ${isPeriodLoading ? "opacity-50 pointer-events-none" : "opacity-100"}`}>
        {isPeriodLoading && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="flex items-center gap-2 bg-white/90 px-4 py-2 rounded-full shadow-md border border-zinc-100">
              <div className="w-3 h-3 rounded-full border-2 border-zinc-900 border-t-transparent animate-spin" />
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Updating...</span>
            </div>
          </div>
        )}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
          <KPICard title="Revenue" value={stats ? `₹${stats.totalRevenue.toLocaleString()}` : "₹0"}
            trend={stats?.revenueTrend || "0%"} trendUp={stats?.revenueTrendUp}
            icon={<DollarSign className="w-4 h-4" />} description={stats?.trendLabel || "vs last period"} />
          <KPICard title="Orders" value={stats ? stats.totalOrders : "0"}
            trend={stats?.ordersTrend || "0%"} trendUp={stats?.ordersTrendUp}
            icon={<ShoppingCart className="w-4 h-4" />} description={stats?.trendLabel || "vs last period"} />
          <KPICard title="Active Users" value={stats ? stats.activeUsers : "0"}
            trend={stats?.activeUsersTrend || "0%"} trendUp={stats?.activeUsersTrendUp}
            icon={<Users className="w-4 h-4" />} description="Unique customers" />
          <KPICard title="New Users" value={stats ? stats.totalUsers : "0"}
            trend={stats?.usersTrend || "0%"} trendUp={stats?.usersTrendUp}
            icon={<TrendingUp className="w-4 h-4" />} description={stats?.trendLabel || "vs last period"} />
        </div>
      </div>

      {/* ── Main Performance Chart: Full Width ── */}
      <div className="mt-6">
        <Card className="border-zinc-200 shadow-sm rounded-2xl md:rounded-[2.5rem] overflow-hidden bg-white">
          <CardHeader className="p-4 md:p-6 pb-2">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-[10px] md:text-sm font-bold uppercase tracking-widest text-zinc-800">
                  Revenue Growth
                </CardTitle>
                <CardDescription className="text-[10px] uppercase tracking-widest font-bold text-zinc-400 mt-1">
                  {PERIOD_OPTIONS.find(o => o.value === period)?.label} Analytics
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4 md:p-6 pt-0">
            <div className="h-[160px] md:h-[200px] w-full mt-2 md:mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats?.salesData || []}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FF4D8D" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#FF4D8D" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f5" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false}
                    tick={{ fontSize: 8, fill: "#999", fontWeight: 600 }} dy={10} interval="preserveStartEnd" />
                  <YAxis axisLine={false} tickLine={false}
                    tick={{ fontSize: 8, fill: "#999", fontWeight: 600 }}
                    tickFormatter={(v) => `₹${v}`} width={45} />
                  <Tooltip
                    contentStyle={{ borderRadius: "16px", border: "none", boxShadow: "0 10px 30px rgba(0,0,0,0.1)", padding: "10px 14px" }}
                    itemStyle={{ fontSize: "10px", fontWeight: "bold", textTransform: "uppercase", color: "#FF4D8D" }}
                    labelStyle={{ fontSize: "10px", fontWeight: "bold", marginBottom: "4px", color: "#333" }}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#FF4D8D" strokeWidth={2}
                    fillOpacity={1} fill="url(#colorRev)" animationDuration={1500} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Secondary Panels Grid: Full Width ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        
        {/* Low Stock Alerts: Now Horizontal-Ready */}
        <Card className="border-red-50 bg-red-50/10 rounded-2xl md:rounded-[2.5rem] overflow-hidden flex flex-col">
          <CardHeader className="p-6 md:p-8 pb-3 md:pb-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-red-600">
                Critical Stock Alerts
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6 md:p-8 pt-0 space-y-3 flex-1">
            {paginatedStockAlerts.length > 0 ? paginatedStockAlerts.map((item: any) => (
              <div key={item.sku} className="flex items-center justify-between p-4 bg-white border border-red-50 rounded-2xl shadow-sm transition-all hover:border-red-200">
                <div className="space-y-0.5 min-w-0 flex-1 mr-4">
                  <p className="text-sm font-bold text-zinc-900 truncate">{item.name}</p>
                  <p className="text-[10px] text-zinc-400 font-mono uppercase tracking-widest truncate">{item.sku}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-black text-red-600 uppercase">{item.stock} LEFT</p>
                  <Link href="/admin/products" className="text-[10px] font-bold text-zinc-400 hover:text-brand-gold underline underline-offset-4 tracking-widest uppercase">
                    Manage Stock
                  </Link>
                </div>
              </div>
            )) : (
              <div className="py-12 text-center bg-white border border-dashed border-zinc-200 rounded-2xl flex flex-col items-center justify-center space-y-2">
                <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
                  <Eye className="w-5 h-5 text-green-400" />
                </div>
                <p className="text-[11px] font-bold text-zinc-300 uppercase tracking-widest">Inventory Healthy</p>
              </div>
            )}
            {totalStockAlertPages > 1 && (
              <div className="flex items-center justify-between pt-4 border-t border-red-50/50">
                <Button variant="ghost" size="sm" onClick={() => setStockAlertPage(p => Math.max(1, p - 1))}
                  disabled={stockAlertPage === 1} className="h-8 px-3 text-[10px] font-bold tracking-widest uppercase hover:bg-white">
                  <ChevronLeft className="w-3.5 h-3.5 mr-1" /> Prev
                </Button>
                <span className="text-[10px] text-zinc-400 font-bold tracking-widest">{stockAlertPage} OF {totalStockAlertPages}</span>
                <Button variant="ghost" size="sm" onClick={() => setStockAlertPage(p => Math.min(totalStockAlertPages, p + 1))}
                  disabled={stockAlertPage === totalStockAlertPages} className="h-8 px-3 text-[10px] font-bold tracking-widest uppercase hover:bg-white">
                  Next <ChevronRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity: Expanded View */}
        <Card className="rounded-2xl md:rounded-[2.5rem] border-zinc-100 shadow-sm overflow-hidden bg-white flex flex-col">
          <CardHeader className="p-6 md:p-8 pb-3 md:pb-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-brand-gold" />
              <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-zinc-800">Operational Pulse</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6 md:p-8 pt-0 space-y-3 flex-1">
            {paginatedRecentActivity.length > 0 ? paginatedRecentActivity.map((activity: any) => (
              <div key={`${activity.type}-${activity.id}`}
                className="flex items-center justify-between p-4 bg-zinc-50 rounded-2xl border border-zinc-100 hover:border-brand-gold/30 hover:bg-brand-cream/10 transition-all cursor-pointer gap-4">
                <div className="flex items-center gap-4 min-w-0 flex-1">
                  <div className={`w-10 h-10 md:w-12 md:h-12 shrink-0 rounded-full bg-white shadow-sm flex items-center justify-center text-xs font-black border border-zinc-100 uppercase ${activity.type === "order" ? "text-zinc-400" : "text-brand-gold"}`}>
                    {activity.initials}
                  </div>
                  <div className="space-y-1 min-w-0">
                    <p className="text-sm font-bold text-zinc-900 truncate">{activity.title}</p>
                    <div className="flex items-center gap-2 text-[10px] text-zinc-400 font-medium tracking-wide">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · {new Date(activity.timestamp).toLocaleDateString([], { month: "short", day: "numeric" })}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right shrink-0 flex flex-col items-end gap-1">
                  <p className="text-sm font-black text-zinc-900">{activity.subtitle.split(" - ")[0]}</p>
                  <div className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest ${activity.type === "order" ? "bg-pink-50 text-[#FF4D8D]" : "bg-emerald-50 text-emerald-600"}`}>
                    {activity.type === "order" ? activity.subtitle.split(" - ")[1] : "NEW USER"}
                  </div>
                </div>
              </div>
            )) : (
              <div className="py-12 text-center text-[11px] font-bold text-zinc-300 uppercase tracking-widest flex flex-col items-center justify-center">
                <RefreshCw className="w-6 h-6 mb-2 animate-spin-slow text-zinc-200" />
                Awaiting Activity...
              </div>
            )}
            {totalRecentActivityPages > 1 && (
              <div className="flex items-center justify-between pt-4 border-t border-zinc-50">
                <Button variant="ghost" size="sm" onClick={() => setRecentActivityPage(p => Math.max(1, p - 1))}
                  disabled={recentActivityPage === 1} className="h-8 px-3 text-[10px] font-bold tracking-widest uppercase">
                  <ChevronLeft className="w-3.5 h-3.5 mr-1" /> Prev
                </Button>
                <span className="text-[10px] text-zinc-400 font-bold tracking-widest">{recentActivityPage} OF {totalRecentActivityPages}</span>
                <Button variant="ghost" size="sm" onClick={() => setRecentActivityPage(p => Math.min(totalRecentActivityPages, p + 1))}
                  disabled={recentActivityPage === totalRecentActivityPages} className="h-7 px-2 text-[10px] font-bold tracking-widest uppercase">
                  Next <ChevronRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </div>
            )}
            <Link href="/admin/orders" className="flex items-center justify-center gap-2 text-[10px] font-black text-brand-gold hover:opacity-70 transition-all pt-4 uppercase tracking-[0.2em] border-t border-zinc-50 mt-1">
              Analyze Full Stream <ExternalLink className="w-3 h-3" />
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function KPICard({ title, value, trend, trendUp, icon, description }: any) {
  return (
    <Card className="border-none shadow-sm rounded-2xl md:rounded-[2rem] bg-zinc-50/50 hover:bg-zinc-50 transition-colors">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 md:p-6 pb-1 md:pb-2">
        <CardTitle className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-zinc-400 leading-tight">
          {title}
        </CardTitle>
        <div className="w-7 h-7 md:w-8 md:h-8 shrink-0 rounded-full bg-white flex items-center justify-center border border-zinc-100 shadow-sm text-brand-gold">
          {icon}
        </div>
      </CardHeader>
      <CardContent className="p-3 md:p-6 pt-1 md:pt-2">
        <div className="text-xl md:text-3xl font-black tracking-tight text-zinc-900">{value}</div>
        <div className="flex items-center gap-1.5 mt-1">
          <div className={`flex items-center text-[10px] font-black ${trendUp ? "text-green-500" : "text-red-500"}`}>
            {trendUp ? <ArrowUpRight className="w-3 h-3 mr-0.5" /> : <ArrowDownRight className="w-3 h-3 mr-0.5" />}
            {trend}
          </div>
          <span className="text-[9px] md:text-[10px] text-zinc-400 font-medium truncate">{description}</span>
        </div>
      </CardContent>
    </Card>
  );
}
