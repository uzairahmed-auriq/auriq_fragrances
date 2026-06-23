import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Gift } from "lucide-react";

export default function GiftSetsPage() {
  const sets = [
    {
      id: 1,
      name: "The Signature Trilogy",
      description: "A curated trio of our most beloved fragrances in 30ml travel sizes. Perfect for discovering your next signature scent.",
      price: "15,000",
      image: "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?q=80&w=2787&auto=format&fit=crop"
    },
    {
      id: 2,
      name: "Oud Discovery Collection",
      description: "Experience the profound depth of our oud blends. Five 10ml vials showcasing the versatility of this precious resin.",
      price: "12,500",
      image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=2787&auto=format&fit=crop"
    },
    {
      id: 3,
      name: "The Artisan's Vault",
      description: "Our ultimate luxury gifting experience. Includes a full-size fragrance, matching body oil, and a solid perfume compact housed in a handcrafted wooden box.",
      price: "35,000",
      image: "https://images.unsplash.com/photo-1616401784845-180882ba9ba8?q=80&w=2940&auto=format&fit=crop"
    }
  ];

  return (
    <div className="pt-32 pb-24 relative z-10">
      
      <div className="text-center mb-16 md:mb-24 px-4">
        <span className="text-gold text-xs tracking-[0.3em] uppercase mb-4 block font-bold flex items-center justify-center gap-3">
          <Gift className="w-4 h-4" /> The Art of Gifting
        </span>
        <h1 className="text-4xl md:text-6xl font-serif text-gradient-gold font-bold tracking-widest drop-shadow-md mb-6">Gift Sets</h1>
        <p className="text-foreground/70 max-w-2xl mx-auto font-medium tracking-wide">
          Exquisitely packaged collections designed to delight the senses and create unforgettable memories. The perfect present for the fragrance connoisseur in your life.
        </p>
      </div>

      <div className="flex flex-col gap-16 md:gap-32 px-4 md:px-8 max-w-7xl mx-auto">
        {sets.map((set, index) => (
          <div key={set.id} className={`flex flex-col ${index % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-8 lg:gap-16 items-center group`}>
            
            {/* Image Side */}
            <div className="w-full lg:w-1/2 relative">
              <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden lux-glass p-2">
                <div className="relative w-full h-full rounded-xl overflow-hidden bg-background/20">
                  <Image 
                    src={set.image} 
                    alt={set.name}
                    fill
                    className="object-cover transition-transform duration-[2s] group-hover:scale-105"
                  />
                </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-gold/5 rounded-full blur-2xl z-0 pointer-events-none"></div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gold/5 rounded-full blur-2xl z-0 pointer-events-none"></div>
            </div>

            {/* Content Side */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center">
              <span className="text-[10px] text-gold uppercase tracking-[0.2em] font-bold mb-4">Limited Edition</span>
              <h2 className="text-3xl md:text-4xl font-serif text-foreground font-bold tracking-wide mb-6">{set.name}</h2>
              <p className="text-foreground/70 leading-relaxed font-medium tracking-wide mb-8">
                {set.description}
              </p>
              
              <div className="flex items-end gap-4 mb-10 border-t border-foreground/10 pt-6">
                <span className="text-2xl font-bold tracking-wide text-foreground">
                  Rs. {set.price}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button className="lg-btn-primary px-8 py-4 text-white text-xs font-bold tracking-[0.2em] uppercase flex items-center justify-center gap-3 w-full sm:w-auto">
                  Add to Cart
                </button>
                <Link href="/contact" className="lg-btn px-8 py-4 text-xs font-bold tracking-[0.2em] uppercase text-foreground flex items-center justify-center w-full sm:w-auto">
                  Inquire
                </Link>
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* Custom Gifting Banner */}
      <div className="mt-32 max-w-5xl mx-auto px-4">
        <div className="lg-card p-10 md:p-16 text-center relative overflow-hidden group border-gold/20">
          <div className="absolute inset-0 bg-noise opacity-30 pointer-events-none z-0"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 rounded-full blur-3xl group-hover:bg-gold/20 transition-colors duration-700 -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gold/10 rounded-full blur-3xl group-hover:bg-gold/20 transition-colors duration-700 translate-y-1/2 -translate-x-1/2"></div>
          
          <div className="relative z-10 flex flex-col items-center">
            <Gift className="w-10 h-10 text-gold mb-6 drop-shadow-[0_0_10px_rgba(212,175,55,0.5)]" />
            <h3 className="text-3xl font-serif text-foreground font-bold tracking-wide mb-4">Bespoke Gifting</h3>
            <p className="text-foreground/80 max-w-lg mb-8 font-medium tracking-wide">
              Create a personalized gift set tailored to their unique preferences. Our fragrance experts are available to guide you through the selection process.
            </p>
            <Link href="/contact" className="lg-btn px-8 py-4 text-xs font-bold tracking-[0.2em] uppercase text-gold border-gold/30 flex items-center gap-3 group-hover:bg-gold group-hover:text-black transition-all duration-500">
              Contact Concierge <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}
