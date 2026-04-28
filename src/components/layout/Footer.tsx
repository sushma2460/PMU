"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getSocialLinks } from "@/lib/services/admin";
import { SocialLinks } from "@/lib/types";
import { MessageCircle } from "lucide-react";

const SocialIcons = {
  Instagram: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
    </svg>
  ),
  Facebook: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
    </svg>
  ),
  Youtube: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/>
    </svg>
  ),
  WhatsApp: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-10.6 8.38 8.38 0 0 1 3.8.9L21 3z"/>
    </svg>
  )
};

export function Footer() {
  const [socialLinks, setSocialLinks] = useState<SocialLinks>({});

  useEffect(() => {
    async function fetchLinks() {
      try {
        const links = await getSocialLinks();
        console.log("Fetched social links:", links);
        if (links) setSocialLinks(links);
      } catch (err) {
        console.error("Error fetching social links:", err);
      }
    }
    fetchLinks();
  }, []);

  return (
    <footer className="bg-brand-rose text-brand-black pt-16 pb-10 overflow-hidden relative border-t border-brand-gold/10">
      {/* Cinematic Glossy Background Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/30 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-16 mb-12">
          
          {/* Brand Column: The Manifesto & Social Presence */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-6">
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

            {/* Social Presence - Now under description */}
            <div className="flex flex-wrap gap-4 pt-2">
              {socialLinks.instagram && (
                <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="p-2.5 bg-white/40 border border-brand-gold/10 rounded-full text-zinc-700 hover:bg-brand-gold hover:text-white transition-all shadow-sm active:scale-90">
                  <SocialIcons.Instagram />
                </a>
              )}
              {socialLinks.facebook && (
                <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="p-2.5 bg-white/40 border border-brand-gold/10 rounded-full text-zinc-700 hover:bg-brand-gold hover:text-white transition-all shadow-sm active:scale-90">
                  <SocialIcons.Facebook />
                </a>
              )}
              {socialLinks.whatsapp && (
                <a href={`https://wa.me/${String(socialLinks.whatsapp).replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="p-2.5 bg-white/40 border border-brand-gold/10 rounded-full text-zinc-700 hover:bg-brand-gold hover:text-white transition-all shadow-sm active:scale-90">
                  <SocialIcons.WhatsApp />
                </a>
              )}
              {socialLinks.youtube && (
                <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="p-2.5 bg-white/40 border border-brand-gold/10 rounded-full text-zinc-700 hover:bg-brand-gold hover:text-white transition-all shadow-sm active:scale-90">
                  <SocialIcons.Youtube />
                </a>
              )}
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

            {/* Certification / Trust Section - Now on the Right */}
            <div className="space-y-4">
              <h4 className="text-[9px] font-black tracking-[0.4em] uppercase text-brand-gold opacity-80">Certification</h4>
              <div className="space-y-4">
                <div className="p-4 border border-brand-gold/10 rounded-2xl bg-white/30 backdrop-blur-sm">
                  <p className="text-[9px] text-zinc-600 italic font-medium leading-relaxed">
                    All products are ISO certified and artist-tested for maximum safety and performance.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Editorial Bar */}
        <div className="pt-8 border-t border-brand-black/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-1 text-center md:text-left">
            <p className="text-zinc-600 text-[9px] tracking-[0.2em] uppercase font-bold">
              © {new Date().getFullYear()} PMU SUPPLY INDIA
            </p>
            <p className="text-zinc-500 text-[7px] tracking-[0.1em] uppercase italic">The Elite Choice for Permanent Artistry</p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2">
            <span className="text-brand-gold text-[8px] font-black tracking-[0.3em] uppercase italic transition-opacity hover:opacity-70">Precision Driven</span>
            <span className="text-brand-gold text-[8px] font-black tracking-[0.3em] uppercase italic transition-opacity hover:opacity-70">Medical Grade</span>
            <span className="text-brand-gold text-[8px] font-black tracking-[0.3em] uppercase italic transition-opacity hover:opacity-70">Artist Approved</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
