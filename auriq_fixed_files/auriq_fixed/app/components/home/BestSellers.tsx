"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import ProductCardActions from "./ProductCardActions";
import { productService } from "../../services/productService";

interface Product {
  id: number;
  name: string;
  slug: string;
  brand: string;
  base_price: string;
  images: { id: number; image_url: string; alt_text: string; is_primary: boolean }[];
  variants: { id: number; price: string; discount_price: string | null }[];
}

// Skeleton card shown while loading
function SkeletonCard() {
  return (
    <div className="flex flex-col h-full bg-transparent lux-glass-card p-4 animate-pulse">
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-foreground/5 rounded-lg mb-6" />
      <div className="flex flex-col items-center gap-2 px-2">
        <div className="h-2 w-16 bg-foreground/10 rounded-full" />
        <div className="h-4 w-28 bg-foreground/10 rounded-full" />
        <div className="h-3 w-14 bg-foreground/10 rounded-full" />
      </div>
    </div>
  );
}

export default function BestSellers() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productService.getBestSellers()
      .then((res) => {
        if (res.success) setProducts(res.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-24 bg-perfume-main relative">
      <div className="container-lux">
        <div className="text-center mb-16">
          <span className="text-gold text-xs tracking-[0.3em] uppercase mb-4 block font-bold">Most Loved</span>
          <h2 className="text-3xl md:text-5xl font-serif text-foreground font-bold tracking-wide">Best Sellers</h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
            : products.length > 0
              ? products.map((product) => {
                  const defaultVariant = product.variants[0];
                  const price = defaultVariant?.discount_price || defaultVariant?.price || product.base_price;
                  const originalPrice = defaultVariant?.discount_price ? defaultVariant.price : null;
                  const primaryImage = product.images.find(img => img.is_primary)?.image_url || product.images[0]?.image_url || "/placeholder.jpg";
                  return (
                    <div key={product.id} className="group relative flex flex-col h-full bg-transparent lux-glass-card p-4">
                      {originalPrice && (
                        <div className="absolute top-4 left-4 z-10 lg-badge bg-gold/90 text-background text-[10px] font-bold px-3 py-1 uppercase tracking-widest">
                          Sale
                        </div>
                      )}
                      <ProductCardActions productId={product.id} variantId={defaultVariant?.id} />
                      <Link href={`/products/${product.id}`} className="flex flex-col h-full">
                        <div className="relative aspect-[3/4] w-full overflow-hidden bg-background/5 rounded-lg mb-6">
                          <Image
                            src={primaryImage}
                            alt={product.name}
                            fill
                            sizes="(max-width: 768px) 50vw, 25vw"
                            className="object-cover transition-transform duration-[1.5s] group-hover:scale-110"
                          />
                        </div>
                        <div className="flex flex-col flex-1 text-center justify-end px-2">
                          <span className="text-gold text-[10px] uppercase tracking-[0.2em] font-bold mb-2">{product.brand}</span>
                          <h3 className="font-serif text-base md:text-lg text-foreground font-bold mb-2 line-clamp-1 group-hover:text-gold transition-colors">{product.name}</h3>
                          <div className="flex items-center justify-center gap-2">
                            <span className="text-foreground text-sm font-semibold tracking-wide">Rs. {Number(price).toLocaleString()}</span>
                            {originalPrice && (
                              <span className="text-foreground/40 text-xs line-through tracking-wide">Rs. {Number(originalPrice).toLocaleString()}</span>
                            )}
                          </div>
                        </div>
                      </Link>
                    </div>
                  );
                })
              : null}
        </div>

        {!loading && products.length > 0 && (
          <div className="mt-16 text-center">
            <Link href="/collections?sort=best-sellers" className="lg-btn inline-block px-8 py-4 text-xs font-bold tracking-[0.2em] uppercase">
              View All Best Sellers
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
