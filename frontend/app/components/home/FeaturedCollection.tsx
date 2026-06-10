"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";

const products = [
  {
    id: 1,
    name: "Oud Royale",
    brand: "Auriq",
    price: "Rs. 12,500",
    image: "https://images.unsplash.com/photo-1595425970377-c9703cc48a7e?q=80&w=2800&auto=format&fit=crop",
  },
  {
    id: 2,
    name: "Velvet Rose",
    brand: "Auriq",
    price: "Rs. 9,800",
    image: "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?q=80&w=2787&auto=format&fit=crop",
  },
  {
    id: 3,
    name: "Midnight Amber",
    brand: "Auriq",
    price: "Rs. 14,200",
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=2796&auto=format&fit=crop",
  },
  {
    id: 4,
    name: "Santal 33",
    brand: "Auriq",
    price: "Rs. 11,000",
    image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=2787&auto=format&fit=crop",
  },
  {
    id: 5,
    name: "Neroli Portofino",
    brand: "Auriq",
    price: "Rs. 13,500",
    image: "https://images.unsplash.com/photo-1616401784845-180882ba9ba8?q=80&w=2940&auto=format&fit=crop",
  },
  {
    id: 6,
    name: "Bleu De Noir",
    brand: "Auriq",
    price: "Rs. 10,500",
    image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=2953&auto=format&fit=crop",
  },
];

export default function FeaturedCollection() {
  return (
    <section className="py-24 bg-perfume-main relative overflow-hidden" id="collection">
      {/* Noise texture for matte finish */}
      <div className="absolute inset-0 bg-noise opacity-30 pointer-events-none"></div>
      
      <div className="container-lux relative z-10">
        <div className="flex justify-between items-end mb-16 border-b border-foreground/5 pb-6">
          <h2 className="text-3xl md:text-5xl font-serif text-gradient-gold font-bold tracking-wide">Featured Collection</h2>
          <Link href="#" className="text-xs tracking-[0.2em] text-foreground hover:text-gold transition-colors pb-1 drop-shadow-md">
            EXPLORE ALL
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
          {products.map((product) => (
            <div key={product.id} className="group relative flex flex-col lux-glass-card p-6">
              <div className="flex flex-col h-full">
                {/* Image Container with elegant hover zoom */}
                <Link href={`/products/${product.id}`} className="block relative aspect-[4/5] overflow-hidden rounded-xl mb-6 z-10 bg-background shadow-2xl">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover opacity-90 transition-all duration-700 group-hover:scale-110 group-hover:opacity-100"
                  />
                  
                  {/* Actions overlay - elegant fade in */}
                  <div className="absolute top-4 right-4 flex flex-col gap-3 opacity-0 transition-opacity duration-500 group-hover:opacity-100 z-10">
                    <button className="bg-background/60 backdrop-blur-md border border-foreground/20 text-foreground p-3 rounded-full hover:bg-gold hover:text-background hover:border-gold transition-all shadow-lg" aria-label="Add to Wishlist" onClick={(e) => e.preventDefault()}>
                      <Heart className="w-5 h-5" />
                    </button>
                  </div>
                  
                  {/* Quick Add overlay - sleek bottom bar */}
                  <div className="absolute bottom-0 left-0 w-full opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 z-10">
                    <button className="w-full bg-gold/90 backdrop-blur-md text-background py-4 text-sm font-bold tracking-widest hover:bg-foreground transition-colors flex items-center justify-center gap-2 border-t border-foreground/20" onClick={(e) => e.preventDefault()}>
                      <ShoppingBag className="w-5 h-5" />
                      ADD TO CART
                    </button>
                  </div>
                </Link>

                {/* Product Info - Minimalist typography */}
                <div className="flex flex-col text-center relative z-10 px-4">
                  <span className="text-[10px] text-gold uppercase tracking-[0.2em] mb-3 font-bold">{product.brand}</span>
                  <Link href={`/products/${product.id}`}>
                    <h3 className="font-serif text-xl text-foreground mb-2 font-bold drop-shadow-md hover:text-gold transition-colors">{product.name}</h3>
                  </Link>
                  <span className="text-foreground/80 text-sm tracking-wide font-medium">{product.price}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
