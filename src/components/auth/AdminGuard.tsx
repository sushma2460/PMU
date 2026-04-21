"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, isAdmin, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        toast.error("Administrative access required");
        router.push("/admin/login");
      } else if (!isAdmin) {
        toast.error("Unauthorized: Admin access only");
        router.push("/");
      }
    }
  }, [user, isAdmin, loading, router]);

  if (loading || !user || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <p className="font-medium text-zinc-500 animate-pulse tracking-widest uppercase text-xs">Verifying Admin Access...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
