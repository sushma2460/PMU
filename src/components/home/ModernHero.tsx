"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Sparkles, ArrowRight, Play, Award, CheckCircle2, ShoppingBag, Layers } from "lucide-react";

export function ModernHero() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const mosaics = [
    { url: "/images/landing/aftercare.png", title: "Aftercare", href: "/products?category=aftercare" },
    { url: "/images/landing/master-studio.png", title: "Master Studio", href: "/products" },
    { url: "/images/landing/elite-pigments.png", title: "Elite Pigments", href: "/products?category=pigments" },
    { url: "/images/landing/precision-machine.png", title: "Precision Machines", href: "/products?category=machines-power-supplies" },
    { url: "/images/landing/artistry-tools.png", title: "Artistry Tools", href: "/products?category=shaping-tools" },
    { url: "/images/landing/pro-needles.png", title: "Pro Needles", href: "/products?category=needles" },
    { url: "/images/landing/luxury-lashes.png", title: "Luxury Lashes", href: "/products?category=lashes" },
    { url: "/images/landing/numbing.png", title: "Anesthetics", href: "/products?category=anesthetic-numbing" },
    { url: "/images/landing/practice-skins.png", title: "Practice Materials", href: "/products?category=practice-materials" },
  ];

  if (!mounted) return null;

  return (
    <section className="relative w-full min-h-screen flex items-center bg-brand-cream overflow-hidden">

      {/* Cinematic Background Layer */}
      <div className="absolute inset-0 z-0">
        {/* Full-bleed Background Image with Subtle Zoom */}
        <div 
          className="absolute inset-0 bg-cover bg-center animate-subtle-zoom"
          style={{ backgroundImage: `url("/images/landing/master-studio.png")` }}
        />
        
        {/* Video Overlay for Dynamic Texture */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-[0.15] mix-blend-screen contrast-125"
        >
          <source src="https://assets.mixkit.co/videos/preview/mixkit-glitter-particles-moving-in-a-black-background-4217-large.mp4" type="video/mp4" />
        </video>

        {/* Sophisticated Editorial Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-brand-cream via-brand-cream/80 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-cream/20 via-transparent to-transparent z-10" />
      </div>

      <div className="container mx-auto px-4 md:px-8 lg:px-12 relative z-20 pt-24 lg:pt-0 pb-12 lg:pb-0">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-center">

          {/* Left Column: Editorial Content */}
          <div className="lg:col-span-6 xl:col-span-6 space-y-10 order-1">
            <div className="space-y-4 animate-in fade-in slide-in-from-left-8 duration-1000">
              <div className="flex items-center gap-4">
                <span className="h-[1px] w-12 bg-brand-gold/30" />
                <span className="text-brand-gold text-[10px] font-black tracking-[0.8em] uppercase flex items-center gap-2">
                  <Layers className="h-3.5 w-3.5" /> THE COMPLETE CATALOG
                </span>
              </div>

              <div className="space-y-2">
                <h1 className="flex flex-col py-2">
                  <span className="text-4xl md:text-5xl xl:text-7xl font-sans font-black tracking-[0.3em] uppercase leading-[1.1] text-transparent bg-clip-text bg-gradient-to-r from-black to-zinc-400">
                    PRECISION
                  </span>
                  <span className="text-8xl md:text-9xl xl:text-[11rem] font-heading font-normal italic tracking-tighter text-brand-gold leading-[0.7] mt-[-0.05em]">
                    PMU
                  </span>
                </h1>
              </div>

              <div className="relative max-w-md">
                <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-brand-gold/20" />
                <p className="text-zinc-500 text-xs md:text-sm font-light italic tracking-wider leading-relaxed pl-8">
                  "Enter the vault of <span className="text-zinc-900 font-bold uppercase tracking-widest text-[10px]">unlimited possibilities.</span> From revolutionary <span className="text-brand-gold font-bold">E95 Machines</span> to our signature <span className="text-brand-gold font-bold">Organic Pigments</span>—we supply everything an elite PMU artist needs."
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-10 pt-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
              <Link href="/products" className="w-full sm:w-auto">
                <Button size="lg" className="w-full bg-brand-gold text-white hover:bg-brand-black px-12 h-14 rounded-none transition-all duration-500 tracking-[0.4em] text-[10px] font-bold shadow-xl">
                  VIEW ALL PRODUCTS
                </Button>
              </Link>

              <Link href="/products">
                <button className="group flex items-center gap-4 text-zinc-900 text-[10px] font-bold tracking-[0.4em] uppercase hover:text-brand-gold transition-all duration-500">
                  <div className="w-12 h-12 rounded-full border border-zinc-200 flex items-center justify-center group-hover:border-brand-gold transition-all duration-500">
                    <Play className="h-3 w-3 fill-zinc-900 group-hover:fill-brand-gold transition-colors ml-0.5" />
                  </div>
                  SHOWCASE ALL
                </button>
              </Link>
            </div>

            <div className="grid grid-cols-4 gap-6 pt-10 border-t border-zinc-100 animate-in fade-in duration-1000 delay-500">
              <StatItem label="300+" sub="SKUs" />
              <StatItem label="100%" sub="Vegan" />
              <StatItem label="PRO" sub="Level" />
              <StatItem label="INDIA" sub="Supply" />
            </div>
          </div>

          {/* Right Column: Refined Glassy Accents */}
          <div className="lg:col-span-6 xl:col-span-6 relative order-2 py-10 lg:py-0 flex justify-end items-center">
            
            {/* Elegant Floating Element */}
            <div className="relative w-full max-w-md aspect-[4/5] backdrop-blur-md bg-white/10 border border-white/20 shadow-2xl rounded-[4rem] overflow-hidden group animate-in zoom-in duration-1000 delay-500">
               <div className="absolute inset-0 bg-gradient-to-br from-brand-gold/10 via-transparent to-transparent" />
               
               <div className="absolute inset-0 p-10 flex flex-col justify-between">
                  <div className="space-y-6">
                    <div className="h-16 w-16 rounded-3xl bg-brand-gold/20 flex items-center justify-center border border-brand-gold/30">
                      <Award className="h-8 w-8 text-brand-gold" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-3xl font-heading italic text-brand-black">Elite Standards</h3>
                      <p className="text-zinc-500 text-[10px] tracking-[0.3em] leading-relaxed uppercase font-bold">The Choice of Champions</p>
                    </div>
                    <div className="h-[1px] w-20 bg-brand-gold/30" />
                  </div>

                  <div className="space-y-8">
                    <div className="flex items-center gap-4">
                      <div className="flex -space-x-3">
                         {[1,2,3,4].map(i => (
                           <div key={i} className="w-12 h-12 rounded-full border-4 border-brand-cream bg-zinc-200 overflow-hidden shadow-lg">
                              <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="Artist" className="w-full h-full object-cover" />
                           </div>
                         ))}
                         <div className="w-12 h-12 rounded-full border-4 border-brand-cream bg-brand-gold flex items-center justify-center text-[10px] text-white font-black shadow-lg">
                           +5K
                         </div>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[9px] font-black text-brand-black tracking-widest uppercase">Community</span>
                        <span className="text-[8px] text-zinc-500 italic">Global Artist Network</span>
                      </div>
                    </div>

                    <div className="backdrop-blur-2xl bg-black/60 p-6 rounded-[2rem] border border-white/20 shadow-2xl transform transition-transform group-hover:scale-105 duration-500">
                       <div className="flex justify-between items-start mb-4">
                         <span className="text-[8px] font-black text-brand-gold tracking-[0.4em] uppercase">Featured Certification</span>
                         <CheckCircle2 className="h-4 w-4 text-brand-gold" />
                       </div>
                       <span className="text-xl font-heading italic text-white tracking-wide block mb-1">Medical Grade Safety</span>
                       <p className="text-[9px] text-zinc-400 leading-relaxed font-light tracking-wider uppercase">All pigments are strictly tested and ISO certified for maximum safety and retention.</p>
                    </div>
                  </div>
               </div>

               {/* Inner Glossy Light Leaks */}
               <div className="absolute -top-20 -right-20 w-40 h-40 bg-brand-gold/20 blur-[100px] rounded-full" />
               <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-brand-rose/20 blur-[100px] rounded-full" />
            </div>

            {/* Decorative Floating Accents */}
            <div className="absolute top-0 right-0 w-24 h-24 border-t-2 border-r-2 border-brand-gold/10 rounded-tr-[4rem] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-24 h-24 border-b-2 border-l-2 border-brand-gold/10 rounded-bl-[4rem] pointer-events-none" />
          </div>

        </div>
      </div>

      {/* Decorative vertical bar */}
      <div className="absolute bottom-0 right-10 z-30 hidden lg:flex flex-col items-center">
        <div className="h-24 w-[1px] bg-brand-gold/20 mb-4" />
        <div className="vertical-text text-[8px] text-brand-gold font-bold tracking-[1em] uppercase pb-10 opacity-60">
          THE PMU ARCHIVE
        </div>
      </div>
    </section>
  );
}

function StatItem({ label, sub }: { label: string, sub: string }) {
  return (
    <div className="space-y-1">
      <div className="text-brand-gold text-[10px] font-black tracking-[0.3em] uppercase">{label}</div>
      <div className="text-zinc-500 text-[7px] font-bold tracking-[0.3em] uppercase italic">{sub}</div>
    </div>
  );
}
