import Image from "next/image";
import Link from "next/link";

export default function OurStory() {
  return (
    <section className="py-24 bg-perfume-main relative overflow-hidden">
      <div className="container-lux relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Images Layout */}
          <div className="relative h-[600px] w-full group">
            {/* Main Image */}
            <div className="absolute top-0 left-0 w-4/5 h-4/5 rounded-2xl overflow-hidden lux-glass p-2 z-10 transition-transform duration-700 group-hover:-translate-y-2">
              <div className="relative w-full h-full rounded-xl overflow-hidden">
                <Image 
                  src="https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=2787&auto=format&fit=crop" 
                  alt="Perfume Creation Process" 
                  fill 
                  className="object-cover"
                />
              </div>
            </div>
            
            {/* Secondary Image */}
            <div className="absolute bottom-0 right-0 w-3/5 h-3/5 rounded-2xl overflow-hidden lux-glass p-2 z-20 transition-transform duration-700 group-hover:translate-y-2 group-hover:translate-x-2">
              <div className="relative w-full h-full rounded-xl overflow-hidden">
                <Image 
                  src="https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=2804&auto=format&fit=crop" 
                  alt="Auriq Ingredients" 
                  fill 
                  className="object-cover"
                />
              </div>
            </div>

            {/* Decorative Element */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border border-gold/10 rounded-full z-0 animate-[spin_60s_linear_infinite] pointer-events-none"></div>
          </div>

          {/* Text Content */}
          <div className="flex flex-col justify-center lg:pl-12">
            <span className="text-gold text-xs tracking-[0.3em] uppercase mb-6 font-bold flex items-center gap-4">
              <span className="w-12 h-px bg-gold"></span> The Artisan Touch
            </span>
            <h2 className="text-4xl md:text-5xl font-serif text-foreground font-bold tracking-wide mb-8 leading-tight">
              Crafting Memories,<br />One Drop at a Time.
            </h2>
            <div className="space-y-6 text-foreground/70 font-medium tracking-wide text-sm leading-relaxed mb-10">
              <p>
                At Auriq, we believe that a fragrance is more than a scent—it is an invisible garment, a lingering memory, and an expression of one's deepest essence.
              </p>
              <p>
                Our master perfumers travel the globe to source the rarest ingredients, from the rich oud woods of the East to the delicate rose valleys of the West, blending them into symphonies of olfactory perfection.
              </p>
            </div>
            <Link 
              href="/about" 
              className="lg-btn inline-block px-8 py-4 text-xs font-bold tracking-[0.2em] uppercase w-fit"
            >
              Discover Our Heritage
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}
