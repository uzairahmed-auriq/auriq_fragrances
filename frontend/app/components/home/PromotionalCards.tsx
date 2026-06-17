import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { publicSettingsService } from "../../services/publicSettingsService";

export default function PromotionalCards({ 
  className = "py-8 md:py-12 bg-perfume-main relative overflow-hidden",
  showNoise = true,
}: { 
  className?: string;
  showNoise?: boolean;
}) {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    publicSettingsService.getSettingsByGroup("HOMEPAGE").then((data) => {
      setSettings(data);
      setIsLoaded(true);
    });
  }, []);

  const displayAds = [
    {
      title: isLoaded && settings.PROMO1_TITLE ? settings.PROMO1_TITLE : "The Midnight Collection",
      tag: isLoaded && settings.PROMO1_TAG ? settings.PROMO1_TAG : "New Arrival",
      image_url: isLoaded && settings.PROMO1_IMAGE ? settings.PROMO1_IMAGE : "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=2787&auto=format&fit=crop",
      link_url: isLoaded && settings.PROMO1_LINK ? settings.PROMO1_LINK : "/collections?sort=new-arrivals",
      buttonText: isLoaded && settings.PROMO1_BTN ? settings.PROMO1_BTN : "Discover Now"
    },
    {
      title: isLoaded && settings.PROMO2_TITLE ? settings.PROMO2_TITLE : "Summer Exclusives",
      tag: isLoaded && settings.PROMO2_TAG ? settings.PROMO2_TAG : "Limited Edition",
      image_url: isLoaded && settings.PROMO2_IMAGE ? settings.PROMO2_IMAGE : "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?q=80&w=2787&auto=format&fit=crop",
      link_url: isLoaded && settings.PROMO2_LINK ? settings.PROMO2_LINK : "/collections?sort=best-sellers",
      buttonText: isLoaded && settings.PROMO2_BTN ? settings.PROMO2_BTN : "Shop Sale"
    }
  ];

  if (isLoaded && settings.PROMO_CARDS_ENABLED === 'false') {
    return null;
  }

  return (
    <section className={className}>
      {/* Noise overlay */}
      {showNoise && <div className="absolute inset-0 bg-noise opacity-30 pointer-events-none z-0"></div>}

      <div className="container-lux relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {displayAds.map((ad, idx) => (
            <Link key={idx} href={ad.link_url || "/collections"} className="group block relative aspect-[4/3] md:aspect-[16/9] lg:aspect-[2/1] rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-black/50">
              <Image
                src={ad.image_url}
                alt={ad.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover opacity-80 transition-transform duration-700 group-hover:scale-105"
              />
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent"></div>
              
              {/* Content */}
              <div className="absolute bottom-0 left-0 p-8 md:p-10 flex flex-col justify-end h-full w-full">
                <span className="text-gold text-[10px] uppercase font-bold tracking-[0.2em] mb-2 drop-shadow-md">
                  {ad.tag || "Featured"}
                </span>
                <h3 className="text-3xl md:text-4xl lg:text-5xl font-serif text-gradient-gold font-bold mb-4 drop-shadow-lg">
                  {ad.title}
                </h3>
                <div className="flex items-center gap-2 text-[10px] md:text-xs text-white uppercase tracking-widest font-bold group-hover:text-gold transition-colors drop-shadow-md">
                  {ad.buttonText || "Shop Now"} <ArrowRight className="w-3 h-3 md:w-4 md:h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}        </div>
      </div>
    </section>
  );
}
