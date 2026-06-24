"use client";

import { useState } from "react";
import { Heart, ShoppingBag, Check } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { wishlistService } from "../../services/wishlistService";

export default function ProductCardActions({ productId, variantId }: { productId: number; variantId?: number }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('auriqAccessToken');
    if (!token) {
      window.location.href = '/account';
      return;
    }
    setWishlistLoading(true);
    try {
      if (wishlisted) {
        await wishlistService.removeFromWishlist(productId);
        setWishlisted(false);
      } else {
        await wishlistService.addToWishlist(productId);
        setWishlisted(true);
      }
    } catch (err) {
      console.error('Wishlist error', err);
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!variantId) return;
    try {
      await addToCart(variantId, undefined, 1);
      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
    } catch (err) {
      console.error("Failed to add to cart", err);
    }
  };

  return (
    <>
      <div className="absolute top-4 right-4 flex flex-col gap-3 opacity-0 transition-opacity duration-500 group-hover:opacity-100 z-10">
        <button
          onClick={handleWishlist}
          disabled={wishlistLoading}
          className={`bg-background/60 backdrop-blur-md border p-3 rounded-full transition-all shadow-lg ${wishlisted ? 'border-gold text-gold bg-gold/10' : 'border-foreground/20 text-foreground hover:bg-gold hover:text-background hover:border-gold'}`}
          aria-label="Add to Wishlist"
        >
          <Heart className={`w-5 h-5 ${wishlisted ? 'fill-gold' : ''}`} />
        </button>
      </div>

      <div className="absolute bottom-0 left-0 w-full opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 z-10">
        <button
          onClick={handleAddToCart}
          className="w-full bg-gold/90 backdrop-blur-md text-background py-4 text-sm font-bold tracking-widest hover:bg-foreground transition-colors flex items-center justify-center gap-2 border-t border-foreground/20"
        >
          {added ? (
            <><Check className="w-5 h-5" /> ADDED</>
          ) : (
            <><ShoppingBag className="w-5 h-5" /> ADD TO CART</>
          )}
        </button>
      </div>
    </>
  );
}
