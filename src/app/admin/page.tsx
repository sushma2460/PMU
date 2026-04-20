import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, ShoppingCart, Users, DollarSign } from "lucide-react";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-zinc-500 mt-2">Welcome to your MEKA PMU Supply admin panel.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard 
          title="Total Revenue" 
          value="$45,231.89" 
          icon={<DollarSign className="h-4 w-4 text-zinc-500" />} 
          description="+20.1% from last month"
        />
        <StatsCard 
          title="Orders" 
          value="+2350" 
          icon={<ShoppingCart className="h-4 w-4 text-zinc-500" />} 
          description="+180.1% from last month"
        />
        <StatsCard 
          title="Products" 
          value="124" 
          icon={<Package className="h-4 w-4 text-zinc-500" />} 
          description="+19 added this month"
        />
        <StatsCard 
          title="Active Users" 
          value="+573" 
          icon={<Users className="h-4 w-4 text-zinc-500" />} 
          description="+201 since last week"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Placeholder for Recent Orders Table */}
            <div className="text-sm text-zinc-500 py-8 text-center border border-dashed rounded-md">
              Order history will appear here once connected to Firestore.
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Top Selling Products</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Placeholder for Top Products List */}
            <div className="text-sm text-zinc-500 py-8 text-center border border-dashed rounded-md">
              Top products will appear here.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatsCard({ title, value, icon, description }: { title: string, value: string, icon: React.ReactNode, description: string }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-zinc-500 mt-1">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}
