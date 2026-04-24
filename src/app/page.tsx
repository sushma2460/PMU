"use client";

import React, { useEffect, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CheckCircle2, Sparkles, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { ModernHero } from "@/components/home/ModernHero";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { ArtistSection } from "@/components/home/ArtistSection";
import { GallerySection } from "@/components/home/GallerySection";
import { useRouter } from "next/navigation";
import { getCategoriesAction } from "@/app/admin/products/category-actions";
import { getProducts } from "@/lib/services/admin";
import { Product } from "@/lib/types";
import { getBannersAction, seedInitialBannersAction, type Banner } from "@/app/admin/banners/actions";

// Helper to slugify category names
const slugify = (text: string) => {
  return text.toLowerCase().replace(/[\s/&_-]+/g, '-').replace(/[^\w-]/g, '').replace(/^-+|-+$/g, '');
};

const CATEGORY_IMAGE_MAP: Record<string, string> = {
  "Practice Materials": "/images/landing/practice-skins.png",
  "Machines & Power Supplies": "/images/landing/precision-machine.png",
  "Machines": "/images/landing/precision-machine.png",
  "Pigments": "/images/landing/collection-hero.png",
  "Needles": "/images/landing/v3-cartridges.png",
  "Q Vision Pigments": "/images/landing/q-vision.png",
  "Etalon Hybrid & Mineral": "/images/landing/etalon.png",
  "Anesthetic/Numbing": "/images/landing/numbing.png",
  "Numbing": "/images/landing/numbing.png",
  "Aftercare": "/images/landing/aftercare.png",
  "Shaping Tools": "/images/landing/shaping-tools.png",
};

const FALLBACK_IMAGE_POOL = [
  "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?auto=format&fit=crop&q=80",
];

function DynamicCollectionsGrid() {
  const [categories, setCategories] = useState<{id: string, name: string, count: number, image: string}[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [catRes, prodRes] = await Promise.all([
          getCategoriesAction(),
          getProducts()
        ]);

        if (catRes.success && catRes.categories) {
          const categoryData = prodRes.reduce((acc: Record<string, {count: number, firstImage: string | null}>, p: Product) => {
            const cat = typeof p.category === 'string' ? p.category : p.category;
            if (!acc[cat]) acc[cat] = { count: 0, firstImage: p.imageUrls?.[0] || null };
            acc[cat].count += 1;
            return acc;
          }, {});

          const processed = catRes.categories
            .filter(cat => cat.name.toLowerCase() !== 'other')
            .map((cat, index) => {
              const stats = categoryData[cat.name];
              let displayImage = CATEGORY_IMAGE_MAP[cat.name];
              if (!displayImage && stats?.firstImage) displayImage = stats.firstImage;
              if (!displayImage) displayImage = FALLBACK_IMAGE_POOL[index % FALLBACK_IMAGE_POOL.length];
              return { ...cat, count: stats?.count || 0, image: displayImage };
            });
          setCategories(processed);
        }
      } catch (error) {
        console.error("Error loading dynamic collections:", error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="aspect-[4/5] bg-zinc-100 animate-pulse rounded-3xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {categories.map((cat) => (
        <CollectionCard 
          key={cat.id}
          title={cat.name === 'Machines & Power Supplies' ? 'Machines' : (cat.name === 'Anesthetic/Numbing' ? 'Numbing' : cat.name)} 
          href={`/products?category=${slugify(cat.name)}`} 
          image={cat.image}
          count={`${cat.count} Products`}
        />
      ))}
    </div>
  );
}

