"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import ProductCardActions from "./ProductCardActions";
import { publicSettingsService } from "../../services/publicSettingsService";

export default function BestSellers({ products = [] }: { products?: any[] }) {
  const [settings, setSettings] = useState<Record<string, string>>({});

  useEffect(() => {
    publicSettingsService.getSettingsByGroup("HOMEPAGE").then(setSettings);
  }, []);

  if (!products || products.length === 0) return null; // Hide section if no data yet

  const title = settings.BESTSELLERS_TITLE || "Best Sellers";
  const limit = parseInt(settings.BESTSELLERS_LIMIT || "4");
  const displayProducts = products.slice(0, limit);

  return (
    <section className="py-24 bg-perfume-main relative overflow-hidden">
      {/* Noise overlay for matte finish */}
      <div className="absolute inset-0 bg-noise opacity-30 pointer-events-none"></div>
      
      <div className="container-lux relative z-10">
        <div className="flex justify-between items-end mb-16 border-b border-foreground/5 pb-6">
          <h2 className="text-3xl md:text-5xl font-serif text-gradient-gold font-bold tracking-wide">{title}</h2>
          <Link href="#" className="text-xs tracking-[0.2em] text-foreground hover:text-gold transition-colors pb-1 drop-shadow-md">
            EXPLORE ALL
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
          {displayProducts.map((product) => {
            const price = product.variants?.[0]?.price || 0;
            const imageUrl = product.images?.[0]?.image_url || "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=2787&auto=format&fit=crop";
            
            return (
              <div key={product.id} className="group relative flex flex-col lux-glass-card p-5">
                <div className="flex flex-col h-full">
                  <Link href={`/products/${product.slug || product.id}`} className="block relative aspect-[4/5] overflow-hidden rounded-xl mb-6 bg-background z-10 shadow-2xl">
                    <Image
                      src={imageUrl}
                      alt={product.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      className="object-cover opacity-90 transition-all duration-700 group-hover:scale-110 group-hover:opacity-100"
                    />
                    
                    <ProductCardActions productId={product.id} />
                  </Link>

                  <div className="flex flex-col text-center relative z-10 px-2">
                    <span className="text-[10px] text-gold uppercase tracking-[0.2em] mb-3 font-bold">{product.brand}</span>
                    <Link href={`/products/${product.slug || product.id}`}>
                      <h3 className="font-serif text-xl text-foreground mb-2 font-bold drop-shadow-md hover:text-gold transition-colors">{product.name}</h3>
                    </Link>
                    <span className="text-foreground/80 text-sm tracking-wide font-medium">Rs. {parseFloat(price).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
