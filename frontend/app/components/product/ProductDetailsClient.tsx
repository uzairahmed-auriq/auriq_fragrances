"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Heart, ShoppingBag, ShieldCheck, Truck, RefreshCcw } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { apiFetch } from "../../utils/api";
import { useRouter } from "next/navigation";

export default function ProductDetailsClient({ product }: { product: any }) {
  const [quantity, setQuantity] = useState(1);
  const [cartError, setCartError] = useState<string | null>(null);
  const [cartLoading, setCartLoading] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'notes' | 'details'>('notes');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { addToCart } = useCart();
  const router = useRouter();
  
  const images = product.images || [];
  
  useEffect(() => {
    if (images.length > 1) {
      const timer = setInterval(() => {
        setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
      }, 4000);
      return () => clearInterval(timer);
    }
  }, [images.length]);

  useEffect(() => {
  const token = localStorage.getItem('auriqAccessToken');
  if (!token) return;
  apiFetch('/wishlist', { headers: { Authorization: `Bearer ${token}` } })
    .then((res) => {
      if (res.success && res.data?.items) {
        const isInWishlist = res.data.items.some((item: any) => item.product_id === product.id);
        setIsWishlisted(isInWishlist);
      }
    })
    .catch(() => {});
}, [product.id]);
  const activeVariants = (product.variants || []).filter((v: any) => v.is_active !== false);
  const [selectedVariant, setSelectedVariant] = useState(activeVariants[0] || null);
  const price = selectedVariant ? (selectedVariant.discount_price || selectedVariant.price) : 0;
  const originalPrice = selectedVariant?.price;
  
  // Format price
  const formatPrice = (amount: number | string) => {
    return new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', minimumFractionDigits: 0 }).format(Number(amount)).replace('PKR', 'Rs.');
  };

  const handleWishlist = async () => {
    const token = localStorage.getItem('auriqAccessToken');
    if (!token) { window.location.href = '/account'; return; }
    setWishlistLoading(true);
    try {
      if (isWishlisted) {
        await apiFetch(`/wishlist/remove/${product.id}`, { method: 'DELETE' });
        setIsWishlisted(false);
      } else {
        await apiFetch('/wishlist/add', { method: 'POST', body: JSON.stringify({ product_id: product.id }) });
        setIsWishlisted(true);
      }
    } catch (err: any) {
      if (err?.message === 'Product already in wishlist') {
        setIsWishlisted(true);
      } else {
        console.error('Wishlist error', err);
      }
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!selectedVariant) return;
    setCartLoading(true);
    setCartError(null);
    try {
      await addToCart(selectedVariant.id, undefined, quantity);
      router.push('/cart');
    } catch (error: any) {
      setCartError(error?.message || 'Failed to add to cart. Please try again.');
    } finally {
      setCartLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 items-start">
      
      {/* Left: Product Image */}
      <div className="w-full lg:w-1/2 sticky top-32">
        <div className="relative aspect-[4/5] overflow-hidden lux-glass-card p-2 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          <div className="relative w-full h-full rounded-xl overflow-hidden bg-background">
            {images.length > 0 ? (
              images.map((img: any, idx: number) => (
                <Image
                  key={idx}
                  src={img.image_url}
                  alt={`${product.name} - Image ${idx + 1}`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className={`object-cover transition-all duration-1000 ${
                    currentImageIndex === idx 
                      ? 'opacity-90 z-10 scale-100 hover:scale-110 hover:opacity-100' 
                      : 'opacity-0 z-0 scale-105'
                  }`}
                  priority={idx === 0}
                />
              ))
            ) : (
              <Image
                src="/placeholder.jpg"
                alt={product.name}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover opacity-90"
              />
            )}
            
            {/* Image Navigation Dots */}
            {images.length > 1 && (
              <div className="absolute bottom-6 left-0 right-0 z-20 flex justify-center gap-2">
                {images.map((_: any, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      currentImageIndex === idx ? "bg-gold w-6" : "bg-white/50 hover:bg-white/80"
                    }`}
                    aria-label={`View image ${idx + 1}`}
                  />
                ))}
              </div>
            )}
            
            {/* Subtle vignette over image */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none z-10"></div>
          </div>
        </div>
      </div>

      {/* Right: Product Details */}
      <div className="w-full lg:w-1/2 flex flex-col pt-4 lg:pt-12">
        
        <div className="mb-8 border-b border-foreground/10 pb-8">
          <span className="text-gold text-xs font-bold tracking-[0.3em] uppercase mb-4 block">{product.brand || 'Auriq'}</span>
          <h1 className="text-4xl md:text-5xl font-serif text-foreground font-bold tracking-wide mb-4 drop-shadow-md">{product.name}</h1>
          <div className="flex items-center gap-4 mb-6">
            <p className="text-2xl text-foreground/80 font-medium tracking-wide">{formatPrice(price)}</p>
            {selectedVariant?.size_ml && <span className="text-xs font-bold tracking-widest uppercase text-foreground/40 border border-foreground/20 px-3 py-1 rounded-full">{selectedVariant.size_ml}ml</span>}
            {originalPrice && originalPrice !== price && (
              <p className="text-lg text-foreground/40 line-through tracking-wide">{formatPrice(originalPrice)}</p>
            )}
          </div>
          {product.description && (
            <div className="mt-2">
              <span className="text-[10px] text-foreground/40 uppercase tracking-[0.2em] font-bold block mb-2">Ingredients</span>
              <p className="text-foreground/60 leading-relaxed tracking-wide text-sm md:text-base">{product.description}</p>
            </div>
          )}
        </div>

        {/* Size Selector */}
        {activeVariants.length > 1 && (
          <div className="mb-8">
            <span className="text-xs font-bold tracking-[0.3em] uppercase text-foreground/50 mb-4 block">Select Size</span>
            <div className="flex flex-wrap gap-3">
              {activeVariants.map((variant: any) => (
                <button
                  key={variant.id}
                  onClick={() => variant.stock_quantity > 0 && setSelectedVariant(variant)}
                  className={`px-5 py-2 rounded-full text-xs font-bold tracking-widest uppercase border transition-all ${
                    selectedVariant?.id === variant.id
                      ? 'border-gold bg-gold/10 text-gold'
                      : 'border-foreground/20 text-foreground/60 hover:border-gold/50'
                  } ${variant.stock_quantity === 0 ? 'opacity-40 cursor-not-allowed' : ''}`}
                >
                  {variant.size_ml}ml
                  {variant.stock_quantity === 0 && <span className="ml-1 text-red-400">(Out)</span>}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Quantity & Add to Cart */}
        <div className="flex flex-col gap-6 mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
            {/* Quantity — on top on mobile, on the left on desktop */}
            <div className="flex justify-center sm:justify-start">
              <div className="flex items-center border border-foreground/20 rounded-full lux-glass-card">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-5 py-3 text-foreground hover:text-gold transition-colors"
                >
                  -
                </button>
                <span className="w-8 text-center text-foreground font-bold">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-5 py-3 text-foreground hover:text-gold transition-colors"
                >
                  +
                </button>
              </div>
            </div>
            {/* Add to Cart + Wishlist — beneath the quantity on mobile, on the right on desktop */}
            <div className="flex items-center gap-4 sm:flex-1">
              <button
                onClick={handleAddToCart}
                disabled={cartLoading || !selectedVariant}
                className="flex-1 bg-gold/90 backdrop-blur-md text-background py-4 px-8 rounded-full font-bold tracking-widest hover:bg-foreground hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <ShoppingBag className="w-5 h-5" />
                {cartLoading ? 'ADDING...' : 'ADD TO CART'}
              </button>
              <button onClick={handleWishlist} disabled={wishlistLoading} className={`p-4 border rounded-full transition-colors lux-glass-card disabled:opacity-50 ${isWishlisted ? "border-gold text-gold bg-gold/10" : "border-foreground/20 text-foreground hover:text-gold hover:border-gold"}`}>
                <Heart className={`w-6 h-6 ${isWishlisted ? "fill-gold" : ""}`} />
              </button>
            </div>
          </div>
          {cartError && (
            <p className="text-red-400 text-sm text-center tracking-wide">{cartError}</p>
          )}
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-3 gap-4 mb-12 border-y border-foreground/10 py-8">
          <div className="flex flex-col items-center justify-center text-center gap-2 opacity-70">
            <ShieldCheck className="w-6 h-6 text-gold" />
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-foreground">Authentic</span>
          </div>
          <div className="flex flex-col items-center justify-center text-center gap-2 opacity-70 border-x border-foreground/10">
            <Truck className="w-6 h-6 text-gold" />
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-foreground">Fast Delivery</span>
          </div>
          <div className="flex flex-col items-center justify-center text-center gap-2 opacity-70">
            <RefreshCcw className="w-6 h-6 text-gold" />
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-foreground">Free Returns</span>
          </div>
        </div>

        {/* Tabs: Notes & Details */}
        <div className="flex flex-col">
          <div className="flex gap-8 border-b border-foreground/10 mb-8">
            <button 
              onClick={() => setActiveTab('notes')}
              className={`pb-4 text-xs font-bold tracking-[0.2em] uppercase transition-colors relative ${activeTab === 'notes' ? 'text-gold' : 'text-foreground/50 hover:text-foreground'}`}
            >
              Fragrance Notes
              {activeTab === 'notes' && <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gold"></span>}
            </button>
            <button 
              onClick={() => setActiveTab('details')}
              className={`pb-4 text-xs font-bold tracking-[0.2em] uppercase transition-colors relative ${activeTab === 'details' ? 'text-gold' : 'text-foreground/50 hover:text-foreground'}`}
            >
              Details
              {activeTab === 'details' && <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gold"></span>}
            </button>
          </div>

          <div className="min-h-[200px]">
            {activeTab === 'notes' ? (
              <div className="flex flex-col gap-6">
                <div className="flex flex-col">
                  <span className="text-[10px] text-foreground/50 uppercase tracking-[0.2em] font-bold mb-1">Top Notes</span>
                  <p className="text-foreground tracking-wide">
                    {product.fragrance_notes?.filter((n: any) => n.note_type === 'TOP').map((n: any) => n.note_name).join(', ') || 'Fresh Citrus'}
                  </p>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-foreground/50 uppercase tracking-[0.2em] font-bold mb-1">Heart Notes</span>
                  <p className="text-foreground tracking-wide">
                    {product.fragrance_notes?.filter((n: any) => n.note_type === 'HEART').map((n: any) => n.note_name).join(', ') || 'Floral Woods'}
                  </p>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-foreground/50 uppercase tracking-[0.2em] font-bold mb-1">Base Notes</span>
                  <p className="text-foreground tracking-wide">
                    {product.fragrance_notes?.filter((n: any) => n.note_type === 'BASE').map((n: any) => n.note_name).join(', ') || 'Musk, Amber'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-6 text-sm text-foreground/70 leading-loose tracking-wide">
                <p>
                  <strong>Application:</strong> Spray onto pulse points (wrists, neck, and behind ears) for best performance. Do not rub the fragrance into the skin as this will alter how the fragrance develops.
                </p>
                <p>
                  <strong>Storage:</strong> Store in a cool, dry place away from direct sunlight and heat to preserve the fragrance integrity.
                </p>
                <p className="text-[10px] text-foreground/40 mt-4 uppercase tracking-widest">
                  For allergen information and full ingredient list, refer to the product packaging.
                </p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
