"use client";

import { Quote } from "lucide-react";

export function ArtistSection() {
  return (
    <section className="py-24 bg-brand-cream/30">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative rounded-[3rem] overflow-hidden shadow-2xl border border-brand-gold/20 aspect-square max-w-[500px]">
            <img 
              src="/images/landing/master-studio.png" 
              alt="Mosha Studio Artist" 
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-8 left-8 bg-black/20 backdrop-blur-md p-4 rounded-xl border border-white/20">
              <span className="text-[#ff4d8d] text-[8px] font-bold tracking-[0.4em] uppercase">Featured Master</span>
              <h3 className="text-white text-xl font-heading mt-1">Mosha Studio</h3>
            </div>
          </div>

          <div className="space-y-12">
            <div className="space-y-6">
              <Quote className="w-10 h-10 text-[#ff4d8d] opacity-50" />
              <h2 className="text-3xl md:text-4xl font-heading leading-tight text-zinc-900">
                Precision in every stroke is only possible when you trust your tools implicitly.
              </h2>
              <p className="text-zinc-500 text-lg font-light italic leading-relaxed">
                "Our mission is to empower PMU artists worldwide with products that meet the highest standards of safety and performance. Every pigment, skin, and machine in the PMU SUPPLY catalog is tested by real artists, for real results."
              </p>
            </div>

            <div className="pt-8 border-t border-brand-gold/20 flex flex-col items-end">
              <span className="text-[10px] font-bold tracking-[0.5em] uppercase text-zinc-400">Master Artisan Signature</span>
              <div className="h-1 w-24 bg-brand-gold/30 mt-2" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
