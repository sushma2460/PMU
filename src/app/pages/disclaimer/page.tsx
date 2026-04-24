import React from 'react';
import { ShieldAlert, AlertTriangle, FileText, CheckCircle } from 'lucide-react';
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function DisclaimerPage() {
  return (
    <main className="min-h-screen bg-brand-cream">
      <Navbar />
      <div className="pt-32 pb-24">
      {/* Hero Section */}
      <div className="container mx-auto px-4 mb-20 text-center">
        <h1 className="text-6xl md:text-8xl font-heading italic mb-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          Professional <span className="text-brand-gold">Disclaimer</span>
        </h1>
        <p className="text-zinc-500 text-xs font-light tracking-[0.4em] uppercase max-w-2xl mx-auto leading-relaxed">
          Operational Transparency & Safety Protocols for the Elite Permanent Makeup Industry
        </p>
      </div>

      {/* Content Grid */}
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          
          {/* Sales Policy */}
          <div className="bg-zinc-50 p-12 rounded-[3rem] border border-zinc-100 space-y-6 group hover:border-brand-gold/20 transition-all duration-700">
            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-500">
              <ShieldAlert className="w-6 h-6 text-brand-gold" />
            </div>
            <h2 className="text-2xl font-heading italic">All Sales Are Final</h2>
            <p className="text-zinc-600 font-light leading-relaxed">
              Due to the nature of Permanent Makeup (PMU) and tattoo products, all sales are final. To maintain the highest hygiene and safety standards, we do not accept returns or exchanges once a product has been purchased and shipped.
            </p>
          </div>

          {/* Professional Use */}
          <div className="bg-zinc-50 p-12 rounded-[3rem] border border-zinc-100 space-y-6 group hover:border-brand-gold/20 transition-all duration-700">
            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-500">
              <AlertTriangle className="w-6 h-6 text-brand-gold" />
            </div>
            <h2 className="text-2xl font-heading italic">Professional Use Only</h2>
            <p className="text-zinc-600 font-light leading-relaxed">
              Our products are intended strictly for trained professionals in the PMU and tattooing industry. By purchasing, you confirm you are a qualified professional or working under professional supervision.
            </p>
          </div>

          {/* Quality Assurance */}
          <div className="bg-zinc-50 p-12 rounded-[3rem] border border-zinc-100 space-y-6 group hover:border-brand-gold/20 transition-all duration-700">
            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-500">
              <CheckCircle className="w-6 h-6 text-brand-gold" />
            </div>
            <h2 className="text-2xl font-heading italic">Quality Assurance</h2>
            <p className="text-zinc-600 font-light leading-relaxed">
              Every item undergoes strict quality checks. Any damaged or defective products must be reported within 7 days of receipt for professional assistance and resolution.
            </p>
          </div>

          {/* Liability */}
          <div className="bg-zinc-50 p-12 rounded-[3rem] border border-zinc-100 space-y-6 group hover:border-brand-gold/20 transition-all duration-700">
            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-500">
              <FileText className="w-6 h-6 text-brand-gold" />
            </div>
            <h2 className="text-2xl font-heading italic">Liability & Responsibility</h2>
            <p className="text-zinc-600 font-light leading-relaxed">
              The purchaser is solely responsible for ensuring they have the necessary expertise to use products safely. PMU SUPPLY is not liable for misuse or adverse reactions resulting from improper application.
            </p>
          </div>

        </div>

        {/* Legal Footer */}
        <div className="mt-24 text-center space-y-8">
           <div className="w-px h-24 bg-gradient-to-b from-brand-gold to-transparent mx-auto" />
           <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.5em]">
             Legal Governance & Industry Standards
           </p>
           <p className="text-zinc-500 font-light text-sm max-w-3xl mx-auto leading-relaxed italic">
             By completing a purchase on PMU SUPPLY, you acknowledge and agree to these terms. These policies are enforced to protect our artists and maintain the integrity of the professional PMU community in India.
           </p>
        </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
