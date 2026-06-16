"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import PromotionalCards from "./PromotionalCards";
import { publicSettingsService } from "../../services/publicSettingsService";

export default function Hero({ ads = [] }: { ads?: any[] }) {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    publicSettingsService.getSettingsByGroup("HOMEPAGE").then((data) => {
      setSettings(data);
      setIsLoaded(true);
    });
  }, []);

  // If the CMS has disabled the hero section, don't render it
  if (isLoaded && settings.HERO_ENABLED === 'false') {
    return null;
  }

  const title = settings.HERO_TITLE || "AURIQ";
  const subtitle = settings.HERO_SUBTITLE || `"Essence In Motion"`;
  const description = settings.HERO_DESCRIPTION || "A premium fragrance experience crafted for those who appreciate elegance, sophistication, and timeless luxury.";
  
  const cta1Text = settings.HERO_CTA1_TEXT || "EXPLORE COLLECTION";
  const cta1Link = settings.HERO_CTA1_LINK || "#collection";

  // Use CMS Background video or image, or fallback to default
  const videoUrl = settings.HERO_VIDEO_URL || "/video.mp4";
  const bgImage = settings.HERO_BG_IMAGE || null;

  return (
    <section id="hero" className="relative min-h-screen w-full flex flex-col justify-center overflow-hidden pt-20">
      {/* Background Video/Image with Overlay */}
      <div className="absolute inset-0 z-0">
        {videoUrl ? (
          <video 
            autoPlay 
            muted 
            loop 
            playsInline
            className="object-cover w-full h-full"
          >
            <source src={videoUrl} type="video/mp4" />
          </video>
        ) : bgImage ? (
          <img src={bgImage} alt="Hero Background" className="object-cover w-full h-full" />
        ) : null}
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 container-lux flex-1 flex flex-col items-center justify-center text-center mt-12 mb-16">
        <h1 className="text-6xl md:text-8xl lg:text-[9rem] font-serif font-bold text-gradient-gold tracking-widest mb-2 drop-shadow-lg uppercase">
          {title}
        </h1>
        <h2 className="text-xl md:text-2xl font-serif text-gold italic mb-6">
          {subtitle}
        </h2>
        <p className="max-w-2xl text-white/90 text-sm md:text-base leading-relaxed mb-10 drop-shadow-md">
          {description}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 mb-16">
          <Link 
            href={cta1Link} 
            className="px-10 py-4 bg-white/90 backdrop-blur-sm text-black font-medium tracking-wide hover:bg-gold hover:text-black transition-colors duration-300 text-sm shadow-xl uppercase"
          >
            {cta1Text}
          </Link>
          <Link 
            href="#story" 
            className="px-10 py-4 border border-white/80 text-white font-medium tracking-wide hover:bg-white hover:text-black transition-colors duration-300 text-sm shadow-xl backdrop-blur-sm uppercase"
          >
            OUR STORY
          </Link>
        </div>

        {/* Promotional Cards Overlay */}
        <div className="w-full max-w-7xl mx-auto mt-auto pb-4 md:pb-8">
          {/* @ts-ignore - Assuming PromotionalCards exists and accepts ads */}
          <PromotionalCards ads={ads} className="w-full relative z-10" showNoise={false} />
        </div>
      </div>
    </section>
  );
}

