import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function OurStory() {
  // Hardcoded as requested
  const subtitle = "WHY CHOOSE AURIQ";
  const title = "The Auriq Standard";
  const paragraph1 = "Sourced from the finest ingredients worldwide, ensuring an unparalleled olfactory experience. 100% genuine products crafted by master perfumers with a rich heritage in scent making.";
  const paragraph2 = "Complimentary express shipping on all orders, delivered in pristine condition to your doorstep. Dedicated concierge service ready to assist you in finding your perfect signature scent.";
  const image1 = "https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?q=80&w=2787&auto=format&fit=crop";
  const image2 = null;

  return (
    <section className="py-32 bg-perfume-main relative overflow-hidden" id="story">
      {/* Subtle top structural line */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-foreground/10 to-transparent"></div>
      
      {/* Subtle noise texture */}
      <div className="absolute inset-0 bg-noise opacity-30 pointer-events-none"></div>
      
      <div className="container-lux relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* Left: Images */}
          <div className="relative w-full max-w-md mx-auto lg:max-w-none h-[450px] md:h-[550px] lg:h-[650px]">
            {/* Primary Image (Image 1) */}
            <div className={`absolute ${image2 ? 'top-0 left-0 w-[80%] h-[80%]' : 'inset-0 w-full h-full'} group overflow-hidden p-2 lux-glass-card rounded-xl z-10 transition-all duration-700`}>
              <div className="relative w-full h-full rounded-lg overflow-hidden shadow-2xl">
                <Image
                  src={image1}
                  alt={title}
                  fill
                  className="object-cover opacity-90 transition-all duration-[2000ms] group-hover:scale-110 group-hover:opacity-100"
                />
                {/* Elegant overlay mask */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 pointer-events-none"></div>
              </div>
            </div>

            {/* Secondary Image (Image 2) */}
            {image2 && (
              <div className="absolute bottom-0 right-0 w-[55%] h-[55%] group overflow-hidden p-2 lux-glass-card rounded-xl z-20 transition-all duration-700 shadow-2xl transform translate-x-4 md:-translate-x-8 translate-y-8 md:-translate-y-12">
                <div className="relative w-full h-full rounded-lg overflow-hidden shadow-2xl">
                  <Image
                    src={image2}
                    alt={subtitle}
                    fill
                    className="object-cover opacity-90 transition-all duration-[2000ms] group-hover:scale-110 group-hover:opacity-100"
                  />
                  {/* Elegant overlay mask */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 pointer-events-none"></div>
                </div>
              </div>
            )}
          </div>

          {/* Right: Story Content */}
          <div className="flex flex-col mt-12 lg:mt-0">
            <span className="text-gold text-xs tracking-[0.3em] uppercase mb-4 block font-bold drop-shadow-sm">{subtitle}</span>
            <h2 className="text-3xl md:text-5xl font-serif text-gradient-gold mb-8 font-bold tracking-wide leading-tight drop-shadow-md">
              {title}
            </h2>
            <div className="w-16 h-[2px] bg-gold mb-8 shadow-[0_0_10px_rgba(212,175,55,0.6)]"></div>
            <p className="text-foreground/80 mb-6 leading-relaxed font-semibold text-sm tracking-wide whitespace-pre-wrap">
              {paragraph1}
            </p>
            <p className="text-foreground/80 mb-10 leading-relaxed font-semibold text-sm tracking-wide whitespace-pre-wrap">
              {paragraph2}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
