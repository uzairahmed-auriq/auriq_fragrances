"use client";

import Image from "next/image";
import Link from "next/link";
import ProductCardActions from "./ProductCardActions";

export default function FeaturedGrid({ products = [] }: { products?: any[] }) {
  if (!products || products.length === 0) return null;

  // Take exactly up to 8 products for the 2x4 grid
  const displayProducts = products.slice(0, 8);

  return (
    <section className="py-12 md:py-24 bg-perfume-main relative overflow-hidden" id="featured-grid">
      {/* Noise texture for matte finish */}
      <div className="absolute inset-0 bg-noise opacity-30 pointer-events-none"></div>

      <div className="container-lux relative z-10">
        <div className="flex justify-between items-end mb-8 md:mb-16 border-b border-foreground/5 pb-6">
          <div>
            <h2 className="text-2xl md:text-5xl font-serif text-gradient-gold font-bold tracking-wide">Featured Collection</h2>
            <p className="mt-2 md:mt-4 text-sm text-foreground/70 max-w-2xl">Discover our handpicked selection of exceptional fragrances.</p>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-3 gap-y-6 sm:gap-x-8 sm:gap-y-16">
          {displayProducts.map((product) => {
            const price = product.variants?.[0]?.price || 0;
            const imageUrl = product.images?.[0]?.image_url || "https://images.unsplash.com/photo-1595425970377-c9703cc48a7e?q=80&w=2800&auto=format&fit=crop";

            return (
              <div key={product.id} className="group relative flex flex-col lux-glass-card p-3 sm:p-6">
                <div className="flex flex-col h-full">
                  <Link href={`/products/${product.slug || product.id}`} className="block relative aspect-[4/5] overflow-hidden rounded-xl mb-3 sm:mb-6 z-10 bg-transparent shadow-2xl">
                    <Image
                      src={imageUrl}
                      alt={product.name}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1200px) 50vw, 25vw"
                      className="object-cover opacity-90 transition-all duration-700 group-hover:scale-110 group-hover:opacity-100"
                    />
                    <ProductCardActions productId={product.id} />
                  </Link>

                  <div className="flex flex-col text-center relative z-10 px-1 sm:px-4 mt-auto">
                    <span className="text-[9px] sm:text-[10px] text-gold uppercase tracking-[0.2em] mb-1 sm:mb-3 font-bold">{product.brand}</span>
                    <Link href={`/products/${product.slug || product.id}`}>
                      <h3 className="font-serif text-sm sm:text-xl text-foreground mb-1 sm:mb-2 font-bold drop-shadow-md hover:text-gold transition-colors line-clamp-1 leading-tight">{product.name}</h3>
                    </Link>
                    <span className="text-foreground/80 text-xs sm:text-sm tracking-wide font-medium">Rs. {parseFloat(price).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-end mt-8 sm:mt-12">
          <Link href="/collections" className="group flex items-center gap-2 text-sm tracking-[0.2em] uppercase font-bold text-foreground hover:text-gold transition-colors drop-shadow-md">
            View All
            <span className="block transform transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
