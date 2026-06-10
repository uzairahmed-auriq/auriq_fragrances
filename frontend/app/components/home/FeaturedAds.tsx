"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ads = [
  {
    id: 1,
    tag: "Limited Time",
    title: "Summer Sale 2026",
    description: "Discover our newest range of intense, captivating fragrances designed for the modern connoisseur. Up to 30% off selected luxury perfumes.",
    image: "https://images.unsplash.com/photo-1616401784845-180882ba9ba8?q=80&w=2940&auto=format&fit=crop",
    link: "/collections?sort=best-sellers",
    buttonText: "SHOP THE SALE",
  },
  {
    id: 2,
    tag: "Just In",
    title: "The Midnight Collection",
    description: "Embrace the elegance of the night with our new exclusive signature blends. Dark, woody, and irresistibly smooth.",
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=2796&auto=format&fit=crop",
    link: "/collections?sort=new-arrivals",
    buttonText: "DISCOVER NOW",
  },
  {
    id: 3,
    tag: "Exclusive",
    title: "Luxury Gift Sets",
    description: "The perfect present for the ones you cherish. Curated fragrance boxes wrapped in our signature gold foil packaging.",
    image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=2787&auto=format&fit=crop",
    link: "/collections",
    buttonText: "VIEW GIFT SETS",
  }
];

export default function FeaturedAds() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-advance the carousel every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === ads.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === ads.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? ads.length - 1 : prev - 1));
  };

  return (
    <section className="w-full relative overflow-hidden bg-background group">
      {/* Carousel Container */}
      <div 
        className="flex transition-transform duration-1000 ease-in-out h-[25vh] md:h-[35vh]"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {ads.map((ad, index) => (
          <div key={ad.id} className="min-w-full h-full relative">
            <Image
              src={ad.image}
              alt={ad.title}
              fill
              className={`object-cover transition-transform duration-[10000ms] ${currentSlide === index ? 'scale-110' : 'scale-100'}`}
              priority={index === 0}
            />
            {/* Gradient Overlay for Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/40 to-transparent"></div>
            
            <div className="absolute inset-0 flex flex-col justify-center p-6 md:px-16 md:py-8 lg:w-1/2">
              <span className="text-gold tracking-[0.3em] text-[10px] md:text-xs font-bold mb-2 uppercase inline-block">
                {ad.tag}
              </span>
              <h2 className="text-2xl md:text-4xl lg:text-5xl font-serif text-gradient-gold font-bold tracking-widest mb-2 leading-tight drop-shadow-md">
                {ad.title}
              </h2>
              <p className="text-foreground/80 max-w-xl mb-4 text-xs md:text-sm tracking-wide font-medium hidden sm:block">
                {ad.description}
              </p>
              <div>
                <Link 
                  href={ad.link} 
                  className="inline-block px-6 py-3 bg-transparent border border-foreground/20 text-foreground font-bold tracking-widest hover:border-gold hover:text-gold transition-all uppercase text-[10px] shadow-[0_0_20px_rgba(255,255,255,0.05)] hover:shadow-[0_0_30px_rgba(255,255,255,0.15)] backdrop-blur-sm"
                >
                  {ad.buttonText}
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button 
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-background/20 backdrop-blur-md border border-foreground/10 text-foreground opacity-0 group-hover:opacity-100 transition-all hover:bg-gold/20 hover:text-gold hover:border-gold"
        aria-label="Previous Slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button 
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-background/20 backdrop-blur-md border border-foreground/10 text-foreground opacity-0 group-hover:opacity-100 transition-all hover:bg-gold/20 hover:text-gold hover:border-gold"
        aria-label="Next Slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Pagination Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-y-1/2 flex gap-3 z-20 md:left-24 md:-translate-x-0">
        {ads.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              currentSlide === index ? "bg-gold w-8" : "bg-foreground/30 hover:bg-foreground/60"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
