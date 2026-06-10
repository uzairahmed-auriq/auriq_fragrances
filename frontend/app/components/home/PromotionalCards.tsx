import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function PromotionalCards() {
  return (
    <section className="py-8 md:py-12 bg-perfume-main relative overflow-hidden">
      {/* Noise overlay */}
      <div className="absolute inset-0 bg-noise opacity-30 pointer-events-none z-0"></div>

      <div className="container-lux relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          
          {/* Left Card - The Midnight Collection */}
          <Link href="/collections?sort=new-arrivals" className="group block relative aspect-[4/3] md:aspect-[16/9] lg:aspect-[2/1] rounded-2xl overflow-hidden shadow-2xl border border-foreground/5 bg-background">
            <Image
              src="https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=2787&auto=format&fit=crop"
              alt="The Midnight Collection"
              fill
              className="object-cover opacity-80 transition-transform duration-700 group-hover:scale-105"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent"></div>
            
            {/* Content */}
            <div className="absolute bottom-0 left-0 p-8 md:p-10 flex flex-col justify-end h-full w-full">
              <span className="text-gold text-[10px] uppercase font-bold tracking-[0.2em] mb-2 drop-shadow-md">
                New Arrival
              </span>
              <h3 className="text-3xl md:text-4xl lg:text-5xl font-serif text-gradient-gold font-bold mb-4 drop-shadow-lg">
                The Midnight Collection
              </h3>
              <div className="flex items-center gap-2 text-[10px] md:text-xs text-foreground uppercase tracking-widest font-bold group-hover:text-gold transition-colors drop-shadow-md">
                Discover Now <ArrowRight className="w-3 h-3 md:w-4 md:h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>

          {/* Right Card - Summer Exclusives */}
          <Link href="/collections?sort=best-sellers" className="group block relative aspect-[4/3] md:aspect-[16/9] lg:aspect-[2/1] rounded-2xl overflow-hidden shadow-2xl border border-foreground/5 bg-background">
            <Image
              src="https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?q=80&w=2787&auto=format&fit=crop"
              alt="Summer Exclusives"
              fill
              className="object-cover opacity-80 transition-transform duration-700 group-hover:scale-105"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent"></div>
            
            {/* Content */}
            <div className="absolute bottom-0 left-0 p-8 md:p-10 flex flex-col justify-end h-full w-full">
              <span className="text-gold text-[10px] uppercase font-bold tracking-[0.2em] mb-2 drop-shadow-md">
                Limited Edition
              </span>
              <h3 className="text-3xl md:text-4xl lg:text-5xl font-serif text-gradient-gold font-bold mb-4 drop-shadow-lg">
                Summer Exclusives
              </h3>
              <div className="flex items-center gap-2 text-[10px] md:text-xs text-foreground uppercase tracking-widest font-bold group-hover:text-gold transition-colors drop-shadow-md">
                Shop Sale <ArrowRight className="w-3 h-3 md:w-4 md:h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>

        </div>
      </div>
    </section>
  );
}
