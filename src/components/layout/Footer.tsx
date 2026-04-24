"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export function Footer() {
  return (
    <footer className="bg-brand-rose text-brand-black pt-16 pb-10 overflow-hidden relative border-t border-brand-gold/10">
      {/* Cinematic Glossy Background Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/30 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-16 mb-12">
          
          {/* Brand Column: The Manifesto */}
          <div className="lg:col-span-5 space-y-6">
            <Link href="/" className="inline-block transform transition-transform hover:scale-105 duration-500">
              <span className="text-3xl md:text-4xl font-heading font-normal tracking-tighter text-brand-gold leading-none">
                PMU <span className="italic">SUPPLY</span>
              </span>
            </Link>
            <div className="relative max-w-sm">
              <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-brand-gold/20" />
              <p className="text-zinc-800 text-xs md:text-sm font-light italic leading-relaxed pl-6 tracking-wide">
                "The ultimate destination for elite permanent makeup artists in India. We curate only the most precise, medical-grade tools to empower your creative vision."
              </p>
            </div>
          </div>

          {/* Navigation Matrix */}
          <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-8">
            {/* Boutique Section */}
            <div className="space-y-4">
              <h4 className="text-[9px] font-black tracking-[0.4em] uppercase text-brand-gold opacity-80">Boutique</h4>
              <ul className="space-y-3">
                {[
                  { name: "All Products", href: "/products" },
                  { name: "Machines", href: "/products?category=machines-power-supplies" },
                  { name: "Pigments", href: "/products?category=pigments" },
                  { name: "Needles", href: "/products?category=needles" }
                ].map((item) => (
                  <li key={item.name}>
                    <Link href={item.href} className="text-zinc-700 hover:text-brand-gold transition-all duration-300 text-[11px] font-bold tracking-widest uppercase flex items-center group">
                      <span className="w-0 h-[1px] bg-brand-gold transition-all duration-300 group-hover:w-4 mr-0 group-hover:mr-3" />
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support Section */}
            <div className="space-y-4">
              <h4 className="text-[9px] font-black tracking-[0.4em] uppercase text-brand-gold opacity-80">Studio Support</h4>
              <ul className="space-y-3">
                {[
                  { name: "Our Story", href: "/pages/about" },
                  { name: "Affiliate", href: "/pages/affiliate" },
                  { name: "Contact Us", href: "/pages/contact" },
                  { name: "Disclaimer", href: "/pages/disclaimer" }
                ].map((item) => (
                  <li key={item.name}>
                    <Link href={item.href} className="text-zinc-700 hover:text-brand-gold transition-all duration-300 text-[10px] font-bold tracking-widest uppercase flex items-center group">
                      <span className="w-0 h-[1px] bg-brand-gold transition-all duration-300 group-hover:w-4 mr-0 group-hover:mr-3" />
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Certification / Trust Section */}
            <div className="space-y-4 hidden md:block">
              <h4 className="text-[9px] font-black tracking-[0.4em] uppercase text-brand-gold opacity-80">Certification</h4>
              <div className="space-y-4">
                <div className="p-3 border border-brand-gold/10 rounded-2xl bg-white/30 backdrop-blur-sm">
                  <p className="text-[8px] text-zinc-600 italic font-medium leading-relaxed">
                    All products are ISO certified and artist-tested for maximum safety.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Editorial Bar */}
        <div className="pt-8 border-t border-brand-black/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-1 text-center md:text-left">
            <p className="text-zinc-500 text-[9px] tracking-[0.2em] uppercase font-bold">
              © {new Date().getFullYear()} PMU SUPPLY INDIA
            </p>
            <p className="text-zinc-400 text-[7px] tracking-[0.1em] uppercase italic">The Elite Choice for Permanent Artistry</p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2">
            <span className="text-brand-gold/40 text-[8px] font-black tracking-[0.3em] uppercase italic transition-opacity hover:opacity-100">Precision Driven</span>
            <span className="text-brand-gold/40 text-[8px] font-black tracking-[0.3em] uppercase italic transition-opacity hover:opacity-100">Medical Grade</span>
            <span className="text-brand-gold/40 text-[8px] font-black tracking-[0.3em] uppercase italic transition-opacity hover:opacity-100">Artist Approved</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
