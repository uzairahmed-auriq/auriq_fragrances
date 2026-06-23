"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, SlidersHorizontal, ChevronDown } from "lucide-react";
import ProductCardActions from "../components/home/ProductCardActions";

export default function CollectionsClient({ initialProducts }: { initialProducts: any[] }) {
  const [products] = useState<any[]>(initialProducts || []);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("featured");

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.brand.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const priceA = Number(a.variants?.[0]?.discount_price || a.variants?.[0]?.price || a.base_price);
    const priceB = Number(b.variants?.[0]?.discount_price || b.variants?.[0]?.price || b.base_price);
    
    if (sortOption === "price-low-high") return priceA - priceB;
    if (sortOption === "price-high-low") return priceB - priceA;
    if (sortOption === "newest") return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    return 0; // "featured" defaults to current order
  });

  return (
    <main className="flex-1 w-full bg-perfume-main min-h-screen relative overflow-hidden pb-24">
      {/* Background Noise & Overlay */}
      <div className="absolute inset-0 bg-noise opacity-30 pointer-events-none z-0"></div>

      <div className="container-lux pt-20 relative z-10">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <span className="text-gold text-xs tracking-[0.3em] uppercase mb-4 block font-bold">The Complete Portfolio</span>
          <h1 className="text-4xl md:text-6xl font-serif text-foreground font-bold tracking-widest drop-shadow-md">Collections</h1>
        </div>

        {/* Filters & Search Toolbar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12 lg-card p-6 border-gold/20 shadow-[0_4px_30px_rgba(0,0,0,0.3)]">
          
          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40 group-focus-within:text-gold transition-colors" />
            <input 
              type="text" 
              placeholder="Search by name or brand..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full lg-input py-3 pl-12 pr-4 text-sm font-medium tracking-wide"
            />
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:flex-none min-w-[200px]">
              <select 
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="w-full lg-input py-3 px-4 text-sm font-medium tracking-wide appearance-none cursor-pointer"
              >
                <option value="featured" className="bg-charcoal text-white">Featured</option>
                <option value="newest" className="bg-charcoal text-white">Newest Arrivals</option>
                <option value="price-low-high" className="bg-charcoal text-white">Price: Low to High</option>
                <option value="price-high-low" className="bg-charcoal text-white">Price: High to Low</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/50 pointer-events-none" />
            </div>
            
            <button className="lg-btn p-3 flex-shrink-0 text-foreground/70 hover:text-gold transition-colors !rounded-xl" aria-label="Filter">
              <SlidersHorizontal className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
          {sortedProducts.map((product) => {
            const defaultVariant = product.variants?.[0];
            const price = defaultVariant?.discount_price || defaultVariant?.price || product.base_price;
            const originalPrice = defaultVariant?.discount_price ? defaultVariant.price : null;
            const primaryImage = product.images?.find((img: any) => img.is_primary)?.image_url || product.images?.[0]?.image_url || "/placeholder.jpg";

            return (
              <div key={product.id} className="group relative flex flex-col h-full bg-transparent lux-glass-card p-4">
                {originalPrice && (
                  <div className="absolute top-4 left-4 z-10 lg-badge bg-gold/90 text-background text-[10px] font-bold px-3 py-1 uppercase tracking-widest shadow-[0_0_10px_rgba(212,175,55,0.4)]">
                    Sale
                  </div>
                )}
                
                {/* Actions (Wishlist & Add to Cart) */}
                <ProductCardActions productId={product.id} variantId={defaultVariant?.id} />

                <Link href={`/products/${product.id}`} className="flex flex-col h-full">
                  <div className="relative aspect-[3/4] w-full overflow-hidden bg-background/5 rounded-lg mb-6">
                    <Image
                      src={primaryImage}
                      alt={product.name}
                      fill
                      sizes="(max-width: 768px) 50vw, 33vw"
                      className="object-cover transition-transform duration-[1.5s] group-hover:scale-110"
                    />
                  </div>
                  
                  <div className="flex flex-col flex-1 text-center justify-end px-2">
                    <span className="text-gold text-[10px] uppercase tracking-[0.2em] font-bold mb-2">{product.brand}</span>
                    <h3 className="font-serif text-base md:text-lg text-foreground font-bold mb-2 line-clamp-1 group-hover:text-gold transition-colors tracking-wide">{product.name}</h3>
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
          })}
        </div>

        {sortedProducts.length === 0 && (
          <div className="py-32 text-center lg-card border-dashed">
            <h3 className="text-2xl font-serif text-foreground font-bold mb-4">No products found</h3>
            <p className="text-foreground/60 font-medium tracking-wide">Try adjusting your search or filter criteria.</p>
            <button 
              onClick={() => { setSearchQuery(""); setSortOption("featured"); }}
              className="mt-8 lg-btn px-8 py-3 text-xs font-bold tracking-[0.2em] uppercase"
            >
              Clear Filters
            </button>
          </div>
        )}

      </div>
    </main>
  );
}
