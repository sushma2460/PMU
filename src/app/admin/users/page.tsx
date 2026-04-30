"use client";

import { useState, useEffect } from "react";
import { 
  Search, 
  Filter, 
  Users as UsersIcon,
  ShieldCheck,
  Ban,
  MoreVertical,
  Mail,
  Award,
  History,
  ArrowUpRight,
  UserPlus,
  ShieldAlert,
  Download,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Layout
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
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { getAllUsersAction, setUserRoleAction, registerUserAction } from "./actions";
import { getAllAdminModulesAction, updateUserPermissionsAction } from "./rbac-actions";
import { UserProfile, UserPermissions, UserRole, ModulePermissions } from "@/lib/types";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "../../../components/ui/checkbox";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [regForm, setRegForm] = useState({ email: "", displayName: "", password: "", role: "customer" as UserRole });
  
  const [availableModules, setAvailableModules] = useState<string[]>([]);
  const [permissions, setPermissions] = useState<UserPermissions>({});
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [editRole, setEditRole] = useState<UserRole>('customer');
  
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await getAllUsersAction();
      if (res.success && res.users) {
        setUsers(res.users);
      } else {
        toast.error(res.error || "Failed to fetch users");
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    
    // Fetch dynamic modules
    const fetchModules = async () => {
      const res = await getAllAdminModulesAction();
      if (res.success && res.modules) {
        setAvailableModules(res.modules);
      }
    };
    fetchModules();
  }, []);

  const handleSavePermissions = async () => {
    if (!selectedUser) return;
    
    setIsSubmitting(true);
    try {
      const res = await updateUserPermissionsAction(
        selectedUser.uid, 
        editRole, 
        permissions, 
        isSuperAdmin
      );
      
      if (res.success) {
        toast.success("Permissions updated successfully.");
        await fetchUsers();
        setSelectedUser(null);
      } else {
        toast.error(res.error || "Failed to update permissions");
      }
    } catch (error) {
      toast.error("An error occurred while saving permissions");
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePermission = (module: string, action: keyof ModulePermissions) => {
    setPermissions(prev => {
      const current = prev[module] || { view: false, create: false, edit: false, delete: false };
      return {
        ...prev,
        [module]: {
          ...current,
          [action]: !current[action]
        }
      };
    });
  };

  const handleUserSelect = (user: UserProfile) => {
    setSelectedUser(user);
    setEditRole(user.role);
    setIsSuperAdmin(user.isSuperAdmin || false);
    setPermissions(user.permissions || {});
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await registerUserAction(regForm);
      if (res.success) {
        toast.success("User registered successfully.");
        setIsRegisterOpen(false);
        setRegForm({ email: "", displayName: "", password: "", role: "customer" as UserRole });
        await fetchUsers();
      } else {
        toast.error(res.error || "Registration failed.");
      }
    } catch (err: any) {
      toast.error(err.message || "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const exportToCSV = () => {
    const headers = ["Name", "Email", "Role", "Joined", "UID"];
    const rows = filteredUsers.map(user => [
      user.displayName || "N/A",
      user.email || "N/A",
      user.role || "customer",
      user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A",
      user.uid,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(r => r.map(cell => `"${cell}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `user_directory_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("User directory exported.");
  };

  const filteredUsers = users.filter(user => 
    user.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.uid?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const initials = (name: string) => name?.split(" ").map(n => n[0]).join("").toUpperCase() || "?";

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-heading font-normal">User Management</h1>
          <p className="text-zinc-500 text-sm mt-1">Manage global user network and account security.</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="rounded-none text-[10px] font-bold tracking-widest uppercase gap-2 px-6"
            onClick={exportToCSV}
            disabled={filteredUsers.length === 0}
          >
            <Download className="w-3 h-3" /> Export CSV
          </Button>
          
          <Dialog open={isRegisterOpen} onOpenChange={setIsRegisterOpen}>
            <DialogTrigger 
              render={
                <Button size="sm" className="bg-brand-gold hover:bg-brand-gold/90 text-white rounded-none text-[10px] font-bold tracking-widest uppercase px-8 flex gap-2">
                  <UserPlus className="w-3 h-3" /> Register User
                </Button>
              }
            />
            <DialogContent className="sm:max-w-[450px] rounded-none p-8 border-none shadow-2xl">
              <DialogHeader>
                <DialogTitle className="text-2xl font-heading">New User Account</DialogTitle>
                <DialogDescription className="text-xs font-bold tracking-widest uppercase text-zinc-400">Initialize a new user profile in the system.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleRegister} className="space-y-6 mt-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest ml-1 text-zinc-500">Professional Name</Label>
                  <Input 
                    required
                    className="h-12 rounded-none bg-zinc-50 border-zinc-100" 
                    placeholder="e.g. Jane Doe"
                    value={regForm.displayName}
                    onChange={(e) => setRegForm({...regForm, displayName: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest ml-1 text-zinc-500">Email Address</Label>
                  <Input 
                    required
                    type="email"
                    className="h-12 rounded-none bg-zinc-50 border-zinc-100" 
                    placeholder="user@example.com"
                    value={regForm.email}
                    onChange={(e) => setRegForm({...regForm, email: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest ml-1 text-zinc-500">Secure Password</Label>
                  <Input 
                    required
                    type="password"
                    className="h-12 rounded-none bg-zinc-50 border-zinc-100" 
                    placeholder="Min. 6 characters"
                    value={regForm.password}
                    onChange={(e) => setRegForm({...regForm, password: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest ml-1 text-zinc-500">Initial Designation</Label>
                  <select 
                    className="w-full h-12 rounded-none bg-zinc-50 border border-zinc-100 px-4 text-sm font-medium focus:ring-2 focus:ring-brand-gold outline-none"
                    value={regForm.role}
                    onChange={(e) => setRegForm({...regForm, role: e.target.value as UserRole})}
                  >
                    <option value="customer">User (Customer)</option>
                    <option value="staff">Staff (Granular Access)</option>
                    <option value="admin">Admin (Full Access)</option>
                  </select>
                </div>
                <Button type="submit" disabled={isSubmitting} className="w-full h-14 bg-brand-black hover:bg-brand-gold text-white rounded-none font-bold uppercase tracking-[0.2em] text-[10px] shadow-lg shadow-zinc-900/10">
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Finalize Registration"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard title="Total Users" value={isLoading ? "..." : users.length.toString()} icon={<UsersIcon className="w-4 h-4" />} />
        <MetricCard title="Customers" value={isLoading ? "..." : users.filter(u => u.role === "customer").length.toString()} icon={<ShieldCheck className="w-4 h-4 text-emerald-500" />} />
        <MetricCard title="Admin & Staff" value={isLoading ? "..." : users.filter(u => u.role === "admin" || u.role === "staff").length.toString()} icon={<ShieldAlert className="w-4 h-4 text-brand-gold" />} />
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <Input 
            placeholder="Search by name, email or UID..." 
            className="pl-10 h-11 border-zinc-100 rounded-none focus:ring-brand-gold/20 focus:border-brand-gold bg-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" className="h-11 rounded-none px-6 text-[10px] font-bold tracking-widest uppercase border-zinc-100 gap-3">
          <Filter className="w-3 h-3" /> Advanced Filter
        </Button>
      </div>

      <div className="bg-white border border-zinc-100 rounded-none shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-zinc-50/50">
            <TableRow>
              <TableHead className="px-8 text-[10px] font-bold uppercase tracking-widest">User Profile</TableHead>
               <TableHead className="text-[10px] font-bold uppercase tracking-widest">Role</TableHead>
              <TableHead className="text-[10px] font-bold uppercase tracking-widest">Joined</TableHead>
              <TableHead className="text-right px-8 text-[10px] font-bold uppercase tracking-widest">Management</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="py-24 text-center">
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-gold" />
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="py-24 text-center">
                    <p className="text-zinc-400 text-sm italic">
                      {users.length === 0 ? "No users registered yet." : "No matching users found."}
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedUsers.map((user) => (
                <TableRow key={user.uid} className="hover:bg-zinc-50/50 transition-colors group">
                  <TableCell className="px-8">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-none bg-zinc-50 flex items-center justify-center font-heading text-zinc-400 border border-zinc-100 group-hover:border-brand-gold group-hover:bg-brand-rose/10 group-hover:text-brand-black transition-all text-xs font-bold">
                        {initials(user.displayName || "Unknown")}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-zinc-900">{user.displayName || "No Name"}</span>
                        <span className="text-[10px] text-zinc-400 font-light italic truncate max-w-[150px]">{user.email}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={`rounded-none px-3 py-1 font-bold text-[8px] uppercase tracking-tighter border ${user.role === "admin" ? "bg-brand-rose/10 text-brand-gold border-brand-rose/30" : "bg-emerald-50 text-emerald-600 border-emerald-100"}`}>
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-zinc-500">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                  </TableCell>
                  <TableCell className="text-right px-8">
                    <Dialog onOpenChange={(open) => {
                      if(open) {
                        handleUserSelect(user);
                      }
                    }}>
                    <DialogTrigger 
                      render={
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-none hover:bg-zinc-100 text-zinc-400">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      }
                    />
                      {selectedUser?.uid === user.uid && (
                        <DialogContent className="sm:max-w-[700px] rounded-none p-10 border-none shadow-2xl">
                          <DialogHeader>
                            <div className="flex items-center gap-4 mb-4">
                              <div className="w-16 h-16 rounded-none bg-brand-rose/20 flex items-center justify-center text-xl font-heading text-brand-black border border-brand-rose/30">
                                {initials(selectedUser.displayName || "Unknown")}
                              </div>
                              <div className="text-left">
                                <DialogTitle className="text-2xl font-heading">{selectedUser.displayName}</DialogTitle>
                                <DialogDescription className="text-xs font-bold tracking-widest uppercase text-zinc-400">{selectedUser.email}</DialogDescription>
                              </div>
                            </div>
                          </DialogHeader>
                          
                          <div className="space-y-6 animate-in slide-in-from-left-2 duration-300">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="p-4 bg-zinc-50 rounded-none border border-zinc-100 text-left">
                                <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest mb-1 flex items-center gap-2"><ShieldCheck className="w-3 h-3" /> Account Designation</p>
                                <select 
                                  className="w-full bg-transparent text-sm font-bold text-zinc-900 outline-none"
                                  value={editRole}
                                  onChange={(e) => setEditRole(e.target.value as UserRole)}
                                >
                                  <option value="customer">Customer</option>
                                  <option value="staff">Staff</option>
                                  <option value="admin">Admin</option>
                                </select>
                              </div>
                              <div className="p-4 bg-zinc-50 rounded-none border border-zinc-100 text-left flex items-center justify-between">
                                <div>
                                  <p className="text-[10px] font-black uppercase text-zinc-400 tracking-widest mb-1 flex items-center gap-2"><ShieldAlert className="w-3 h-3 text-brand-gold" /> Super Admin</p>
                                  <p className="text-[10px] text-zinc-400 font-medium italic">Full System Bypass</p>
                                </div>
                                <Switch 
                                  checked={isSuperAdmin}
                                  onCheckedChange={setIsSuperAdmin}
                                />
                              </div>
                            </div>

                            {(editRole === 'staff' || editRole === 'admin') && !isSuperAdmin && (
                              <div className="space-y-4">
                                <div className="flex items-center justify-between ml-1">
                                  <Label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest flex items-center gap-2">
                                    <Layout className="w-3 h-3 text-brand-gold" /> Module Permissions
                                  </Label>
                                  <span className="text-[8px] font-bold text-zinc-300 uppercase tracking-tighter">Granular Access Matrix</span>
                                </div>
                                
                                <div className="max-h-[300px] overflow-y-auto rounded-none border border-zinc-100 bg-zinc-50/30">
                                  <Table>
                                    <TableHeader className="sticky top-0 bg-white z-10 shadow-sm">
                                      <TableRow className="hover:bg-transparent">
                                        <TableHead className="text-[9px] font-bold uppercase py-2">Module</TableHead>
                                        <TableHead className="text-[9px] font-bold uppercase py-2 text-center">View</TableHead>
                                        <TableHead className="text-[9px] font-bold uppercase py-2 text-center">Create</TableHead>
                                        <TableHead className="text-[9px] font-bold uppercase py-2 text-center">Edit</TableHead>
                                        <TableHead className="text-[9px] font-bold uppercase py-2 text-center">Del</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {availableModules.map((mod) => (
                                        <TableRow key={mod} className="hover:bg-white transition-colors">
                                          <TableCell className="py-3">
                                            <span className="text-[10px] font-bold uppercase tracking-tight text-zinc-600">{mod}</span>
                                          </TableCell>
                                          {['view', 'create', 'edit', 'delete'].map((action) => (
                                            <TableCell key={action} className="text-center py-3">
                                              <Checkbox 
                                                checked={permissions[mod]?.[action as keyof ModulePermissions] || false}
                                                onCheckedChange={() => togglePermission(mod, action as keyof ModulePermissions)}
                                                className="rounded-sm border-zinc-200 data-[state=checked]:bg-brand-gold data-[state=checked]:border-brand-gold"
                                              />
                                            </TableCell>
                                          ))}
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                                </div>
                              </div>
                            )}

                            <div className="pt-4 space-y-4">
                              <Button 
                                className="w-full h-14 bg-brand-black hover:bg-brand-gold text-white rounded-none font-bold uppercase tracking-[0.2em] text-[10px] shadow-lg shadow-zinc-900/10 transition-all active:scale-[0.98]"
                                onClick={handleSavePermissions}
                                disabled={isSubmitting}
                              >
                                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Synchronize Permissions"}
                              </Button>
                              <p className="text-[9px] text-center text-zinc-400 font-medium uppercase tracking-[0.2em]">
                                Changes apply immediately to the user's active session.
                              </p>
                            </div>
                          </div>
                        </DialogContent>
                      )}
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        
        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex flex-col md:flex-row items-center justify-between px-8 py-6 bg-zinc-50/30 border-t border-zinc-100 gap-4">
            <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
              Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredUsers.length)} of {filteredUsers.length} users
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="rounded-none h-10 px-4 text-[10px] font-bold uppercase tracking-widest gap-2 border-zinc-200"
              >
                <ChevronLeft className="w-3 h-3" /> Previous
              </Button>
              
              <div className="hidden sm:flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 rounded-none text-[10px] font-bold ${
                      currentPage === page 
                        ? 'bg-brand-gold text-white hover:bg-brand-gold/90 shadow-md shadow-brand-gold/20' 
                        : 'text-zinc-400 hover:text-zinc-900 hover:bg-white'
                    }`}
                  >
                    {page}
                  </Button>
                ))}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="rounded-none h-10 px-4 text-[10px] font-bold uppercase tracking-widest gap-2 border-zinc-200"
              >
                Next <ChevronRight className="w-3 h-3" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function MetricCard({ title, value, icon }: { title: string; value: string; icon: React.ReactNode }) {
  return (
    <Card className="rounded-none border-zinc-100 shadow-sm overflow-hidden bg-white hover:border-brand-gold transition-all duration-500 group cursor-default p-5">
      <div className="flex items-center gap-5">
        <div className="w-14 h-14 rounded-none bg-zinc-50 flex items-center justify-center text-zinc-400 group-hover:bg-brand-rose/20 group-hover:text-brand-black transition-all duration-500 shrink-0">
          {icon}
        </div>
        <div className="space-y-0.5">
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em]">{title}</p>
          <p className="text-2xl font-black text-zinc-900 group-hover:text-brand-gold transition-colors">{value}</p>
        </div>
      </div>
    </Card>
  );
}
