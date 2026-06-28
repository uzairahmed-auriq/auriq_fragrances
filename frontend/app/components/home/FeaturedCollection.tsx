"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import ProductCardActions from "./ProductCardActions";
import { useSettings } from "../../context/SettingsContext";

export default function FeaturedCollection({ products = [] }: { products?: any[] }) {
  const settings = useSettings();

  if (!products || products.length === 0 || settings.FEATURED_ENABLED === 'false') return null;

  const title = settings.FEATURED_TITLE || "Featured Collections";
  const subtitle = settings.FEATURED_SUBTITLE || "";

  return (
    <section className="py-24 bg-perfume-main relative overflow-hidden" id="collection">
      {/* Noise texture for matte finish */}
      <div className="absolute inset-0 bg-noise opacity-30 pointer-events-none"></div>
      
      <div className="container-lux relative z-10">
        <div className="flex justify-between items-end mb-16 border-b border-foreground/5 pb-6">
          <div>
            <h2 className="text-3xl md:text-5xl font-serif text-gradient-gold font-bold tracking-wide">{title}</h2>
            {subtitle && (
              <p className="mt-4 text-sm text-foreground/70 max-w-2xl">{subtitle}</p>
            )}
          </div>
          <Link href="/collections" className="text-xs tracking-[0.2em] text-foreground hover:text-gold transition-colors pb-1 drop-shadow-md">
            EXPLORE ALL
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
          {products.map((product) => {
            const price = product.variants?.[0]?.price || 0;
            const imageUrl = product.images?.[0]?.image_url || "https://images.unsplash.com/photo-1595425970377-c9703cc48a7e?q=80&w=2800&auto=format&fit=crop";

            return (
              <div key={product.id} className="group relative flex flex-col lux-glass-card p-6">
                <div className="flex flex-col h-full">
                  {/* Image Container with elegant hover zoom */}
                  <Link href={`/products/${product.slug || product.id}`} className="block relative aspect-[4/5] overflow-hidden rounded-xl mb-6 z-10 bg-background shadow-2xl">
                    <Image
                      src={imageUrl}
                      alt={product.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover opacity-90 transition-all duration-700 group-hover:scale-110 group-hover:opacity-100"
                    />
                    
                    <ProductCardActions productId={product.id} />
                  </Link>

                  {/* Product Info - Minimalist typography */}
                  <div className="flex flex-col text-center relative z-10 px-4">
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
