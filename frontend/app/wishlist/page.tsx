"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, Check } from "lucide-react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { apiFetch } from "../utils/api";
import { useCart } from "../context/CartContext";

export default function WishlistPage() {
  const { addToCart } = useCart();
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);
  const [addingId, setAddingId] = useState<number | null>(null);
  const [addedId, setAddedId] = useState<number | null>(null);
  const [togglingIds, setTogglingIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('auriqAccessToken');
      if (!token) {
        setError("Please sign in to view your wishlist.");
        setLoading(false);
        return;
      }
      
      const res = await apiFetch('/wishlist', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.success && res.data) {
        setWishlistItems(res.data.items || []);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load wishlist.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const handleRemoveWishlist = async (productId: number) => {
    if (togglingIds.includes(productId)) return;
    setTogglingIds(prev => [...prev, productId]);
    
    // Remove from UI immediately
    setWishlistItems(prev => prev.filter(item => item.product.id !== productId));
    
    try {
      const token = localStorage.getItem('auriqAccessToken');
      if (!token) return;
      
      await apiFetch(`/wishlist/remove/${productId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (err: any) {
      // Revert on failure
      fetchWishlist();
    } finally {
      setTogglingIds(prev => prev.filter(id => id !== productId));
    }
  };

  const handleAddToCart = async (e: React.MouseEvent, variantId?: number) => {
    e.preventDefault();
    if (!variantId) {
      alert("This product has no available size/variant.");
      return;
    }
    setAddingId(variantId);
    try {
      await addToCart(variantId, undefined, 1);
      setAddedId(variantId);
      setTimeout(() => setAddedId(null), 1500);
    } catch (err) {
      alert("Failed to add to cart.");
    } finally {
      setAddingId(null);
    }
  };

  return (
    <>
      <Header />
      <main className="flex-1 w-full bg-perfume-main min-h-screen relative overflow-hidden pt-24 pb-24">
        <div className="absolute inset-0 bg-noise opacity-30 pointer-events-none z-0"></div>
        
        <div className="container-lux relative z-10">
          <div className="text-center mb-16">
            <span className="text-gold text-xs font-bold tracking-[0.3em] uppercase mb-4 block">Your Collection</span>
            <h1 className="text-4xl md:text-5xl font-serif text-foreground font-bold tracking-widest mb-6">Wishlist</h1>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64 text-gold">Loading...</div>
          ) : error ? (
            <div className="text-center text-red-400 p-8 border border-red-500/20 bg-red-500/5">{error}</div>
          ) : wishlistItems.length === 0 ? (
            <div className="text-center p-16 lux-glass-card">
              <p className="text-foreground/60 mb-6">Your wishlist is currently empty.</p>
              <Link href="/collections" className="bg-gold text-background px-8 py-3 text-xs font-bold tracking-[0.2em] uppercase hover:bg-foreground transition-colors inline-block">
                Explore Fragrances
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {wishlistItems.map((item) => {
                const product = item.product;
                const imageUrl = product.images?.[0]?.image_url || "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=2787&auto=format&fit=crop";
                const price = product.variants?.[0]?.price || "N/A";
                
                return (
                  <div key={item.id} className="group cursor-pointer">
                    <Link href={`/products/${product.id}`} className="relative aspect-[4/5] overflow-hidden mb-6 bg-foreground/5 lux-glass-card block">
                      <Image
                        src={imageUrl}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <button 
                        onClick={(e) => { e.preventDefault(); handleRemoveWishlist(product.id); }}
                        disabled={togglingIds.includes(product.id)}
                        className={`absolute top-4 right-4 w-10 h-10 rounded-full bg-background/50 backdrop-blur-md flex items-center justify-center text-foreground hover:bg-background/80 transition-all opacity-100 ${togglingIds.includes(product.id) ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <Heart className="w-5 h-5 fill-red-500 text-red-500" />
                      </button>
                    </Link>
                    
                    <div className="flex flex-col items-center text-center">
                      <span className="text-gold text-[10px] font-bold tracking-[0.3em] uppercase mb-2">Auriq Exclusives</span>
                      <Link href={`/products/${product.id}`}>
                        <h3 className="text-xl font-serif text-foreground font-bold tracking-widest mb-2 hover:text-gold transition-colors">{product.name}</h3>
                      </Link>
                      <p className="text-sm text-foreground/70 tracking-widest font-light mb-4">Rs. {price}</p>
                      
                      <button
                        onClick={(e) => handleAddToCart(e, product.variants?.[0]?.id)}
                        disabled={addingId === product.variants?.[0]?.id}
                        className={`w-full flex items-center justify-center gap-2 border py-3 text-xs font-bold tracking-[0.2em] uppercase transition-colors disabled:opacity-50 ${addedId === product.variants?.[0]?.id ? 'border-gold bg-gold text-background' : 'border-foreground/20 text-foreground hover:bg-foreground hover:text-background'}`}
                      >
                        {addedId === product.variants?.[0]?.id ? (
                          <><Check className="w-4 h-4" /> Added</>
                        ) : (
                          <><ShoppingBag className="w-4 h-4" /> {addingId === product.variants?.[0]?.id ? "Adding..." : "Add to Cart"}</>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
