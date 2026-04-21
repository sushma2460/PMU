"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShieldAlert, ShieldCheck, Lock } from "lucide-react";
import Link from "next/link";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

const BOOTSTRAP_ADMIN_UID = "JFfgcLKDtTPDsHUxrmi5L7sLIom2";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { user: loggedInUser } = await signInWithEmailAndPassword(auth, email, password);

      // Bootstrap bypass for owner
      if (loggedInUser.uid === BOOTSTRAP_ADMIN_UID) {
        toast.success("Root Admin Access Granted.");
        router.push("/admin/dashboard");
        return;
      }

      // For all others, verify admin role in Firestore
      try {
        const { doc, getDoc } = await import("firebase/firestore");
        const { db } = await import("@/lib/firebase");
        const userSnap = await getDoc(doc(db, "users", loggedInUser.uid));
        const role = userSnap.data()?.role;

        if (role !== "admin") {
          toast.error("Unauthorized: Administrators only.");
          await auth.signOut();
          return;
        }
        toast.success("Identity Verified. Accessing Console...");
        router.push("/admin/dashboard");
      } catch {
        // If Firestore fails (locked rules), block access to be safe
        toast.error("Cannot verify admin role. Please update Firestore Security Rules first.");
        await auth.signOut();
      }
    } catch (error: any) {
      toast.error(error.message || "Invalid credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Abstract Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-amber-500/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-zinc-500/20 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-md z-10">
        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-2xl mb-4 group transition-all duration-500 hover:border-amber-500/50">
            <ShieldCheck className="w-8 h-8 text-amber-500 group-hover:scale-110 transition-transform" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center justify-center gap-3">
             PMU <span className="text-zinc-500 font-light">SYSTEM ACCESS</span>
          </h1>
          <p className="text-zinc-500 text-xs tracking-[0.2em] uppercase font-medium">Secured Administrative Gateway</p>
        </div>

        <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 p-8 rounded-[2rem] shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase ml-1">Admin Identifier</label>
              <div className="relative">
                <Input
                  type="email"
                  placeholder="admin@pmusupply.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-black/50 border-zinc-800 text-zinc-100 h-12 rounded-xl focus:ring-amber-500/20 focus:border-amber-500 transition-all pl-10"
                />
                <ShieldAlert className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase ml-1">Security Keyphrase</label>
              <div className="relative">
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-black/50 border-zinc-800 text-zinc-100 h-12 rounded-xl focus:ring-amber-500/20 focus:border-amber-500 transition-all pl-10"
                />
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-amber-500 hover:bg-amber-600 text-black font-bold h-12 rounded-xl tracking-widest uppercase text-xs transition-all duration-300 shadow-lg shadow-amber-500/10"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                   <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                   AUTHENTICATING...
                </div>
              ) : (
                "INITIALIZE ACCESS"
              )}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-zinc-800 flex justify-between items-center">
            <Link href="/" className="text-[9px] font-bold text-zinc-600 hover:text-zinc-400 tracking-widest uppercase transition-colors">
               Return to Terminal
            </Link>
            <span className="text-[9px] font-mono text-zinc-700">v2.4.0_SECURE</span>
          </div>
        </div>

        <p className="mt-8 text-center text-zinc-600 text-[10px] tracking-wide font-light">
          Unauthorized access attempts are logged and reported. <br/>
          By accessing this system, you agree to the administrative security protocols.
        </p>
      </div>
    </div>
  );
}
