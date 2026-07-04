"use client";

import Link from "next/link";
import Image from "next/image";
import PromotionalCards from "./PromotionalCards";

export default function Hero({ settings = {} }: { settings?: Record<string, string> }) {

  const title = settings.HERO_TITLE || "AURIQ";
  const subtitle = settings.HERO_SUBTITLE || `"Essence In Motion"`;
  const description = settings.HERO_DESCRIPTION || "A premium fragrance experience crafted for those who appreciate elegance, sophistication, and timeless luxury.";
  
  const cta1Text = settings.HERO_CTA1_TEXT || "EXPLORE COLLECTION";
  const cta1Link = settings.HERO_CTA1_LINK || "/collections";

  const videoUrl = settings.HERO_VIDEO_URL || "https://res.cloudinary.com/dasozntqa/video/upload/f_auto,q_auto/v1782857916/video_zms4gn.mp4";
  const bgImage = settings.HERO_BG_IMAGE || null;

  return (
    <section id="hero" className="relative min-h-screen w-full flex flex-col justify-center overflow-hidden pt-10">
      {/* Background Video/Image with Overlay */}
      <div className="absolute inset-0 z-0">
        {videoUrl ? (
          <video
            autoPlay
            muted
            loop
            playsInline
            aria-hidden="true"
            tabIndex={-1}
            className="object-cover w-full h-full"
          >
            <source src={videoUrl} type="video/mp4" />
          </video>
        ) : bgImage ? (
          <Image src={bgImage} alt="Hero Background" fill priority className="object-cover" />
        ) : (
          <div className="absolute inset-0 bg-[#0a0a0a]" />
        )}
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 container-lux flex-1 flex flex-col items-center justify-center text-center mt-12 mb-16">
        <div className="relative w-[95%] sm:w-[90%] max-w-5xl md:max-w-6xl lg:max-w-screen-2xl h-48 md:h-64 lg:h-96 mb-0 mt-6" style={{ transform: 'translateZ(0)', backfaceVisibility: 'hidden' }}>
          <Image 
            src="/hero-logo.png" 
            alt={title}
            fill
            className="object-contain"
            priority
          />
        </div>
        <div className="relative w-[260px] sm:w-[400px] md:w-[500px] lg:w-[600px] h-[44px] sm:h-[60px] md:h-[80px] lg:h-[100px] -mt-2 md:-mt-6 mb-6">
          <Image 
            src="/Essence_in_motion.png" 
            alt={subtitle || "Essence In Motion"}
            fill
            className="object-contain drop-shadow-md"
            priority
          />
        </div>
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
            href="/about" 
            className="px-10 py-4 border border-white/80 text-white font-medium tracking-wide hover:bg-white hover:text-black transition-colors duration-300 text-sm shadow-xl backdrop-blur-sm uppercase"
          >
            OUR STORY
          </Link>
        </div>

        {/* Promotional Cards Overlay */}
        <div className="w-full max-w-7xl mx-auto mt-auto pb-4 md:pb-8">
          <PromotionalCards className="w-full relative z-10" showNoise={false} settings={settings} />
        </div>
      </div>
    </section>
  );
}