function DynamicBannerSection({ banner }: { banner: Banner }) {
  const isRight = banner.imageSide === 'right';
  const bgClass = banner.bgColor === 'white' ? 'bg-white' : 'bg-brand-cream/50';
  
  return (
    <section className={`py-24 overflow-hidden ${bgClass}`}>
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className={`${isRight ? 'order-2 lg:order-1' : 'order-2'} space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700`}>
            <div className="space-y-4">
              {banner.subtitle && (
                <span className="text-brand-gold text-[10px] font-bold tracking-[0.4em] uppercase">{banner.subtitle}</span>
              )}
              <h2 className="text-4xl md:text-6xl font-heading leading-tight text-zinc-900">
                {banner.title} <br/>
                {banner.highlightedTitle && (
                  <span className="italic text-[#ff4d8d]">{banner.highlightedTitle}</span>
                )}
              </h2>
            </div>
            
            <div className="relative pl-8 border-l border-brand-gold/20">
              <p className="text-zinc-600 text-lg leading-relaxed font-light italic">
                {banner.description}
              </p>
            </div>

            {/* Dynamic Badges */}
            {banner.badges && banner.badges.length > 0 && (
              <div className="flex flex-wrap gap-3 pt-2">
                {banner.badges.map((badge, i) => (
                  <span key={i} className="px-5 py-2 bg-white rounded-full border border-zinc-100 text-[9px] font-bold tracking-widest uppercase text-zinc-400 shadow-sm">
                    {badge}
                  </span>
                ))}
              </div>
            )}

            {/* Dynamic Bullets */}
            {banner.bullets && banner.bullets.length > 0 && (
              <ul className="space-y-3 pt-2">
                {banner.bullets.map((bullet, i) => (
                  <li key={i} className="flex items-center gap-3 text-[10px] font-bold tracking-widest uppercase text-zinc-500">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-gold shadow-[0_0_8px_rgba(212,175,55,0.4)]" />
                    {bullet}
                  </li>
                ))}
              </ul>
            )}

            <Link href={banner.buttonLink} className="inline-block pt-4">
              <Button size="lg" className="bg-brand-rose text-brand-black hover:bg-brand-black hover:text-white px-10 h-14 rounded-none tracking-[0.2em] text-[10px] font-bold transition-all duration-500 shadow-lg shadow-brand-rose/10">
                {banner.buttonText}
              </Button>
            </Link>
          </div>

          <div className={`${isRight ? 'order-1 lg:order-2' : 'order-1'} relative animate-in fade-in zoom-in duration-1000`}>
            <div className={`relative aspect-square w-full max-w-[500px] ${isRight ? 'ml-auto' : 'mr-auto'} rounded-[3rem] overflow-hidden shadow-2xl border-[12px] border-white`}>
              <img 
                src={banner.imageUrl} 
                alt={banner.title}
                className="w-full h-full object-cover transition-transform duration-[2s] hover:scale-105"
              />
            </div>
            {/* Subtle background decoration */}
            <div className={`absolute -z-10 top-1/2 -translate-y-1/2 ${isRight ? '-right-20' : '-left-20'} w-80 h-80 bg-brand-gold/5 rounded-full blur-3xl`} />
          </div>
        </div>
      </div>
    </section>
  );
}

function SectionDivider() {
  return (
    <div className="container mx-auto px-4">
      <div className="h-px w-full bg-gradient-to-r from-transparent via-brand-gold/20 to-transparent" />
    </div>
  );
}

