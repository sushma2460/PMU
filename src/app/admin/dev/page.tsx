"use client";

import { useState, useEffect } from "react";
import { Mail, Send, Zap, Tag, Loader2, CheckCircle2, Settings2, BellOff, BellRing } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { sendSaleCampaignAction, sendFlashSaleCampaignAction } from "../campaigns/actions";
import { getGlobalSettingsAction, updateNewArrivalsToggleAction } from "./actions";

export default function DevPage() {
  const [isSending, setIsSending] = useState(false);
  const [activeTab, setActiveTab] = useState<"sale" | "flash" | "settings">("settings");
  
  // Settings state
  const [newArrivalsEnabled, setNewArrivalsEnabled] = useState(true);
  const [isLoadingSettings, setIsLoadingSettings] = useState(true);

  // Sale form state
  const [saleName, setSaleName] = useState("");
  const [saleDiscount, setSaleDiscount] = useState("");
  const [saleCode, setSaleCode] = useState("");

  // Flash sale form state
  const [flashDuration, setFlashDuration] = useState("");
  const [flashDiscount, setFlashDiscount] = useState("");

  useEffect(() => {
    async function loadSettings() {
      const res = await getGlobalSettingsAction();
      if (res.success && res.settings) {
        setNewArrivalsEnabled(res.settings.newArrivalsEmailEnabled ?? true);
      }
      setIsLoadingSettings(false);
    }
    loadSettings();
  }, []);

  const handleToggleNewArrivals = async (checked: boolean) => {
    setNewArrivalsEnabled(checked);
    const res = await updateNewArrivalsToggleAction(checked);
    if (res.success) {
      toast.success(`New Arrival emails ${checked ? "enabled" : "disabled"}`);
    } else {
      setNewArrivalsEnabled(!checked);
      toast.error("Failed to update settings");
    }
  };

  const handleSendSale = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!saleName || !saleDiscount) return toast.error("Please fill required fields");

    setIsSending(true);
    try {
      const result = await sendSaleCampaignAction(saleName, saleDiscount, saleCode);
      if (result.success) {
        toast.success("Sale campaign sent successfully!");
        setSaleName("");
        setSaleDiscount("");
        setSaleCode("");
      } else {
        toast.error(result.error as string || "Failed to send campaign");
      }
    } catch (err) {
      toast.error("An error occurred");
    } finally {
      setIsSending(false);
    }
  };

  const handleSendFlash = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!flashDuration || !flashDiscount) return toast.error("Please fill required fields");

    setIsSending(true);
    try {
      const result = await sendFlashSaleCampaignAction(flashDuration, flashDiscount);
      if (result.success) {
        toast.success("Flash sale campaign sent successfully!");
        setFlashDuration("");
        setFlashDiscount("");
      } else {
        toast.error(result.error as string || "Failed to send campaign");
      }
    } catch (err) {
      toast.error("An error occurred");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-heading italic text-zinc-900">Dev Administration</h1>
        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.3em] mt-2">
          Advanced controls and marketing campaigns
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Sidebar / Selector */}
        <div className="space-y-4">
          <button
            onClick={() => setActiveTab("settings")}
            className={`w-full p-6 rounded-none border transition-all text-left flex items-center gap-4 ${
              activeTab === "settings" 
                ? "bg-zinc-900 border-zinc-900 text-white shadow-xl shadow-zinc-900/20 scale-[1.02]" 
                : "bg-white border-zinc-200 text-zinc-500 hover:border-zinc-300"
            }`}
          >
            <div className={`p-3 rounded-none ${activeTab === "settings" ? "bg-zinc-800 text-brand-gold" : "bg-zinc-100 text-zinc-900"}`}>
              <Settings2 size={20} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Global Config</p>
              <h3 className="text-sm font-bold">Automation Settings</h3>
            </div>
          </button>

          <button
            onClick={() => setActiveTab("sale")}
            className={`w-full p-6 rounded-none border transition-all text-left flex items-center gap-4 ${
              activeTab === "sale" 
                ? "bg-zinc-900 border-zinc-900 text-white shadow-xl shadow-zinc-900/20 scale-[1.02]" 
                : "bg-white border-zinc-200 text-zinc-500 hover:border-zinc-300"
            }`}
          >
            <div className={`p-3 rounded-none ${activeTab === "sale" ? "bg-zinc-800" : "bg-zinc-100 text-zinc-900"}`}>
              <Tag size={20} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Marketing</p>
              <h3 className="text-sm font-bold">Seasonal Sale</h3>
            </div>
          </button>

          <button
            onClick={() => setActiveTab("flash")}
            className={`w-full p-6 rounded-none border transition-all text-left flex items-center gap-4 ${
              activeTab === "flash" 
                ? "bg-[#FF4D6D] border-[#FF4D6D] text-white shadow-xl shadow-rose-500/20 scale-[1.02]" 
                : "bg-white border-zinc-200 text-zinc-500 hover:border-zinc-300"
            }`}
          >
            <div className={`p-3 rounded-none ${activeTab === "flash" ? "bg-rose-600" : "bg-zinc-100 text-zinc-900"}`}>
              <Zap size={20} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">High Urgency</p>
              <h3 className="text-sm font-bold">Flash Sale</h3>
            </div>
          </button>
        </div>

        {/* Form Area */}
        <div className="lg:col-span-2">
          {activeTab === "settings" && (
            <Card className="rounded-none border-zinc-200 overflow-hidden shadow-sm">
              <CardHeader className="bg-zinc-50 border-b border-zinc-100 p-8">
                <CardTitle className="text-xl">Automation Controls</CardTitle>
                <CardDescription>Manage automated email behaviors across the platform.</CardDescription>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                <div className="flex items-center justify-between p-6 rounded-none bg-zinc-50 border border-zinc-100 transition-all hover:shadow-md group">
                  <div className="flex gap-4 items-center">
                    <div className={`p-3 rounded-none transition-colors ${newArrivalsEnabled ? "bg-emerald-100 text-emerald-600" : "bg-red-100 text-red-600"}`}>
                      {newArrivalsEnabled ? <BellRing size={20} /> : <BellOff size={20} />}
                    </div>
                    <div>
                      <h4 className="font-bold text-zinc-900">New Arrival Emails</h4>
                      <p className="text-xs text-zinc-500">Blast automated emails to all users when a new product is created.</p>
                    </div>
                  </div>
                  <Switch 
                    checked={newArrivalsEnabled} 
                    onCheckedChange={handleToggleNewArrivals}
                    disabled={isLoadingSettings}
                  />
                </div>

                <div className="p-6 rounded-none border border-dashed border-zinc-200">
                  <p className="text-xs text-zinc-400 italic">
                    Note: Transactional emails (Invoices, Payment Confirmations, Order Status) are not affected by these toggles and will always be sent for security and compliance.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "sale" && (
            <Card className="rounded-none border-zinc-200 overflow-hidden shadow-sm">
              <CardHeader className="bg-zinc-50 border-b border-zinc-100 p-8">
                <CardTitle className="text-xl">Seasonal Sale Campaign</CardTitle>
                <CardDescription>Send a professional sale announcement with an optional coupon code.</CardDescription>
              </CardHeader>
              <form onSubmit={handleSendSale}>
                <CardContent className="p-8 space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Campaign Name</Label>
                      <Input 
                        placeholder="e.g. SUMMER ARTIST SERIES" 
                        value={saleName}
                        onChange={(e) => setSaleName(e.target.value)}
                        className="h-12 rounded-none border-zinc-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Discount Amount</Label>
                      <Input 
                        placeholder="e.g. 20% OFF" 
                        value={saleDiscount}
                        onChange={(e) => setSaleDiscount(e.target.value)}
                        className="h-12 rounded-none border-zinc-200"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Coupon Code (Optional)</Label>
                    <Input 
                      placeholder="e.g. ARTIST20" 
                      value={saleCode}
                      onChange={(e) => setSaleCode(e.target.value)}
                      className="h-12 rounded-none border-zinc-200 font-mono uppercase"
                    />
                  </div>
                </CardContent>
                <CardFooter className="p-8 bg-zinc-50 border-t border-zinc-100 flex justify-between items-center">
                  <p className="text-xs text-zinc-400 italic flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-emerald-500" /> Sent to all registered users.
                  </p>
                  <Button 
                    type="submit"
                    disabled={isSending}
                    className="h-12 px-8 bg-zinc-900 text-white rounded-none font-bold uppercase tracking-widest hover:bg-brand-rose transition-all shadow-lg shadow-zinc-900/10"
                  >
                    {isSending ? <Loader2 className="animate-spin" /> : <><Send size={18} className="mr-2" /> Blast Campaign</>}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          )}

          {activeTab === "flash" && (
            <Card className="rounded-none border-zinc-200 overflow-hidden shadow-sm">
              <CardHeader className="bg-rose-50 border-b border-rose-100 p-8">
                <CardTitle className="text-xl text-rose-900">Flash Sale Campaign</CardTitle>
                <CardDescription className="text-rose-600/70">High-urgency email for a short-term store-wide discount.</CardDescription>
              </CardHeader>
              <form onSubmit={handleSendFlash}>
                <CardContent className="p-8 space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Duration Text</Label>
                      <Input 
                        placeholder="e.g. 4 HOURS ONLY" 
                        value={flashDuration}
                        onChange={(e) => setFlashDuration(e.target.value)}
                        className="h-12 rounded-none border-zinc-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Discount Amount</Label>
                      <Input 
                        placeholder="e.g. 30% OFF EVERYTHING" 
                        value={flashDiscount}
                        onChange={(e) => setFlashDiscount(e.target.value)}
                        className="h-12 rounded-none border-zinc-200"
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="p-8 bg-rose-50 border-t border-rose-100 flex justify-between items-center">
                  <p className="text-xs text-rose-600/60 italic flex items-center gap-2">
                    <Zap size={14} className="text-rose-500 fill-rose-500" /> High-urgency template will be used.
                  </p>
                  <Button 
                    type="submit"
                    disabled={isSending}
                    className="h-12 px-8 bg-[#FF4D6D] text-white rounded-none font-bold uppercase tracking-widest hover:bg-rose-600 transition-all shadow-lg shadow-rose-500/20"
                  >
                    {isSending ? <Loader2 className="animate-spin" /> : <><Send size={18} className="mr-2" /> Launch Flash Sale</>}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
