"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export function Footer() {
  return (
    <footer className="bg-brand-rose text-brand-black pt-24 pb-12 overflow-hidden relative border-t border-brand-gold/10">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 lg:gap-8 mb-20">
          
          {/* Brand Column */}
          <div className="lg:col-span-4 space-y-8">
            <Link href="/" className="inline-block">
              <span className="text-2xl font-heading font-normal tracking-tighter text-brand-gold">
                PMU <span className="italic">SUPPLY</span>
              </span>
            </Link>
            <p className="text-zinc-700 text-sm font-light leading-relaxed max-w-sm tracking-wide">
              The ultimate destination for elite permanent makeup artists in India. Providing precision-engineered tools and organic pigments to elevate your artistry.
            </p>
            <div className="flex gap-6">
              <Link href="https://instagram.com/moshastudio" target="_blank" className="text-brand-black hover:text-brand-gold transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-instagram"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </Link>
              <Link href="https://facebook.com" target="_blank" className="text-brand-black hover:text-brand-gold transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-facebook"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 space-y-8">
            <h4 className="text-[10px] font-bold tracking-[0.3em] uppercase text-brand-gold">Boutique</h4>
            <ul className="space-y-4">
              <li><Link href="/products" className="text-zinc-700 hover:text-brand-gold transition-colors text-xs font-light tracking-widest uppercase">All Products</Link></li>
              <li><Link href="/products?category=machines-power-supplies" className="text-zinc-700 hover:text-brand-gold transition-colors text-xs font-light tracking-widest uppercase">Machines</Link></li>
              <li><Link href="/products?category=pigments" className="text-zinc-700 hover:text-brand-gold transition-colors text-xs font-light tracking-widest uppercase">Pigments</Link></li>
              <li><Link href="/products?category=needles" className="text-zinc-700 hover:text-brand-gold transition-colors text-xs font-light tracking-widest uppercase">Needles</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div className="lg:col-span-2 space-y-8">
            <h4 className="text-[10px] font-bold tracking-[0.3em] uppercase text-brand-gold">Studio Support</h4>
            <ul className="space-y-4">
              <li><Link href="/pages/about" className="text-zinc-700 hover:text-brand-black transition-colors text-xs font-light tracking-widest uppercase">Our Story</Link></li>
              <li><Link href="/pages/affiliate" className="text-zinc-700 hover:text-brand-black transition-colors text-xs font-light tracking-widest uppercase">Affiliate</Link></li>
              <li><Link href="/pages/contact" className="text-zinc-700 hover:text-brand-black transition-colors text-xs font-light tracking-widest uppercase">Contact Us</Link></li>
              <li><Link href="/pages/international" className="text-zinc-700 hover:text-brand-black transition-colors text-xs font-light tracking-widest uppercase">International</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-4 space-y-8">
            <h4 className="text-[10px] font-bold tracking-[0.3em] uppercase text-brand-gold">The Elite List</h4>
            <p className="text-zinc-700 text-xs font-light tracking-wide uppercase">Join for exclusive product drops and professional insights.</p>
            <form className="relative group border-b border-brand-black pb-2">
              <input 
                type="email" 
                placeholder="Email Address" 
                className="w-full bg-transparent py-2 text-xs font-light tracking-widest outline-none focus:border-brand-gold transition-colors placeholder:text-zinc-400"
              />
              <button className="absolute right-0 top-1/2 -translate-y-1/2 text-brand-gold hover:text-brand-black transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-brand-black/10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-zinc-500 text-[10px] tracking-[0.2em] uppercase font-light">
            © {new Date().getFullYear()} PMU SUPPLY INDIA. ALL RIGHTS RESERVED.
          </p>
          <div className="flex gap-8">
            <span className="text-brand-gold/40 text-[8px] font-black tracking-[0.4em] uppercase italic">Precision Driven</span>
            <span className="text-brand-gold/40 text-[8px] font-black tracking-[0.4em] uppercase italic">Artist Approved</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