export default function Home() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loadingBanners, setLoadingBanners] = useState(true);

  useEffect(() => {
    async function loadBanners() {
      const res = await getBannersAction();
      if (res.success && res.banners) {
        if (res.banners.length === 0) {
          await seedInitialBannersAction();
          const retry = await getBannersAction();
          if (retry.success && retry.banners) setBanners(retry.banners);
        } else {
          setBanners(res.banners);
        }
      }
      setLoadingBanners(false);
    }
    loadBanners();
  }, []);

  if (authLoading || user || isRedirecting) {
    return (
      <div className="min-h-screen bg-brand-cream flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-gold"></div>
          <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-brand-gold animate-pulse">Authenticating Artistry</span>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-brand-cream">
      <Navbar />
      
      <ModernHero />

      <SectionDivider />

      {/* Dynamic Featured Collections Section */}
      <section className="py-24 container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="space-y-2">
            <span className="text-brand-gold text-[10px] font-bold tracking-[0.4em] uppercase">Curated Catalog</span>
            <h2 className="text-4xl md:text-5xl font-heading font-normal">Featured Collections</h2>
          </div>
          <Link href="/products" className="text-xs font-bold tracking-[0.2em] border-b-2 border-brand-gold pb-1 hover:opacity-70 transition-opacity">
            BROWSE ALL PRODUCTS
          </Link>
        </div>

        <DynamicCollectionsGrid />
      </section>

      <SectionDivider />

      {/* RESTORED: Featured Products */}
      <FeaturedProducts />

      <SectionDivider />

      {/* Admin Controlled Dynamic Banners (First 2) */}
      {!loadingBanners && banners.slice(0, 2).map((banner, index) => (
        <React.Fragment key={banner.id}>
          <DynamicBannerSection banner={banner} />
          {index < 1 && <SectionDivider />}
        </React.Fragment>
      ))}

      <SectionDivider />

      {/* RESTORED: Gallery Section (Results) */}
      <GallerySection />

      <SectionDivider />

      {/* Admin Controlled Dynamic Banners (Remaining) */}
      {!loadingBanners && banners.slice(2).map((banner, index) => (
        <React.Fragment key={banner.id}>
          <DynamicBannerSection banner={banner} />
          <SectionDivider />
        </React.Fragment>
      ))}

      {/* RESTORED: Artist Section */}
      <ArtistSection />

      <SectionDivider />

      {/* Brand Values Strip */}
      <section className="bg-brand-cream py-20 border-y border-brand-gold/10 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_-20%,rgba(248,184,200,0.05),transparent_70%)]" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
            <ValueItem title="100% Vegan" desc="Ethically Sourced Purity" icon={<CheckCircle2 className="w-8 h-8 text-brand-gold" />} />
            <ValueItem title="Organic Purity" desc="Water-Based Formulations" icon={<Sparkles className="w-8 h-8 text-brand-gold" />} />
            <ValueItem title="Cruelty Free" desc="Leaping Bunny Certified" icon={<Award className="w-8 h-8 text-brand-gold" />} />
            <ValueItem title="Pro Tested" desc="Used by Global Masters" icon={<CheckCircle2 className="w-8 h-8 text-brand-gold" />} />
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function CollectionCard({ title, href, image, count }: { title: string, href: string, image: string, count: string }) {
  return (
    <Link href={href} className="group relative aspect-[4/5] overflow-hidden block rounded-3xl bg-zinc-100">
      <img src={image} alt={title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110" />
      <div className="absolute inset-0 bg-gradient-to-t from-brand-black/90 via-brand-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
      <div className="absolute bottom-8 left-8 right-8 space-y-2">
        <span className="text-brand-gold text-[10px] font-bold tracking-[0.3em] uppercase opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0">
          Explore Collection
        </span>
        <h3 className="text-white text-2xl font-heading tracking-wide group-hover:text-brand-gold transition-colors">
          {title}
        </h3>
        <p className="text-zinc-400 text-[10px] tracking-widest font-light uppercase">{count}</p>
      </div>
    </Link>
  );
}

function ValueItem({ title, desc, icon }: { title: string, desc: string, icon: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center text-center space-y-4 group">
      <div className="w-16 h-16 rounded-full border border-zinc-100 flex items-center justify-center bg-white shadow-sm group-hover:border-brand-gold group-hover:shadow-[0_0_20px_rgba(248,184,200,0.1)] transition-all duration-500">
        {icon}
      </div>
      <div className="space-y-1">
        <h3 className="text-[11px] font-bold tracking-[0.3em] uppercase text-brand-black">{title}</h3>
        <p className="text-[9px] font-medium tracking-[0.1em] text-zinc-400 uppercase">{desc}</p>
      </div>
    </div>
  );
}
