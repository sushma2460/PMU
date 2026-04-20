import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <div className="bg-[#ffc0d4] text-center py-2 px-4 text-xs md:text-sm font-semibold tracking-widest uppercase text-black">
        WELCOME TO MEKA PMU SUPPLY USA
      </div>
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative w-full h-[80vh] flex items-center justify-center bg-zinc-950 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/30 z-10" />
        {/* We would use next/image here, but using a placeholder background for now */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1616422285623-14fcac31f7ea?auto=format&fit=crop&q=80")' }}
        />
        <div className="relative z-20 text-center space-y-6 max-w-3xl px-4">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">PREMIUM PMU SUPPLY</h1>
          <p className="text-lg md:text-xl text-zinc-200">
            Professional quality pigments, machines, and skin care. 100% vegan, organic, and cruelty-free.
          </p>
          <div className="flex items-center justify-center gap-4 pt-4">
            <Link href="/products">
              <Button size="lg" className="bg-amber-500 text-black hover:bg-amber-600 font-semibold px-8">
                SHOP NOW
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 container mx-auto px-4">
        <h2 className="text-3xl lg:text-4xl font-bold font-heading mb-12 capitalize tracking-wide">Collections</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <CategoryCard title="Practice Materials" href="/products?category=practice" image="https://images.unsplash.com/photo-1611558709798-e009c8fd7706?auto=format&fit=crop&q=80" />
          <CategoryCard title="Machines & Power Supplies" href="/products?category=machines" image="https://images.unsplash.com/photo-1590243003050-71644dff3379?auto=format&fit=crop&q=80" />
          <CategoryCard title="Pigments" href="/products?category=pigments" image="https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80" />
          <CategoryCard title="Needles" href="/products?category=needles" image="https://images.unsplash.com/photo-1596755389378-c31d21fd1273?auto=format&fit=crop&q=80" />
          <CategoryCard title="Q Vision Pigments" href="/products?category=q-vision" image="https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80" />
          <CategoryCard title="Aftercare" href="/products?category=aftercare" image="https://images.unsplash.com/photo-1556228720-192a6af4e865?auto=format&fit=crop&q=80" />
          <CategoryCard title="Anesthetic/Numbing" href="/products?category=numbing" image="https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80" />
          <CategoryCard title="Shaping Tools" href="/products?category=tools" image="https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&q=80" />
          <CategoryCard title="Etalon Hybrid & Mineral Pigments" href="/products?category=etalon" image="https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80" />
        </div>
      </section>
      
      {/* Featured Section */}
      <section className="py-20 bg-zinc-50">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <h2 className="text-3xl xl:text-4xl font-bold mb-6 font-heading">Organic Smoothie Skin Treatment</h2>
          <p className="text-zinc-600 mb-8 leading-relaxed text-lg">
            Petroleum Free! Made for professional PMU artists and the general public alike. 
            Gentle and soothing for all skin types, creating a soft and smooth skin surface. 
            Made with a concentrated mix of all organic oils and vitamins such as B5, C, E, 
            almond oil, avocado oil, tamanu oil, evening primrose oil, and cactus oil. Use it to soothe any irritating external skin condition!
          </p>
          <Link href="/products?category=aftercare">
            <Button size="lg" className="bg-black text-white hover:bg-zinc-800">
              SHOP NOW
            </Button>
          </Link>
        </div>
      </section>

      {/* New Hair Stroke Pattern Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h2 className="text-3xl xl:text-4xl font-bold font-heading">New Hair Stroke Pattern</h2>
            <p className="text-zinc-600 text-lg leading-relaxed">
              Mosha Studio & MEKA are proud to announce our newest versions of latex practice skins, designed to make brow practice easier than ever. Now with new and improved hair stroke patterns that Mosha uses on real clients, and new lamination styles for women's brows. Add them to your order today!
            </p>
            <div className="pt-4">
              <Link href="/products/signature-practice-skins">
                <Button size="lg" className="bg-black text-white hover:bg-zinc-800">
                  SHOP NOW
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer minimal version */}
      <footer className="bg-[#ffc0d4] text-black py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-center md:text-left">
            <div>
              <h3 className="font-bold text-xl mb-4">Quick links</h3>
              <ul className="space-y-3 font-medium">
                <li><Link href="https://af.uppromote.com/meka-999/register" className="hover:opacity-75">Become an Affiliate</Link></li>
                <li><Link href="https://moshastudio.teachable.com/" className="hover:opacity-75">Mosha Online Classes</Link></li>
                <li><Link href="https://www.facebook.com/moshastudios" className="hover:opacity-75">Mosha Studio Facebook</Link></li>
                <li><Link href="https://www.instagram.com/moshastudio/" className="hover:opacity-75">Mosha Studio Instagram</Link></li>
                <li><Link href="https://www.instagram.com/meka.999/" className="hover:opacity-75">MEKA Instagram</Link></li>
              </ul>
            </div>
            <div className="max-w-md mx-auto md:mx-0 md:ml-auto">
              <h3 className="font-bold text-xl mb-4">Our mission</h3>
              <p className="leading-relaxed font-medium">
                We strive to offer only the best quality products for PMU and skin care. Our products have been tested by professionals, and are 100% vegan, organic, and cruelty free.
              </p>
            </div>
          </div>
          <div className="border-t border-black/10 mt-12 pt-8 text-center text-sm font-medium">
            <p>© 2026 MEKA PMU SUPPLY - meka.999</p>
            <Link href="/admin" className="text-black hover:opacity-75 mt-2 inline-block">Admin Login</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}

function CategoryCard({ title, href, image }: { title: string, href: string, image: string }) {
  return (
    <Link href={href} className="group relative h-80 overflow-hidden rounded-xl block">
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
        style={{ backgroundImage: `url("${image}")` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
      <div className="absolute bottom-6 left-6 text-white text-xl font-medium tracking-wide">
        {title}
      </div>
    </Link>
  );
}
