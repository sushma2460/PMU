"use client";

import Link from "next/link";

export function GallerySection() {
  const images = [
    { url: "/images/landing/microblading-result.png", title: "Microblading" },
    { url: "/images/landing/lip-blush-result.png", title: "Lip Blush" },
    { url: "/images/landing/eyeliner-result.png", title: "Eyeliner" },
    { url: "/images/landing/brow-class.png", title: "Master Class" },
  ];

  return (
    <section className="py-24 bg-brand-cream/30">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="space-y-2">
            <span className="text-[#ff4d8d] text-[10px] font-bold tracking-[0.4em] uppercase">Master Artistry</span>
            <h2 className="text-4xl md:text-5xl font-heading font-normal">
              Elitist Healed <span className="italic text-[#ff4d8d]">Results</span>
            </h2>
          </div>
          <Link href="https://instagram.com/moshastudio" target="_blank" className="text-[10px] font-bold tracking-[0.3em] border-b border-brand-black pb-1 uppercase hover:opacity-70 transition-opacity">
            Follow @MoshaStudio
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {images.map((img, i) => (
            <div key={i} className="group relative aspect-[3/4] rounded-[2.5rem] overflow-hidden shadow-xl border border-zinc-100">
              <img 
                src={img.url} 
                alt={img.title} 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-110"
              />
              {/* Glassy Hover Overlay */}
              <div className="absolute inset-0 backdrop-blur-[2px] bg-white/10 opacity-0 group-hover:opacity-100 transition-all duration-700" />
              
              {/* Floating Glassy Title Card */}
              <div className="absolute bottom-6 left-6 right-6 p-5 backdrop-blur-3xl bg-white/40 border border-white/60 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-[1.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] flex items-center justify-center">
                <span className="text-zinc-900 text-[8px] font-black tracking-[0.4em] uppercase">{img.title}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
