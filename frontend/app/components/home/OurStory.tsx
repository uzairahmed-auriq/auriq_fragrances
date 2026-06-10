import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function OurStory() {
  return (
    <section className="py-32 bg-perfume-main relative overflow-hidden" id="story">
      {/* Subtle top structural line */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-foreground/10 to-transparent"></div>
      
      {/* Subtle noise texture */}
      <div className="absolute inset-0 bg-noise opacity-30 pointer-events-none"></div>
      
      <div className="container-lux relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left: Image */}
          <div className="relative aspect-[3/4] w-full max-w-md mx-auto lg:max-w-none group overflow-hidden p-2 lux-glass-card rounded-xl">
            <div className="relative w-full h-full rounded-lg overflow-hidden shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?q=80&w=2787&auto=format&fit=crop"
                alt="Auriq Perfume Craftsmanship"
                fill
                className="object-cover opacity-90 transition-all duration-[2000ms] group-hover:scale-110 group-hover:opacity-100"
              />
              {/* Elegant overlay mask */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 pointer-events-none"></div>
            </div>
          </div>

          {/* Right: Story Content */}
          <div className="flex flex-col">
            <span className="text-gold text-xs tracking-[0.3em] uppercase mb-4 block font-bold drop-shadow-sm">The Heritage</span>
            <h2 className="text-3xl md:text-5xl font-serif text-gradient-gold mb-8 font-bold tracking-wide leading-tight drop-shadow-md">
              Crafting The Essence Of Elegance
            </h2>
            <div className="w-16 h-[2px] bg-gold mb-8 shadow-[0_0_10px_rgba(212,175,55,0.6)]"></div>
            <p className="text-foreground/80 mb-6 leading-relaxed font-semibold text-sm tracking-wide">
              Every drop of Auriq is a testament to the art of fine perfumery. We source the rarest, most exquisite ingredients from across the globe—from the fields of Grasse to the deep forests of the East—to create fragrances that are not just scents, but timeless memories.
            </p>
            <p className="text-foreground/80 mb-10 leading-relaxed font-semibold text-sm tracking-wide">
              Our master perfumers blend traditional techniques with modern innovation, ensuring that every bottle holds a symphony of notes that evolve beautifully on your skin throughout the day.
            </p>
            <Link 
              href="#philosophy" 
              className="inline-flex items-center gap-4 text-xs text-foreground/80 font-semibold tracking-[0.2em] hover:text-gold transition-colors w-max uppercase group"
            >
              <span className="flex items-center gap-2">READ FULL STORY <ArrowRight className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-2" /></span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
