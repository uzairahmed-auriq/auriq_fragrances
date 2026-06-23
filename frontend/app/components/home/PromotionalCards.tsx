"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function PromotionalCards({ className = "", showNoise = true, settings = {} }: { className?: string, showNoise?: boolean, settings?: Record<string, string> }) {

  // Fetch CMS settings if not provided
  const isPromo1Enabled = settings.PROMO1_ENABLED !== 'false';
  const promo1Title = settings.PROMO1_TITLE || "The OUD Collection";
  const promo1Subtitle = settings.PROMO1_SUBTITLE || "Discover intense, woody notes";
  const promo1Link = settings.PROMO1_LINK || "/collections?collection=oud";
  const promo1Image = settings.PROMO1_IMAGE || "/placeholder.jpg";

  const isPromo2Enabled = settings.PROMO2_ENABLED !== 'false';
  const promo2Title = settings.PROMO2_TITLE || "Gift Sets";
  const promo2Subtitle = settings.PROMO2_SUBTITLE || "The perfect luxury present";
  const promo2Link = settings.PROMO2_LINK || "/gift-sets";
  const promo2Image = settings.PROMO2_IMAGE || "/placeholder.jpg";


  if (!isPromo1Enabled && !isPromo2Enabled) {
    return null; // Don't render if both are disabled
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${className}`}>
      {/* Promo Card 1 */}
      {isPromo1Enabled && (
        <Link href={promo1Link} className="group relative h-64 md:h-80 overflow-hidden rounded-2xl block">
          <Image 
            src={promo1Image} 
            alt={promo1Title} 
            fill 
            className="object-cover transition-transform duration-[2s] group-hover:scale-105"
          />
          {/* Default Dark Overlay */}
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500"></div>
          
          {/* Glass Text Container */}
          <div className="absolute bottom-6 left-6 right-6 lg-card p-6 flex flex-col items-start translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
            <h3 className="font-serif text-2xl text-foreground font-bold mb-1">{promo1Title}</h3>
            <p className="text-foreground/80 text-sm mb-4 font-medium">{promo1Subtitle}</p>
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-gold flex items-center gap-2 group-hover:gap-3 transition-all">
              Explore <ArrowRight className="w-4 h-4" />
            </span>
          </div>
        </Link>
      )}

      {/* Promo Card 2 */}
      {isPromo2Enabled && (
        <Link href={promo2Link} className="group relative h-64 md:h-80 overflow-hidden rounded-2xl block">
          <Image 
            src={promo2Image} 
            alt={promo2Title} 
            fill 
            className="object-cover transition-transform duration-[2s] group-hover:scale-105"
          />
          {/* Default Dark Overlay */}
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500"></div>
          
          {/* Glass Text Container */}
          <div className="absolute bottom-6 left-6 right-6 lg-card p-6 flex flex-col items-start translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
            <h3 className="font-serif text-2xl text-foreground font-bold mb-1">{promo2Title}</h3>
            <p className="text-foreground/80 text-sm mb-4 font-medium">{promo2Subtitle}</p>
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-gold flex items-center gap-2 group-hover:gap-3 transition-all">
              Shop Now <ArrowRight className="w-4 h-4" />
            </span>
          </div>
        </Link>
      )}
    </div>
  );
}
