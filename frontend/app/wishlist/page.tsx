"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Trash2, ShoppingBag, ArrowLeft } from "lucide-react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

const mockWishlistItems = [
  {
    id: 2,
    name: "Velvet Rose",
    brand: "Auriq",
    price: "Rs. 9,800",
    image: "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?q=80&w=2787&auto=format&fit=crop",
  },
  {
    id: 5,
    name: "Oud Wood",
    brand: "Auriq",
    price: "Rs. 16,500",
    image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=2787&auto=format&fit=crop",
  },
  {
    id: 7,
    name: "Lost Cherry",
    brand: "Auriq",
    price: "Rs. 19,000",
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=2796&auto=format&fit=crop",
  }
];

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState(mockWishlistItems);

  const removeItem = (id: number) => {
    setWishlistItems(items => items.filter(item => item.id !== id));
  };

  return (
    <>
      <Header />
      <main className="flex-1 w-full bg-perfume-main min-h-screen relative overflow-hidden pb-24">
        {/* Noise overlay */}
        <div className="absolute inset-0 bg-noise opacity-30 pointer-events-none z-0"></div>

        <div className="relative z-10 container-lux pt-12">
          
          {/* Header */}
          <div className="mb-12 border-b border-foreground/10 pb-6 flex items-center justify-between">
            <h1 className="text-3xl md:text-5xl font-serif text-foreground font-bold tracking-widest">Your Wishlist</h1>
            <span className="hidden md:block text-foreground/50 text-xs font-bold tracking-[0.2em] uppercase">
              {wishlistItems.length} {wishlistItems.length === 1 ? 'Item' : 'Items'} Saved
            </span>
          </div>

          {wishlistItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center lux-glass-card rounded-2xl">
              <h2 className="text-2xl font-serif text-foreground mb-4">Your wishlist is empty.</h2>
              <p className="text-foreground/60 mb-8 max-w-md">
                Save your favorite fragrances here and easily move them to your cart when you are ready to purchase.
              </p>
              <Link href="/collections" className="bg-gold text-background px-8 py-4 text-xs font-bold tracking-[0.2em] uppercase hover:bg-foreground transition-colors">
                Discover Fragrances
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
              {wishlistItems.map((item) => (
                <div key={item.id} className="group relative flex flex-col lux-glass-card p-5">
                  <div className="flex flex-col h-full">
                    
                    {/* Image Container */}
                    <div className="relative aspect-[4/5] overflow-hidden rounded-xl mb-6 bg-background z-10 shadow-2xl">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover opacity-90 transition-all duration-700 group-hover:scale-110 group-hover:opacity-100"
                      />
                      
                      {/* Remove Overlay */}
                      <div className="absolute top-4 right-4 z-10">
                        <button 
                          onClick={(e) => {
                            e.preventDefault();
                            removeItem(item.id);
                          }} 
                          className="bg-background/60 backdrop-blur-md border border-foreground/20 text-foreground/80 p-2.5 rounded-full hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/50 transition-all shadow-lg" 
                          aria-label="Remove from Wishlist"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      
                      {/* Move to Cart Overlay */}
                      <div className="absolute bottom-0 left-0 w-full opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 z-10">
                        <button 
                          onClick={(e) => {
                            e.preventDefault();
                            // Implementation for moving to cart will go here
                          }} 
                          className="w-full bg-foreground/95 backdrop-blur-md text-background py-4 text-xs font-bold tracking-[0.2em] uppercase hover:bg-gold transition-colors flex items-center justify-center gap-2 border-t border-foreground/20 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]"
                        >
                          <ShoppingBag className="w-4 h-4" />
                          Move to Cart
                        </button>
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="flex flex-col text-center relative z-10 px-2">
                      <span className="text-[10px] text-gold uppercase tracking-[0.2em] mb-3 font-bold">{item.brand}</span>
                      <Link href={`/products/${item.id}`}>
                        <h3 className="font-serif text-xl text-foreground mb-2 font-bold drop-shadow-md hover:text-gold transition-colors">{item.name}</h3>
                      </Link>
                      <span className="text-foreground/80 text-sm tracking-wide font-medium">{item.price}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {wishlistItems.length > 0 && (
            <div className="mt-16 flex justify-center">
              <Link href="/collections" className="flex items-center gap-2 text-foreground/50 hover:text-gold transition-colors text-xs font-bold tracking-[0.2em] uppercase">
                <ArrowLeft className="w-4 h-4" />
                Continue Shopping
              </Link>
            </div>
          )}

        </div>
      </main>
      <Footer />
    </>
  );
}
