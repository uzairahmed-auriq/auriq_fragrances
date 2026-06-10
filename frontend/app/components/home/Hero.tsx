import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingBag, ArrowRight } from "lucide-react";

// Mock data for advertisements (Admin manageable in future)
const advertisements = [
  {
    id: 1,
    title: "The Midnight Collection",
    subtitle: "New Arrival",
    image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=2787&auto=format&fit=crop",
    cta: "DISCOVER NOW",
    url: "#",
  },
  {
    id: 2,
    title: "Summer Exclusives",
    subtitle: "Limited Edition",
    image: "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?q=80&w=2787&auto=format&fit=crop",
    cta: "SHOP SALE",
    url: "#",
  }
];

// Mock data for fallback featured perfumes
const featuredPerfumes = [
  {
    id: 1,
    name: "Royal Oud",
    brand: "Auriq",
    price: "Rs. 15,000",
    image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=2787&auto=format&fit=crop",
  },
  {
    id: 2,
    name: "Tuscan Leather",
    brand: "Auriq",
    price: "Rs. 12,800",
    image: "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?q=80&w=2787&auto=format&fit=crop",
  },
  {
    id: 3,
    name: "Baccarat Rouge",
    brand: "Auriq",
    price: "Rs. 18,200",
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=2796&auto=format&fit=crop",
  }
];

export default function Hero() {
  // Toggle this to test alternative mode
  const showAds = true; 

  return (
    <section className="relative min-h-screen w-full flex flex-col justify-center overflow-hidden pt-20">
      {/* Background Video with Overlay */}
      <div className="absolute inset-0 z-0">
        <video 
          autoPlay 
          muted 
          loop 
          playsInline
          className="object-cover w-full h-full"
        >
          {/* Note: User must place video.mp4 in the public folder */}
          <source src="/video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 container-lux flex-1 flex flex-col items-center justify-center text-center mt-12 mb-16">
        <h1 className="text-6xl md:text-8xl lg:text-[9rem] font-serif font-bold text-gradient-gold tracking-widest mb-2 drop-shadow-lg">
          AURIQ
        </h1>
        <h2 className="text-xl md:text-2xl font-serif text-gold italic mb-6">
          &quot;Essence In Motion&quot;
        </h2>
        <p className="max-w-2xl text-white text-sm md:text-base leading-relaxed mb-10 drop-shadow-md">
          A premium fragrance experience crafted for those who appreciate elegance, sophistication, and timeless luxury.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 mb-16">
          <Link 
            href="#collection" 
            className="px-10 py-4 bg-white/90 backdrop-blur-sm text-black font-medium tracking-wide hover:bg-gold hover:text-black transition-colors duration-300 text-sm shadow-xl"
          >
            EXPLORE COLLECTION
          </Link>
          <Link 
            href="#story" 
            className="px-10 py-4 border border-white/80 text-white font-medium tracking-wide hover:bg-white hover:text-black transition-colors duration-300 text-sm shadow-xl backdrop-blur-sm"
          >
            OUR STORY
          </Link>
        </div>

        {/* Advertisement / Featured Showcase Overlay */}
        <div className="w-full max-w-6xl mx-auto mt-auto">
          {showAds && advertisements.length > 0 ? (
            /* Ads Mode */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              {advertisements.slice(0, 2).map((ad, index) => (
                <div 
                  key={ad.id} 
                  className={`lux-glass-card group p-2 ${index === 0 ? 'md:col-span-2 lg:col-span-1 lg:h-[280px]' : 'hidden lg:block lg:h-[280px]'}`}
                >
                  <div className="relative w-full h-full overflow-hidden rounded-lg">
                    <Image
                      src={ad.image}
                      alt={ad.title}
                      fill
                      className="object-cover opacity-60 transition-all duration-[2000ms] group-hover:scale-105 group-hover:opacity-40"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none"></div>
                    
                    <div className="absolute inset-0 flex flex-col justify-end p-8 text-left z-10">
                      <span className="text-gold text-[10px] font-bold tracking-[0.2em] uppercase mb-3 drop-shadow-sm">{ad.subtitle}</span>
                      <h3 className="text-2xl md:text-3xl font-serif text-gradient-gold mb-4 font-bold tracking-wide drop-shadow-md">{ad.title}</h3>
                      <Link 
                        href={ad.url} 
                        className="inline-flex items-center gap-4 text-xs text-white/80 font-bold tracking-[0.2em] hover:text-white transition-colors w-max group/link uppercase"
                      >
                        {ad.cta} <ArrowRight className="w-4 h-4 transition-transform duration-500 group-hover/link:translate-x-2" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Fallback Mode: Featured Perfumes */
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {featuredPerfumes.map((perfume) => (
                <div 
                  key={perfume.id} 
                  className="lux-glass-card p-4 group"
                >
                  <div className="flex items-center gap-6 relative h-full w-full">
                    <div className="relative w-24 h-24 rounded-sm overflow-hidden shrink-0 z-10 shadow-lg bg-background">
                      <Image
                        src={perfume.image}
                        alt={perfume.name}
                        fill
                        className="object-cover opacity-90 transition-all duration-700 group-hover:scale-110 group-hover:opacity-100"
                      />
                    </div>
                    <div className="flex flex-col text-left flex-1 z-10">
                      <span className="text-gold text-[9px] font-bold tracking-[0.2em] uppercase mb-2">{perfume.brand}</span>
                      <h4 className="font-serif text-gradient-gold text-sm mb-1 font-bold tracking-wide">{perfume.name}</h4>
                      <span className="text-foreground/80 text-xs font-bold tracking-wider mb-3">{perfume.price}</span>
                      <div className="flex items-center gap-4">
                        <button className="text-foreground/60 hover:text-gold transition-colors" aria-label="Add to Wishlist">
                          <Heart className="w-4 h-4" />
                        </button>
                        <button className="text-foreground/60 hover:text-gold transition-colors" aria-label="Add to Cart">
                          <ShoppingBag className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

