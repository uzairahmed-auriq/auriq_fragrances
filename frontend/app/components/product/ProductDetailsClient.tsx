"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Heart, Minus, Plus, Share2, ShieldCheck, Truck, RefreshCcw, Star } from "lucide-react";
import { useCart } from "../../context/CartContext";
import ProductReviews from "./ProductReviews";
import Header from "../layout/Header";
import Footer from "../layout/Footer";

// Component props remain the same
export default function ProductDetailsClient({ product, relatedProducts = [] }: { product: any; relatedProducts?: any[] }) {
  const [selectedVariant, setSelectedVariant] = useState(product.variants?.[0] || null);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(product.images?.find((img: any) => img.is_primary) || product.images?.[0]);
  const [activeTab, setActiveTab] = useState("description");
  
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  // Fallbacks
  const images = product.images || [];
  const variants = product.variants || [];
  const basePrice = product.base_price;
  
  const currentPrice = selectedVariant?.discount_price || selectedVariant?.price || basePrice;
  const originalPrice = selectedVariant?.discount_price ? selectedVariant.price : null;

  const handleAddToCart = async () => {
    if (!selectedVariant) {
      alert("Please select a size first.");
      return;
    }
    
    setIsAdding(true);
    try {
      await addToCart(selectedVariant.id, undefined, quantity);
    } catch (error) {
      console.error("Failed to add to cart", error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: `Check out ${product.name} by ${product.brand}`,
          url: window.location.href,
        });
      } catch (err) {
        console.error("Error sharing", err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <>
      <Header />
      <main className="flex-1 w-full bg-perfume-main min-h-screen relative overflow-hidden pb-24">
        {/* Ambient background noise */}
        <div className="absolute inset-0 bg-noise opacity-30 pointer-events-none z-0"></div>

        <div className="relative z-10 container-lux pt-12">
          
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-foreground/50 mb-8 font-bold">
            <Link href="/" className="hover:text-gold transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/collections" className="hover:text-gold transition-colors">Collections</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-foreground">{product.name}</span>
          </div>

          <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
            
            {/* Left: Image Gallery */}
            <div className="w-full lg:w-1/2 flex flex-col gap-6">
              <div className="relative aspect-[4/5] w-full lux-glass-card rounded-2xl overflow-hidden p-4 group">
                <div className="relative w-full h-full rounded-xl overflow-hidden bg-background/20">
                  <Image 
                    src={activeImage?.image_url || "/placeholder.jpg"} 
                    alt={activeImage?.alt_text || product.name}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover transition-transform duration-[2s] group-hover:scale-105"
                  />
                </div>
                {originalPrice && (
                  <div className="absolute top-8 left-8 lg-badge bg-gold/90 text-background text-[10px] font-bold px-4 py-1.5 uppercase tracking-widest shadow-lg">
                    Sale
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                  {images.map((img: any) => (
                    <button 
                      key={img.id}
                      onClick={() => setActiveImage(img)}
                      className={`relative aspect-square lux-glass-card rounded-xl overflow-hidden transition-all duration-300 p-1
                        ${activeImage?.id === img.id ? 'border-gold shadow-[0_0_15px_rgba(212,175,55,0.3)]' : 'border-transparent hover:border-foreground/30'}`}
                    >
                      <div className="relative w-full h-full rounded-lg overflow-hidden bg-background/20">
                        <Image 
                          src={img.image_url} 
                          alt={img.alt_text || product.name}
                          fill
                          sizes="25vw"
                          className="object-cover"
                        />
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Product Info */}
            <div className="w-full lg:w-1/2 flex flex-col">
              
              <div className="mb-8 border-b border-foreground/10 pb-8">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-gold text-[10px] tracking-[0.3em] uppercase font-bold mb-2 block">{product.brand}</span>
                    <h1 className="text-3xl md:text-5xl font-serif text-foreground font-bold tracking-wide">{product.name}</h1>
                  </div>
                  <button onClick={handleShare} className="text-foreground/50 hover:text-gold transition-colors p-2 lg-btn !rounded-full">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>

                {/* Rating summary - Mock for now until reviews are implemented */}
                <div className="flex items-center gap-2 mb-6">
                  <div className="flex text-gold">
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current opacity-50" />
                  </div>
                  <span className="text-xs text-foreground/50 font-bold tracking-wide">(24 Reviews)</span>
                </div>

                <div className="flex items-end gap-4">
                  <span className="text-2xl md:text-3xl font-semibold tracking-wide text-foreground">
                    Rs. {Number(currentPrice).toLocaleString()}
                  </span>
                  {originalPrice && (
                    <span className="text-lg text-foreground/40 line-through tracking-wide mb-1">
                      Rs. {Number(originalPrice).toLocaleString()}
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-foreground/40 mt-2 tracking-widest uppercase font-bold">Tax included. Shipping calculated at checkout.</p>
              </div>

              {/* Size Selector */}
              {variants.length > 0 && (
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xs uppercase tracking-widest text-foreground font-bold">Size</span>
                  </div>
                  <div className="flex flex-wrap gap-4">
                    {variants.map((variant: any) => (
                      <button
                        key={variant.id}
                        onClick={() => setSelectedVariant(variant)}
                        className={`relative px-8 py-3 rounded-full text-xs font-bold tracking-[0.2em] uppercase transition-all duration-300 lg-btn
                          ${selectedVariant?.id === variant.id 
                            ? 'bg-gold/10 border-gold text-gold shadow-[0_0_20px_rgba(212,175,55,0.2)]' 
                            : 'border-foreground/20 text-foreground/70 hover:border-gold/50 hover:text-gold'}`}
                      >
                        {variant.size_ml} ml
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity & Add to Cart */}
              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <div className="flex items-center border border-foreground/20 rounded-full h-14 px-2 lg-input">
                  <button 
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="w-10 h-10 flex items-center justify-center text-foreground/50 hover:text-foreground transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center text-sm font-bold text-foreground">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(q => q + 1)}
                    className="w-10 h-10 flex items-center justify-center text-foreground/50 hover:text-foreground transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <button 
                  onClick={handleAddToCart}
                  disabled={isAdding}
                  className="flex-1 lg-btn-primary h-14 text-white text-xs font-bold tracking-[0.2em] uppercase transition-all disabled:opacity-50"
                >
                  {isAdding ? "Adding..." : "Add to Cart"}
                </button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12 lg-card p-6">
                <div className="flex items-center gap-3">
                  <Truck className="w-5 h-5 text-gold" />
                  <span className="text-xs font-medium tracking-wide text-foreground/80">Free Shipping over Rs.5000</span>
                </div>
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-gold" />
                  <span className="text-xs font-medium tracking-wide text-foreground/80">100% Authentic Guaranteed</span>
                </div>
                <div className="flex items-center gap-3">
                  <RefreshCcw className="w-5 h-5 text-gold" />
                  <span className="text-xs font-medium tracking-wide text-foreground/80">Easy 7-Day Returns</span>
                </div>
              </div>

              {/* Accordion / Tabs for Details */}
              <div className="border-t border-foreground/10 pt-8">
                <div className="flex gap-8 border-b border-foreground/10 mb-6">
                  <button 
                    onClick={() => setActiveTab('description')}
                    className={`lg-tab text-xs font-bold tracking-widest uppercase ${activeTab === 'description' ? 'text-gold active' : 'text-foreground/50 hover:text-foreground'}`}
                  >
                    Description
                  </button>
                  <button 
                    onClick={() => setActiveTab('notes')}
                    className={`lg-tab text-xs font-bold tracking-widest uppercase ${activeTab === 'notes' ? 'text-gold active' : 'text-foreground/50 hover:text-foreground'}`}
                  >
                    Olfactory Notes
                  </button>
                </div>

                <div className="text-sm text-foreground/70 leading-relaxed font-medium tracking-wide animate-in fade-in duration-500">
                  {activeTab === 'description' && (
                    <div dangerouslySetInnerHTML={{ __html: product.description }} />
                  )}
                  {activeTab === 'notes' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="lux-glass-card p-4 text-center">
                        <span className="text-[10px] text-gold uppercase tracking-[0.2em] font-bold block mb-2">Top Notes</span>
                        <p>{product.top_notes || "N/A"}</p>
                      </div>
                      <div className="lux-glass-card p-4 text-center">
                        <span className="text-[10px] text-gold uppercase tracking-[0.2em] font-bold block mb-2">Heart Notes</span>
                        <p>{product.middle_notes || "N/A"}</p>
                      </div>
                      <div className="lux-glass-card p-4 text-center">
                        <span className="text-[10px] text-gold uppercase tracking-[0.2em] font-bold block mb-2">Base Notes</span>
                        <p>{product.base_notes || "N/A"}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>

          {/* Reviews Section */}
          <div className="mt-32">
            <ProductReviews productId={product.id} />
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mt-32 border-t border-foreground/10 pt-24">
              <div className="text-center mb-16">
                <span className="text-gold text-xs tracking-[0.3em] uppercase mb-4 block font-bold">Discover More</span>
                <h2 className="text-3xl font-serif text-foreground font-bold tracking-wide">You May Also Like</h2>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
                {relatedProducts.map((rp: any) => {
                  const rpPrice = rp.variants?.[0]?.discount_price || rp.variants?.[0]?.price || rp.base_price;
                  const rpImage = rp.images?.find((img: any) => img.is_primary)?.image_url || rp.images?.[0]?.image_url || "/placeholder.jpg";
                  
                  return (
                    <Link key={rp.id} href={`/products/${rp.id}`} className="group flex flex-col h-full bg-transparent lux-glass-card p-4">
                      <div className="relative aspect-[3/4] w-full overflow-hidden bg-background/5 rounded-lg mb-6">
                        <Image
                          src={rpImage}
                          alt={rp.name}
                          fill
                          sizes="(max-width: 768px) 50vw, 25vw"
                          className="object-cover transition-transform duration-[1.5s] group-hover:scale-110"
                        />
                      </div>
                      
                      <div className="flex flex-col flex-1 text-center justify-end px-2">
                        <span className="text-gold text-[10px] uppercase tracking-[0.2em] font-bold mb-2">{rp.brand}</span>
                        <h3 className="font-serif text-base md:text-lg text-foreground font-bold mb-2 line-clamp-1 group-hover:text-gold transition-colors">{rp.name}</h3>
                        <span className="text-foreground text-sm font-semibold tracking-wide">Rs. {Number(rpPrice).toLocaleString()}</span>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          )}

        </div>
      </main>
      <Footer />
    </>
  );
}
