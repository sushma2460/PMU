import Link from "next/link";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Tag, 
  Ticket, 
  Settings,
  LogOut
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-100 dark:bg-zinc-950">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-zinc-200 dark:border-zinc-800">
          <Link href="/admin" className="font-bold text-xl tracking-tight">
            MEKA
            <span className="text-zinc-500 font-normal"> ADMIN</span>
          </Link>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          <NavItem href="/admin" icon={<LayoutDashboard size={20} />} label="Dashboard" />
          <NavItem href="/admin/products" icon={<Package size={20} />} label="Products" />
          <NavItem href="/admin/categories" icon={<Tag size={20} />} label="Categories" />
          <NavItem href="/admin/orders" icon={<ShoppingCart size={20} />} label="Orders" />
          <NavItem href="/admin/users" icon={<Users size={20} />} label="Users" />
          <NavItem href="/admin/coupons" icon={<Ticket size={20} />} label="Coupons" />
        </nav>
        
        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
          <NavItem href="/admin/settings" icon={<Settings size={20} />} label="Settings" />
          <button className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-950/50 mt-1 transition-colors">
            <LogOut size={20} />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <header className="h-16 flex items-center justify-end px-6 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
           {/* Admin Topbar (User profile etc) */}
           <div className="flex items-center gap-4">
             <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-sm font-medium border border-zinc-300 dark:border-zinc-700">
               AD
             </div>
           </div>
        </header>
        <div className="p-6 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}

function NavItem({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link 
      href={href}
      className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-white transition-colors"
    >
      {icon}
      {label}
    </Link>
  );
}
