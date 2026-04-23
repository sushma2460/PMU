"use client";

import { useState, useEffect } from "react";
import { getShopAllSettings, updateShopAllSettings, DEFAULT_SHOP_ALL_SETTINGS } from "@/lib/services/admin";
import { ShopAllSettings } from "@/lib/types";
import { toast } from "sonner";
import { 
  Grid3X3, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  Layout, 
  Image as ImageIcon,
  Type,
  Save,
  RotateCcw,
  Smartphone,
  Monitor
} from "lucide-react";

export default function AdminDesignPage() {
  const [settings, setSettings] = useState<ShopAllSettings | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await getShopAllSettings();
        setSettings(data);
      } catch (error) {
        toast.error("Failed to load settings");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    if (!settings) return;
    setIsSaving(true);
    try {
      await updateShopAllSettings(settings);
      toast.success("Design settings updated successfully");
    } catch (error) {
      toast.error("Failed to save settings");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    if (confirm("Are you sure you want to reset to default settings?")) {
      setSettings(DEFAULT_SHOP_ALL_SETTINGS);
    }
  };

  if (isLoading || !settings) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-gold"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      <div className="flex justify-between items-center bg-white p-6 rounded-xl border border-zinc-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 italic">Shop All Interface</h1>
          <p className="text-zinc-500 text-sm">Customize how your products are displayed to customers.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors"
          >
            <RotateCcw size={16} />
            Reset Defaults
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 bg-zinc-900 text-brand-gold px-6 py-2 rounded-lg font-bold text-sm hover:bg-zinc-800 transition-all shadow-lg active:scale-95 disabled:opacity-50"
          >
            {isSaving ? "Saving..." : <><Save size={16} /> Save Changes</>}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Grid Settings */}
        <section className="bg-white p-8 rounded-2xl border border-zinc-200 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-zinc-100 pb-4">
            <div className="p-2 bg-brand-cream rounded-lg text-brand-gold">
              <Grid3X3 size={20} />
            </div>
            <h2 className="font-bold text-lg uppercase tracking-tight">Grid Layout</h2>
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-xs font-bold text-zinc-400 uppercase tracking-widest">
                <Monitor size={14} /> Desktop Columns
              </label>
              <div className="flex gap-2">
                {[2, 3, 4, 5, 6].map((num) => (
                  <button
                    key={num}
                    onClick={() => setSettings({ ...settings, grid: { ...settings.grid, desktop: num } })}
                    className={`flex-1 py-3 text-sm font-bold rounded-xl border transition-all ${
                      settings.grid.desktop === num 
                        ? "bg-zinc-900 text-brand-gold border-zinc-900 shadow-md" 
                        : "bg-white text-zinc-400 border-zinc-200 hover:border-brand-gold hover:text-brand-gold"
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="flex items-center gap-2 text-xs font-bold text-zinc-400 uppercase tracking-widest">
                <Smartphone size={14} /> Mobile Columns
              </label>
              <div className="flex gap-2">
                {[1, 2].map((num) => (
                  <button
                    key={num}
                    onClick={() => setSettings({ ...settings, grid: { ...settings.grid, mobile: num } })}
                    className={`flex-1 py-3 text-sm font-bold rounded-xl border transition-all ${
                      settings.grid.mobile === num 
                        ? "bg-zinc-900 text-brand-gold border-zinc-900 shadow-md" 
                        : "bg-white text-zinc-400 border-zinc-200 hover:border-brand-gold hover:text-brand-gold"
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex justify-between items-center">
                 <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Item Spacing (px)</label>
                 <span className="text-xs font-bold text-brand-gold bg-brand-cream px-2 py-1 rounded">{settings.grid.gap}px</span>
              </div>
              <input 
                type="range" min="0" max="60" step="4"
                value={settings.grid.gap}
                onChange={(e) => setSettings({ ...settings, grid: { ...settings.grid, gap: parseInt(e.target.value) } })}
                className="w-full accent-brand-gold h-1.5 bg-zinc-100 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
        </section>

        {/* Product Card Styling */}
        <section className="bg-white p-8 rounded-2xl border border-zinc-200 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-zinc-100 pb-4">
            <div className="p-2 bg-brand-cream rounded-lg text-brand-gold">
              <Layout size={20} />
            </div>
            <h2 className="font-bold text-lg uppercase tracking-tight">Product Card</h2>
          </div>

          <div className="grid grid-cols-2 gap-6">
             <div className="space-y-3">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Text Alignment</label>
                <div className="flex p-1 bg-zinc-100 rounded-xl">
                  <button 
                    onClick={() => setSettings({...settings, card: {...settings.card, textAlignment: 'left'}})}
                    className={`flex-1 py-2 flex justify-center rounded-lg transition-all ${settings.card.textAlignment === 'left' ? "bg-white text-brand-gold shadow-sm" : "text-zinc-400"}`}
                  >
                    <AlignLeft size={18} />
                  </button>
                  <button 
                    onClick={() => setSettings({...settings, card: {...settings.card, textAlignment: 'center'}})}
                    className={`flex-1 py-2 flex justify-center rounded-lg transition-all ${settings.card.textAlignment === 'center' ? "bg-white text-brand-gold shadow-sm" : "text-zinc-400"}`}
                  >
                    <AlignCenter size={18} />
                  </button>
                  <button 
                    onClick={() => setSettings({...settings, card: {...settings.card, textAlignment: 'right'}})}
                    className={`flex-1 py-2 flex justify-center rounded-lg transition-all ${settings.card.textAlignment === 'right' ? "bg-white text-brand-gold shadow-sm" : "text-zinc-400"}`}
                  >
                    <AlignRight size={18} />
                  </button>
                </div>
             </div>

             <div className="space-y-3">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Image Aspect Ratio</label>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setSettings({...settings, card: {...settings.card, aspectRatio: 'square'}})}
                    className={`flex-1 py-2 text-[10px] font-bold rounded-lg border uppercase tracking-widest transition-all ${settings.card.aspectRatio === 'square' ? "bg-zinc-900 text-white border-zinc-900" : "bg-white text-zinc-400 border-zinc-200"}`}
                  >
                    1:1
                  </button>
                  <button 
                    onClick={() => setSettings({...settings, card: {...settings.card, aspectRatio: 'portrait'}})}
                    className={`flex-1 py-2 text-[10px] font-bold rounded-lg border uppercase tracking-widest transition-all ${settings.card.aspectRatio === 'portrait' ? "bg-zinc-900 text-white border-zinc-900" : "bg-white text-zinc-400 border-zinc-200"}`}
                  >
                    4:5
                  </button>
                </div>
             </div>
          </div>

          <div className="grid grid-cols-2 gap-6 pt-2">
             <div className="space-y-3">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Image Fit</label>
                <div className="flex p-1 bg-zinc-100 rounded-xl">
                  <button 
                    onClick={() => setSettings({...settings, card: {...settings.card, imageFit: 'contain'}})}
                    className={`flex-1 py-2 text-[10px] font-bold rounded-lg transition-all ${settings.card.imageFit === 'contain' ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-400 uppercase"}`}
                  >
                    Contain
                  </button>
                  <button 
                    onClick={() => setSettings({...settings, card: {...settings.card, imageFit: 'cover'}})}
                    className={`flex-1 py-2 text-[10px] font-bold rounded-lg transition-all ${settings.card.imageFit === 'cover' ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-400 uppercase"}`}
                  >
                    Cover
                  </button>
                </div>
             </div>

             <div className="space-y-3 flex flex-col justify-between">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Brand Badge</label>
                <button 
                  onClick={() => setSettings({...settings, card: {...settings.card, showBadge: !settings.card.showBadge}})}
                  className={`w-full py-2 flex items-center justify-center gap-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all border ${settings.card.showBadge ? "bg-green-50 text-green-700 border-green-200" : "bg-zinc-50 text-zinc-400 border-zinc-200"}`}
                >
                  {settings.card.showBadge ? "Visible" : "Hidden"}
                </button>
             </div>
          </div>

          <div className="space-y-5 pt-4">
             <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Card Padding</label>
                  <span className="text-xs font-bold text-zinc-900">{settings.card.padding}px</span>
                </div>
                <input 
                  type="range" min="0" max="40" step="4"
                  value={settings.card.padding}
                  onChange={(e) => setSettings({ ...settings, card: { ...settings.card, padding: parseInt(e.target.value) } })}
                  className="w-full accent-zinc-900 h-1 bg-zinc-100 rounded-lg appearance-none cursor-pointer"
                />
             </div>

             <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Border Radius</label>
                  <span className="text-xs font-bold text-zinc-900">{settings.card.borderRadius}px</span>
                </div>
                <input 
                  type="range" min="0" max="32" step="4"
                  value={settings.card.borderRadius}
                  onChange={(e) => setSettings({ ...settings, card: { ...settings.card, borderRadius: parseInt(e.target.value) } })}
                  className="w-full accent-zinc-900 h-1 bg-zinc-100 rounded-lg appearance-none cursor-pointer"
                />
             </div>
          </div>
        </section>

        {/* Text Scaling */}
        <section className="bg-white p-8 rounded-2xl border border-zinc-200 shadow-sm space-y-6 lg:col-span-2">
          <div className="flex items-center gap-3 border-b border-zinc-100 pb-4">
            <div className="p-2 bg-brand-cream rounded-lg text-brand-gold">
              <Type size={20} />
            </div>
            <h2 className="font-bold text-lg uppercase tracking-tight">Typography Scaling</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
             <div className="space-y-4">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Title Size</label>
                <div className="flex gap-4 items-end">
                   {['xs', 'sm', 'base'].map((size) => (
                     <button 
                       key={size}
                       onClick={() => setSettings({...settings, card: {...settings.card, titleSize: size as any}})}
                       className={`flex-1 pb-2 border-b-2 transition-all ${settings.card.titleSize === size ? "border-brand-gold text-zinc-900" : "border-zinc-100 text-zinc-300"}`}
                     >
                       <span style={{ fontSize: size === 'xs' ? '12px' : size === 'sm' ? '14px' : '16px' }} className="font-bold uppercase tracking-tight">
                         Abc
                       </span>
                       <div className="text-[10px] mt-1 font-bold">{size.toUpperCase()}</div>
                     </button>
                   ))}
                </div>
             </div>

             <div className="space-y-4">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Price Size</label>
                <div className="flex gap-4 items-end">
                   {['xs', 'sm', 'base'].map((size) => (
                     <button 
                       key={size}
                       onClick={() => setSettings({...settings, card: {...settings.card, priceSize: size as any}})}
                       className={`flex-1 pb-2 border-b-2 transition-all ${settings.card.priceSize === size ? "border-brand-gold text-zinc-900" : "border-zinc-100 text-zinc-300"}`}
                     >
                       <span style={{ fontSize: size === 'xs' ? '12px' : size === 'sm' ? '14px' : '16px' }} className="font-bold">
                         ₹99
                       </span>
                       <div className="text-[10px] mt-1 font-bold">{size.toUpperCase()}</div>
                     </button>
                   ))}
                </div>
             </div>
          </div>
        </section>
      </div>

      {/* Live Preview Sticker */}
      <div className="fixed bottom-6 right-6 bg-white border border-zinc-200 p-4 rounded-2xl shadow-2xl w-72 h-auto space-y-4 hidden xl:block">
         <div className="flex justify-between items-center border-b pb-2">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Desktop Preview</span>
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
         </div>
          <div className="flex flex-col gap-3 group">
            <div 
              style={{ 
                aspectRatio: settings.card.aspectRatio === 'square' ? '1/1' : '4/5',
                borderRadius: `${settings.card.borderRadius}px`,
                backgroundColor: '#ffffff'
              }}
              className="border border-zinc-100 relative overflow-hidden flex items-center justify-center p-0"
            >
               <img 
                 src="https://images.unsplash.com/photo-1556228578-8d91b1a4d530?auto=format&fit=crop&q=80"
                 className="w-full h-full"
                 style={{ 
                   objectFit: settings.card.imageFit as any,
                   padding: `${settings.card.padding}px`
                 }}
               />
               {settings.card.showBadge && (
                 <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-white border border-brand-gold text-[8px] font-bold text-brand-gold z-10">PMU SUPPLY</div>
               )}
            </div>
            <div 
              style={{ textAlign: settings.card.textAlignment as any }}
              className="space-y-1"
            >
               <div style={{ fontSize: settings.card.titleSize === 'xs' ? '11px' : settings.card.titleSize === 'sm' ? '12px' : '14px' }} className="font-normal leading-tight">
                 *Product Title Example
               </div>
               <div style={{ fontSize: settings.card.priceSize === 'xs' ? '11px' : settings.card.priceSize === 'sm' ? '13px' : '15px' }} className="font-bold text-zinc-900">₹19.00</div>
            </div>
          </div>
      </div>
    </div>
  );
}
